import React from "react";

const EditProfile = () => {
  return (
    <div className="w-[400px] h-[300px] border border-solid border-cyan-500 rounded-md relative p-6 flex-auto">
      <div className="mb-2">
        <label>
          <span className="text-gray-700">Location</span>
          <input
            name="email"
            type="text"
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
    </div>
  );
};

export default EditProfile;
