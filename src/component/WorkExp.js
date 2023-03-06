import React from "react";
import { ImCross } from "react-icons/im";

import Image from "./Image";
import {MdSchool} from "react-icons/md"

const WorkExp = ({
  className,
  imgSrc,
  jbName,
  position,
  place,
  time,
  duration,
  details,
  blick,
}) => {
  return (
    <>
      <div className=" w-full border-b border-solid border-[#bab8b8] ">
        <div className="flex mt-3 gap-x-2 ">
          <div className="">
            {imgSrc ? (
              <div className="">
                <Image className={className} imgSrc={imgSrc} />
              </div>
            ) : (
              <div className="w-[35px]"><MdSchool className="text-[#0275B1] text-[27px]"/></div>
            )}
          </div>
          <div className="flex gap-x-[275px] pb-10 ">
            <div className=" w-[300px]">
              {jbName && (
                <h4 className="font-bar font-normal text-sm text-[#181818] mb-5">
                  {jbName}
                </h4>
              )}

              <div>
                {position && (
                  <p className="font-bar font-normal text-[#181818] inline-block text-[10px] mr-10">
                    {position}
                  </p>
                )}
                {place && (
                  <p className=" font-bar text-[#181818] font-normal inline-block  text-[10px]">
                    {place}
                  </p>
                )}
              </div>
              <div className="">
                {time && (
                  <p className=" font-bar text-[#181818] font-normal inline-block  text-[10px] mr-10">
                    {time}
                  </p>
                )}
                {duration && (
                  <p className=" font-bar text-[#181818] font-normal inline-block  text-[10px]">
                    {duration}
                  </p>
                )}
              </div>
              <div className=" ">
                {details && (
                  <p className=" font-bar text-[#181818] font-normal inline-block  text-[10px] mb-3">
                    {details}
                  </p>
                )}
              </div>
            </div>

            <button
              onClick={blick}
              className="text-bar  self-baseline  block font-medium text-base  text-[#0275B1] hover:text-red-500 cursor-pointer  px-2 rounded-lg "
            >
              <ImCross />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default WorkExp;
