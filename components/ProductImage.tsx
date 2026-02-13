
import React, { useState } from 'react';
import { Package } from 'lucide-react';

interface Props {
  src: string;
  alt: string;
  className?: string;
}

const ProductImage: React.FC<Props> = ({ src, alt, className = "" }) => {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div className={`bg-gray-100 flex items-center justify-center ${className}`}>
        <Package className="text-gray-400 w-1/3 h-1/3" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={() => setError(true)}
      className={`object-cover ${className}`}
    />
  );
};

export default ProductImage;
