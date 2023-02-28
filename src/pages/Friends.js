import React, { useState, useEffect } from "react";
import Image from "../component/Image";

import Container from "../component/Container";
import { useNavigate } from "react-router-dom";
import { getDatabase, ref, onValue } from "firebase/database";
import { useSelector } from "react-redux";

const Friends = () => {
  let navigate = useNavigate();
  const db = getDatabase();
  let reduxReturnData = useSelector((state) => state);
  useEffect(() => {
    if (reduxReturnData.userStoreData.userInfo == null) {
      console.log("not signIn ");

      navigate("/siginin");
    }
  }, []);

  let [userList, setUserList] = useState([]);

  useEffect(() => {
    const userref = ref(db, "users/");

    onValue(userref, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        arr.push({ ...item.val() });
      });
      setUserList(arr);
    });
  }, []);

  let [newArr, setNew] = useState([]);

  return (
    <>
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
      <Container>
        <div className="w-[100%] flex justify-start mt- items-center">
          <div>
            <div className=" flex justify-between w-max pt-4  ">
              <div className=" w-[777px] h-[360px] ">
                <h3 className="font-bar font-medium font-md text-black pb-2">
                  User list{" "}
                </h3>
                {userList.map((item) => (
                  <div className="mb-3 border-b pb-1 w-[120px] border-black ">
                    <div className="flex w-[80px] justify-between ">
                      {item.photoURL ? (
                        <image>
                          <Image
                            className="w-[42px] h-[42px] rounded-full"
                            imgSrc={item.photoURL}
                          />
                        </image>
                      ) : (
                        <image>
                          <Image
                            className="w-[42px] h-[42px] rounded-full"
                            imgSrc="assets/wx1.png"
                          />
                        </image>
                      )}
                      <h4 className="font-bar font-bold text-[12px]">
                        {item.displayName}
                      </h4>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
};

export default Friends;
