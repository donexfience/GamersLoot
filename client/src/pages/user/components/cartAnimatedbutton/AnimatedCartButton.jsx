import { useState } from "react";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { FaSpinner } from "react-icons/fa";

const AnimatedCartButton = ({ onClick, isLoading }) => {
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    setIsClicked(true);
    onClick(); // Call the onClick function passed from parent component
    // Reset the animation after a delay
    setTimeout(() => {
      setIsClicked(false);
    }, 1000); // Adjust the delay as needed
  };

  return (
    <button
      className={`relative flex items-center w-full justify-center px-4 py-2  text-black border-2 border-purple-600 rounded-lg transition-all duration-300 ${
        isClicked ? "animate-bounce" : ""
      }`}
      onClick={handleClick}
      disabled={isLoading}
    >
      {isLoading ? (
        <FaSpinner className="animate-spin mr-2 font-bold" />
      ) : (
        <>
          <span className="font-bold">Add to Cart</span>
          <AiOutlineShoppingCart className="ml-2 font-bold" />
        </>
      )}
    </button>
  );
};

export default AnimatedCartButton;
