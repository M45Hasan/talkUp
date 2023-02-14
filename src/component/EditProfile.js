import React, { useState } from "react";
import { getDatabase, ref, set, push } from "firebase/database";
import { useSelector } from "react-redux";

const EditProfile = () => {
  const db = getDatabase();
  let reduxReturnData = useSelector((state) => state);
  let [data, setData] = useState({
    add: "",
    about: "",
  });
  let [editShow, setShow] = useState(false);
  let handleChange = (e) => {
    setShow(false);

    let { name, value } = e.target;
    setData({ ...data, [name]: value });
    console.log(data);
  };
  let handleProfile123 = () => {
    set(ref(db, "userInfo/" + reduxReturnData.userStoreData.userInfo.uid), {
      location: data.add,
      about: data.about,
    });
    setShow(!editShow);
  };

  return (
    <div className="w-[400px] h-[300px] border border-solid border-cyan-500 rounded-md relative p-6 flex-auto">
      <div className="mb-2">
        <label>
          <span className="text-gray-700">Location</span>
          <input
            name="add"
            type="text"
            onChange={handleChange}
            className="
            block
            w-full
            mt-2 px-16 py-2
            border-gray-300
            rounded-md
            shadow-sm
            focus:border-indigo-300
            focus:ring
            focus:ring-indigo-200
            focus:ring-opacity-50
          "
          />
        </label>
      </div>
      <div className="mb-2">
        <label>
          <span class="text-gray-700">About </span>
          <textarea
            name="about"
            onChange={handleChange}
            className="
            block
            w-full
            mt-2 px-16 py-1
            border-gray-300
            rounded-md
            shadow-sm
            focus:border-indigo-300
            focus:ring
            focus:ring-indigo-200
            focus:ring-opacity-50
            resize-none
          "
            rows="6"
            cols="5"
          ></textarea>
        </label>
      </div>
      {!editShow ? (
        <p
          className="mt-6 inline-block p-1 bg-[#086FA4] text-[#FFFFFF] cursor-pointer hover:bg-cyan-600 font-nuni font-semibold border border-solid border-orange-600  text-base h-8 rounded-[4px]"
          onClick={handleProfile123}
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

export default EditProfile;
