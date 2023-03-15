import React, { useState } from "react";
import { getDatabase, ref, set, push } from "firebase/database";
import { useSelector } from "react-redux";
import {
  ref as def,
  uploadBytes,
  getDownloadURL,
  getStorage,
} from "firebase/storage";
import { v4 } from "uuid";

const CreateGroup = () => {
  const db = getDatabase();
  let reduxReturnData = useSelector((state) => state);
  let storage = getStorage();

  //#######################################################################

  //########## handle Change start ######
  let [formData, setData] = useState({
    title: "",
    about: "",
  });

  let handleChange = (e) => {
    setShow(false);
    let { name, value } = e.target;

    setData({
      ...formData,
      [name]: value,
    });
  };
  console.log(formData);
  //########## handle Change end ######
  // ##################### Group Imgae start dataBase ######
  let [show, setShow] = useState(false);
  const [imageUpload, setImageUpload] = useState(null);
  let handleCreate = (e) => {
    if (formData.title !== "") {
      if (imageUpload == null) {
        set(push(ref(db, "userGroup/")), {
          gpTitle: formData.title,
          gpAbout: formData.about,
          createrId: reduxReturnData.userStoreData.userInfo.uid,
          createrName: reduxReturnData.userStoreData.userInfo.displayName,
          createrURL: reduxReturnData.userStoreData.userInfo.photoURL,
        }).then(() => {
          setData({
            title: "",
            about: "",
          });
          setImageUpload("");
          formData.title = " ";
          formData.about = " ";
          imageUpload(null);
          setImageUpload("");
        });
      } else {
        const imageRef = def(
          storage,
          `userGroup/${reduxReturnData.userStoreData.userInfo.uid} /${v4()}`
        );
        uploadBytes(imageRef, imageUpload).then((snapshot) => {
          getDownloadURL(snapshot.ref).then((url) => {
            console.log("url", url);
            set(push(ref(db, "userGroup/")), {
              gpTitle: formData.title,
              gpAbout: formData.about,
              createrId: reduxReturnData.userStoreData.userInfo.uid,
              createrName: reduxReturnData.userStoreData.userInfo.displayName,
              createrURL: reduxReturnData.userStoreData.userInfo.photoURL,
              gpURL: url,
            }).then(() => {
              setData({
                title: "",
                about: "",
              });
              formData.title = " ";
              formData.about = " ";
              imageUpload(null);
              setImageUpload("");
            });
          });
        });
      }
    }
    setShow(true);
  };

  // ##################### Group Imgae end dataBase ######

  return (
    <>
      <div className="m-2 ">
        <label>
          <span className="text-gray-700 font-bar font-semibold text-base">
            Group Title
          </span>
          <input
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            className="
            block
            
            mt-2 px-16 py-2
            border-gray-300
            rounded-md
            shadow-sm
            focus:border-indigo-300
            focus:ring
            focus:ring-indigo-200
            focus:ring-opacity-50
            outline-none

          "
          />
        </label>
      </div>
      <div className="m-2">
        <label>
          <span className="text-gray-700 font-bar font-semibold text-base">
            About
          </span>
          <input
            name="about"
            type="text"
            value={formData.about}
            onChange={handleChange}
            className="
            block
            
            mt-2 px-16 py-2
            border-gray-300
            rounded-md
            shadow-sm
            focus:border-indigo-300
            focus:ring
            focus:ring-indigo-200
            focus:ring-opacity-50
            outline-none
          "
          />
        </label>
      </div>
      <div className=" m-2">
        <input
          type="file"
          placeholder="none"
          className=" font-nuni text-[#11175D] text-sm font-bold"
          name="groupPhoto"
          
          onChange={(event) => {
            setImageUpload(event.target.files[0]);
          }}
        />
      </div>

      <div className="m-2">
        {formData.title ? (
          <p
            className=" text-center  p-1 bg-[#086FA4] text-[#FFFFFF] cursor-pointer hover:bg-cyan-600 font-nuni font-semibold border border-solid border-orange-600  text-base h-8 rounded-[4px]"
            onClick={handleCreate}
          >
            Create
          </p>
        ) : show ? (
          <p className=" text-center  p-1 bg-[#086FA4] text-[#FFFFFF] cursor-pointer hover:bg-cyan-600 font-nuni font-semibold border border-solid border-orange-600  text-base h-8 rounded-[4px]">
            Created
          </p>
        ) : (
          <p className=" text-center  p-1 bg-[#086FA4] text-[#FFFFFF] cursor-pointer hover:bg-cyan-600 font-nuni font-semibold border border-solid border-orange-600  text-base h-8 rounded-[4px]">
            Create
          </p>
        )}
      </div>
    </>
  );
};

export default CreateGroup;
