import React, { useState } from 'react';

interface IconImageProps {
  src: string;
  alt: string;
  fallbackIcon: string;
  style?: React.CSSProperties;
  className?: string;
  lazy?: boolean;
  webpSupport?: boolean;
}

const IconImage: React.FC<IconImageProps> = ({ 
  src, 
  alt, 
  fallbackIcon, 
  style, 
  className,
  lazy = true,
  webpSupport = true
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleImageLoad = () => {
    setImageLoaded(true);
    setImageError(false);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(false);
  };

  // Nếu có lỗi, hiển thị fallback
  if (imageError) {
    return (
      <span 
        className={className}
        style={style}
        aria-label={alt}
      >
        {fallbackIcon}
      </span>
    );
  }

  // Tạm thời sử dụng file gốc để test
  const finalSrc = src;

  return (
    <img
      src={finalSrc}
      alt={alt}
      style={{
        ...style,
        opacity: imageLoaded ? 1 : 0,
        transition: 'opacity 0.2s ease-in-out'
      }}
      className={className}
      onLoad={handleImageLoad}
      onError={handleImageError}
      loading={lazy ? 'lazy' : 'eager'}
      decoding="async"
    />
  );
};

export default IconImage;
