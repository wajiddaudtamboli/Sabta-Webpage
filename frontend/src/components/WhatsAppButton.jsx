const WhatsAppButton = () => {
  return (
    <a
      href="https://wa.me/971555826436"
      target="_blank"
      rel="noopener noreferrer"
      className="
        fixed 
        bottom-4 
        right-4
        p-0
        z-50 
        transition 
        duration-300 
        hover:scale-110
        flex 
        items-center 
        justify-center
      "
    >
      <img
        src="/WhatsApp_logo.png"
        alt="WhatsApp"
        className="w-18 h-18 object-contain"
      />
    </a>
  );
};

export default WhatsAppButton;
