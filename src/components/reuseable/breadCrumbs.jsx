import React from "react";
import {Link} from "react-router-dom"

const BreadCrumbs = (props) => {
  const { link, firstLink, secondLink } = props;

  return (
    <div className="flex font-HelveticaNeueMedium text-darkColor/60 text-sm">
      <Link to={link}>{firstLink}</Link>
      <p className="px-1">/</p>
      <p>{secondLink}</p>
    </div>
  );
};

export default BreadCrumbs;
