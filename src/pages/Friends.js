import React, { useState, useEffect } from "react";
import Image from "../component/Image";

import Container from "../component/Container";
import { useNavigate } from "react-router-dom";
import { getDatabase, ref, onValue, set, push } from "firebase/database";
import { useSelector } from "react-redux";
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from "react-accessible-accordion";
import "react-accessible-accordion/dist/fancy-example.css";

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
        if (item.key !== reduxReturnData.userStoreData.userInfo.uid) {
          arr.push({ ...item.val(), uid: item.key });
        }
      });
      setUserList(arr);
    });
  }, []);

  //################ friend Request start #########
  let handleUserList = (item) => {
    console.log(item);

    set(
      push(ref(db, "fndRequest/"), {
        requSenderId: reduxReturnData.userStoreData.userInfo.uid,
        requSenderName: reduxReturnData.userStoreData.userInfo.displayName,
        requSenderURL: reduxReturnData.userStoreData.userInfo.photoURL,
        requSenderAbout:
          item.uid === reduxReturnData.userStoreData.userInfo.uid
            ? item.about
            : "Developer",
        requSenderEmail: reduxReturnData.userStoreData.userInfo.email,
        requSenderLoc:
          item.uid === reduxReturnData.userStoreData.userInfo.uid
            ? item.location
            : "Online",
        receiverId: item.uid,
        receiverName: item.displayName,
        receiverEmail: item.email,
        receiverAbout: item.about ? item.about : "WebDev",
        receiverLoc: item.location ? item.location : "Online",
      })
    );
  };
  let [reqShow, setReq] = useState([]);
  useEffect(() => {
    const useRef = ref(db, "fndRequest/");
    onValue(useRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        if (
          item.val().receiverId === reduxReturnData.userStoreData.userInfo.uid
        ) {
          arr.push({ ...item.val(), uid: item.key });
        }
      });
      setReq(arr);
    });
  }, []);
  console.log(reqShow);
  //################ friend Request end #########

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
          <div
            onClick={() => {
              navigate("/feed");
            }}
            className="cursor-pointer w-[100px] h-10 border  hover:bg-cyan-500 bg-[#FFFFFF] border-solid border-[#bab8b8] flex items-center justify-center"
          >
            {" "}
            <p className="font-bar font-medium font-base text-black">
              Feeds
            </p>{" "}
          </div>
        </div>
      </div>
      <Container>
        <div className="w-[100%] flex justify-start mt- items-center">
          <div>
            <div className=" flex justify-between w-max pt-4  ">
              <div className=" w-[720px] h-[360px] ">
                <Accordion>
                  <AccordionItem>
                    <AccordionItemHeading>
                      <AccordionItemButton>User list</AccordionItemButton>
                    </AccordionItemHeading>
                    <AccordionItemPanel className="h-[250px]  overflow-y-scroll">
                      {userList.map((item) => (
                        <div
                          key={item.uid}
                          className="mb-3 border-b pb-1 w-[130px] border-black  "
                        >
                          <div className="flex w-[110x] justify-between ">
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
                            <div className="ml-1">
                              <h4 className="font-bar font-bold text-[12px]">
                                {item.displayName}
                              </h4>
                              <p className="font-bar font-semibold text-[10px] text-[#181818]">
                                @ {item.about}
                              </p>
                            </div>

                            <div className="w-[40px]">
                              <button
                                onClick={() => handleUserList(item)}
                                className="cursor-pointer px-[2px] bg-[#0E6795] text-white font-bar text-[12px] font-semibold rounded-[4px]"
                              >
                                Request
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </AccordionItemPanel>
                  </AccordionItem>
                  <AccordionItem>
                    <AccordionItemHeading>
                      <AccordionItemButton>Friends Request <span className="pl-2 text-[#0E6795] font-bar font-semibold"> {reqShow.filter((item)=>item.receiverId===reduxReturnData.userStoreData.userInfo.uid).length}</span></AccordionItemButton>
                    </AccordionItemHeading>
                    <AccordionItemPanel className="h-[250px]  overflow-y-scroll">
                      {reqShow.map((item) => (
                        <div
                          key={item.uid}
                          className="mb-3 border-b pb-1 w-[120px] border-black relative "
                        >
                          <div className="flex w-[100x] gap-x-2 ">
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
                            <div className="ml-1">
                              <h4 className="font-bar font-bold text-[12px]">rrg fgdgfdg
                                {item.displayName}
                              </h4>
                              <p className="font-bar font-semibold text-[10px] text-[#181818]">
                                @ {item.about} hnhh
                              </p>
                            </div>
                          </div>
                          <div className="w-[90px] justify-between top-[5px] right-[-95px] absolute flex">
                            <button
                              onClick={() => handleUserList(item)}
                              className="cursor-pointer px-[2px] bg-[#0E6795] text-white font-bar text-[12px] font-semibold rounded-[4px]"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => handleUserList(item)}
                              className="cursor-pointer px-[2px] bg-[#0E6795] text-white font-bar text-[12px] font-semibold rounded-[4px]"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </AccordionItemPanel>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
};

export default Friends;
