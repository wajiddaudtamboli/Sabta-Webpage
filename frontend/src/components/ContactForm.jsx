import { IoMdSend } from "react-icons/io";
import { useState, useEffect } from "react";
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
  const [contactInfo, setContactInfo] = useState(null);

  useEffect(() => {
    const fetchContactData = async () => {
      try {
        const res = await api.get('/pages/contact');
        setContactInfo(res.data?.content);
      } catch (err) {
        console.error("Error fetching contact page data:", err);
      }
    };
    fetchContactData();
  }, []);

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

  // Default contact info
  const info = contactInfo || {
    address: "Dubai, UAE",
    phone: "+971 XXXXXXXXX",
    email: "info@sabtagranite.com",
    whatsapp: "+971XXXXXXXXX"
  };

  return (
    <div className="w-full px-6 md:px-16 lg:px-32 py-20 mt-20">
      <h2 className="text-3xl font-semibold mb-10 tracking-wide">
        {contactInfo?.title || "Get in Touch"}
      </h2>

      {/* Contact Information Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] p-6 rounded-xl border border-gray-700">
          <div className="text-[#d4a853] text-2xl mb-3">📍</div>
          <h3 className="font-semibold mb-2">Address</h3>
          <p className="text-gray-400 text-sm">{info.address}</p>
        </div>
        
        <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] p-6 rounded-xl border border-gray-700">
          <div className="text-[#d4a853] text-2xl mb-3">📞</div>
          <h3 className="font-semibold mb-2">Phone</h3>
          <a href={`tel:${info.phone}`} className="text-gray-400 text-sm hover:text-[#d4a853] transition-colors">
            {info.phone}
          </a>
        </div>
        
        <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] p-6 rounded-xl border border-gray-700">
          <div className="text-[#d4a853] text-2xl mb-3">✉️</div>
          <h3 className="font-semibold mb-2">Email</h3>
          <a href={`mailto:${info.email}`} className="text-gray-400 text-sm hover:text-[#d4a853] transition-colors">
            {info.email}
          </a>
        </div>
      </div>

      {submitStatus === 'success' && (
        <div className="mb-6 p-4 bg-green-500/20 border border-green-500 rounded-lg text-green-400">
          Thank you! Your message has been sent successfully. We will contact you soon.
        </div>
      )}

      {submitStatus === 'error' && (
        <div className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-400">
          Sorry, there was an error. Please try again or contact us directly.
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="
          backdrop-blur-sm 
          border border-[#d4a853]/30 
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
                border border-[#d4a853]/40
                rounded-lg
                outline-none
                peer
                placeholder-transparent
                transition
                focus:border-[#d4a853]
              "
            />
            <label
              className="
                absolute left-3 top-6
                px-1
                text-sm opacity-70
                pointer-events-none
                transition-all duration-200
                bg-[#0a0a0a]
                
                peer-focus:-top-3
                peer-focus:text-xs
                peer-focus:opacity-100
                peer-focus:text-[#d4a853]

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
                border border-[#d4a853]/40
                rounded-lg
                outline-none
                peer
                placeholder-transparent
                transition
                focus:border-[#d4a853]
              "
            />
            <label
              className="
                absolute left-3 top-6
                px-1
                text-sm opacity-70
                pointer-events-none
                transition-all duration-200
                bg-[#0a0a0a]

                peer-focus:-top-3
                peer-focus:text-xs
                peer-focus:opacity-100
                peer-focus:text-[#d4a853]

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
              border border-[#d4a853]/40
              rounded-lg
              outline-none
              peer
              placeholder-transparent
              transition
              focus:border-[#d4a853]
            "
          />
          <label
            className="
              absolute left-3 top-6
              px-1
              text-sm opacity-70
              pointer-events-none
              transition-all duration-200
              bg-[#0a0a0a]

              peer-focus:-top-3
              peer-focus:text-xs
              peer-focus:opacity-100
              peer-focus:text-[#d4a853]

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
              border border-[#d4a853]/40
              rounded-lg
              outline-none
              resize-none
              peer
              placeholder-transparent
              transition
              focus:border-[#d4a853]
            "
          ></textarea>

          <label
            className="
              absolute left-3 top-6
              px-1
              text-sm opacity-70
              pointer-events-none
              transition-all duration-200
              bg-[#0a0a0a]

              peer-focus:-top-3
              peer-focus:text-xs
              peer-focus:opacity-100
              peer-focus:text-[#d4a853]

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
            border border-[#d4a853]
            rounded-lg
            font-semibold tracking-wide
            flex items-center justify-center gap-2
            transition duration-200
            hover:bg-[#d4a853] hover:text-black
            disabled:opacity-50 disabled:cursor-not-allowed
            cursor-pointer
          "
        >
          <IoMdSend />
          {isSubmitting ? 'SENDING...' : 'SEND MESSAGE'}
        </button>
      </form>

      {/* Google Maps Embed */}
      {info.mapUrl && (
        <div className="mt-12">
          <h3 className="text-xl font-semibold mb-4">Find Us</h3>
          <iframe
            src={info.mapUrl}
            width="100%"
            height="400"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="rounded-xl"
          ></iframe>
        </div>
      )}
    </div>
  );
};

export default ContactForm;
