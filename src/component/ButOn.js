import React from "react";

const ButOn = ({ butName, click }) => {
  return (
    <div className=" w-full mt-6  ">
 
        <button
          onClick={click}
          className="bg-[#086FA4] text-[#FFFFFF] font-nuni font-semibold   w-[170px] text-base h-8 rounded-[4px]"
        >
          {butName}
        </button>

    </div>
  );
};
export default ButOn;
