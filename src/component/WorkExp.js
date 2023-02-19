import React from "react";
import Topic from "./Topic";
import Image from "./Image";

const WorkExp = ({
  className,
  imgSrc,
  jbName,
  position,
  place,
  time,
  duration,
  details,
}) => {
  return (
    <div className=" w-full border-b border-solid border-[#bab8b8] ">
      <div className="flex mt-3 gap-x-2 ">
        {imgSrc && (
          <div className="">
            <Image className={className} imgSrc={imgSrc} />
          </div>
        )}
        <div className="">
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
          <div>
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
          <div>
            {details && (
              <p className=" font-bar text-[#181818] font-normal inline-block  text-[10px] mb-3">
                {details}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkExp;
