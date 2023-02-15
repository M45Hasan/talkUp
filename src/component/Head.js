
import React, { useState, useEffect } from "react";
import Image from "./Image";
import LogoutButton from "./LogoutButton";
import { useNavigate } from "react-router-dom";

import { getDatabase} from "firebase/database";

import { useSelector } from "react-redux";

const Head = () => {
  
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
        <LogoutButton />
      </nav>
     
    </>
  );
};

export default Head;
