import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import Image from "./Image";
import Topic from "./Topic";
import { ImCross } from "react-icons/im";

import { getDatabase, ref, set, push, onValue, remove } from "firebase/database";
import { useSelector } from "react-redux";
import {
  ref as def,
  uploadBytes,
  getDownloadURL,
  getStorage,
 
} from "firebase/storage";
import { v4 } from "uuid";

const Slide = () => {
  let db = getDatabase();
  let reduxReturnData = useSelector((state) => state);
  let [editShow, setShow] = useState(false);
  let [formData, setData] = useState({
    about: "",
    link: "",
  });

  let [current, setCurrent] = useState("");
  let [total, setTotal] = useState("");
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    fade: false,
    beforeChange: (oldIndex, newIndex) => {
      if (newIndex == 0) {
        setCurrent((newIndex = 1));
        setTotal(oldIndex + 1);
      } else {
        setCurrent(newIndex + 1);
      }
    },
  };
  let [projShow, setPro] = useState(false);
  let handlEdit = () => {
    console.log("open");
    setPro(!projShow);
  };

  const [imageUpload, setImageUpload] = useState(null);

  let storage = getStorage();

  let handleChange = (e) => {
    setShow(false);

    let { name, value } = e.target;
    setData({ ...formData, [name]: value });
  };

  let handleEdit = (e) => {
    console.log("ami Exp data");

    if (imageUpload == null) {
      set(push(ref(db, "userProj")), {
        about: formData.about,
        link: formData.link,
        pid: reduxReturnData.userStoreData.userInfo.uid,
      }).catch((error) => {
        console.log(error.code);
      });
      setShow(!editShow);
    } else {
      const imageRef = def(
        storage,
        `userProj/${reduxReturnData.userStoreData.userInfo.uid} /${v4()}`
      );
      uploadBytes(imageRef, imageUpload).then((snapshot) => {
        getDownloadURL(snapshot.ref).then((url) => {
          console.log("url", url);
          set(push(ref(db, "userProj")), {
            about: formData.about,
            link: formData.link,
            pid: reduxReturnData.userStoreData.userInfo.uid,
            projURL: url,
          }).catch((error) => {
            console.log(error.code);
          });
        });
      });
      setShow(!editShow);
    }
  };

  let [arrProj, setProj] = useState([]);
  useEffect(() => {
    const usref = ref(db, "userProj");
    onValue(usref, (snapshot) => {
      let arr = [];

      snapshot.forEach((item) => {
        if (item.val().pid == reduxReturnData.userStoreData.userInfo.uid) {
          arr.push({ ...item.val(),uid:item.key });
        }
      });
      setProj(arr);
    });
  }, []);

  let handledel=(item)=>{
     console.log("proj:",item.uid)
     console.log("proj:",item.pid)
     if(item.pid==reduxReturnData.userStoreData.userInfo.uid){
      remove(ref(db,`userProj/${item.uid}`))

     }
  }
  return (
    <>
      {" "}
      <div className="flex justify-between item-center">
        <Topic topic="Project" count={current} total={total} x={true} />
        <p
          className="text-bar inline-block font-medium text-base bg-[#0275B1] rounded-lg px-2 py-1 text-[#ffffff] cursor-pointer"
          onClick={handlEdit}
        >
          {" "}
          Add One
        </p>
      </div>
      <div className=" w-full h-[300px]  ">
        <Slider {...settings} className=" mt-5">
          {arrProj.map((item) => (
            <div className="border-[2px] relative w-[200px] h-[210px] rounded-lg border-cyan-500 border-solid ">
              {" "}
              {item.projURL && (
                <Image className="w-[180px] h-[160px] " imgSrc={item.projURL} />
              )}
              {item.about && (
                <p className="text-bar text-center font-medium text-[#0275B1]  text-base">
                  {item.about}
                </p>
              )}
              {item.link && (
                <a
                  className="text-bar text-center  block font-medium text-[#0275B1]  text-base"
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  My Project
                </a>
              )}
              <button
                onClick={()=>handledel(item)}
                className="text-bar absolute top-2 right-2  block font-medium text-base  text-[#0275B1] hover:text-red-500 cursor-pointer bg-orange-400 shadow rounded-lg "
              >
                <ImCross />
              </button>
            </div>
          ))}
        </Slider>
      </div>
      {projShow ? (
        <>
          <div className="justify-center border-2 rounded-lg border-solid border-orange-500 items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*header*/}

                <div className="w-[400px] h-[300px] border border-solid border-cyan-500 rounded-md relative p-6 flex-auto">
                  <div className=" w-[60%]">
                    <input
                      type="file"
                      className="w-full font-nuni text-[#11175D] text-sm font-bold"
                      name="userpostPhoto"
                      onChange={(event) => {
                        setImageUpload(event.target.files[0]);
                      }}
                    />
                  </div>
                  <div className="mb-1 flex gap-x-1 items-center">
                    <label className="font-nuni text-[#11175D] text-sm font-bold ">
                      About:
                    </label>
                    <input
                      name="about"
                      type="text"
                      onChange={handleChange}
                      className="
                      border-b-[1px] border-b-solid border-b-cyan-500
                      block
                      w-[60%]
                      mt-1 px-8 py-[2px]
                      border-gray-300
                      rounded-md
                      shadow-sm
                      focus:border-indigo-300
                      focus:ring
                      focus:ring-indigo-200
                      focus:ring-opacity-50"
                    />
                  </div>
                  <div className="mb-1 flex gap-x-1 items-center">
                    <label className="font-nuni text-[#11175D] text-sm font-bold ">
                      Link:
                    </label>
                    <input
                      name="link"
                      type="text"
                      onChange={handleChange}
                      className="
                      border-b-[1px] border-b-solid border-b-cyan-500
                      block
                      w-[60%]
                      mt-1 px-8 py-[2px]
                      border-gray-300
                      rounded-md
                      shadow-sm
                      focus:border-indigo-300
                      focus:ring
                      focus:ring-indigo-200
                      focus:ring-opacity-50"
                    />
                  </div>

                  {!editShow ? (
                    <p
                      className="mt-[30px] inline-block p-1 bg-[#086FA4] text-[#FFFFFF] cursor-pointer hover:bg-cyan-600 font-nuni font-semibold border border-solid border-orange-600  text-base h-8 rounded-[4px]"
                      onClick={handleEdit}
                    >
                      Edit
                    </p>
                  ) : (
                    <p className="mt-6 inline-block p-1 bg-[#086FA4] text-[#FFFFFF] cursor-pointer hover:bg-cyan-600 font-nuni font-semibold border border-solid border-orange-600  text-base h-8 rounded-[4px]">
                      Edit Successful
                    </p>
                  )}
                </div>

                {/*footer*/}
                <div
                  onClick={() => setPro(!projShow)}
                  className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b"
                >
                  <button
                    className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
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
    </>
  );
};

export default Slide;
