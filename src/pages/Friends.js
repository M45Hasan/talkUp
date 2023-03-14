import React, { useState, useEffect } from "react";
import Image from "../component/Image";

import Container from "../component/Container";
import { useNavigate } from "react-router-dom";
import {
  getDatabase,
  ref,
  onValue,
  set,
  push,
  remove,
} from "firebase/database";
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
        console.log(item.key);
        if (item.key !== reduxReturnData.userStoreData.userInfo.uid) {
          arr.push({ ...item.val(), uid: item.key });
        }
      });
      setUserList(arr);
    });
  }, []);
  console.log(userList);

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
        arr.push(item.val().receiverId + item.val().requSenderId);
      });
      setReq(arr);
    });
  }, []);
  console.log(reqShow);
  //##################################### request arr
  let [rqShow, setRq] = useState([]);
  useEffect(() => {
    const useRef = ref(db, "fndRequest/");
    onValue(useRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        arr.push({ ...item.val(), uid: item.key });
      });
      setRq(arr);
    });
  }, []);
  console.log(rqShow);

  //################ friend Request end #########

  //################ friend Request delete/cancel start #########

  let deleteReq = (item) => {
    if (item.receiverId === reduxReturnData.userStoreData.userInfo.uid) {
      remove(ref(db, "fndRequest/" + item.uid));
    }
    console.log(item);
  };

  let reqCancel = (item) => {
    console.log(item);
    rqShow.forEach((itm) => {
      if (
        item.uid === itm.receiverId &&
        reduxReturnData.userStoreData.userInfo.uid === itm.requSenderId
      ) {
        remove(ref(db, "fndRequest/" + itm.uid));
      }
    });
  };
  //################ friend Request delete end #########

  //################ friend Request Accept Start #########

  let acceptRequ = (item) => {
    console.log(item.uid);
    set(push(ref(db, "friends/")), {
      friendId: item.requSenderId,
      friendName: item.requSenderName,
      friendURL: item.requSenderURL,
      friendAbout: item.requSenderAbout,
      friendLoc: item.requSenderLoc,
      friendEmail: item.requSenderEmail,
      fndAcptId: item.receiverId,
      fndAcptName: item.receiverName,
      fndAcptURL: reduxReturnData.userStoreData.userInfo.photoURL,
      fndAcptEmail: item.receiverEmail,
      fndAcptABout: item.receiverAbout,
      fndAcptLoc: item.receiverLoc,
      reqId: item.uid,
    }).then(() => {
      remove(ref(db, "fndRequest/" + item.uid));
    });
  };

  let [frnShow, setFrn] = useState([]);
  useEffect(() => {
    const useRef = ref(db, "friends/");
    onValue(useRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        arr.push({ ...item.val(), fndUid: item.key });
      });
      setFrn(arr);
    });
  }, []);
  console.log(frnShow);

  //############################# for button friend arr####

  let [fnShow, setFn] = useState([]);
  useEffect(() => {
    const useRef = ref(db, "friends/");
    onValue(useRef, (snapshot) => {
      let arr = [];

      snapshot.forEach((item) => {
        arr.push(item.val().friendId + item.val().fndAcptId);
      });
      setFn(arr);
    });
  }, []);
  console.log(fnShow);
  //################ friend Request Accept end #########

  //################ unfriend fun start #########
  let unfriendFun = (item) => {
    console.log(item);
    if (
      item.fndAcptId === reduxReturnData.userStoreData.userInfo.uid ||
      item.friendId === reduxReturnData.userStoreData.userInfo.uid
    ) {
      remove(ref(db, "friends/" + item.fndUid));
    }
  };
  //################ unfriend fun end ###########

  //################ block friend fun start ###########

  //############# all user call ####
  let [uList, setUList] = useState([]);

  useEffect(() => {
    const userref = ref(db, "users/");

    onValue(userref, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        console.log(item.key);

        arr.push({ ...item.val(), uid: item.key });
      });
      setUList(arr);
    });
  }, []);
  console.log(uList);
  //############# all user call ####

  let blockFndFun = (item) => {
    console.log(item);
    if (item.fndAcptId === reduxReturnData.userStoreData.userInfo.uid) {
      set(push(ref(db, "blockFnd/")), {
        blockByName: item.fndAcptName,
        blockById: item.fndAcptId,
        blockByURL: item.fndAcptURL,
        blockByAbout: item.fndAcptABout,
        blockByEmail: item.fndAcptEmail,
        blockByLoc: item.fndAcptLoc,

        blockedId: item.friendId,
        blockedName: item.friendName,
        blockedURL: item.friendURL,
        blockedEmail: item.friendEmail,
        blockedAbout: item.friendAbout,
        blockedLoc: item.friendLoc,
      }).then(() => {
        remove(ref(db, "friends/" + item.fndUid));
      });
    }

    if (item.friendId === reduxReturnData.userStoreData.userInfo.uid) {
      set(push(ref(db, "blockFnd/")), {
        blockByName: item.friendName,
        blockById: item.friendId,
        blockByURL: item.friendURL,
        blockByAbout: item.friendAbout,
        blockByEmail: item.friendEmail,
        blockByLoc: item.friendLoc,

        blockedId: item.fndAcptId,
        blockedName: item.fndAcptName,
        blockedURL: item.fndAcptURL,
        blockedEmail: item.fndAcptEmail,
        blockedAbout: item.fndAcptABout,
        blockedLoc: item.fndAcptLoc,
      }).then(() => {
        remove(ref(db, "friends/" + item.fndUid));
      });
    }
  };

  //###### block arr ####
  let [bShow, setBlock] = useState([]);

  useEffect(() => {
    const useRef = ref(db, "blockFnd/");
    onValue(useRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        arr.push({ ...item.val(), blockUid: item.key });
      });
      setBlock(arr);
    });
  }, []);
  console.log(bShow);

  //################ block friend fun end ###########

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
              <div className=" w-[720px] h-[360px] flex justify-between ">
                <div className="w-[355px]">
                  {" "}
                  <Accordion>
                    <AccordionItem>
                      <AccordionItemHeading>
                        <AccordionItemButton>
                          User list{" "}
                          <span className="pl-2 text-[#0E6795] font-bar font-semibold">
                            {userList.length}
                          </span>
                        </AccordionItemButton>
                      </AccordionItemHeading>
                      <AccordionItemPanel className="h-[250px]  overflow-y-scroll">
                        {userList.map((item) => (
                          <div
                            key={item.uid}
                            className="mb-3 border-b pb-1 w-[130px] border-black shadow-xl "
                          >
                            <div className="flex w-[202px] justify-between ">
                              {item.photoURL ? (
                                <div className="w-[40px] border-[1px] border-orange-600 rounded-full">
                                  <image>
                                    <Image
                                      className="w-[40px] h-[40px] rounded-full"
                                      imgSrc={item.photoURL}
                                    />
                                  </image>
                                </div>
                              ) : (
                                <image>
                                  <Image
                                    className="w-[40px] h-[40px] rounded-full"
                                    imgSrc="assets/wx1.png"
                                  />
                                </image>
                              )}
                              <div className="ml-1 w-[120px]">
                                <h4 className="font-bar font-bold text-[12px]">
                                  {item.displayName}
                                </h4>
                                <p className="font-bar font-semibold text-[10px] text-[#181818]">
                                  @{item.about}
                                </p>
                              </div>

                              <div className="w-[40px]">
                                {reqShow.includes(
                                  item.uid +
                                    reduxReturnData.userStoreData.userInfo.uid
                                ) ||
                                reqShow.includes(
                                  reduxReturnData.userStoreData.userInfo.uid +
                                    item.uid
                                ) ? (
                                  <div>
                                    <button className="cursor-pointer px-[2px] bg-[#0E6795] text-white font-bar text-[12px] font-semibold rounded-[4px]">
                                      Pendding
                                    </button>

                                    {reqShow.includes(
                                      item.uid +
                                        reduxReturnData.userStoreData.userInfo
                                          .uid
                                    ) && (
                                      <button
                                        onClick={() => reqCancel(item)}
                                        className="cursor-pointer px-[2px] bg-[#0E6795] text-white font-bar text-[12px] font-semibold rounded-[4px]"
                                      >
                                        cancel
                                      </button>
                                    )}
                                  </div>
                                ) : fnShow.includes(
                                    item.uid +
                                      reduxReturnData.userStoreData.userInfo.uid
                                  ) ||
                                  fnShow.includes(
                                    reduxReturnData.userStoreData.userInfo.uid +
                                      item.uid
                                  ) ? (
                                  <button className="cursor-pointer px-[2px] bg-[#0E6795] text-white font-bar text-[12px] font-semibold rounded-[4px]">
                                    Friend
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => handleUserList(item)}
                                    className="cursor-pointer px-[2px] bg-[#0E6795] text-white font-bar text-[12px] font-semibold rounded-[4px]"
                                  >
                                    Request
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </AccordionItemPanel>
                    </AccordionItem>

                    <AccordionItem>
                      <AccordionItemHeading>
                        <AccordionItemButton>
                          Friends Request{" "}
                          <span className="pl-2 text-[#0E6795] font-bar font-semibold">
                            {" "}
                            {
                              rqShow.filter(
                                (item) =>
                                  item.receiverId ===
                                  reduxReturnData.userStoreData.userInfo.uid
                              ).length
                            }
                          </span>
                        </AccordionItemButton>
                      </AccordionItemHeading>
                      <AccordionItemPanel className="h-[250px]  overflow-y-scroll">
                        {rqShow.map(
                          (item) =>
                            item.receiverId ===
                              reduxReturnData.userStoreData.userInfo.uid && (
                              <div
                                key={item.requSenderId}
                                className="mb-3 border-b pb-1 w-[120px] border-black relative "
                              >
                                <div className="flex w-[100x] gap-x-2 ">
                                  {item.requSenderURL ? (
                                    <image>
                                      <Image
                                        className="w-[42px] h-[42px] rounded-full"
                                        imgSrc={item.requSenderURL}
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
                                      {item.requSenderName}
                                    </h4>
                                    <p className="font-bar font-semibold text-[10px] text-[#181818]">
                                      @ {item.requSenderAbout}
                                    </p>
                                  </div>
                                </div>
                                <div className="w-[90px] justify-between top-[5px] right-[-95px] absolute flex">
                                  <button
                                    onClick={() => acceptRequ(item)}
                                    className="cursor-pointer px-[2px] bg-[#0E6795] text-white font-bar text-[12px] font-semibold rounded-[4px]"
                                  >
                                    Accept
                                  </button>
                                  <button
                                    onClick={() => deleteReq(item)}
                                    className="cursor-pointer px-[2px] bg-[#0E6795] text-white font-bar text-[12px] font-semibold rounded-[4px]"
                                  >
                                    Delete
                                  </button>
                                </div>
                              </div>
                            )
                        )}
                      </AccordionItemPanel>
                    </AccordionItem>

                    <AccordionItem>
                      <AccordionItemHeading>
                        <AccordionItemButton>
                          Friends{" "}
                          <span className="pl-2 text-[#0E6795] font-bar font-semibold">
                            {" "}
                            {
                              frnShow.filter((item) =>
                                item.fndAcptId ===
                                reduxReturnData.userStoreData.userInfo.uid
                                  ? item.fndAcptId ===
                                    reduxReturnData.userStoreData.userInfo.uid
                                  : item.friendId ===
                                    reduxReturnData.userStoreData.userInfo.uid
                              ).length
                            }
                          </span>
                        </AccordionItemButton>
                      </AccordionItemHeading>
                      <AccordionItemPanel className="h-[250px]  overflow-y-scroll">
                        {frnShow.map(
                          (item) =>
                            item.fndAcptId ===
                              reduxReturnData.userStoreData.userInfo.uid && (
                              <div
                                key={item.friendId}
                                className="mb-3 border-b pb-1 w-[120px] border-black relative "
                              >
                                <div className="flex w-[100x] gap-x-2 ">
                                  {item.friendURL ? (
                                    <image>
                                      <Image
                                        className="w-[42px] h-[42px] rounded-full"
                                        imgSrc={item.friendURL}
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
                                      {item.friendName}
                                    </h4>
                                    <p className="font-bar font-semibold text-[10px] text-[#181818]">
                                      @ {item.friendAbout}
                                    </p>
                                  </div>
                                </div>
                                <div className="w-[90px] justify-between top-[5px] right-[-95px] absolute flex">
                                  <button
                                    onClick={() => blockFndFun(item)}
                                    className="cursor-pointer px-[2px] bg-[#0E6795] text-white font-bar text-[12px] font-semibold rounded-[4px]"
                                  >
                                    Block
                                  </button>
                                  <button
                                    onClick={() => unfriendFun(item)}
                                    className="cursor-pointer px-[2px] bg-[#0E6795] text-white font-bar text-[12px] font-semibold rounded-[4px]"
                                  >
                                    Unfriend
                                  </button>
                                </div>
                              </div>
                            )
                        )}

                        {frnShow.map(
                          (item) =>
                            item.friendId ===
                              reduxReturnData.userStoreData.userInfo.uid && (
                              <div
                                key={item.friendId}
                                className="mb-3 border-b pb-1 w-[120px] border-black relative "
                              >
                                <div className="flex w-[100x] gap-x-2 ">
                                  {item.fndAcptURL ? (
                                    <image>
                                      <Image
                                        className="w-[42px] h-[42px] rounded-full"
                                        imgSrc={item.fndAcptURL}
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
                                      {item.fndAcptName}
                                    </h4>
                                    <p className="font-bar font-semibold text-[10px] text-[#181818]">
                                      @ {item.fndAcptABout}
                                    </p>
                                  </div>
                                </div>
                                <div className="w-[90px] justify-between top-[5px] right-[-95px] absolute flex">
                                  <button
                                    onClick={() => blockFndFun(item)}
                                    className="cursor-pointer px-[2px] bg-[#0E6795] text-white font-bar text-[12px] font-semibold rounded-[4px]"
                                  >
                                    Block
                                  </button>
                                  <button
                                    onClick={() => unfriendFun(item)}
                                    className="cursor-pointer px-[2px] bg-[#0E6795] text-white font-bar text-[12px] font-semibold rounded-[4px]"
                                  >
                                    Unfriend
                                  </button>
                                </div>
                              </div>
                            )
                        )}
                      </AccordionItemPanel>
                    </AccordionItem>

                    <AccordionItem>
                      <AccordionItemHeading>
                        <AccordionItemButton>
                          Block List
                          <span className="pl-2 text-[#0E6795] font-bar font-semibold">
                            {" "}
                            {
                              bShow.filter(
                                (item) =>
                                  item.blockById ===
                                  reduxReturnData.userStoreData.userInfo.uid
                              ).length
                            }
                          </span>
                        </AccordionItemButton>
                      </AccordionItemHeading>
                      <AccordionItemPanel className="h-[250px]  overflow-y-scroll">
                        {bShow.map(
                          (item) =>
                            item.blockById ===
                              reduxReturnData.userStoreData.userInfo.uid && (
                              <div
                                key={item.blockedId}
                                className="mb-3 border-b pb-1 w-[120px] border-black relative "
                              >
                                <div className="flex w-[100x] gap-x-2 ">
                                  {item.blockedURL ? (
                                    <image>
                                      <Image
                                        className="w-[42px] h-[42px] rounded-full"
                                        imgSrc={item.blockedURL}
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
                                      {item.blockedName}
                                    </h4>
                                    <p className="font-bar font-semibold text-[10px] text-[#181818]">
                                      @ {item.blockedAbout}
                                    </p>
                                  </div>
                                </div>
                                <div className="w-[90px] justify-between top-[5px] right-[-95px] absolute flex">
                                  <button
                                    onClick={"()=>UnBlockFn(item)"}
                                    className="cursor-pointer px-[2px] bg-[#0E6795] text-white font-bar text-[12px] font-semibold rounded-[4px]"
                                  >
                                    Unblock
                                  </button>
                                </div>
                              </div>
                            )
                        )}


                      </AccordionItemPanel>
                    </AccordionItem>
                  </Accordion>
                </div>

                <div className="w-[355px]">
                  {" "}
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
                        <AccordionItemButton>
                          Friends Request{" "}
                          <span className="pl-2 text-[#0E6795] font-bar font-semibold">
                            {" "}
                            {
                              reqShow.filter(
                                (item) =>
                                  item.receiverId ===
                                  reduxReturnData.userStoreData.userInfo.uid
                              ).length
                            }
                          </span>
                        </AccordionItemButton>
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
                                <h4 className="font-bar font-bold text-[12px]">
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
        </div>
      </Container>
    </>
  );
};

export default Friends;
