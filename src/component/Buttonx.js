import React from "react";

const Buttonx = ({ butName, click }) => {
  return (
    <div className=" w-full mt-6 flex justify-center ">
      <div className="pl-[20px]">
        <button
          onClick={click}
          className="bg-[#086FA4] text-[#FFFFFF] font-nuni font-semibold   w-[360px] text-base h-12 rounded-[86px]"
        >
          {butName}
        </button>
      </div>
    </div>
  );
};
export default Buttonx;
