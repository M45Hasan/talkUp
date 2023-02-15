import React, { useEffect, useState, useRef } from "react";
import Image from "../component/Image";
import { BsFillCameraFill } from "react-icons/bs";

import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { activeUser } from "../slices/UserSlice";
import LogoutButton from "../component/LogoutButton";
import ButOn from "../component/ButOn";
import WorkExp from "../component/WorkExp";
import { TiLocationArrowOutline } from "react-icons/ti";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";

import {
  getStorage,
  ref,
  uploadString,
  getDownloadURL,
  listAll,
  list,
} from "firebase/storage";
import { getAuth, updateProfile } from "firebase/auth";
import { getDatabase, ref as def, set, push, onValue } from "firebase/database";
import Slide from "../component/Slide";
import EditProfile from "../component/EditProfile";
import Container from "../component/Container";

const Profile = () => {
  //############################ state start####

  let navigate = useNavigate();
  let reduxReturnData = useSelector((state) => state);
  // console.log("Redux-Data:",reduxReturnData.userStoreData.userInfo.uid);
  useEffect(() => {
    if (reduxReturnData.userStoreData.userInfo == null) {
      console.log("not signIn ");

      navigate("/siginin");
    }
  }, []);

  let [seeWrite, setWrite] = useState("");
  let [seeShow, setSee] = useState(false);
  let [editShow, setEdit] = useState(false);
  let [postShow, setPost] = useState(false);
  const [cropData, setCropData] = useState();

  const [cropper, setCropper] = useState();

  const [profile, setProfile] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [contactModal, setContactModal] = useState(false);

  const [image, setImage] = useState();
  const [show, setShow] = useState(false);
  let [arrShow, setArr] = useState([]);
  let [newArr, setNew] = useState([]);
  let [profileEdit, setProfileEdit] = useState(false);

  const auth = getAuth();
  const db = getDatabase();
  let dispatch = useDispatch();
  //#################################### cover #######
  const [showCov, setShowCov] = useState(false);
  const [showMod, setShowMod] = useState(false);
  const [cover, setCover] = useState("");
  const [coverCrp, setCoverCrp] = useState();
  const [dataCover, setDCover] = useState();
  const [imaCover, setImacov] = useState();
  const [picture, setPicture] = useState([]);

  //############################ state end####
  console.log(cropData);
  console.log("cover:", dataCover);
  //############################# handleButton start ########

  let handleSee = () => {
    console.log("ami hyce");
    setSee(!seeShow);
  };

  let handleWrite = (e) => {
    setWrite(e.target.value);
    console.log(seeWrite);
  };

  let handleEdit = () => {
    setEdit(!editShow);
  };
  let handlePost = () => {
    setPost(!postShow);
    setEdit(true);
    setSee(!seeShow);
  };

  let handleCrop = () => {
    console.log("ami");
    setShow(true);
  };
  let handleCover = () => {
    console.log("ami");
    setShowCov(true);
  };
  let handleFriend = () => {
    navigate("/friends");
  };

  let handleProfileEdit = () => {
    setProfileEdit(!profileEdit);
  };
  //############################# handleButton end ########

  //#################################Cropper start #####
  const onChange = (e) => {
    e.preventDefault();
    let files;
    if (e.dataTransfer) {
      files = e.dataTransfer.files;
    } else if (e.target) {
      files = e.target.files;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(files[0]);
  };

  const getCropData = () => {
    console.log("ami getCropData");
    if (typeof cropper !== "undefined") {
      setCropData(cropper.getCroppedCanvas().toDataURL());
      const storage = getStorage();
      const storageRef = ref(
        storage,
        `profilepic/${reduxReturnData.userStoreData.userInfo.uid}`
      );
      const message4 = cropper.getCroppedCanvas().toDataURL();
      uploadString(storageRef, message4, "data_url").then((snapshot) => {
        console.log("Uploaded a data_url string!");
        getDownloadURL(storageRef).then((downloadURL) => {
          console.log("File available at", downloadURL);

          updateProfile(auth.currentUser, {
            photoURL: downloadURL,
          }).then(() => {
            localStorage.setItem("userInfo", JSON.stringify(auth.currentUser));
            dispatch(activeUser(auth.currentUser));
            set(
              def(db, "users/" + reduxReturnData.userStoreData.userInfo.uid),
              {
                displayName: reduxReturnData.userStoreData.userInfo.displayName,
                email: reduxReturnData.userStoreData.userInfo.email,
                photoURL: auth.currentUser.photoURL,
              }
            );
            console.log("Rootdispatch", auth.currentUser.photoURL);
          });
        });
      });
    }
  };

  useEffect(() => {
    setProfile(reduxReturnData.userStoreData.userInfo.photoURL);
  }, [reduxReturnData]);

  //#################################Cropper end #####

  //#################################### cover Img start ###

  const coverChange = (e) => {
    console.log("coverTarget:", e.target);
    e.preventDefault();
    let files;
    if (e.dataTransfer) {
      files = e.dataTransfer.files;
    } else if (e.target) {
      files = e.target.files;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setImacov(reader.result);
    };
    reader.readAsDataURL(files[0]);
  };

  const storage = getStorage();
  const storageRef = ref(
    storage,
    `coverpic/${reduxReturnData.userStoreData.userInfo.uid}`
  );
  const getCoverData = () => {
    console.log("ami getCoverpData");

    if (typeof coverCrp !== "undefined") {
      setDCover(coverCrp.getCroppedCanvas().toDataURL());

      const message4 = coverCrp.getCroppedCanvas().toDataURL();
      uploadString(storageRef, message4, "data_url").then((snapshot) => {
        getDownloadURL(snapshot.ref).then((downloadURL) => {
          setPicture((item) => [downloadURL]);

          set(
            def(db, "userCover/" + reduxReturnData.userStoreData.userInfo.uid),
            {
              coverPic: downloadURL,
            }
          );
        });

        console.log("ami piccture:", picture);
      });

      //     updateProfile(auth.currentUser, {
      //       phoneNumber: downloadURL,
      //     }).then(() => {
      //       localStorage.setItem("userInfo", JSON.stringify(auth.currentUser));
      //       dispatch(activeUser(auth.currentUser));
      //       set(
      //         def(db, "users/" + reduxReturnData.userStoreData.userInfo.uid),
      //         {
      //           displayName: reduxReturnData.userStoreData.userInfo.displayName,
      //           email: reduxReturnData.userStoreData.userInfo.email,
      //           photoURL:reduxReturnData.userStoreData.userInfo.photoURL,
      //           phoneNumber:auth.currentUser.phoneNumber,
      //         }
      //       );
      //       console.log("Rootdispatch", auth.currentUser.phoneNumber);
      //     });
      //   });
      // });
    }
  };
  useEffect(() => {
    listAll(storageRef).then((response) => {
      response.items.forEach((item) => {
        getDownloadURL(item).then((downloadURL) => {
          setPicture((item) => [downloadURL]);
        });
      });
    });
  });
  useEffect(() => {
    const userRef = def(db, "userCover");
    onValue(userRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        console.log("ami Arritem:", item);
        if (item.key == reduxReturnData.userStoreData.userInfo.uid) {
          arr.push({
            ...item.val(),
          });
        }
      });
      setArr(arr);
    });
    console.log("ami ARR hello:", arrShow);
  }, []);

  useEffect(() => {
    const userRef = def(db, "userInfo");
    onValue(userRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        if (item.key == reduxReturnData.userStoreData.userInfo.uid) {
          arr.push({ ...item.val() });
        }
      });
      setNew(arr);
    });
    console.log("ami Location", newArr);
  }, []);
  //#################################### cover Img end ###

  return (
    <>
      <Container>
        <div className="w-[100%] flex justify-start mt- items-center">
          <div>
            <div className=" flex justify-between w-max pt-4   ">
              <div className=" w-[777px] h-[360px] ">
                <div className="block ">
                  <div className="relative">
                    <image className="w-[840px] h-[160px] bg-cover bg-center ">
                      {!arrShow.length == 0 ? (
                        arrShow.map((item) => (
                          <img
                            id="cover"
                            src={item.coverPic}
                            className="w-[840px] h-[160px]  overflow-hidden "
                            alt=" cover"
                          />
                        ))
                      ) : (
                        <img
                          id="cover"
                          src="assets/banner.png"
                          className="w-[840px] h-[160px]  overflow-hidden "
                          alt=" cover"
                        />
                      )}
                    </image>

                    <BsFillCameraFill
                      className="absolute top-3 right-7 text-orange-700 "
                      onClick={() => setShowMod(true)}
                    />
                  </div>
                  <div className=" flex justify-between">
                    <image
                      onClick={() => setShowModal(true)}
                      className="z-0 w-[170px] h-[170px] mt-[14px] pl-3"
                    >
                      <Image
                        className="mt-[-44px] w-[158px] h-[158px] rounded-full shadow-sm align-bottom border-[4px] border-white border-solid"
                        imgSrc={profile}
                      />
                    </image>

                    <div className=" w-[600px] ">
                      <div className=" flex justify-between pb-2 pr-7">
                        <h2 className="inline-block font-bar font-bold text-[18px]">
                          {reduxReturnData.userStoreData.userInfo.displayName}
                        </h2>
                        <TiLocationArrowOutline className=" translate-x-[132px] translate-y-[2px] text-[blue] " />
                        {newArr.map((item) => (
                          <p className="font-bar font-medium text-base text-[#181818]">
                            {item.location}
                          </p>
                        ))}
                      </div>
                      {newArr.map((item) => (
                        <p className="font-bar font-rugular text-base text-[#181818]">
                          {item.about}.
                        </p>
                      ))}
                      <div className="flex justify-between w-full items-center">
                        {" "}
                        <div onClick={() => setContactModal(!contactModal)}>
                          {" "}
                          <ButOn butName="Contact info" />
                        </div>
                        <p
                          className="mt-6 p-1 bg-[#086FA4] text-[#FFFFFF] cursor-pointer hover:bg-cyan-600 font-nuni font-semibold border border-solid border-orange-600  text-base h-8 rounded-[4px]"
                          onClick={handleProfileEdit}
                        >
                          Edit
                        </p>{" "}
                      </div>
                    </div>
                  </div>
                  <div className="pt-6 flex items-end w-[720px]">
                    <div className="w-[240px] flex items-center justify-center h-12 bg-[#0E6795] cursor-pointer">
                      <p className="font-bar font-medium font-base text-white">
                        Profile
                      </p>{" "}
                    </div>
                    <div className="cursor-pointer w-[240px] h-10 border  hover:bg-cyan-500 bg-[#FFFFFF] border-solid border-[#bab8b8] flex items-center justify-center">
                      {" "}
                      <p
                        className="font-bar font-medium font-base text-black"
                        onClick={handleFriend}
                      >
                        Friends
                      </p>{" "}
                    </div>
                    <div
                      onClick={() => {
                        navigate("post");
                      }}
                      className="cursor-pointer w-[240px] h-10 border  hover:bg-cyan-500 bg-[#FFFFFF] border-solid border-[#bab8b8] flex items-center justify-center"
                    >
                      {" "}
                      <p className="font-bar font-medium font-base text-black">
                        Post
                      </p>{" "}
                    </div>
                  </div>
                  {!seeShow ? (
                    <div className="h-[170px] bg-white border border-solid border-[#bab8b8] w-full mt-7 p-7">
                      <h3 className="font-bar font-bold text-lg">About</h3>
                      <p className="font-bar font-medium text-[14px] text-[#181818]] mt-2">
                        {seeWrite}
                      </p>
                      <p
                        className="text-bar font-medium text-base text-[#0275B1] cursor-pointer hover:text-[20px] mt-5 inline-block"
                        onClick={handleSee}
                      >
                        {" "}
                        See more
                      </p>
                    </div>
                  ) : (
                    <div className=" bg-white border border-solid border-[#bab8b8] w-full mt-7 p-7 relative">
                      <h3 className="font-bar font-bold text-lg">About</h3>

                      <br />

                      {postShow && <p>{seeWrite}</p>}

                      {!editShow && (
                        <textarea
                          rows={4}
                          cols={10}
                          value={seeWrite}
                          className="block w-full border-0 mt-2"
                          onChange={handleWrite}
                        />
                      )}
                      <div className="flex justify-between w-full">
                        <p
                          className="text-bar inline-block font-medium text-base text-[#0275B1] cursor-pointer hover:text-[20px] mt-5 "
                          onClick={handleSee}
                        >
                          {" "}
                          See Less
                        </p>
                        <div className="flex gap-x-4">
                          <p
                            className="text-bar inline-block font-medium text-base text-[#0275B1] cursor-pointer hover:text-[20px] mt-5 "
                            onClick={handleEdit}
                          >
                            {" "}
                            Edit
                          </p>
                          <p
                            className="text-bar inline-block font-medium text-base text-[#0275B1] cursor-pointer hover:text-[20px] mt-5 "
                            onClick={handlePost}
                          >
                            {" "}
                            Post
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="mt-7 p-7 w-full bg-[#FFFFFF] border border-solid border-[#bab8b8] h-[355px]">
                    <Slide />
                  </div>

                  <div className="w-full h-[370px] bg-[#FFFFFF] border border-solid border-[#bab8b8] mt-4 p-5 ">
                    <WorkExp
                      topic="Experience"
                      className=""
                      imgSrc="../assets/wx.png"
                      jbName="Freelance UX/UI designer"
                      position="Jun 2016 — Present"
                      place="Around the world"
                      time="Jun 2016 — Present"
                      duration="3 yrs 3 mos"
                      details="Work with clients and web studios as freelancer.  Work in next areas: eCommerce web projects; creative landing pages; iOs and Android apps; corporate web sites and corporate identity sometimes."
                    />
                    <WorkExp
                      topic=""
                      className=""
                      imgSrc="../assets/wx1.png"
                      jbName="Freelance UX/UI designer"
                      position="Jun 2016 — Present"
                      place="Around the world"
                      time="Jun 2016 — Present"
                      duration="3 yrs 3 mos"
                      details="Work with clients and web studios as freelancer.  Work in next areas: eCommerce web projects; creative landing pages; iOs and Android apps; corporate web sites and corporate identity sometimes."
                    />
                  </div>
                  <div className="w-full h-[195px] mt-[30px] bg-[#FFFFFF] border border-solid border-[#bab8b8] p-8">
                    <WorkExp
                      topic="Education"
                      className=" w-10 h-10"
                      imgSrc="../assets/wx2.png"
                      jbName="Bachelor's degree Field Of StudyComputer and Information Systems Security/Information Assurance"
                      time="2013 — 2017"
                      details="Additional English classes and UX profile courses​."
                    />
                  </div>
                </div>
              </div>
              <div className=" w-[400px]  h-min bg-slate-900"></div>
            </div>
          </div>
        </div>
      </Container>

      <div className="  ">
        {showModal ? (
          <>
            <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 ">
              <div className="relative w-[300px] my-6 mx-auto ">
                {/*content*/}
                <div className="border-[2px] border-orange-700 rounded-[30px] shadow-lg relative flex flex-col w-full bg-black ">
                  {/*header*/}
                  <div className="flex items-center justify-center p-2">
                    <h3 className="text-lg text-orange-500 text-center font-semibold">
                      Image Upload
                    </h3>
                  </div>
                  <div className=" w-full flex items-center justify-center">
                    <input
                      className=" w-[65px] rounded-xl"
                      type="file"
                      accept="image/*"
                      onChange={onChange}
                      onClick={handleCrop}
                    />
                  </div>

                  {/*body*/}
                  <div className="relative p-2 flex items-start justify-center  h-[250px] ">
                    <Cropper
                      className="h-[144px] w-[232px] "
                      zoomTo={0.05}
                      initialAspectRatio={1}
                      preview=".img-preview"
                      src={image}
                      viewMode={2}
                      minCropBoxHeight={50}
                      minCropBoxWidth={50}
                      background={false}
                      responsive={true}
                      autoCropArea={1}
                      checkOrientation={false}
                      onInitialized={(instance) => {
                        setCropper(instance);
                      }}
                      guides={true}
                    />
                  </div>
                  <div>
                    <div className=" flex justify-between px-2">
                      <div>
                        <div className="img-preview" />
                      </div>
                      <div>
                        {" "}
                        <button
                          className=" bg-orange-500 translate-x-[80px] translate-y-[-80px] text-white font-bar font-bold text-base rounded-sm px-2 py-[2px]"
                          onClick={getCropData}
                        >
                          Crop Image
                        </button>
                      </div>
                      <div>
                        <img
                          onClick={() => setShowModal(false)}
                          className=" w-[158px] h-[158px] rounded-[50%]"
                          src={cropData}
                          alt="cropped"
                        />
                      </div>
                    </div>
                    <br style={{ clear: "both" }} />
                  </div>
                  {/*footer*/}
                </div>
              </div>
            </div>
            <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
          </>
        ) : null}

        {/* ####################################################### cover Modal start*/}

        {showMod ? (
          <>
            <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 ">
              <div className="relative w-[300px] my-6 mx-auto ">
                {/*content*/}
                <div className="border-[2px] border-orange-700 rounded-[30px] shadow-lg relative flex flex-col w-full bg-black ">
                  {/*header*/}
                  <div className="flex items-center justify-center p-2">
                    <h3 className="text-lg text-orange-500 text-center font-semibold">
                      Image Upload
                    </h3>
                  </div>
                  <div className=" w-full flex items-center justify-center">
                    <input
                      className=" w-[65px] rounded-xl"
                      type="file"
                      accept="image/*"
                      onChange={coverChange}
                      onClick={handleCover}
                    />
                  </div>

                  {/*body*/}
                  <div className="relative p-2 flex items-start justify-center  h-[250px] ">
                    <Cropper
                      className="h-[144px] w-[232px] "
                      zoomTo={0.05}
                      initialAspectRatio={1}
                      preview=".img-preview"
                      src={imaCover}
                      viewMode={2}
                      minCropBoxHeight={50}
                      minCropBoxWidth={50}
                      background={false}
                      responsive={true}
                      autoCropArea={1}
                      checkOrientation={false}
                      onInitialized={(instance) => {
                        setCoverCrp(instance);
                      }}
                      guides={true}
                    />
                  </div>
                  <div>
                    <div className=" flex justify-between px-2">
                      <div>
                        <div className="img-preview" />
                      </div>
                      <div>
                        {" "}
                        <button
                          className=" bg-orange-500 translate-x-[80px] translate-y-[-80px] text-white font-bar font-bold text-base rounded-sm px-2 py-[2px]"
                          onClick={getCoverData}
                        >
                          Crop Image
                        </button>
                      </div>
                      <div>
                        <img
                          onClick={() => setShowMod(false)}
                          className=" w-[158px] h-[158px] rounded-[50%]"
                          src={dataCover}
                          alt="cropped"
                        />
                      </div>
                    </div>
                    <br style={{ clear: "both" }} />
                  </div>
                  {/*footer*/}
                </div>
              </div>
            </div>
            <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
          </>
        ) : null}

        {/* ####################################################### cover Modal end*/}
      </div>

      {/* ############################################################################ Contact Modasl start #####*/}

      {contactModal ? (
        <>
          <div className="justify-center border-2 rounded-lg border-solid border-orange-500 items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*header*/}

                {/*body*/}
                <div className="relative p-6 flex-auto">
                  <h3>
                    Name: {reduxReturnData.userStoreData.userInfo.displayName}
                  </h3>
                  <h4>Email: {reduxReturnData.userStoreData.userInfo.email}</h4>
                  <h4>
                    Mobile: {reduxReturnData.userStoreData.userInfo.phoneNumber}
                  </h4>
                </div>
                {/*footer*/}
                <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                  <button
                    className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => setContactModal(!contactModal)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}

      {/* // ############################################################################ Contact Modasl end ##### */}

      {/* // ############################################################################ Edit profile Modasl start ##### */}

      {profileEdit ? (
        <>
          <div className="justify-center border-2 rounded-lg border-solid border-orange-500 items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*header*/}

                {/*body*/}
                <EditProfile />

                {/*footer*/}
                <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                  <button
                    className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => setProfileEdit(!profileEdit)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}

      {/* // ############################################################################ edit-profile Modasl end ##### */}
    </>
  );
};

export default Profile;
