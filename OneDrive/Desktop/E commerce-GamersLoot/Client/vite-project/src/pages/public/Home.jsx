import React from "react";
import { BiSearch } from "react-icons/bi";
import home3 from '../../assets/home3.png'

const Home = () => {
  return (
    <div className="">
      {/* Landing Session */}
      <div className="lg:h-screen bg-color lg:flex lg:items-start overflow-clip bg-black pt-32 font-semibold">
        <div className="text-white ml-4 p-6 h-full  w-[90%] text-nowrap "> 
          <ul className="flex flex-col gap-3">
            <li>Gaming Headsets</li>
            <li>Gaming Keyboards</li>
            <li>Gaming Chairs</li>
            <li>Gaming Mouses</li>
            <li>Gaming Monitor</li>
            <li>Gaming Pc components</li>
            <li>GamePad and Joystick</li>
            <li>Gamepad and Joystick</li>
            <li>Gaming laptop</li>
            <li>Games store</li>
          </ul>
        </div>
        
        {/* Search and content div */}
        <div className="flex-shrink-0 text-white lg:pl-34 ml-5 lg:w-[75%] mr-12">
          <div className="flex justify-between rounded-2xl py-2 pl-2 lg:pl-5 pr-2 bg-white font-semibold">
            <div className="flex items-center lg:gap-3">
              <BiSearch className="text-2xl text-blue-600" />
              <input
                type="text"
                placeholder="Find the best product"
                className="text-black outline-none w-full"
              />
            </div>
            <button className="bg-black py-3 px-8 rounded-md">Search</button>
          </div>
          <h1 className="text-4xl lg:text-6xl font-bold mb-6 mt-12">PlayStation®5</h1>
          <p className="font-bold text-gray-500  text-sm lg:text-lg mb-10 lg:mb-3">
            Find the best, reliable and affordable Gaming products here. We focus
            on the product quality. Here you can find all the products apple
            ever made. Even the products  officially stopped selling. Just visit our services and share yours feedbacks So
            why you are waiting? Just order now!
          </p>
          <img
          src={home3}
          className="lg:w-[1200px] lg:-ml-12 lg:mt-16"
          alt="Bg Image"
        />
        </div>
      </div>
    </div>
  );
};

export default Home;
