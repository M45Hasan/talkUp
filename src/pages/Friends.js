import React from "react";
import Image from "../component/Image";
import LogoutButton from "../component/LogoutButton";
import Container from "../component/Container";

const Friends = () => {
  return (
    <>
      <Container>
        <div className="w-[100%] flex justify-center items-center">
          <div>
            <nav className=" bg-white max-w-container h-16 px-[40px] py-3 flex justify-between items-center ">
              <image>
                <Image imgSrc="../assets/lo.png" />
              </image>
              <LogoutButton />
            </nav>
          </div>
        </div>
      </Container>
    </>
  );
};

export default Friends;
