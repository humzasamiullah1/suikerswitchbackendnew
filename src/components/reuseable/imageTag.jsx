import React, { useState } from "react";

const ImageTag = (props) => {
  const { path, classes, altText } = props;
  const [isLoaded, setIsLoaded] = useState(false);

  const handleImageLoad = () => {
    setIsLoaded(true);
  };

  const handleImageError = () => {
    setIsLoaded(false);
  };

  return (
    <img
      src={isLoaded && path.length > 0 ? path : "/assets/images/default-image.png" }
      className={`${classes}`}
      alt={altText}
      onLoad={handleImageLoad}
      onError={handleImageError}
    />
  );
};

export default ImageTag;
