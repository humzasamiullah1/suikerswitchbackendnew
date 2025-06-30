import React, { useEffect, useState } from "react";


const ParentComponent = ({ style, children }) => {
    const [width, setWidth] = useState(getWidthByBreakpoint());

    function getWidthByBreakpoint() {
      const screenWidth = window.innerWidth;
  
      if (screenWidth < 640) {
  
        // sm
        return screenWidth;
      } else if (screenWidth < 768) {
        // md
        return screenWidth - 60;
      } else {
        // 2xl and above
        return screenWidth - 320;
      }
    }
  
    useEffect(() => {
      const handleResize = () => {
        setWidth(getWidthByBreakpoint());
      };
  
      window.addEventListener('resize', handleResize);
      handleResize(); // call once on mount
  
      return () => window.removeEventListener('resize', handleResize);
    }, []);
    return (
        <div className={`p-6  font-public h-screen overflow-y-scroll ${style}`}
            // style={{ width: width < 640 ? '100%' : `${width}px` }}
        >
            {children}
        </div>
    );
};

export default ParentComponent;
