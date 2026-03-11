// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// ═══════════════════════════════════════════════════════════════════
//  INLINE HELPERS  (no npm / no imports needed in Remix)
// ═══════════════════════════════════════════════════════════════════

abstract contract Context {
    function _msgSender() internal view virtual returns (address) {
        return msg.sender;
    }
}

abstract contract Ownable is Context {
    address private _owner;

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    constructor() {
        _owner = _msgSender();
        emit OwnershipTransferred(address(0), _owner);
    }

    function owner() public view returns (address) { return _owner; }

    modifier onlyOwner() {
        require(_msgSender() == _owner, "Ownable: not owner");
        _;
    }

    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "Ownable: zero address");
        emit OwnershipTransferred(_owner, newOwner);
        _owner = newOwner;
    }
}

abstract contract Pausable is Context {
    bool private _paused;

    event Paused(address account);
    event Unpaused(address account);

    modifier whenNotPaused() {
        require(!_paused, "Pausable: paused");
        _;
    }

    function paused() public view returns (bool) { return _paused; }

    function _pause() internal {
        require(!_paused, "Pausable: already paused");
        _paused = true;
        emit Paused(_msgSender());
    }

    function _unpause() internal {
        require(_paused, "Pausable: not paused");
        _paused = false;
        emit Unpaused(_msgSender());
    }
}

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
//  CrowdfundHub
// ═══════════════════════════════════════════════════════════════════
//
//  ┌─ REMIX DEPLOYMENT CHECKLIST ──────────────────────────────────┐
//  │ 1. Compiler  : 0.8.20  │  EVM : paris  │  Optimiser : ON      │
//  │ 2. CONTRACT dropdown   → CrowdfundHub – CrowdfundHub.sol      │
//  │    (NOT Context / Ownable / Pausable / ReentrancyGuard)       │
//  │ 3. No constructor arguments – just click Deploy               │
//  └───────────────────────────────────────────────────────────────┘
//
//  ┌─ createProject ARGUMENTS ─────────────────────────────────────┐
//  │  title    : MyProject                                         │
//  │  goal     : 1000000000000000000   (= 1 ETH in wei)           │
//  │  deadline : call currentTime() first, then add 300            │
//  │             e.g. if currentTime() returns 1741693500          │
//  │             enter  1741693800  as deadline                    │
//  │             (MIN_DEADLINE is 120 s so +300 is safe)           │
//  └───────────────────────────────────────────────────────────────┘
//
//  ┌─ FULL TEST FLOW ───────────────────────────────────────────────┐
//  │ 1. Deploy                                                      │
//  │ 2. currentTime()  → note the value, add 300, use as deadline  │
//  │ 3. createProject("MyProject", 1000000000000000000, <deadline>) │
//  │ 4. contribute(0)  — set VALUE = 1 Ether in Remix              │
//  │ 5. Wait ~5 min (or reduce MIN_DEADLINE to 10 for fast test)   │
//  │ 6. finalise(0)                                                 │
//  │ 7. SUCCESS → withdraw(0) from creator account                 │
//  │    FAIL    → claimRefund(0) from backer account               │
//  │ 8. Hub owner → withdrawFees()                                  │
//  └───────────────────────────────────────────────────────────────┘

