import React, { useState, useEffect } from "react";
import Image from "./Image";
import Slider from "react-slick";
import LogoutButton from "./LogoutButton";
import { useNavigate } from "react-router-dom";

import { useSelector } from "react-redux";
import NewPostCard from "./NewPostCard";
import { getDatabase, ref, onValue } from "firebase/database";
import { FiMessageSquare } from "react-icons/fi";

const Head = () => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 300,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    arrows: false,
    adaptiveHeight: true,
  };

  const [profile, setProfile] = useState("");

  let navigate = useNavigate();

  const db = getDatabase();
  let reduxReturnData = useSelector((state) => state);

  useEffect(() => {
    if (reduxReturnData.userStoreData.userInfo == null) {
      console.log("not signIn ");

      navigate("/siginin");
    }
  }, []);

  useEffect(() => {
    setProfile(reduxReturnData.userStoreData.userInfo.photoURL);
  }, [reduxReturnData]);
  //######################################database call####

  let [userPost, setPost] = useState([]);

  useEffect(() => {
    const userRef = ref(db, "userPost");
    onValue(userRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        //problem here want to show other post
        console.log(item.val());
        if (item.val().pid !== reduxReturnData.userStoreData.userInfo.uid) {
          arr.push({ ...item.val() });

          console.log(arr);
        }
      });
      setPost(arr);
    });
  }, []);
  console.log("ami Post arr", userPost);
  //######################## users database cll
  let [userShow, setUser] = useState([]);

  useEffect(() => {
    const useRef = ref(db, "users/");
    onValue(useRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        arr.push({ ...item.val(), uid: item.key });
      });
      setUser(arr);
    });
  }, []);
  console.log(userShow);
  //######################## users database cll ##
  //############### friends base call start ##########

  let [fndShow, setFndShow] = useState([]);

  useEffect(() => {
    const useRef = ref(db, "friends/");
    onValue(useRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        arr.push({ ...item.val(), fndUid: item.key });
      });
      setFndShow(arr);
    });
  }, []);
  console.log(fndShow);
  //############### friends base call end ##########
  //############### friends message start ##########
  let [messClose, setMessClose] = useState("");

  let fmessFunc = (item) => {
    setMessClose(item.fndUid);

    console.log(item);
  };
  //############### friends message end ##########

  return (
    <>
      <>
        <nav className=" bg-white w-full h-16 px-[40px] py-3 flex justify-between items-center ">
          <image>
            <Image imgSrc="../assets/lo.png" />
          </image>
          <div className="w-[32%]  flex justify-between items-center">
            <div className="flex  w-[130px] justify-between shadow-xl rounded-[4px] border-[1px] border-white-200">
              <div className="w-[80px] border-[1px] border-orange-600 rounded-full">
                <image>
                  <Image
                    className="w-[42px] h-[42px] rounded-full"
                    imgSrc={reduxReturnData.userStoreData.userInfo.photoURL}
                  />
                </image>
              </div>
              <div className="w-[150px]">
                <h4 className="font-bar font-bold text-[12px]">
                  {reduxReturnData.userStoreData.userInfo.displayName}
                </h4>
                <p className="font-bar font-bold block text-[12px]">
                  @
                  {userShow.map(
                    (item) =>
                      reduxReturnData.userStoreData.userInfo.uid === item.uid &&
                      item.about
                  )}
                </p>
              </div>
            </div>
            <div className="shadow-xl rounded-full">
              <LogoutButton />
            </div>
          </div>
        </nav>

        <div className=" absolute top-9 right-0 translate-x-[-15%] translate-y-[30%]">
          <div className="rounded-lg shadow-lg bg-white w-[302px] h-[140px]">
            <Slider {...settings} className="">
              {userPost.reverse().map((item) => (
                <div>
                  <NewPostCard
                    title={""}
                    text={item.userText}
                    postSrc={item.userpostPhoto}
                    fndSrc={item.userPhoto}
                  />
                </div>
              ))}
            </Slider>
          </div>
        </div>

        <div className=" absolute top-[180px] right-0 translate-x-[-5%] translate-y-[30%]">
          <div className="rounded-lg shadow-lg bg-white w-[342px] h-[200px] ">
            <div className="justify-center  rounded-lg border-solid  items-center flex overflow-x-hidden fixed inset-0 z-50 outline-none focus:outline-none ">
              <div className="relative w-auto my-6 mx-auto max-w-3xl">
                {/*content*/}
                <div className=" rounded-lg  shadow-xl relative flex flex-col w-[342px] h-[198px] bg-white outline-none focus:outline-none p-2 ml-2">
                  {/*header*/}

                  {/*body*/}

                  <div className="mb-3  pb-[6px] w-[300px]  relative ">
                    {fndShow.map(
                      (item) =>
                        item.friendId ===
                          reduxReturnData.userStoreData.userInfo.uid && (
                          <div className="flex w-[120x] gap-x-[2px] h-[45px] shadow-lg mb-1">
                            {item.fndAcptURL ? (
                              <image>
                                <Image
                                  className="w-[42px] h-[42px] border-[1px] border-orange-600 rounded-full"
                                  imgSrc={item.fndAcptURL}
                                />
                              </image>
                            ) : (
                              <image>
                                <Image
                                  className="w-[42px] h-[42px] border-[1px] border-orange-600 rounded-full"
                                  imgSrc="assets/wx1.png"
                                />
                              </image>
                            )}
                            <div className="ml-1">
                              <h4 className="font-bar font-semibold text-[12px] text-[#181818]">
                                {item.fndAcptName}
                              </h4>

                              <p className="font-bar font-semibold text-[10px] text-[#202020]">
                                @ {item.fndAcptABout}
                              </p>
                            </div>
                            <FiMessageSquare
                              className="text-[24px] font-bold absolute right-0  top-2"
                              onClick={() => fmessFunc(item)}
                            />
                            {messClose === item.fndUid && "hello"}
                          </div>
                        )
                    )}

                    {fndShow.map(
                      (item) =>
                        item.fndAcptId ===
                          reduxReturnData.userStoreData.userInfo.uid && (
                          <div className="flex w-[140x] gap-x-[2px] h-[45px] relative  shadow-lg mb-1">
                            {item.friendURL ? (
                              <image>
                                <Image
                                  className="w-[42px] h-[42px] border-[1px] border-orange-600 rounded-full"
                                  imgSrc={item.friendURL}
                                />
                              </image>
                            ) : (
                              <image>
                                <Image
                                  className="w-[40px] h-[40px] border-[1px] border-orange-600 rounded-full"
                                  imgSrc="assets/wx1.png"
                                />
                              </image>
                            )}
                            <div className="ml-1">
                              <h4 className="font-bar font-semibold text-[12px] text-[#181818]">
                                {item.friendName}
                              </h4>

                              <p className="font-bar font-semibold text-[10px] text-[#202020]">
                                @ {item.friendAbout}
                              </p>
                            </div>
                            <FiMessageSquare
                              className="text-[24px] font-bold absolute right-0  top-2"
                              onClick={() => fmessFunc(item)}
                            />
                            {messClose === item.fndUid && (
                              <div className=" w-[300px] h-[200px] overflow-y-scroll overscroll-y-none my-4"></div>
                            )}
                          </div>
                        )
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    </>
  );
};

export default Head;
