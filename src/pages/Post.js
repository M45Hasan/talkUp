import React, { useEffect, useState } from "react";
import Container from "../component/Container";

import { FiSend } from "react-icons/fi";
import { MdOutlineAddPhotoAlternate } from "react-icons/md";
import { getDatabase, ref, set, onValue, push } from "firebase/database";
import { useSelector } from "react-redux";
import Image from "../component/Image";
import {
  ref as def,
  uploadBytes,
  getDownloadURL,
  getStorage,
} from "firebase/storage";
import SccroolButton from "../component/SccroolButton";

const Post = () => {
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
    console.log(formData);
    console.log(formData.userText);
  };

  const [imageUpload, setImageUpload] = useState(null);

  let storage = getStorage();

  let handleSend = (e) => {
    console.log("amsdih");

    if (imageUpload == null) {
      set(ref(db, "userPost/" + reduxReturnData.userStoreData.userInfo.uid), {
        userText: formData.userText,
        userPhoto: formData.userPhoto,
        userName: formData.userName,
      }).catch((error) => {
        console.log(error.code);
      });
    } else {
      const imageRef = def(
        storage,
        `userPostURL/${reduxReturnData.userStoreData.userInfo.uid}`
      );

      uploadBytes(imageRef, imageUpload).then((snapshot) => {
        getDownloadURL(snapshot.ref).then((url) => {
          console.log("url", url);
          set(
            ref(db, "userPost/" + reduxReturnData.userStoreData.userInfo.uid),
            {
              userText: formData.userText,
              userPhoto: formData.userPhoto,
              userName: formData.userName,

              userpostPhoto: url,
            }
          ).catch((error) => {
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
    const userRef = ref(db, "userPost/");
    onValue(userRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        arr.push({ ...item.val() });
        console.log(item.key);
      });
      setPost(arr);
    });
    console.log("ami Post arr", userPost);
  }, []);

  let [useLoc, setLoc] = useState([]);
  useEffect(() => {
    const userRef = ref(db, "userInfo");
    onValue(userRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        if (item.key == reduxReturnData.userStoreData.userInfo.uid) {
          arr.push({ ...item.val() });
        }
      });
      setLoc(arr);
    });
    console.log("ami Location", useLoc);
  }, []);
  //################################### database call end ########
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
            {userPost.map((item) => (
              <div className="mt-[25px] w-full px-6 py-[30px] bg-[#FFFF]">
                <div className="flex justify-between items-center w-[150px] mb-[12px]">
                  <image className="">
                    <Image
                      className="w-[42px] h-[42px] rounded-full"
                      imgSrc={item.userPhoto}
                    />
                  </image>
                  <div className="w-[100px]">
                    <h4 className="font-bar font-bold mt-[-15px] text-[12px]">
                      {item.userName}
                    </h4>
                    {useLoc.map((item) => (
                      <p className="font-bar font-semibold text-[10px] text-[#181818]">
                        @ {item.about}
                      </p>
                    ))}
                  </div>
                </div>
                {item.userText && (
                  <p className="text-gray-700 text-base font-bar mb-4">
                    {item.userText}
                  </p>
                )}
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

export default Post;
