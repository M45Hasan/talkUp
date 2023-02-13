import React from "react";
import { GrAlert } from "react-icons/gr";

const Alert = ({ children }) => {
  return (
    <div className=" bg-red-600 w-[360px] h-8 border border-solid border-white rounded-xl flex gap-x-5 items-center ml-[80px] pl-4">
      < GrAlert className="text-white" />
      <p className="font-nuni text-sm font-bold text-white">{children}</p>
    </div>
  );
};

export default Alert;
