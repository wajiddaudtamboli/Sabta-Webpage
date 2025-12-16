import { useNavigate, useLocation } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";

const BackButton = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // If you're on home page "/", don't show the button
  if (location.pathname === "/") return null;

  return (
    <button
      onClick={() => navigate(-1)}
      className="
        fixed 
        bottom-6 
        left-6 
        z-50 
        bg-(--brand-bg) 
        text-black 
        p-4 
        rounded-full 
        shadow-lg 
        hover:shadow-xl 
        transition 
        duration-300 
        hover:scale-110 
        flex 
        items-center 
        justify-center
      "
    >
      <IoArrowBack size={26} />
    </button>
  );
};

export default BackButton;
