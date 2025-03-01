import React from "react";

const ButtonTag = (props) => {
  const { name, classes, onSubmit, disabled } = props;

  return (
    <button
      disabled={disabled}
      onClick={onSubmit}
      className={`${classes} cursor-pointer font-popinsMedium rounded-full flex justify-center mx-auto py-2 w-full items-center`}
    >
      {name}

    </button>
  );
};

export default ButtonTag;
