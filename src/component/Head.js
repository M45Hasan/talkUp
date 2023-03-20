import React, { useState, useEffect, useRef } from "react";
import Image from "./Image";
import Slider from "react-slick";
import LogoutButton from "./LogoutButton";
import { useNavigate } from "react-router-dom";

import { useSelector } from "react-redux";
import NewPostCard from "./NewPostCard";
import {
  getDatabase,
  ref,
  onValue,
  set,
  push,
  remove,
} from "firebase/database";
import {
  ref as def,
  uploadBytes,
  getDownloadURL,
  getStorage,
} from "firebase/storage";
import { v4 } from "uuid";

import { FiMessageSquare, FiSend } from "react-icons/fi";
import { BsFillEmojiSunglassesFill } from "react-icons/bs";
import EmojiPicker from "emoji-picker-react";
import { AiFillCamera } from "react-icons/ai";
import { MdOutlineAddPhotoAlternate } from "react-icons/md";
import { HiMicrophone } from "react-icons/hi";
import { FaShare } from "react-icons/fa";
import Webcam from "react-webcam";
//############################### web Cam start ########
const WebcamComponent = () => <Webcam />;
const videoConstraints = {
  width: 400,
  height: 300,
  facingMode: "user",
};
//############################### web Cam end ########

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
  let storage = getStorage();

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
  //############### friends db call end ##########
  //############### friends message start ##########
  let mesClose = (item) => {
    setMessClose("ooo");
    setEmoji(false);
    setInputEmojiShow();
    setComImgUp(null);
    setSw(false);
    setPicture("");
    setKamShow("kk");
    setRecordedAudio(null);
    setMic("lkk");
  };
  //######### datat send start image  ####
  let [sw, setSw] = useState(false);
  const [comImgUp, setComImgUp] = useState(null);
  let [vSend, setVsend] = useState(null);

  let comImgOpen = (e) => {
    console.log(e);

    setSw(!sw);
  };

  let comSend = (item) => {
    console.log(item);
    if (comImgUp == null) {
      set(push(ref(db, "fndMess/")), {
        mesg: comData.comInput,
        fndUid: item.fndUid,
        messCamURL: picture,
        mSenderId: reduxReturnData.userStoreData.userInfo.uid,
        mSenderName: reduxReturnData.userStoreData.userInfo.displayName,
        mSenderURL: reduxReturnData.userStoreData.userInfo.photoURL,
        messVoice: vSend,
      }).then(() => {
        setInputEmojiShow();
        setSw(false);
        setComImgUp(null);
        setEmoji(false);
        setPicture("");
        setKamShow("kk");
        setCaptShow(true);
        setVsend(null);
        setMic("kk");
        setRecordedAudio(null);
      });
    } else {
      const imageRef = def(
        storage,
        `fndMess/${reduxReturnData.userStoreData.userInfo.uid} /${v4()}`
      );

      uploadBytes(imageRef, comImgUp).then((snapshot) => {
        getDownloadURL(snapshot.ref).then((url) => {
          console.log("url", url);
          set(push(ref(db, "fndMess/")), {
            mesg: comData.comInput,
            fndUid: item.fndUid,
            messCamURL: picture,
            mSenderId: reduxReturnData.userStoreData.userInfo.uid,
            mSenderName: reduxReturnData.userStoreData.userInfo.displayName,
            mSenderURL: reduxReturnData.userStoreData.userInfo.photoURL,
            messURL: url,
            messVoice: vSend,
          }).then(() => {
            setInputEmojiShow();
            setSw(false);
            setComImgUp(null);
            setEmoji(false);
            setPicture("");
            setKamShow("kk");
            setCaptShow(true);
            setVsend(null);
            setMic("kk");
            setRecordedAudio(null);
          });
        });
      });
    }
  };
  //######### dtat send image end ###
  //######### datat arr start ###
  let [messArr, setMess] = useState([]);
  useEffect(() => {
    const useRef = ref(db, "fndMess/");
    onValue(useRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        arr.push({ ...item.val(), messUid: item.key });
      });
      setMess(arr);
    });
  }, []);
  console.log(messArr);
  //######### datat arr end ###
  let [messClose, setMessClose] = useState("");

  let fmessFunc = (item) => {
    setMessClose(item.fndUid);
    setEmoji(false);
    setInputEmojiShow();
    setComImgUp(null);
    setSw(false);
    setPicture("");
    setKamShow("kk");
    setMic("ll");
    setRecordedAudio(null);

    console.log(item);
  };

  //######## input func start ###

  let [comData, setComData] = useState({
    comInput: "",
    messURL: "",
    comCamURL: "",
    comVoice: null,
  });
  let writeCom = (e) => {
    let { name, value } = e.target;

    setComData({
      ...comData,
      [name]: value,
    });
    console.log(comData);
  };
  //######## input func end ###
  //####### emoji func start ###
  let [emojiShow, setEmoji] = useState(false);

  let handleEmoji = (e) => {
    setEmoji(!emojiShow);
  };

  let emojiPic = (item) => {
    setComData({
      comInput: comData.comInput
        ? comData.comInput + item.emoji
        : item.emoji + comData.comInput,
    });
  };
  let [inputEmojiShow, setInputEmojiShow] = useState(false);
  let inputClick = (item) => {
    setInputEmojiShow(true);
  };
  //####### emoji func end ###
  //######## mess delete ###
  let comDel = (e) => {
    console.log(e);
    if (e.mSenderId === reduxReturnData.userStoreData.userInfo.uid) {
      remove(ref(db, "fndMess/" + e.messUid));
    }
  };
  //######## mess delete ###
  //############################### web Cam start ########
  const [picture, setPicture] = useState("");
  const webcamRef = useRef(null);
  const capture = () => {
    const pictureSrc = webcamRef.current.getScreenshot();
    setPicture(pictureSrc);
  };
  let [kapShow, setKamShow] = useState("");
  let cameraOpen = (item) => {
    console.log(item);
    setKamShow(item.uid);
  };
  let [captShow, setCaptShow] = useState(true);
  //############################### web Cam end ########
  //#####
  //############################### voice start ########
  const [recordedAudio, setRecordedAudio] = useState(null);
  let mediaRecorder;

  let [micShow, setMic] = useState("");
  let micOpen = (item) => {
    setMic(item.uid);
  };

  function startRecording() {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.start();

        const chunks = [];
        mediaRecorder.addEventListener("dataavailable", (event) => {
          chunks.push(event.data);
        });

        mediaRecorder.addEventListener("stop", () => {
          const blob = new Blob(chunks, { type: "audio/ogg; codecs=opus" });
          setRecordedAudio(blob);
        });
      })
      .catch((error) => console.error(error));
  }

  function stopRecording() {
    mediaRecorder.stop();
  }

  let saveMessage = (item) => {
    const voiceRef = def(
      storage,
      `messVoice/${reduxReturnData.userStoreData.userInfo.uid} /${v4()}`
    );

    uploadBytes(voiceRef, recordedAudio).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        setVsend(url);
        setRecordedAudio("");
      });
    });
    setMic("998");
  };
  //############################### voice end ########
  //############### friends message end ##########
  //######
  //############### share message start ##########
  // let [shareFnd, setShareFnd] = useState("");
  // let [shareArr, setShare] = useState([]);
  // let shareFn = (it) => {
  //   setShareFnd(it.messUid);
  //   console.log(it);
  //   let arr = [];
  //   fndShow.forEach((item) => {
  //     if (it.fndUid === item.fndUid) {
  //       arr.push(it);
  //     }
  //   });
  //   setShare(arr);
  // };
  // console.log(shareArr);

  // let sendShare = (item) => {
  //   console.log(item);
  //   shareArr.forEach((it) => {
  //     console.log(it);
  //     set(push(ref(db, "fndMess/")), {
  //       mesg: it.mesg,
  //       fndUid: item.fndUid,
  //       messCamURL: it.messCamURL ? it.messCamURL : "",
  //       mSenderId: it.mSenderId,
  //       mSenderName: it.mSenderName,
  //       mSenderURL: it.mSenderURL,
  //       messURL: it.messURL ? it.messURL : "",
  //       messVoice: it.messVoice ? it.messVoice : "",
  //     });
  //   });
  // };

  //############### share message end ##########

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
          <div className="rounded-lg shadow-lg bg-white w-[342px] h-[400px] ">
            <div className="justify-center  rounded-lg border-solid  items-center flex overflow-x-hidden fixed inset-0 z-50 outline-none focus:outline-none ">
              <div className="relative w-auto my-6 mx-auto max-w-3xl">
                {/*content*/}
                <div className=" rounded-lg  shadow-xl relative flex flex-col w-[342px] h-[400px] bg-white outline-none focus:outline-none p-2 ml-2">
                  {/*header*/}

                  {/*body*/}

                  <div className="mb-3  pb-[6px] w-[300px]  relative ">
                    {fndShow.map(
                      (item) =>
                        item.friendId ===
                          reduxReturnData.userStoreData.userInfo.uid && (
                          <>
                            <div className="flex w-[120x] gap-x-[2px] h-[45px] shadow-lg mb-1">
                              {item.fndAcptURL ? (
                                <div className="w-[40px]">
                                  <image>
                                    <Image
                                      className="w-[42px] h-[42px] border-[1px] border-orange-600 rounded-full"
                                      imgSrc={item.fndAcptURL}
                                    />
                                  </image>
                                </div>
                              ) : (
                                <div className="w-[40px]">
                                  <image>
                                    <Image
                                      className="w-[42px] h-[42px] border-[1px] border-orange-600 rounded-full"
                                      imgSrc="assets/wx1.png"
                                    />
                                  </image>
                                </div>
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
                            </div>
                            {messClose === item.fndUid && (
                              <>
                                <div className=" w-[319px] h-[150px] overflow-y-scroll overscroll-y-none my-4">
                                  {messArr.map((it) => (
                                    <>
                                      <div className="w-full  shadow-lg  my-2 ">
                                        {reduxReturnData.userStoreData.userInfo
                                          .uid === it.mSenderId &&
                                          item.fndUid === it.fndUid && (
                                            <div className="w-[70%] bg-cyan-300 translate-x-[40%] rounded-lg shadow-lg p-2  relative hover:border-[1px]  hover:border-orange-700 ease-in duration-100">
                                              <button
                                                onClick={() => comDel(it)}
                                                className="text-bar self-baseline absolute top-1 right-2 font-sm text-sm  text-[#0275B1] hover:text-red-500 cursor-pointer "
                                              >
                                                x
                                              </button>
                                             
                                              <div className="flex justify-between items-center w-[150px] mb-[8px]">
                                                <image className="shadow-lg ">
                                                  <Image
                                                    className="w-[35px] h-[35px] rounded-[4px] border-2 border-solid border-cyan-400"
                                                    imgSrc={it.mSenderURL}
                                                  />
                                                </image>

                                                <div className="w-[100px]">
                                                  <h4 className="font-bar font-bold mt-[-15px] text-[12px]">
                                                    {it.mSenderName}
                                                  </h4>
                                                </div>
                                              </div>
                                              <div className="pr-1 w-[200px] overflow-x-hidden">
                                                <p className="text-gray-700 text-sm font-semibold font-bar ">
                                                  {it.mesg}
                                                </p>
                                              </div>
                                              {it.messURL && (
                                                <image className="w-[120px] h-[80px] mt-1">
                                                  <Image
                                                    className="w-full h-[80px] cover border-2 border-orange-600 rounded-[5px]"
                                                    imgSrc={it.messURL}
                                                  />
                                                </image>
                                              )}

                                              {it.messCamURL && (
                                                <image className="w-[120px] h-[80px] mt-1">
                                                  <Image
                                                    className="w-full h-[80px] cover border-2 border-orange-600 shadow-lg rounded-[5px]"
                                                    imgSrc={it.messCamURL}
                                                  />
                                                </image>
                                              )}
                                              {it.messVoice && (
                                                <audio
                                                  className="h-[28px]  w-[190px]"
                                                  src={it.messVoice}
                                                  type="audio/ogg; codecs=opus"
                                                  controls
                                                />
                                              )}
                                            </div>
                                          )}

                                        {reduxReturnData.userStoreData.userInfo
                                          .uid !== it.mSenderId &&
                                          item.fndUid === it.fndUid && (
                                            <div className="w-[70%] bg-gray-300 rounded-lg shadow-lg p-2  relative hover:border-[1px]  hover:border-orange-700 ease-in duration-100">
                                            

                                              <div className="flex gap-x-1 items-center w-[150px] mb-[8px]">
                                                <image className="shadow-lg ">
                                                  <Image
                                                    className="w-[35px] h-[35px] rounded-[4px] border-2 border-solid border-cyan-400"
                                                    imgSrc={it.mSenderURL}
                                                  />
                                                </image>

                                                <div className="w-[100px]">
                                                  <h4 className="font-bar font-bold mt-[-10px] text-[12px]">
                                                    {it.mSenderName}
                                                  </h4>
                                                </div>
                                              </div>
                                              <div className="pr-1 w-[200px] overflow-x-hidden">
                                                <p className="text-gray-700 text-sm font-semibold font-bar ">
                                                  {it.mesg}
                                                </p>
                                              </div>
                                              {it.messURL && (
                                                <image className="w-[120px] h-[80px] mt-1">
                                                  <Image
                                                    className="w-full h-[80px] cover border-2 border-orange-600 rounded-[5px]"
                                                    imgSrc={it.messURL}
                                                  />
                                                </image>
                                              )}

                                              {it.messCamURL && (
                                                <image className="w-[120px] h-[80px] mt-1">
                                                  <Image
                                                    className="w-full h-[80px] cover border-2 border-orange-600 shadow-lg rounded-[5px]"
                                                    imgSrc={it.messCamURL}
                                                  />
                                                </image>
                                              )}
                                              {it.messVoice && (
                                                <audio
                                                  className="h-[28px] w-[190px]"
                                                  src={it.messVoice}
                                                  type="audio/ogg; codecs=opus"
                                                  controls
                                                />
                                              )}
                                            </div>
                                          )}
                                      </div>

                                    </>
                                  ))}

                                  <div className="w-full h-6  flex justify-between bg-gray-300 shadow-lg rounded-sm hover:border-orange-800 mt-[10px] relative">
                                    <div className="w-[100px]">
                                      <input
                                        onClick={() => inputClick(item)}
                                        className=" h-full pl-2 w-[100px] rounded-sm outline-none bg-gray-300"
                                        type="text"
                                        name="comInput"
                                        value={
                                          inputEmojiShow
                                            ? comData.comInput
                                            : (comData.comInput = "")
                                        }
                                        onChange={writeCom}
                                        placeholder="Message"
                                      />
                                    </div>
                                    <div className=" absolute left-[100px] top-[1px] flex gap-x-2  w-[50px] ">
                                      <BsFillEmojiSunglassesFill
                                        onClick={() => handleEmoji(item)}
                                        className=" cursor-pointer text-[#0E6795]  text-[20px] hover:text-[20px] hover:text-orange-600 hover:rotate-180 ease-in duration-100 "
                                      />
                                      <FiSend
                                        onClick={(e) => comSend(item)}
                                        className="  cursor-pointer text-[#0E6795] text-[18px] hover:text-[18px] hover:text-orange-600 origin-center rotate-180 ease-in duration-200 hover:rotate-0"
                                      />
                                    </div>
                                    <p
                                      onClick={() => mesClose(item)}
                                      className=" absolute right-0 bottom-0 cursor-pointer font-bold text-[red] font-bar text-[12px]  hover:text-orange-600 "
                                    >
                                      X
                                    </p>

                                    <div className="flex gap-x-2 w-[100px]">
                                      <MdOutlineAddPhotoAlternate
                                        onClick={(e) => comImgOpen(item)}
                                        className=" cursor-pointer text-[#0E6795]  text-[20px] hover:text-[20px] hover:text-orange-600 hover:rotate-180 ease-in duration-100 "
                                      />
                                      <AiFillCamera
                                        onClick={() => cameraOpen(item)}
                                        className=" cursor-pointer text-[#0E6795]  text-[20px] hover:text-[20px] hover:text-orange-600 hover:rotate-180 ease-in duration-100 "
                                      />
                                      <HiMicrophone
                                        onClick={() => micOpen(item)}
                                        className=" cursor-pointer text-[#0E6795]  text-[20px] hover:text-[20px] hover:text-orange-600 hover:rotate-180 ease-in duration-100 "
                                      />
                                    </div>
                                    {sw && (
                                      <div className="w-[55px] rounded-full overflow-x-hidden absolute right-[93px] top-[-2px]">
                                        <input
                                          className="text-[5px] "
                                          type="file"
                                          placeholder="Img"
                                          name="comURL"
                                          onChange={(event) => {
                                            setComImgUp(event.target.files[0]);
                                          }}
                                        />
                                      </div>
                                    )}
                                    {kapShow === item.uid && (
                                      <div className="absolute top-[-160px] shadow-xl right-[100px] bg-slate-600 rounded-[4px]">
                                        <div>
                                          {picture === "" ? (
                                            <Webcam
                                              className="border-b-[2px] border-cyan-700"
                                              audio={true}
                                              height={200}
                                              ref={webcamRef}
                                              width={300}
                                              screenshotFormat="image/jpeg"
                                              videoConstraints={
                                                videoConstraints
                                              }
                                            />
                                          ) : (
                                            <div className=" ">
                                              <img
                                                className="w-[200px] h-[80px] shadow-xl  "
                                                src={picture}
                                                alt="kapPic"
                                              />
                                            </div>
                                          )}
                                        </div>
                                        <div className="flex justify-between">
                                          {captShow && (
                                            <button
                                              onClick={(e) => {
                                                e.preventDefault();
                                                capture();
                                                setCaptShow(false);
                                              }}
                                              className="cursor-pointer text-end text-base font-bar p-1  text-[#0E6795] font-semibold rounded-lg hover:text-cyan-500 "
                                            >
                                              Capture
                                            </button>
                                          )}

                                          <button
                                            onClick={(e) => {
                                              setKamShow("kk");

                                              setPicture("");
                                              setCaptShow(true);
                                            }}
                                            className="cursor-pointer text-end text-base font-bar p-1  text-[#0E6795] font-semibold rounded-lg hover:text-cyan-500 "
                                          >
                                            Close
                                          </button>
                                        </div>
                                      </div>
                                    )}
                                    {micShow === item.uid && (
                                      <div className="bg-gradient-to-r from-sky-400 via-cyan-900 to-indigo-500 flex items-center p-1 gap-x-4 h-[28px] mt-[1px] right-[0px] top-10 border-[1px] border-pink-500  rounded-md absolute w-full">
                                        {recordedAudio ? (
                                          <audio
                                            className="h-[20px] hidden"
                                            src={URL.createObjectURL(
                                              recordedAudio
                                            )}
                                            controls
                                          />
                                        ) : (
                                          <p className="text-[10px] font-semibold font-bar">
                                            No audio
                                          </p>
                                        )}
                                        <button
                                          className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-pink-500 hover:to-yellow-500 rounded-md p-[2px] cursor-pointer font-bar text-[#000] text-sm font-semibold "
                                          onClick={() => {
                                            startRecording(item);
                                          }}
                                        >
                                          Start
                                        </button>
                                        <button
                                          className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-pink-500 hover:to-yellow-500  rounded-md p-[2px] cursor-pointer  text-[#000] text-sm font-bar font-semibold "
                                          onClick={() => {
                                            stopRecording(item);
                                          }}
                                        >
                                          Stop
                                        </button>
                                        <button
                                          onClick={() => {
                                            saveMessage(item);
                                          }}
                                        >
                                          <FiSend className="  cursor-pointer text-amber-300 text-[20px] hover:text-[23px] origin-center rotate-180 ease-in duration-200 hover:rotate-0" />
                                        </button>
                                        <button
                                          className="hover:bg-red-700 block translate-x-[38px] bg-amber-300 rounded-md p-[2px]  cursor-pointer font-bar text-[#000] text-sm font-semibold "
                                          onClick={(item) => {
                                            setMic("998");
                                            setRecordedAudio(null);
                                          }}
                                        >
                                          Return
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                </div>

                                {emojiShow && (
                                  <div className="">
                                    <EmojiPicker
                                      onEmojiClick={(item) => emojiPic(item)}
                                      className="h-[100px]"
                                    />
                                  </div>
                                )}
                              </>
                            )}
                          </>
                        )
                    )}
                    {/* ################################### Acc friend ################################## */}
                    {fndShow.map(
                      (item) =>
                        item.fndAcptId ===
                          reduxReturnData.userStoreData.userInfo.uid && (
                          <>
                            <div className="flex w-[140x] gap-x-[2px] h-[45px] relative  shadow-lg mb-1">
                              {item.friendURL ? (
                                <div className="w-[40px]">
                                  <image>
                                    <Image
                                      className="w-[40px] h-[40px] border-[1px] border-orange-600 rounded-full"
                                      imgSrc={item.friendURL}
                                    />
                                  </image>
                                </div>
                              ) : (
                                <div className="w-[40px]">
                                  <image>
                                    <Image
                                      className="w-[40px] h-[40px] border-[1px] border-orange-600 rounded-full"
                                      imgSrc="assets/wx1.png"
                                    />
                                  </image>
                                </div>
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
                            </div>
                            {messClose === item.fndUid && (
                              <>
                                <div className=" w-[319px] h-[150px] overflow-y-scroll overscroll-y-none my-4">
                                  {messArr.map((it) => (
                                    <>
                                      <div className="w-full  shadow-lg  my-2 ">
                                        {reduxReturnData.userStoreData.userInfo
                                          .uid === it.mSenderId &&
                                          item.fndUid === it.fndUid && (
                                            <div className="w-[70%] bg-cyan-200 translate-x-[40%] rounded-lg shadow-lg p-2  relative hover:border-[1px]  hover:border-orange-700 ease-in duration-100">
                                              <button
                                                onClick={() => comDel(it)}
                                                className="text-bar self-baseline absolute top-1 right-2 font-sm text-sm  text-[#0275B1] hover:text-red-500 cursor-pointer "
                                              >
                                                x
                                              </button>
                                           
                                              <div className="flex justify-between items-center w-[150px] mb-[8px]">
                                                <image className="shadow-lg ">
                                                  <Image
                                                    className="w-[35px] h-[35px] rounded-[4px] border-2 border-solid border-cyan-400"
                                                    imgSrc={it.mSenderURL}
                                                  />
                                                </image>

                                                <div className="w-[100px]">
                                                  <h4 className="font-bar font-bold mt-[-15px] text-[12px]">
                                                    {it.mSenderName}
                                                  </h4>
                                                </div>
                                              </div>
                                              <div className="pr-1 w-[200px] overflow-x-hidden">
                                                <p className="text-gray-700 text-sm font-semibold font-bar ">
                                                  {it.mesg}
                                                </p>
                                              </div>
                                              {it.messURL && (
                                                <image className="w-[120px] h-[80px] mt-[5px]">
                                                  <Image
                                                    className="w-full h-[80px] cover border-2 border-orange-600 rounded-[5px]"
                                                    imgSrc={it.messURL}
                                                  />
                                                </image>
                                              )}

                                              {it.messCamURL && (
                                                <image className="w-[120px] h-[80px] mt-1">
                                                  <Image
                                                    className="w-full h-[80px] cover border-2 border-orange-600 shadow-lg rounded-[5px]"
                                                    imgSrc={it.messCamURL}
                                                  />
                                                </image>
                                              )}
                                              {it.messVoice && (
                                                <audio
                                                  className="h-[20px] w-[180px]"
                                                  src={it.messVoice}
                                                  type="audio/ogg; codecs=opus"
                                                  controls
                                                />
                                              )}
                                            </div>
                                          )}

                                        {reduxReturnData.userStoreData.userInfo
                                          .uid !== it.mSenderId &&
                                          item.fndUid === it.fndUid && (
                                            <div className="w-[70%] bg-gray-300 rounded-lg shadow-lg p-2  relative hover:border-[1px]  hover:border-orange-700 ease-in duration-100">
                                            
                                              <div className="flex gap-x-1 items-center w-[150px] mb-[8px]">
                                                <image className="shadow-lg ">
                                                  <Image
                                                    className="w-[35px] h-[35px] rounded-[4px] border-2 border-solid border-cyan-400"
                                                    imgSrc={it.mSenderURL}
                                                  />
                                                </image>

                                                <div className="w-[100px]">
                                                  <h4 className="font-bar font-bold mt-[-15px] text-[12px]">
                                                    {it.mSenderName}
                                                  </h4>
                                                </div>
                                              </div>
                                              <div className="pr-1 w-[200px] overflow-x-hidden">
                                                <p className="text-gray-700 text-sm font-semibold font-bar">
                                                  {it.mesg}
                                                </p>
                                              </div>
                                              {it.messURL && (
                                                <image className="w-[120px] h-[80px] mt-[5px]">
                                                  <Image
                                                    className="w-full h-[80px] cover border-2 border-orange-600 rounded-[5px]"
                                                    imgSrc={it.messURL}
                                                  />
                                                </image>
                                              )}

                                              {it.messCamURL && (
                                                <image className="w-[120px] h-[80px] mt-1">
                                                  <Image
                                                    className="w-full h-[80px] cover border-2 border-orange-600 shadow-lg rounded-[5px]"
                                                    imgSrc={it.messCamURL}
                                                  />
                                                </image>
                                              )}
                                              {it.messVoice && (
                                                <audio
                                                  className="h-[20px] w-[180px]"
                                                  src={it.messVoice}
                                                  type="audio/ogg; codecs=opus"
                                                  controls
                                                />
                                              )}
                                            </div>
                                          )}
                                      </div>
                                    </>
                                  ))}

                                  <div className="w-full h-6  flex justify-between bg-gray-300 shadow-lg rounded-sm hover:border-orange-800 mt-[10px] relative">
                                    <div className="w-[100px]">
                                      <input
                                        onClick={() => inputClick(item)}
                                        className=" h-full pl-2 w-[100px] rounded-sm outline-none bg-gray-300"
                                        type="text"
                                        name="comInput"
                                        value={
                                          inputEmojiShow
                                            ? comData.comInput
                                            : (comData.comInput = "")
                                        }
                                        onChange={writeCom}
                                        placeholder="Message"
                                      />
                                    </div>
                                    <div className=" absolute left-[100px] top-[1px] flex gap-x-2  w-[50px] ">
                                      <BsFillEmojiSunglassesFill
                                        onClick={() => handleEmoji(item)}
                                        className=" cursor-pointer text-[#0E6795]  text-[20px] hover:text-[20px] hover:text-orange-600 hover:rotate-180 ease-in duration-100 "
                                      />
                                      <FiSend
                                        onClick={(e) => comSend(item)}
                                        className="  cursor-pointer text-[#0E6795] text-[18px] hover:text-[18px] hover:text-orange-600 origin-center rotate-180 ease-in duration-200 hover:rotate-0"
                                      />
                                    </div>
                                    <p
                                      onClick={() => mesClose(item)}
                                      className=" absolute right-0 bottom-0 cursor-pointer font-bold text-[red] font-bar text-[12px]  hover:text-orange-600 "
                                    >
                                      X
                                    </p>

                                    <div className="flex gap-x-2 w-[100px]">
                                      <MdOutlineAddPhotoAlternate
                                        onClick={(e) => comImgOpen(item)}
                                        className=" cursor-pointer text-[#0E6795]  text-[20px] hover:text-[20px] hover:text-orange-600 hover:rotate-180 ease-in duration-100 "
                                      />
                                      <AiFillCamera
                                        onClick={() => cameraOpen(item)}
                                        className=" cursor-pointer text-[#0E6795]  text-[20px] hover:text-[20px] hover:text-orange-600 hover:rotate-180 ease-in duration-100 "
                                      />
                                      <HiMicrophone
                                        onClick={(e) => micOpen(item)}
                                        className=" cursor-pointer text-[#0E6795]  text-[20px] hover:text-[20px] hover:text-orange-600 hover:rotate-180 ease-in duration-100 "
                                      />
                                    </div>
                                    {sw && (
                                      <div className="w-[55px] rounded-full overflow-x-hidden absolute right-[93px] top-[-2px]">
                                        <input
                                          className="text-[5px] "
                                          type="file"
                                          placeholder="Img"
                                          name="comURL"
                                          onChange={(event) => {
                                            setComImgUp(event.target.files[0]);
                                          }}
                                        />
                                      </div>
                                    )}
                                    {kapShow === item.uid && (
                                      <div className="absolute top-[-160px] shadow-xl right-[100px] bg-slate-600 rounded-[4px]">
                                        <div>
                                          {picture === "" ? (
                                            <Webcam
                                              className="border-b-[2px] border-cyan-700"
                                              audio={true}
                                              height={200}
                                              ref={webcamRef}
                                              width={300}
                                              screenshotFormat="image/jpeg"
                                              videoConstraints={
                                                videoConstraints
                                              }
                                            />
                                          ) : (
                                            <div className=" ">
                                              <img
                                                className="w-[200px] h-[80px] shadow-xl  "
                                                src={picture}
                                                alt="kapPic"
                                              />
                                            </div>
                                          )}
                                        </div>
                                        <div className="flex justify-between">
                                          {captShow && (
                                            <button
                                              onClick={(e) => {
                                                e.preventDefault();
                                                capture();
                                                setCaptShow(false);
                                              }}
                                              className="cursor-pointer text-end text-base font-bar p-1  text-[#0E6795] font-semibold rounded-lg hover:text-cyan-500 "
                                            >
                                              Capture
                                            </button>
                                          )}

                                          <button
                                            onClick={(e) => {
                                              setKamShow("kk");

                                              setPicture("");
                                              setCaptShow(true);
                                            }}
                                            className="cursor-pointer text-end text-base font-bar p-1  text-[#0E6795] font-semibold rounded-lg hover:text-cyan-500 "
                                          >
                                            Close
                                          </button>
                                        </div>
                                      </div>
                                    )}

                                    {micShow === item.uid && (
                                      <div className="bg-gradient-to-r from-sky-400 via-cyan-900 to-indigo-500 flex items-center p-1 gap-x-4 h-[28px] mt-[1px] right-[0px] top-10 border-[1px] border-pink-500  rounded-md absolute w-full">
                                        {recordedAudio ? (
                                          <audio
                                            className="h-[20px] hidden"
                                            src={URL.createObjectURL(
                                              recordedAudio
                                            )}
                                            controls
                                          />
                                        ) : (
                                          <p className="text-[10px] font-semibold font-bar">
                                            No audio
                                          </p>
                                        )}
                                        <button
                                          className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-pink-500 hover:to-yellow-500 rounded-md p-[2px] cursor-pointer font-bar text-[#000] text-sm font-semibold "
                                          onClick={() => {
                                            startRecording(item);
                                          }}
                                        >
                                          Start
                                        </button>
                                        <button
                                          className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-pink-500 hover:to-yellow-500  rounded-md p-[2px] cursor-pointer  text-[#000] text-sm font-bar font-semibold "
                                          onClick={() => {
                                            stopRecording(item);
                                          }}
                                        >
                                          Stop
                                        </button>
                                        <button
                                          onClick={() => {
                                            saveMessage(item);
                                          }}
                                        >
                                          <FiSend className="  cursor-pointer text-amber-300 text-[20px] hover:text-[23px] origin-center rotate-180 ease-in duration-200 hover:rotate-0" />
                                        </button>
                                        <button
                                          className="hover:bg-red-700 block translate-x-[38px] bg-amber-300 rounded-md p-[2px]  cursor-pointer font-bar text-[#000] text-sm font-semibold "
                                          onClick={(item) => {
                                            setMic("998");
                                            setRecordedAudio(null);
                                          }}
                                        >
                                          Return
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                </div>

                                {emojiShow && (
                                  <div className="">
                                    <EmojiPicker
                                      onEmojiClick={(item) => emojiPic(item)}
                                      className="h-[100px]"
                                    />
                                  </div>
                                )}
                              </>
                            )}
                          </>
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
