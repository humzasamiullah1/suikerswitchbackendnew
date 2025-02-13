import React from "react";


const LabelTag=(props) => {
  const { name, isStaric = true, classes } = props;

  return (
      <label className={`text-darkColor font-HelveticaNeueMedium text-sm ${classes}`}>
        {name}
        {
          isStaric &&
            <span className="text-themeColor">*</span>
        }
      </label>
  );
}

export default LabelTag;