contract CrowdfundHub is Ownable, ReentrancyGuard, Pausable {

    // ── Constants ────────────────────────────────────────────────
    uint256 public constant FEE_BPS      = 200;  // 2 % in basis-points
    uint256 public constant MIN_DEADLINE = 120;  // 2 min — change to 86400 for production

    // ── State enum (CF-2) ────────────────────────────────────────
    enum State { FUNDING, SUCCESS, FAIL }

    // ── Project struct (CF-9) ────────────────────────────────────
    struct Project {
        uint256         id;
        address payable creator;
        string          title;
        uint256         goal;           // wei
        uint256         deadline;       // Unix timestamp
        uint256         totalPledged;   // gross wei raised
        State           state;
        bool            withdrawn;
    }

    // ── Storage ──────────────────────────────────────────────────
    uint256 private _projectCount;

    mapping(uint256 => Project)                     private _projects;
    mapping(uint256 => mapping(address => uint256)) private _contributions;

    uint256 public accumulatedFees;

    // ── Events ───────────────────────────────────────────────────
    event ProjectCreated(
        uint256 indexed projectId,
        address indexed creator,
        string  title,
        uint256 goal,
        uint256 deadline
    );
    event PledgeReceived(address indexed backer, uint256 indexed projectId, uint256 amount);   // CF-3
    event ProjectFinalised(uint256 indexed projectId, State outcome, uint256 totalPledged);    // CF-4
    event FundsWithdrawn(uint256 indexed projectId, address indexed creator, uint256 amount);
    event RefundClaimed (uint256 indexed projectId, address indexed backer,  uint256 amount);
    event FeesWithdrawn (address indexed to, uint256 amount);

    // ── Modifier ─────────────────────────────────────────────────
    modifier exists(uint256 pid) {
        require(pid < _projectCount, "CrowdfundHub: unknown project");
        _;
    }

    // ── Admin ────────────────────────────────────────────────────
    function pause()   external onlyOwner { _pause(); }
    function unpause() external onlyOwner { _unpause(); }

    // ── CF-1  Create project ─────────────────────────────────────
    /**
     * @notice Open a crowdfunding project.
     * @param title    Non-empty project name.
     * @param goal     Funding target in wei.
     *                 Use 1000000000000000000 for 1 ETH.
     * @param deadline Unix timestamp >= block.timestamp + 120.
     *                 Call currentTime() to read block.timestamp,
     *                 then add at least 120 to that value.
     */
    function createProject(
        string  calldata title,
        uint256 goal,
        uint256 deadline
    )
        external
        whenNotPaused
        returns (uint256 projectId)
    {
        require(bytes(title).length > 0,                      "CrowdfundHub: empty title");
        require(goal > 0,                                     "CrowdfundHub: goal is zero");
        require(deadline >= block.timestamp + MIN_DEADLINE,   "CrowdfundHub: deadline too soon");

        projectId = _projectCount++;

        _projects[projectId] = Project({
            id:           projectId,
            creator:      payable(msg.sender),
            title:        title,
            goal:         goal,
            deadline:     deadline,
            totalPledged: 0,
            state:        State.FUNDING,
            withdrawn:    false
        });

        emit ProjectCreated(projectId, msg.sender, title, goal, deadline);
    }

    // ── CF-3  Contribute ─────────────────────────────────────────
    /**
     * @notice Send ETH to back a project.
     *         In Remix: enter amount in VALUE field, then call contribute(id).
     */
    function contribute(uint256 projectId)
        external
        payable
        whenNotPaused
        nonReentrant
        exists(projectId)
    {
        Project storage p = _projects[projectId];
        require(p.state == State.FUNDING,     "CrowdfundHub: not FUNDING");
        require(block.timestamp < p.deadline, "CrowdfundHub: deadline passed");
        require(msg.value > 0,                "CrowdfundHub: send ETH");

        p.totalPledged                        += msg.value;
        _contributions[projectId][msg.sender] += msg.value;

        emit PledgeReceived(msg.sender, projectId, msg.value);
    }

    // ── CF-4  Finalise ───────────────────────────────────────────
    /**
     * @notice Settle a project after its deadline. Anyone may call this.
     */
    function finalise(uint256 projectId)
        external
        whenNotPaused
        nonReentrant
        exists(projectId)
    {
        Project storage p = _projects[projectId];
        require(p.state == State.FUNDING,         "CrowdfundHub: already finalised");
        require(block.timestamp >= p.deadline,    "CrowdfundHub: deadline not reached");

        if (p.totalPledged >= p.goal) {
            p.state = State.SUCCESS;
            accumulatedFees += (p.totalPledged * FEE_BPS) / 10_000; // CF-7
        } else {
            p.state = State.FAIL;
        }

        emit ProjectFinalised(projectId, p.state, p.totalPledged);
    }

    // ── CF-5  Creator withdrawal (SUCCESS) ───────────────────────
    /**
     * @notice Creator pulls net proceeds (98 %). One-shot pull pattern.
     */
    function withdraw(uint256 projectId)
        external
        nonReentrant
        exists(projectId)
    {
        Project storage p = _projects[projectId];
        require(p.state == State.SUCCESS, "CrowdfundHub: not SUCCESS");
        require(msg.sender == p.creator,  "CrowdfundHub: not creator");
        require(!p.withdrawn,             "CrowdfundHub: already withdrawn");

        p.withdrawn = true;

        uint256 fee    = (p.totalPledged * FEE_BPS) / 10_000;
        uint256 payout = p.totalPledged - fee;

        emit FundsWithdrawn(projectId, msg.sender, payout);

        (bool ok, ) = p.creator.call{value: payout}("");
        require(ok, "CrowdfundHub: transfer failed");
    }

    // ── CF-6  Backer refund (FAIL) ───────────────────────────────
    /**
     * @notice Backers reclaim 100 % of their contribution on a failed project.
     */
    function claimRefund(uint256 projectId)
        external
        nonReentrant
        exists(projectId)
    {
        Project storage p = _projects[projectId];
        require(p.state == State.FAIL, "CrowdfundHub: not FAIL");

        uint256 amount = _contributions[projectId][msg.sender];
        require(amount > 0, "CrowdfundHub: nothing to refund");

        _contributions[projectId][msg.sender] = 0; // zero before transfer (CEI)

        emit RefundClaimed(projectId, msg.sender, amount);

        (bool ok, ) = payable(msg.sender).call{value: amount}("");
        require(ok, "CrowdfundHub: refund failed");
    }

    // ── CF-7  Hub fee withdrawal ─────────────────────────────────
    /// @notice Hub owner collects accumulated protocol fees.
    function withdrawFees() external onlyOwner nonReentrant {
        uint256 amount = accumulatedFees;
        require(amount > 0, "CrowdfundHub: no fees");
        accumulatedFees = 0;
        emit FeesWithdrawn(msg.sender, amount);
        (bool ok, ) = payable(msg.sender).call{value: amount}("");
        require(ok, "CrowdfundHub: fee transfer failed");
    }

    // ── CF-9  View helpers ───────────────────────────────────────

    /// @notice Full project details in one call — no loops.
    function getProject(uint256 projectId)
        external view exists(projectId)
        returns (Project memory)
    {
        return _projects[projectId];
    }

    /// @notice A specific backer's total contribution.
    function getContribution(uint256 projectId, address backer)
        external view exists(projectId)
        returns (uint256)
    {
        return _contributions[projectId][backer];
    }

    /// @notice Total projects ever created.
    function projectCount() external view returns (uint256) {
        return _projectCount;
    }

    /**
     * @notice Returns the current block timestamp.
     * @dev    Use this in Remix to calculate a valid deadline:
     *         read this value, add >= 120, pass as the deadline argument.
     */
    function currentTime() external view returns (uint256) {
        return block.timestamp;
    }

    // ── Fallbacks ────────────────────────────────────────────────
    receive()  external payable { revert("CrowdfundHub: use contribute()"); }
    fallback() external payable { revert("CrowdfundHub: use contribute()"); }
}
