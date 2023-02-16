import React from "react";
import Image from "../component/Image";
import LogoutButton from "../component/LogoutButton";
import Container from "../component/Container";
import { useNavigate } from "react-router-dom";

const Friends = () => {
  let navigate = useNavigate();

  return (
    <>
      <Container>
        <div className="w-[100%] flex justify-start mt- items-center">
          <div>
            <div className=" flex justify-between w-max pt-4  ">
              <div className=" w-[777px] h-[360px] ">
                <div className="block "></div>
              </div>
            </div>
          </div>
        </div>
      </Container>

      <div className="flex justify-between w-max  pl-[86px]">
        <div className=" flex items-end w-[720px]">
          <div className="w-[240px] flex items-center justify-center h-10 bg-[#FFFFFF] border  hover:bg-cyan-500  border-solid border-[#bab8b8] cursor-pointer">
            <p
              onClick={() => {
                navigate("/profile");
              }}
              className="font-bar font-medium font-base text-black"
            >
              Profile
            </p>{" "}
          </div>
          <div className="cursor-pointer w-[240px] h-12 border bg-[#0E6795] flex items-center justify-center">
            {" "}
            <p className="font-bar font-medium font-base text-white">
              Friends
            </p>{" "}
          </div>
          <div
            onClick={() => {
              navigate("/post");
            }}
            className="cursor-pointer w-[240px] h-10 border bg-[#FFFFFF] border-solid border-[#bab8b8]  hover:bg-cyan-500 flex items-center justify-center"
          >
            {" "}
            <p className="font-bar font-medium font-base text-black">
              Post
            </p>{" "}
          </div>
        </div>
      </div>
    </>
  );
};

export default Friends;
