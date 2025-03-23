import React, { useState } from "react";

const ImageTag = (props) => {
  const { path, classes, altText } = props;
  const [isLoaded, setIsLoaded] = useState(false);

  const handleImageLoad = () => {
    console.log("hi")
    setIsLoaded(true);
  };

  const handleImageError = () => {
console.log("hello")
    setIsLoaded(false);
  };

  return (
    <img
      src={ path }
      className={`${classes}`}
      alt={altText}
      // onLoad={handleImageLoad}
      // onError={handleImageError}
    />
  );
};

export default ImageTag;
