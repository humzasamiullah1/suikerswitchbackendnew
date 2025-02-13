import React from "react";


const ImageTag=(props) => {
  const { path, classes, altText } = props;

  return (
    
    <img src={path} className={`${classes}`} alt={altText} />
  );
}

export default ImageTag;
