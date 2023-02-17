import React, { useState } from "react";
import { FaArrowCircleUp } from "react-icons/fa";
const SccroolButton = () => {
  const [visible, setVisible] = useState(false);
  const toggleVisible = () => {
    const scrolled = document.documentElement.scrollTop;
    if (scrolled > 300) {
      setVisible(true);
    } else if (scrolled <= 300) {
      setVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  window.addEventListener("scroll", toggleVisible);

  return (
    <div className="w-full ">
      <button className="fixed bg-[#0E6795] font-bar text-[15px] px-2 rounded-full py-2 text-white left-[50%] bottom-10 ">
        <FaArrowCircleUp
        className=""
          onClick={scrollToTop}
          style={{ display: visible ? "inline" : "none" }}
        />
      </button>
    </div>
  );
};

export default SccroolButton;
