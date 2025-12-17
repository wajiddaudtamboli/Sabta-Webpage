import { IoMdSend } from "react-icons/io";
import { useState } from "react";
import { api } from "../api/api";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      await api.post('/enquiries', formData);
      setSubmitStatus('success');
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (err) {
      console.error('Error submitting form:', err);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full px-6 md:px-16 lg:px-32 py-20 mt-20">
      <h2 className="text-3xl font-semibold mb-10 tracking-wide">
        Get in Touch
      </h2>

      {submitStatus === 'success' && (
        <div className="mb-6 p-4 bg-green-500/20 border border-green-500 rounded-lg text-green-400">
          Thank you! Your message has been sent successfully.
        </div>
      )}

      {submitStatus === 'error' && (
        <div className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-400">
          Sorry, there was an error. Please try again.
        </div>
      )}

      <form
        onSubmit={handleSubmit}
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
              value={formData.name}
              onChange={handleChange}
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
              value={formData.email}
              onChange={handleChange}
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
            value={formData.phone}
            onChange={handleChange}
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
            value={formData.message}
            onChange={handleChange}
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
          disabled={isSubmitting}
          className="
            w-full py-4
            border border-(--brand-accent)
            rounded-lg
            font-semibold tracking-wide
            flex items-center justify-center gap-2
            transition duration-200
            hover:opacity-80 hover:scale-[1.02]
            disabled:opacity-50 disabled:cursor-not-allowed
          "
        >
          <IoMdSend />
          {isSubmitting ? 'SENDING...' : 'SEND MESSAGE'}
        </button>
      </form>
    </div>
  );
};

export default ContactForm;
