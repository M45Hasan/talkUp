import React, { useState, useEffect } from "react";
import Image from "./Image";
import Slider from "react-slick";
import LogoutButton from "./LogoutButton";
import { useNavigate } from "react-router-dom";

import { getDatabase } from "firebase/database";

import { useSelector } from "react-redux";
import NewPostCard from "./NewPostCard";

const Head = () => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    arrows: false,
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

  return (
    <>
      <nav className=" bg-white w-full h-16 px-[40px] py-3 flex justify-between items-center ">
        <image>
          <Image imgSrc="../assets/lo.png" />
        </image>
        <div className="w-[28%]  flex justify-between items-center">
          <div className="flex  w-[80px] justify-between ">
            <image>
              <Image
                className="w-[42px] h-[42px] rounded-full"
                imgSrc={reduxReturnData.userStoreData.userInfo.photoURL}
              />
            </image>
            <h4 className="font-bar font-bold text-[12px]">
              {reduxReturnData.userStoreData.userInfo.displayName}
            </h4>
          </div>

          <LogoutButton />
        </div>
      </nav>
      <div className="block absolute top-8 right-0 translate-x-[-15%] translate-y-[12%]">
        <div className="rounded-lg shadow-lg bg-white w-[302px]">
          <Slider {...settings} className="">
            <div>
              <NewPostCard
                title="Hello"
                text="  Some quick example text to build on the card title and make up the
            bulk of the card's content."
                postSrc="https://mdbootstrap.com/img/new/standard/nature/182.jpg"
                fndSrc={reduxReturnData.userStoreData.userInfo.photoURL}
              />
            </div>
            <div className="  ">
              <NewPostCard
               
                text="  Some quick example text to build on the card title and make up the
            bulk of the card's content."
               
                fndSrc={reduxReturnData.userStoreData.userInfo.photoURL}
              />
            </div>
            <div>
              <NewPostCard
                title="Hello"
                text="  Some quick example text to build on the card title and make up the
            bulk of the card's content."
                postSrc="https://mdbootstrap.com/img/new/standard/nature/182.jpg"
                fndSrc={reduxReturnData.userStoreData.userInfo.photoURL}
              />
            </div>
            <div>
              <NewPostCard
                title="Hello"
                text="  Some quick example text to build on the card title and make up the
            bulk of the card's content."
                postSrc="https://mdbootstrap.com/img/new/standard/nature/182.jpg"
                fndSrc={reduxReturnData.userStoreData.userInfo.photoURL}
              />
            </div>
            <div>
              <NewPostCard
                title="Hello"
                text="  Some quick example text to build on the card title and make up the
            bulk of the card's content."
                postSrc="https://mdbootstrap.com/img/new/standard/nature/182.jpg"
                fndSrc={reduxReturnData.userStoreData.userInfo.photoURL}
              />
            </div>
            <div>
              <NewPostCard
                title="Hello"
                text="  Some quick example text to build on the card title and make up the
            bulk of the card's content."
               
                fndSrc={reduxReturnData.userStoreData.userInfo.photoURL}
              />
            </div>
          </Slider>
        </div>
      </div>
    </>
  );
};

export default Head;
