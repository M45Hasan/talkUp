import React, { useEffect, useState, useRef } from "react";
import Container from "../component/Container";

import { FiSend } from "react-icons/fi";
import { MdOutlineAddPhotoAlternate } from "react-icons/md";
import { ImCross } from "react-icons/im";
import { useNavigate } from "react-router-dom";
import {
  AiTwotoneLike,
  AiOutlineCloseSquare,
  AiFillDislike,
  AiFillCamera,
} from "react-icons/ai";
import { BsFillEmojiSunglassesFill } from "react-icons/bs";
import { HiMicrophone } from "react-icons/hi";
import { MdPhotoCamera } from "react-icons/md";
import {
  getDatabase,
  ref,
  set,
  onValue,
  push,
  remove,
  update,
} from "firebase/database";
import { useSelector } from "react-redux";
import Image from "../component/Image";
import {
  ref as def,
  uploadBytes,
  getDownloadURL,
  getStorage,
} from "firebase/storage";
import SccroolButton from "../component/SccroolButton";
import { v4 } from "uuid";

const Feed = () => {
  let navigate = useNavigate();
  let reduxReturnData = useSelector((state) => state);
  let db = getDatabase();
  let [formData, setData] = useState({
    userPhoto: reduxReturnData.userStoreData.userInfo.photoURL,
    userName: reduxReturnData.userStoreData.userInfo.displayName,
    userText: "",
  });

  let handleWrite = (e) => {
    let { name, value } = e.target;

    setData({ ...formData, [name]: value });
  };

  const [imageUpload, setImageUpload] = useState(null);

  let storage = getStorage();

  let handleSend = (e) => {
    console.log("ami postPic");

    if (imageUpload == null) {
      set(push(ref(db, "userPost")), {
        userText: formData.userText,
        userPhoto: formData.userPhoto,
        userName: formData.userName,
        pid: reduxReturnData.userStoreData.userInfo.uid,
      }).catch((error) => {
        console.log(error.code);
      });
    } else {
      const imageRef = def(
        storage,
        `userPostURL/${reduxReturnData.userStoreData.userInfo.uid} /${v4()}`
      );

      uploadBytes(imageRef, imageUpload).then((snapshot) => {
        getDownloadURL(snapshot.ref).then((url) => {
          console.log("url", url);
          set(push(ref(db, "userPost")), {
            userText: formData.userText,
            userPhoto: formData.userPhoto,
            userName: formData.userName,
            pid: reduxReturnData.userStoreData.userInfo.uid,
            userpostPhoto: url,
          }).catch((error) => {
            console.log(error.code);
          });
        });
      });
    }
  };

  let [show, setShow] = useState(false);

  let photoOpen = () => {
    setShow(!show);
  };
  //################################### database call start ########
  let [userPost, setPost] = useState([]);

  useEffect(() => {
    const userRef = ref(db, "userPost");
    onValue(userRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        console.log(item.val());
        if (item.val().pid === reduxReturnData.userStoreData.userInfo.uid) {
          arr.push({ ...item.val(), uid: item.key });
        } else {
          arr.push({ ...item.val(), uid: item.key });
        }
      });
      setPost(arr);
    });
    console.log("ami Post arr", userPost);
  }, []);

  let handlePostdel = (item) => {
    console.log("postDel", item.pid);
    console.log("postUid", item.uid);
    if (item.pid === reduxReturnData.userStoreData.userInfo.uid) {
      remove(ref(db, `userPost/${item.uid}`));
      console.log("delete success");
    } else {
      console.log("delete hoy ny");
    }
  };

  //################################### Comment Start #########

  let [lnew, setlNew] = useState("");
  let handleOpen = (item) => {
    setlNew(item.uid);
  };
  let handleClose = (item) => {
    setlNew("667");
  };

  //################################### Comment end #########

  //################################### like Start #########

  let handleLike = (item) => {
    console.log("like:", item);

    set(push(ref(db, "userLike/")), {
      postId: item.uid,
      postmanId: item.pid,
      postman: item.userName,
      postmanURL: item.userPhoto,
      likerId: reduxReturnData.userStoreData.userInfo.uid,
      likerURL: reduxReturnData.userStoreData.userInfo.photoURL,
      likerName: reduxReturnData.userStoreData.userInfo.displayName,
    });
  };

  let handleDisL = (item) => {
    likeCount.forEach((e) => {
      console.log(e);
      if (
        e.likerId === reduxReturnData.userStoreData.userInfo.uid &&
        e.postId === item.uid
      ) {
        remove(ref(db, "userLike/" + e.lid));
      }
    });
  };

  let [likeCount, setCount] = useState([]);

  useEffect(() => {
    const userRef = ref(db, "userLike/");

    onValue(userRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        arr.push({ ...item.val(), lid: item.key });
      });

      setCount(arr);
    });
  }, []);
  console.log(likeCount);
  //################################################ users map stsrt
  let [showUser, setUser] = useState();

  useEffect(() => {
    const useRef = ref(db, "users");

    onValue(useRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        arr.push({ ...item.val(), uid: item.key });
      });
      setUser(arr);
    });
  }, [db]); // render problem
  console.log(showUser);

  //################################################ users map end
  let [modLike, setModLike] = useState("");
  let [myLiker, setMyLiker] = useState([]);

  let handleLiker = (item) => {
    setModLike(item.uid);

    console.log(item.uid);
    let arr = [];

    likeCount.forEach((likeCow) => {
      showUser.forEach((usShow) => {
        if (likeCow.likerId === usShow.uid && item.uid === likeCow.postId) {
          arr.push({
            likerId: likeCow.likerId,
            likerName: likeCow.likerName,
            likerURL: likeCow.likerURL,
            about: usShow.about,
          });
        }
      });
    });

    console.log(arr);

    setMyLiker(arr);
  };

  console.log(myLiker);

  let modClose = (item) => {
    setModLike("1234");
  };
  //################################### Like end #########

  //##################################### comment start ####
  let [comData, setComData] = useState({
    comInput: "",
  });
  let writeCom = (e) => {
    let { name, value } = e.target;

    setComData({
      ...comData,
      [name]: value,
    });
    console.log(comData);
  };

  //#### Com send start ###
  let comSend = (e) => {
    console.log(e);

    set(
      push(ref(db, "userComment/"), {
        postId: e.uid,
        postmanId: e.pid,
        postMan: e.userName,
        commentar: reduxReturnData.userStoreData.userInfo.displayName,
        commentarId: reduxReturnData.userStoreData.userInfo.uid,
        commentarURL: reduxReturnData.userStoreData.userInfo.photoURL,
        commentText: comData.comInput,
      }).then(() => {
        comData.comInput = "";
      })
    );
  };
  //#### Com send end ###

  //#### comArr fetch start ###

  let [comArr, setComArr] = useState([]);
  useEffect(() => {
    const useRef = ref(db, "userComment/");
    onValue(useRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        arr.push({ ...item.val(), kid: item.key });
      });
      setComArr(arr);
    });
  }, []);
  console.log(comArr);
  //#### Com fetch end ###

  //#### Com delete start ###
  let comDel = (item) => {
    console.log(item);
    if (item.postmanId === reduxReturnData.userStoreData.userInfo.uid) {
      remove(ref(db, "userComment/" + item.kid));
    }
    console.log(item);
    if (item.commentarId === reduxReturnData.userStoreData.userInfo.uid) {
      remove(ref(db, "userComment/" + item.kid));
    }
  };
  //#### Com delete end ###
  //##################################### comment end ####

  //######################### scroll func ####
  let scrollRef = useRef(null);

  let scrollBottom = () => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollBottom();
  }, [comArr]);
  //######################### scroll func ####
  return (
    <>
      <Container>
        <div className="w-[100%] flex justify-start mt- items-center">
          <div>
            <div className=" flex justify-between w-max pt-4 ">
              <div className=" w-[777px] h-[200px] bg-[#FFFF] border border-solid pt-5 px-6 border-[#F4F4F4]">
                <p className=" pb-3 border-b border-solid border-b-[#F4F4F4]">
                  New Post
                </p>

                <div className="relative">
                  {show && (
                    <div>
                      <input
                        type="file"
                        name="userpostPhoto"
                        onChange={(event) => {
                          setImageUpload(event.target.files[0]);
                        }}
                      />
                    </div>
                  )}
                  <textarea
                    rows={4}
                    cols={10}
                    name="userText"
                    className="block w-full border-0 mt-2 h-[100px]  p-2 "
                    onChange={handleWrite}
                    placeholder="Write here"
                  />
                  <div className=" translate-x-[640px] translate-y-[-30px] flex justify-between w-[60px] items-center">
                    <MdOutlineAddPhotoAlternate
                      onClick={photoOpen}
                      className=" cursor-pointer block text-xl"
                    />
                    <FiSend
                      onClick={(e) => handleSend()}
                      className="cursor-pointer text-xl block text-end"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-between w-max ">
              <div className=" flex items-end w-[777px]">
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
                <div
                  onClick={() => {
                    navigate("/friends");
                  }}
                  className="cursor-pointer w-[240px] h-10 border bg-[#FFFFFF]  border-solid border-[#bab8b8]  hover:bg-cyan-500 flex items-center justify-center"
                >
                  {" "}
                  <p className="font-bar font-medium font-base text-black">
                    Friends
                  </p>{" "}
                </div>
                <div
                  onClick={() => {
                    navigate("/post");
                  }}
                  className="cursor-pointer w-[240px] h-10 border bg-[#FFFFFF]  border-solid border-[#bab8b8]  hover:bg-cyan-500 flex items-center justify-center"
                >
                  {" "}
                  <p className="font-bar font-medium font-base text-black">
                    Post
                  </p>{" "}
                </div>
              </div>
            </div>

            {userPost
              ?.slice(0)
              .reverse()
              .map((item) => (
                <div className="mt-[25px] w-full px-6 py-[30px] bg-[#FFFF]">
                  <div className="flex justify-between items-center w-[150px] mb-[12px]">
                    {item.userPhoto && (
                      <image className="">
                        <Image
                          className="w-[42px] h-[42px] rounded-full"
                          imgSrc={item.userPhoto}
                        />
                      </image>
                    )}

                    <div className="w-[100px]">
                      <h4 className="font-bar font-bold mt-[-15px] text-[12px]">
                        {item.userName}
                      </h4>
                      {item.about && (
                        <p className="font-bar font-semibold text-[10px] text-[#181818]">
                          @ {item.about}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-between ">
                    {item.userText && (
                      <p className="text-gray-700 text-base font-bar mb-4">
                        {item.userText}
                      </p>
                    )}
                    {item.pid ===
                      reduxReturnData.userStoreData.userInfo.uid && (
                      <button
                        onClick={() => handlePostdel(item)}
                        className="text-bar self-baseline  font-medium text-base  text-[#0275B1] hover:text-red-500 cursor-pointer "
                      >
                        <ImCross />
                      </button>
                    )}
                  </div>
                  {item.userpostPhoto && (
                    <image className="w-[700px] h-[300px]">
                      <Image
                        className="w-full h-[260px] cover"
                        imgSrc={item.userpostPhoto}
                      />
                    </image>
                  )}
                  <div className="flex w-full h-[20px] flex-row-reverse gap-x-5 items-center  mt-4">
                    <p className="border-[1px]  hover:rounded-[2px] rounded-md border-[#0E6795] cursor-pointer text-center text-sm font-bar px-[2px]  text-[#0E6795] font-semibold hover:text-cyan-500">
                      {" "}
                      {comArr.filter((e) => item.uid === e.postId).length}{" "}
                    </p>
                    <div onClick={() => handleOpen(item)}>
                      <p className=" cursor-pointer text-end text-base font-bar p-1  text-[#0E6795] font-semibold rounded-lg hover:text-cyan-500 ">
                        Comment
                      </p>
                    </div>
                    <div className="flex items-center gap-x-2 w-[100px]">
                      <div className="w-[30%]" onClick={() => handleLike(item)}>
                        <p className=" cursor-pointer text-end text-base font-bar p-1  text-[#0E6795] font-semibold rounded-lg hover:text-cyan-500 ">
                          <AiTwotoneLike />
                        </p>
                      </div>
                      <div
                        className=" w-[40%] "
                        onClick={() => handleLiker(item)}
                      >
                        <p className="border-[1px] hover:rounded-[2px] rounded-md border-[#0E6795] cursor-pointer text-center text-sm font-bar px-[2px]  text-[#0E6795] font-semibold hover:text-cyan-500">
                          {" "}
                          {
                            likeCount.filter((e) => e.postId === item.uid)
                              .length
                          }
                        </p>
                      </div>
                      {/* ########################################### modal start */}
                      {modLike === item.uid && (
                        <>
                          <div
                            onClick={() => modClose(item)}
                            className="justify-center border-4 rounded-lg border-solid border-[#0E6795] items-center flex overflow-x-hidden fixed inset-0 z-50 outline-none focus:outline-none"
                          >
                            <div className="relative w-auto my-6 mx-auto max-w-3xl">
                              {/*content*/}
                              <div className="border-2 rounded-lg border-[#0E6795] shadow-xl dark:text-white relative flex flex-col w-[280px] h-[300px] bg-white outline-none focus:outline-none">
                                {/*header*/}

                                {/*body*/}
                                <div
                                  className="relative p-6 dark:bg-gray-700 flex-auto overflow-y-scroll scrollbar-red-500 "
                                  style={{
                                    scrollBehavior: "smooth",
                                    scrollbarColor: "green",
                                  }}
                                >
                                  {myLiker.map((tem) => (
                                    <div className="mb-3 border-b pb-[6px] w-[200px] border-black ">
                                      <div className="flex w-full gap-x-2 ">
                                        {tem.likerURL ? (
                                          <image>
                                            <Image
                                              className="w-[42px] h-[42px] rounded-full"
                                              imgSrc={tem.likerURL}
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
                                        <div className="ml-1 w-[100px]">
                                          <h4 className="font-bar font-bold text-[12px]">
                                            {tem.likerName}
                                          </h4>
                                          <p className="font-bar font-semibold text-[10px] text-[#181818] dark:text-white">
                                            @ {tem.about}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                                {/*footer*/}
                                <div className="flex items-center justify-end p-2 border-t bg-slate-500 border-solid border-slate-200 rounded-b"></div>
                              </div>
                            </div>
                          </div>
                          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
                        </>
                      )}
                      {/* ########################################### modal end*/}
                      <div className="w-[30%]" onClick={() => handleDisL(item)}>
                        <p className=" cursor-pointer text-end text-base font-bar p-1  text-[#0E6795] font-semibold rounded-lg hover:text-orange-700 ">
                          <AiFillDislike />
                        </p>
                      </div>
                    </div>
                  </div>
                  {/* ######################################################################### Comment Start */}

                  {lnew === item.uid && (
                    <>
                      <div className=" w-full h-[300px] overflow-y-scroll overscroll-y-none my-4">
                        {comArr.map((e) => (
                          <div className="w-full  shadow-lg  my-2 ">
                            {reduxReturnData.userStoreData.userInfo.uid !==
                              e.commentarId &&
                              item.uid === e.postId && (
                                <div className="w-[55%] bg-gray-300 rounded-lg shadow-lg p-2  relative hover:border-[1px]  hover:border-orange-700 ease-in duration-100">
                                  <button
                                    onClick={() => comDel(e)}
                                    className="text-bar self-baseline absolute top-2 right-2 font-sm text-sm  text-[#0275B1] hover:text-red-500 cursor-pointer "
                                  >
                                    <ImCross />
                                  </button>
                                  <div className="flex justify-between items-center w-[150px] mb-[12px]">
                                    <image className="shadow-lg ">
                                      <Image
                                        className="w-[42px] h-[42px] rounded-[4px] border-2 border-solid border-cyan-400"
                                        imgSrc={e.commentarURL}
                                      />
                                    </image>

                                    <div className="w-[100px]">
                                      <h4 className="font-bar font-bold mt-[-15px] text-[12px]">
                                        {e.commentar}
                                      </h4>
                                    </div>
                                  </div>
                                  <div className="pr-1 w-[200px] overflow-x-hidden">
                                    <p className="text-gray-700 text-sm font-semibold font-bar mb-4">
                                      {e.commentText}
                                    </p>
                                  </div>
                                </div>
                              )}

                            {reduxReturnData.userStoreData.userInfo.uid ===
                              e.commentarId &&
                              item.uid === e.postId && (
                                <div className="w-[55%] bg-cyan-200 translate-x-[80%] hover:border-[1px] hover:border-orange-700 ease-in duration-100 rounded-lg shadow-lg p-2">
                                  <button
                                    onClick={() => comDel(e)}
                                    className="text-bar self-baseline absolute top-2 right-2 font-sm text-sm  text-[#0275B1] hover:text-red-500 cursor-pointer "
                                  >
                                    <ImCross />
                                  </button>
                                  <div className="flex justify-between items-center w-[150px] mb-[12px]">
                                    <image className="shadow-lg">
                                      <Image
                                        className="w-[42px] h-[42px] rounded-[4px] rounded-[4px] border-2 border-solid border-orange-400 "
                                        imgSrc={e.commentarURL}
                                      />
                                    </image>

                                    <div className="w-[100px]">
                                      <h4 className="font-bar font-bold mt-[-15px] text-[12px]">
                                        {e.commentar}
                                      </h4>
                                    </div>
                                  </div>
                                  <div className=" w-[200px] overflow-x-hidden">
                                    <p className="text-gray-700 text-sm font-semibold font-bar  mb-4">
                                      {e.commentText}
                                    </p>
                                  </div>
                                </div>
                              )}
                          </div>
                        ))}
                        <div ref={scrollRef} />
                      </div>
                      <div className="w-full h-10 border-[1px] border-[#0E6795] flex gap-x-[60px] shadow-lg rounded-sm hover:border-orange-800 mt-[12px] relative">
                        <input
                          className="w-[470px] h-full pl-10 pr-14 outline-none"
                          type="text"
                          name="comInput"
                          value={comData.comInput}
                          onChange={writeCom}
                          placeholder="Comment Here"
                        />
                        <div className="flex w-[120px] gap-x-5 ">
                          <MdOutlineAddPhotoAlternate className=" cursor-pointer text-[#0E6795] self-end text-[30px]" />
                          <AiFillCamera className=" cursor-pointer text-[#0E6795] self-end text-[30px]" />
                          <HiMicrophone className=" cursor-pointer text-[#0E6795] self-end text-[30px]" />
                        </div>

                        <div className=" absolute left-[420px] top-[10px] flex gap-x-3 h-[25px] w-[50px]">
                          <BsFillEmojiSunglassesFill className=" cursor-pointer text-[#0E6795] self-end text-[30px] hover:text-orange-600 hover:rotate-180 ease-in duration-100 " />
                          <FiSend
                            onClick={() => comSend(item)}
                            className="  cursor-pointer text-[#0E6795] text-[20px] hover:text-[23px] origin-center rotate-180 ease-in duration-200 hover:rotate-0"
                          />
                        </div>

                        <div
                          className=" absolute right-0 bottom-0"
                          onClick={() => handleClose(item)}
                        >
                          <p className=" cursor-pointer text-end text-base font-bar   text-[#973333] font-semibold rounded-lg hover:text-red-500 ">
                            <AiOutlineCloseSquare />
                          </p>
                        </div>
                      </div>
                    </>
                  )}
                  {/* ######################################################################### Comment end */}
                </div>
              ))}
          </div>
        </div>
        <SccroolButton />
      </Container>
    </>
  );
};

export default Feed;
