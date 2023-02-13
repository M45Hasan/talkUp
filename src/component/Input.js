import React from "react";

const Input = ({ type, placeholder, label, onChan,name }) => {
  return (
    <div className=" w-full mt-6 flex justify-center ">
      <div className="pl-[20px]">
        <label className=" font-nuni text-[#11175D] text-sm font-bold block">
          {label}{" "}
        </label>
        <input
          onChange={onChan}
          className="font-nuni text-[#11175D] text-base font-semibold border border-[#11175D] w-[360px] h-12 rounded-[8px] pl-[20px] "
          type={type}
          placeholder={placeholder}
          name={name}
        />
      </div>
    </div>
  );
};

export default Input;
