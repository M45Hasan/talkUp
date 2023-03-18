import React from "react";
import { AiTwotoneLike } from "react-icons/ai";

import Image from "./Image";
import { useNavigate } from "react-router-dom";

const NewPostCard = ({ text, title, postSrc, fndSrc }) => {
  let navigate = useNavigate();

  return (
    <>
      <div className="m-2">
        {postSrc ? (
          <div className="relative w-[80px] h-[80px] mb-2">
            <img
              className="rounded-lg object-cover w-[80px] h-[80px]"
              src={postSrc}
              alt="card"
            />
            <image className="absolute bottom-0 right-0">
              <Image
                className="w-[25px] h-[25px] rounded-full"
                imgSrc={fndSrc}
              />
            </image>
            
          </div>
        ) : (
          <div>
            {" "}
            <image className=" top-0 left-0">
              <Image
                className="w-[42px] h-[42px] rounded-full"
                imgSrc={fndSrc}
              />
            </image>
            <div className="w-[100px] h-[40px]">
            <p className="text-gray-700 text-base font-bar mb-1">{text.slice(0,20)}</p>
            </div>
          </div>
        )}

        <div>
          <div className="flex gap-x-5 w-full">
            <div
              onClick={() => {
                navigate("/feed");
              }}
              className="cursor-pointer  rounded-lg hover:bg-cyan-500 bg-[#0E6795] "
            >
              <p className="text-[10px] font-bar p-1 text-white font-semibold">
                View
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NewPostCard;
