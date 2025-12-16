import { IoMdSend } from "react-icons/io";

const ContactForm = () => {
  return (
    <div className="w-full px-6 md:px-16 lg:px-32 py-20 mt-20">
      <h2 className="text-3xl font-semibold mb-10 tracking-wide">
        Get in Touch
      </h2>

      <form
        className="
          backdrop-blur-sm 
          border border-(--brand-accent)/30 
          rounded-2xl 
          p-8 
          space-y-8 
          shadow-xl
        "
      >
        {/* NAME + EMAIL */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* FULL NAME */}
          <div className="relative pt-3">
            <input
              type="text"
              name="name"
              required
              placeholder="Full Name"
              className="
                w-full px-4 py-3
                bg-transparent
                border border-(--brand-accent)/40
                rounded-lg
                outline-none
                peer
                placeholder-transparent
                transition
              "
            />
            <label
              className="
                absolute left-3 top-6
                px-1
                text-sm opacity-70
                pointer-events-none
                transition-all duration-200
                bg-(--brand-bg)
                
                peer-focus:-top-3
                peer-focus:text-xs
                peer-focus:opacity-100

                peer-valid:-top-3
                peer-valid:text-xs
              "
            >
              Full Name
            </label>
          </div>

          {/* EMAIL */}
          <div className="relative pt-3">
            <input
              type="email"
              name="email"
              required
              placeholder="Email Address"
              className="
                w-full px-4 py-3
                bg-transparent
                border border-(--brand-accent)/40
                rounded-lg
                outline-none
                peer
                placeholder-transparent
                transition
              "
            />
            <label
              className="
                absolute left-3 top-6
                px-1
                text-sm opacity-70
                pointer-events-none
                transition-all duration-200
                bg-(--brand-bg)

                peer-focus:-top-3
                peer-focus:text-xs
                peer-focus:opacity-100

                peer-valid:-top-3
                peer-valid:text-xs
              "
            >
              Email Address
            </label>
          </div>
        </div>

        {/* PHONE */}
        <div className="relative pt-3">
          <input
            type="text"
            name="phone"
            required
            placeholder="Phone Number"
            className="
              w-full px-4 py-3
              bg-transparent
              border border-(--brand-accent)/40
              rounded-lg
              outline-none
              peer
              placeholder-transparent
              transition
            "
          />
          <label
            className="
              absolute left-3 top-6
              px-1
              text-sm opacity-70
              pointer-events-none
              transition-all duration-200
              bg-(--brand-bg)

              peer-focus:-top-3
              peer-focus:text-xs
              peer-focus:opacity-100

              peer-valid:-top-3
              peer-valid:text-xs
            "
          >
            Phone Number
          </label>
        </div>

        {/* MESSAGE */}
        <div className="relative pt-3">
          <textarea
            name="message"
            required
            rows="5"
            placeholder="Your message..."
            className="
              w-full px-4 py-3
              bg-transparent
              border border-(--brand-accent)/40
              rounded-lg
              outline-none
              resize-none
              peer
              placeholder-transparent
              transition
            "
          ></textarea>

          <label
            className="
              absolute left-3 top-6
              px-1
              text-sm opacity-70
              pointer-events-none
              transition-all duration-200
              bg-(--brand-bg)

              peer-focus:-top-3
              peer-focus:text-xs
              peer-focus:opacity-100

              peer-valid:-top-3
              peer-valid:text-xs
            "
          >
            Your message...
          </label>
        </div>

        {/* SUBMIT BUTTON */}
        <button
          type="submit"
          className="
            w-full py-4
            border border-(--brand-accent)
            rounded-lg
            font-semibold tracking-wide
            flex items-center justify-center gap-2
            transition duration-200
            hover:opacity-80 hover:scale-[1.02]
          "
        >
          <IoMdSend />
          SEND MESSAGE
        </button>
      </form>
    </div>
  );
};

export default ContactForm;
