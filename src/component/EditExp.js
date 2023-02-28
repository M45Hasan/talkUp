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


const EditExp = () => {
  let db = getDatabase();
  let reduxReturnData = useSelector((state) => state);
  let [editShow, setShow] = useState(false);
  let [formData, setData] = useState({
    job: "",
    post: "",
    loc: "",
    time: "",
    dura: "",
    about: "",
  });

  let handleChange = (e) => {
    setShow(false);

    let { name, value } = e.target;
    setData({ ...formData, [name]: value });

    console.log("ami exp:", formData);
  };

  const [imageUpload, setImageUpload] = useState(null);

  let storage = getStorage();

  let handleEdit = (e) => {
    console.log("ami Exp data");

    if (imageUpload == null) {
      set(
        push(ref(db, "userExp/" + reduxReturnData.userStoreData.userInfo.uid)),
        {
          job: formData.job,
          post: formData.post,
          loc: formData.loc,
          time: formData.time,
          dura: formData.dura,
          about: formData.about,
        }
      ).catch((error) => {
        console.log(error.code);
      });
      setShow(!editShow);
    } else {
      const imageRef = def(
        storage,
        `userExpURL/${reduxReturnData.userStoreData.userInfo.uid} /${v4()}`
      );
      uploadBytes(imageRef, imageUpload).then((snapshot) => {
        getDownloadURL(snapshot.ref).then((url) => {
          console.log("url", url);
          set(
            push(
              ref(db, "userExp/" + reduxReturnData.userStoreData.userInfo.uid)
            ),
            {
              job: formData.job,
              post: formData.post,
              loc: formData.loc,
              time: formData.time,
              dura: formData.dura,
              about: formData.about,
              expImg: url,
            }
          ).catch((error) => {
            console.log(error.code);
          });
        });
      });
      setShow(!editShow);
    }
  };

  return (
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

      <div className="mb-2 flex gap-x-1 items-center">
        <label className="font-nuni text-[#11175D] text-sm font-bold ">
          Job Name:
        </label>
        <input
          name="job"
          type="text"
          onChange={handleChange}
          className="
          block
          w-[60%]
          mt-1 px-8 py-[2px]
          border-gray-300
          rounded-md
          shadow-sm
          focus:border-indigo-300
          focus:ring
          focus:ring-indigo-200
          focus:ring-opacity-50
          
          border-b-[1px] border-b-solid border-b-cyan-500
        "
        />
      </div>
      <div className="mb-1 flex gap-x-1 items-center">
        <label className="font-nuni text-[#11175D] text-sm font-bold ">
          Position:
        </label>
        <input
          name="post"
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
          focus:ring-opacity-50
          
        "
        />
      </div>
      <div className="mb-1 flex gap-x-1 items-center">
        <label className="font-nuni text-[#11175D] text-sm font-bold ">
          Job Location:
        </label>
        <input
          name="loc"
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
          focus:ring-opacity-50
          
        "
        />
      </div>
      <div className="mb-1 flex gap-x-1 items-center">
        <label className="font-nuni text-[#11175D] text-sm font-bold ">
          From:
        </label>
        <input
          name="time"
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
          focus:ring-opacity-50
          
        "
        />
      </div>
      <div className="mb-1 flex gap-x-1 items-center">
        <label className="font-nuni text-[#11175D] text-sm font-bold ">
          {" "}
          to :
        </label>
        <input
          name="dura"
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
          focus:ring-opacity-50
          
        "
        />
      </div>

      <div className="mb-1 flex gap-x-2  item-center">
        <label class="font-nuni text-[#11175D] text-sm font-bold ">
          Job Discription{" "}
        </label>
        <input
          name="about"
          onChange={handleChange}
          className="
          border-b-[1px] border-b-solid border-b-cyan-500
          block
          w-[60%]
          mt-1 px-16 py-1
          border-gray-300
          rounded-md
          shadow-sm
          focus:border-indigo-300
          focus:ring
          focus:ring-indigo-200
          focus:ring-opacity-50
          resize-none
        "
          rows="2"
          cols="1"
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
  );
};

export default EditExp;
