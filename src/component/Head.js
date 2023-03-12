import React, { useState, useEffect } from "react";
import Image from "./Image";
import Slider from "react-slick";
import LogoutButton from "./LogoutButton";
import { useNavigate } from "react-router-dom";

import { useSelector } from "react-redux";
import NewPostCard from "./NewPostCard";
import { getDatabase, ref, onValue } from "firebase/database";

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
  //######################## users database cll

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

        <div className=" absolute top-8 right-0 translate-x-[-15%] translate-y-[30%]">
          <div className="rounded-lg shadow-lg bg-white w-[302px]">
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
      </>
    </>
  );
};

export default Head;
