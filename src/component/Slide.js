import React, { useState } from "react";
import Slider from "react-slick";
import Image from "./Image";
import Topic from "./Topic";
const Slide = () => {
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
        console.log(setCurrent((newIndex = 1)));
        console.log(setTotal(oldIndex + 1));
      } else {
        console.log(setCurrent(newIndex + 1));
      }
    },
  };
  return (
    <>
      <Topic topic="Project" count={current} total={total} x={true} />
      <div className=" w-full h-[300px] ">
        <Slider {...settings} className=" mt-5">
          <div>
            {" "}
            <Image
              className="w-[200px] h-[160px] m-2  "
              imgSrc="../assets/s1.png"
            />
          </div>
          <div  className="w-[200px] h-[160px] m-2  ">
            <link href="https://hasan-ecom.netlify.app/"/>

          </div>
          <div>
            {" "}
            <Image
              className="w-[200px] h-[160px] m-2  "
              imgSrc={"../assets/s1.png"}
            />
          </div>
          <div>
            {" "}
            <Image
              className="w-[200px] h-[160px] m-2  "
              imgSrc="../assets/s1.png"
            />
          </div>
          <div>
            {" "}
            <Image
              className="w-[200px] h-[160px] m-2  "
              imgSrc="../assets/s1.png"
            />
          </div>
        </Slider>
      </div>
    </>
  );
};

export default Slide;
