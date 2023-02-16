import React, { useState } from "react";
import { AiTwotoneLike } from "react-icons/ai";
import { useSelector } from "react-redux";
import Image from "./Image";

const NewPostCard = ({ text, title, postSrc, fndSrc }) => {
  let [show, setShow] = useState(true);

  let hide = () => {
    setShow(false);
  };
  return (
    <>
      
        <div className={!postSrc == "" ? "relative  mb-3" : "relative mb-4 "}>
          {postSrc && (
            <img
              className="rounded-t-lg w-300px h-[200px]"
              src={postSrc}
              alt="card"
            />
          )}
          <image className="absolute top-2 left-2">
            <Image className="w-[42px] h-[42px] rounded-full" imgSrc={fndSrc} />
          </image>
        </div>
    
      <div className="p-3 ">
        <div className={!postSrc == "" ? "mt-0" : "mt-8"}>
          {title && (
            <h5 className="text-gray-900 text-lg font-bar font-medium mb-1">
              {title}
            </h5>
          )}
          <p className="text-gray-700 text-base font-bar mb-4">{text}</p>
          <div className="flex gap-x-5 w-full">
            <p className="cursor-pointer text-base font-bar p-1 text-white font-semibold rounded-lg hover:bg-cyan-500 bg-[#0E6795]">
              View
            </p>
            <p className=" cursor-pointer text-end text-base font-bar p-1  text-white font-semibold rounded-lg hover:bg-cyan-500 bg-[#0E6795]">
              <AiTwotoneLike />
            </p>
            <p
              onClick={hide}
              className="cursor-pointer font-bar p-1 text-white font-semibold rounded-lg hover:bg-cyan-500 bg-[#0E6795]"
            >
              Hide
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default NewPostCard;
