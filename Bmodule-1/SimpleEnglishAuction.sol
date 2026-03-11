// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// ═══════════════════════════════════════════════════════════════════
//  Minimal ERC-721 interface  (AU-1 – interface only, no NFT code)
// ═══════════════════════════════════════════════════════════════════
interface IERC721 {
    function transferFrom(address from, address to, uint256 tokenId) external;
    function ownerOf(uint256 tokenId) external view returns (address);
}

// ═══════════════════════════════════════════════════════════════════
//  Inline ReentrancyGuard  (AU-9 – no npm needed)
// ═══════════════════════════════════════════════════════════════════
abstract contract ReentrancyGuard {
    uint256 private constant _NOT_ENTERED = 1;
    uint256 private constant _ENTERED     = 2;
    uint256 private _status;

    constructor() { _status = _NOT_ENTERED; }

    modifier nonReentrant() {
        require(_status != _ENTERED, "ReentrancyGuard: reentrant call");
        _status = _ENTERED;
        _;
        _status = _NOT_ENTERED;
    }
}

// ═══════════════════════════════════════════════════════════════════
//  SimpleEnglishAuction
// ═══════════════════════════════════════════════════════════════════
//
//  ┌─ REMIX DEPLOYMENT CHECKLIST ──────────────────────────────────┐
//  │ 1. Compiler  : 0.8.20  │  EVM : paris  │  Optimiser : ON     │
//  │ 2. CONTRACT dropdown   →  SimpleEnglishAuction                │
//  │ 3. Constructor arguments:                                     │
//  │      _nftContract   : 0x... (any ERC-721 address, or a        │
//  │                        dummy address for interface testing)   │
//  │      _tokenId       : 1                                       │
//  │      _startPrice    : 1000000000000000000  (1 ETH in wei)     │
//  │      _biddingPeriod : 300  (5 minutes in seconds)             │
//  │ 4. Before calling end(), the seller must have approved this   │
//  │    contract on the NFT contract:                              │
//  │      nftContract.approve(<auctionAddress>, <tokenId>)         │
//  └───────────────────────────────────────────────────────────────┘
//
//  ┌─ TEST FLOW ────────────────────────────────────────────────────┐
//  │ Bidder A → bid()  VALUE = 1 ETH   (opens bidding)             │
//  │ Bidder B → bid()  VALUE = 1.1 ETH (must be ≥ 10% higher)     │
//  │ Bidder A → claimRefund()          (pulls outbid ETH back)     │
//  │ Wait 5 min, then anyone → end()   (pays seller, sends NFT)    │
//  │                                                               │
//  │ CANCEL PATH (no bids only):                                   │
//  │   Seller → cancel()               (sets state CANCELLED)     │
//  └───────────────────────────────────────────────────────────────┘

