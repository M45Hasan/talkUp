import React, { useEffect, useState } from "react";
import Container from "../component/Container";

import { FiSend } from "react-icons/fi";
import { MdOutlineAddPhotoAlternate } from "react-icons/md";
import { ImCross } from "react-icons/im";
import { useNavigate } from "react-router-dom";
import {
  getDatabase,
  ref,
  set,
  onValue,
  push,
  remove,
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
  // let [delShow, setDel] = useState(false);
  useEffect(() => {
    const userRef = ref(db, "userPost");
    onValue(userRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        console.log("ami pid:", item.val().pid);

        if (item.val().pid == reduxReturnData.userStoreData.userInfo.uid) {
          arr.push({ ...item.val(), uid: item.key, del: "true" });

          // setDel(!delShow);
        } else {
          arr.push({ ...item.val(), uid: item.key, del: "false" });
        }
      });
      setPost(arr);
    });
    console.log("ami Post arr", userPost);
  }, []);

  // let [useLoc, setLoc] = useState([]);

  let handlePostdel = (item) => {
    console.log("postDel", item.pid);
    if (item.pid == reduxReturnData.userStoreData.userInfo.uid) {
      remove(ref(db, `userPost/${item.uid}`));
    }
  };
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

            {userPost.map((item) => (
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
                  {item.del == "true" && (
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
