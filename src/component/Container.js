import React from "react";

const Container = ({ children }) => {
  return (
    <div className="max-w-contain ma-auto">
      <div className=" p-[50px] h-[609px]  flex justify-center">
        <div className="w-[500px] h-full">{children}</div>
      </div>
    </div>
  );
};

export default Container;