contract SimpleEnglishAuction is ReentrancyGuard {

    // ── Custom errors (AU-7) ─────────────────────────────────────
    error AuctionNotActive();
    error AuctionAlreadyEnded();
    error AuctionAlreadyCancelled();
    error AuctionNotEnded();
    error BidTooLow(uint256 required, uint256 provided);
    error NoBidsPlaced();
    error BidsAlreadyPlaced();
    error NotSeller();
    error NothingToRefund();
    error ETHTransferFailed();

    // ── State enum (AU-2) ────────────────────────────────────────
    enum AuctionState { STARTED, ENDED, CANCELLED }

    // ── Immutables set at construction (AU-1) ────────────────────
    IERC721 public immutable nftContract;
    uint256 public immutable tokenId;
    uint256 public immutable startPrice;   // minimum first bid (wei)
    uint256 public immutable endTime;      // block.timestamp + biddingPeriod
    address public immutable seller;

    // ── Mutable auction state ────────────────────────────────────
    AuctionState public state;

    address public highestBidder;
    uint256 public highestBid;

    /// AU-4: out-bidder → refundable ETH
    mapping(address => uint256) public refunds;

    // ── Events ───────────────────────────────────────────────────
    event NewBid(address indexed bidder, uint256 amount);
    event AuctionEnded(address indexed winner, uint256 price);   // AU-5
    event AuctionCancelledEvent();
    event RefundClaimed(address indexed bidder, uint256 amount);

    // ── Constructor (AU-1) ───────────────────────────────────────
    /**
     * @param _nftContract   ERC-721 contract address of the token being auctioned.
     * @param _tokenId       Token ID up for auction.
     * @param _startPrice    Minimum first bid in wei (e.g. 1000000000000000000 = 1 ETH).
     * @param _biddingPeriod Duration of auction in seconds (e.g. 300 = 5 minutes).
     */
    constructor(
        address _nftContract,
        uint256 _tokenId,
        uint256 _startPrice,
        uint256 _biddingPeriod
    ) {
        require(_nftContract  != address(0), "SEA: zero NFT address");
        require(_startPrice   >  0,          "SEA: startPrice must be > 0");
        require(_biddingPeriod > 0,          "SEA: biddingPeriod must be > 0");

        nftContract = IERC721(_nftContract);
        tokenId     = _tokenId;
        startPrice  = _startPrice;
        endTime     = block.timestamp + _biddingPeriod;
        seller      = msg.sender;
        state       = AuctionState.STARTED;
    }

    // ── AU-3  Place a bid ────────────────────────────────────────
    /**
     * @notice Place a bid.
     *         First bid must be >= startPrice.
     *         Every subsequent bid must exceed the current highest by >= 10 %.
     *
     *  Minimum next bid = highestBid + (highestBid / 10)
     *  i.e. highestBid * 110 / 100
     *
     *  In Remix: enter the wei amount in the VALUE field, then click bid().
     */
    function bid() external payable nonReentrant {
        if (state == AuctionState.ENDED)     revert AuctionAlreadyEnded();
        if (state == AuctionState.CANCELLED) revert AuctionAlreadyCancelled();
        if (block.timestamp >= endTime)      revert AuctionAlreadyEnded();

        // Compute minimum acceptable bid
        uint256 minBid = (highestBid == 0)
            ? startPrice
            : highestBid + (highestBid / 10);   // +10 %

        if (msg.value < minBid) revert BidTooLow(minBid, msg.value);

        // Queue previous leader's ETH for refund (AU-4)
        if (highestBidder != address(0)) {
            refunds[highestBidder] += highestBid;
        }

        highestBidder = msg.sender;
        highestBid    = msg.value;

        emit NewBid(msg.sender, msg.value);
    }

    // ── AU-5  End the auction ────────────────────────────────────
    /**
     * @notice Settle the auction after the bidding period.
     *         Pays the seller and transfers the NFT to the winner.
     *         Anyone may call this once endTime has passed.
     */
    function end() external nonReentrant {
        if (state == AuctionState.ENDED)     revert AuctionAlreadyEnded();
        if (state == AuctionState.CANCELLED) revert AuctionAlreadyCancelled();
        if (block.timestamp < endTime)       revert AuctionNotEnded();
        if (highestBidder == address(0))     revert NoBidsPlaced();

        state = AuctionState.ENDED;

        address winner = highestBidder;
        uint256 price  = highestBid;

        emit AuctionEnded(winner, price);

        // Pay seller
        (bool ok, ) = payable(seller).call{value: price}("");
        if (!ok) revert ETHTransferFailed();

        // Transfer NFT to winner
        // Requires: seller called nftContract.approve(address(this), tokenId)
        nftContract.transferFrom(seller, winner, tokenId);
    }

    // ── AU-6  Seller cancel (no-bids only) ───────────────────────
    /**
     * @notice Seller cancels before any bids have been placed.
     */
    function cancel() external {
        if (msg.sender != seller)            revert NotSeller();
        if (state == AuctionState.ENDED)     revert AuctionAlreadyEnded();
        if (state == AuctionState.CANCELLED) revert AuctionAlreadyCancelled();
        if (highestBidder != address(0))     revert BidsAlreadyPlaced();

        state = AuctionState.CANCELLED;
        emit AuctionCancelledEvent();
    }

    // ── AU-4  Refund pull pattern ────────────────────────────────
    /**
     * @notice Out-bidders withdraw their ETH at any time.
     *         Pull pattern protects against reentrancy (AU-9).
     */
    function claimRefund() external nonReentrant {
        uint256 amount = refunds[msg.sender];
        if (amount == 0) revert NothingToRefund();

        refunds[msg.sender] = 0; // CEI: zero before external call

        emit RefundClaimed(msg.sender, amount);

        (bool ok, ) = payable(msg.sender).call{value: amount}("");
        if (!ok) revert ETHTransferFailed();
    }

    // ── View helpers ─────────────────────────────────────────────

    /// @notice Minimum wei required to become the new highest bidder.
    function minimumNextBid() external view returns (uint256) {
        if (highestBid == 0) return startPrice;
        return highestBid + (highestBid / 10);
    }

    /// @notice Seconds left before the auction closes (0 if already past).
    function timeRemaining() external view returns (uint256) {
        if (block.timestamp >= endTime) return 0;
        return endTime - block.timestamp;
    }

    /// @notice Current block timestamp — useful for computing deadlines in Remix.
    function currentTime() external view returns (uint256) {
        return block.timestamp;
    }

    // ── Fallbacks ────────────────────────────────────────────────
    receive()  external payable { revert("SEA: use bid()"); }
    fallback() external payable { revert("SEA: use bid()"); }
}
