import React from "react";

const Topic = ({topic,count,total}) => {
  return (
    <>
      {" "}
      <h3 className="font-bar font-bold text-[#181818] inline-block text-lg mr-10">{topic}</h3>
      <p className="bg-[ #181818] font-bar font-normal inline-block  text-base">{count} out of {total} images</p>
    </>
  );
};

export default Topic;
