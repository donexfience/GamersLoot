import { useState } from "react";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { FaSpinner } from "react-icons/fa";
import "./styles.css"; // Import your CSS file containing the vibrate animation

const AnimatedCartButton = ({ onClick, isLoading }) => {
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    setIsClicked(true);
    onClick();

    setTimeout(() => {
      setIsClicked(false);
    }, 1000);
  };

  return (
    <button
      className={`w-full relative flex items-center justify-center px-4 py-2 text-black border-2 border-purple-600 rounded-lg transition-all duration-300 ${
        isClicked ? "animate-vibrate" : ""
      }`}
      onClick={handleClick}
      disabled={isLoading}
    >
      {isLoading ? (
        <FaSpinner className="animate-spin mr-2 font-bold" />
      ) : (
        <>
          <span className={`w-full font-bold ${isClicked ? "invisible" : ""}`}>
            Add to Cart
          </span>
          <span
            className={`font-bold absolute ${
              isClicked ? "visible" : "invisible"
            }`}
          >
            Added to Cart
          </span>
          <AiOutlineShoppingCart
            className={`ml-2 font-bold ${isClicked ? "invisible" : ""}`}
          />
        </>
      )}
    </button>
  );
};

export default AnimatedCartButton;
