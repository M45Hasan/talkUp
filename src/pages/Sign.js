import React, { useState, useEffect } from "react";
import Input from "../component/Input";
import Container from "../component/Container";
import Header from "../component/Header";
import Image from "../component/Image";
import Buttonx from "../component/Buttonx";
import Alert from "../component/Alert";
import { AiOutlineEyeInvisible, AiOutlineEye } from "react-icons/ai";
import { ColorRing } from "react-loader-spinner";

import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";

import { useNavigate } from "react-router-dom";

import { activeUser } from "../slices/UserSlice";
import { useSelector, useDispatch } from "react-redux";
import { getDatabase, ref, set, push } from "firebase/database";

const Sign = () => {
  // ####################################### import variable#####
  const auth = getAuth();
  let navigate = useNavigate();
  const db = getDatabase();
  let dispatch = useDispatch();
  let reduxReturnData = useSelector((state) => state);

  // ######################################### State Start #########

  //#################################### Page Navigate Start ####
  useEffect(() => {
    if (Boolean(reduxReturnData.userStoreData.userInfo) === true) {
      console.log("should stay in Home Page ");

      navigate("/profile");
    }
  }, []);
  //##### Page Navigate End ####
  let [formData, setData] = useState({
    email: "",

    pass: "",
  });
  let [errorData, setError] = useState({
    email: "",
    pass: "",
    other: "",
  });
  let [loadShow, setLoad] = useState(true);
  let [iCon, setIcon] = useState(true);

  // ######################################### State end #########

  // ######################################### handleChange Func start #########

  let handleClick = () => {
    console.log("ami click");
    let regex =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (formData.email === "") {
      setError({ ...errorData, email: " Email require" });
    } else if (!regex.test(formData.email)) {
      setError({ ...errorData, email: "Enter valid email" });
    } else if (formData.fname === "") {
      setError({ ...errorData, fname: "Enter Your Name" });
    } else if (formData.pass === "") {
      setError({ ...errorData, pass: "Enter valid Password" });
    } else {
      console.log("ami thik");
      signInWithEmailAndPassword(auth, formData.email, formData.pass)
        .then((userCredential) => {
          //************************************************************ */ Signed in
          if (userCredential.user.emailVerified) {
            //** */Email Verify
            setError({ ...errorData, other: "Email Verifed" });
            localStorage.setItem(
              "userInfo",
              JSON.stringify(userCredential.user)
            );
            dispatch(activeUser(userCredential.user));
            setTimeout(() => {
              navigate("/profile");
            }, 2000);
          } else {
            setError({ ...errorData, other: "Please Verify Your Email" });
            setTimeout(() => {
              signOut(auth).then(() => {
                //************************************************** */ Sign-out successful.
                console.log("signOut");
                navigate("/signin");
                setLoad(loadShow);
              });
            }, 3000);
          }
          console.log("Signed in");
          setLoad(!loadShow);
        })
        .catch((error) => {
          const errorCode = error.code;
          if (errorCode.includes("auth/user-not-found")) {
            setError({ ...errorData, other: "user not found" });
          }
          if (errorCode.includes("auth/too-many-requests")) {
            setError({ ...errorData, other: "invalid info" });
          }
          if (errorCode.includes("auth/network-request-failed")) {
            setError({ ...errorData, other: "Network Error" });
          }
          if (errorCode.includes("auth/wrong-password")) {
            setError({ ...errorData, pass: "wrong-password" });
          }

          console.log(error.code);
        });
    }
  };

  let handleChange = (e) => {
    let { name, value } = e.target;
    if (name === "pass") {
      let cap = /(?=.*?[A-Z])/;
      let lower = /(?=.*?[a-z])/;
      let digit = /(?=.*?[0-9])/;
      let spchar = /(?=.*?[#?!@$%^&*-])/;
      let minlen = /.{6,}/;

      if (!cap.test(value)) {
        setError({ ...errorData, pass: "One Capital letter required" });
        return;
      }

      if (!lower.test(value)) {
        setError({ ...errorData, pass: "One Lower letter required" });
        return;
      }

      if (!digit.test(value)) {
        setError({ ...errorData, pass: "At least one digit required" });
        return;
      }

      if (!spchar.test(value)) {
        setError({
          ...errorData,
          pass: "At least one Special Char required",
        });
        return;
      }

      if (!minlen.test(value)) {
        setError({ ...errorData, pass: "At least 6 unit required" });
        return;
      }
    }

    setData({ ...formData, [name]: value });
    setError({ ...errorData, [name]: "" });
    console.log(formData);
    console.log(errorData);
  };

  let handleIcon = () => {
    setIcon(!iCon);
  };

  let handleSign = () => {
    navigate("/");
  };
  // ######################################### handleChange Func end #########

  return (
    <Container>
      <div className="  ">
        <div className=" flex justify-center">
          <image className=" text-center ">
            <Image imgSrc="assets/log.png" />
          </image>
        </div>

        <div className=" flex justify-center flex-wrap  flex-col pt-8 pb-8">
          <Header heading="Login" sub="Free register and you can enjoy it " />{" "}
          {errorData.other && <Alert> {errorData.other}</Alert>}
          <Input
            onChan={handleChange}
            type="email"
            label="Email Address"
            name="email"
            placeholder="Enter Email"
          />
          {errorData.email && <Alert> {errorData.email}</Alert>}
          <Input
            onChan={handleChange}
            type={iCon ? "password" : "text"}
            label="Password"
            name="pass"
            placeholder="Enter Password"
          />
          <div className="w-4 h-4 translate-x-[394px] translate-y-[-29px]">
            {iCon ? (
              <AiOutlineEyeInvisible onClick={handleIcon} />
            ) : (
              <AiOutlineEye onClick={handleIcon} />
            )}
          </div>
          {errorData.pass && <Alert> {errorData.pass}</Alert>}
          {!loadShow ? (
            <ColorRing
              visible={true}
              height="100"
              width="100"
              ariaLabel="blocks-loading"
              wrapperStyle={{ marginLeft: 220 }}
              wrapperClass=" "
              colors={["#e15b64", "#f47e60", "#f8b26a", "#abbd81", "#849b87"]}
            />
          ) : (
            <div className="w-full">
              <Buttonx click={handleClick} butName="Sign In" />
              <p
                className="text-center text-bar pt-3  font-medium text-base text-[#0275B1] cursor-pointer "
                onClick={handleSign}
              >
                Create New One
              </p>
            </div>
          )}
        </div>
      </div>
    </Container>
  );
};

export default Sign;
