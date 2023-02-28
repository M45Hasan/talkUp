import React, { useState } from "react";
import { getDatabase, ref, set, push } from "firebase/database";
import { useSelector } from "react-redux";

const EduEdit = () => {
  let db = getDatabase();
  let reduxReturnData = useSelector((state) => state);
  let [editShow, setShow] = useState(false);
  let [formData, setData] = useState({
    job: "",

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

  let handleEdit = (e) => {
    console.log("ami Edu data");

    set(
      push(ref(db, "userEdu/" + reduxReturnData.userStoreData.userInfo.uid)),
      {
        job: formData.job,

        time: formData.time,
        dura: formData.dura,
        about: formData.about,
      }
    ).catch((error) => {
      console.log(error.code);
    });
    setShow(!editShow);
  };

  return (
    <div className="w-[400px] h-[190px] border border-solid border-cyan-500 rounded-md relative p-6 flex-auto">
      <div className="mb-2 flex gap-x-1 items-center">
        <label className="font-nuni text-[#11175D] text-sm font-bold ">
          School:
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
          Graduation:{" "}
        </label>
        <input
          name="about"
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

export default EduEdit;
