import React, { useState, useEffect } from "react";
import Input from "../component/Input";
import Container from "../component/Container";
import Header from "../component/Header";
import Image from "../component/Image";
import Buttonx from "../component/Buttonx";
import Alert from "../component/Alert";
import { ColorRing } from "react-loader-spinner";
import { AiOutlineEyeInvisible, AiOutlineEye } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import {
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
} from "firebase/auth";
import { getDatabase, ref, set, push } from "firebase/database";
import { useSelector } from "react-redux";

const Regi = () => {
  let [formData, setData] = useState({
    email: "",
    fname: "",
    pass: "",
    photoURL: "",
  });
  let [errorData, setError] = useState({
    email: "",
    fname: "",
  });
  let [wShow, setW] = useState("");
  //############################################################# import variable start###

  const auth = getAuth();
  let navigate = useNavigate();
  let reduxReturnData = useSelector((state) => state);
  const db = getDatabase();
  //############################################################# import variable end###

  //##### Page Navigate Start ####
  useEffect(() => {
    if (Boolean(reduxReturnData.userStoreData.userInfo) === true) {
      console.log("should stay in Home Page ");

      navigate("/profile");
    }
  }, []);
  //##### Page Navigate End ####

  let handleChange = (e) => {
    let { name, value } = e.target;
    if (name === "pass") {
      let cap = /(?=.*?[A-Z])/;
      let lower = /(?=.*?[a-z])/;
      let digit = /(?=.*?[0-9])/;
      let spchar = /(?=.*?[#?!@$%^&*-])/;
      let minlen = /.{6,}/;
      //####################################### progressBar start #####
      if (name.length == 1) {
        setW("33px");
      }
      //####################################### progressBar end #####
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
  /**################################################################### handleButton start */
  let handleClick = () => {
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
      createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.pass,
        formData.photoURL
      )
        .then((user) => {
           sendEmailVerification(auth.currentUser).then(() => {
            console.log(user.user);
            updateProfile(auth.currentUser, {
              displayName: formData.fname,
              photoURL: formData.photoURL,
            })
              .then(() => {
                // Email verification sent!
                console.log("Email Send");
                //########################################Send Database
                set(ref(db, "users/" + user.user.uid), {
                  displayName: user.user.displayName,
                  email: user.user.email,
                  photoURL: user.user.photoURL,
                });
              })
              .then(() => {
                //#######################################Loader
                setLoad(!loadShow);
                //   toast("Registration successful. Please check your email");
                setTimeout(() => {
                  navigate("/signin");
                }, 2000);
              })

              .catch((error) => {
                // An error occurred
                // ...
              });
            });

        })
        .catch((error) => {
          const errorCode = error.code;
          if (errorCode.includes("auth/email-already-in-use")) {
            setError({ ...errorData, email: "Email already exit" });
            setTimeout(() => {
              navigate("/signin");
            }, 2000);
          }

          console.log(errorCode);
        });
    }
  };
  console.log(errorData);

  let handleSign = () => {
    navigate("/signin");
  };
  /**################################################################### handleButton end */

  /**##################################### pass Icon start */
  let [iCon, setIcon] = useState(true);
  let handleIcon = () => {
    setIcon(!iCon);
  };
  /**##################################### pass Icon end */

  /** ###########################################Loader */
  let [loadShow, setLoad] = useState(true);

  return (
    <>
      <Container>
        <div className="drop-shadow-md  ">
          <div className=" flex justify-center">
            <image className=" text-center ">
              <Image imgSrc="assets/log.png" />
            </image>
          </div>

          <div className=" flex justify-center flex-wrap  flex-col pt-8 pb-8">
            <Header
              heading="Get started with easily register"
              sub="Free register and you can enjoy it "
            />{" "}
            <Input
              onChan={handleChange}
              type="email"
              name="email"
              label="Email Address"
              placeholder="Enter Email"
            />
            {errorData.email && <Alert> {errorData.email}</Alert>}
            <Input
              type="text"
              label="Full Name"
              name="fname"
              placeholder="Enter Name"
              onChan={handleChange}
            />
            {errorData.fname && <Alert> {errorData.fname}</Alert>}
            <Input
              type={iCon ? "password" : "text"}
              label="Password"
              name="pass"
              placeholder="Enter Password"
              onChan={handleChange}
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
                <div>
                  <Buttonx click={handleClick} butName="Sign Up" />
                  <div className="w-[313px]mt-[109px]  rounded-full h-2.5 ">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full w-[0]"
                      style={{ width: wShow }}
                    ></div>
                  </div>
                </div>

                <p className="text-center text-bar pt-3  font-medium text-base text-[#0275B1] ">
                  Already account{" "}
                  <span
                    className="text-red-600 cursor-pointer underline"
                    onClick={handleSign}
                  >
                    {" "}
                    Sign In
                  </span>
                </p>
              </div>
            )}
          </div>
        </div>
      </Container>
    </>
  );
};

export default Regi;
