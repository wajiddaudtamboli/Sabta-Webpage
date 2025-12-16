import { IoArrowDown } from "react-icons/io5";

const ScrollDownButton = () => {
  const handleScroll = () => {
    window.scrollBy({
      top: window.innerHeight, // scroll one full screen height
      behavior: "smooth",
    });
  };

  return (
    <button
      onClick={handleScroll}
      className="
        fixed
        top-2/3
        right-6
        -translate-y-1/2
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
      <IoArrowDown size={26} />
    </button>
  );
};

export default ScrollDownButton;
