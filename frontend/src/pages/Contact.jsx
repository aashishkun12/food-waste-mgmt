import { useState, useEffect } from "react";
import { FiMail, FiPhone, FiMapPin, FiSend, FiCheckCircle } from "react-icons/fi";

const CONTACT_INFO = [
  {
    icon: FiMapPin,
    label: "Address",
    value: "Kathmandu-8, Baneshwor, Nepal",
    color: "bg-green-50 text-green-600",
  },
  {
    icon: FiMail,
    label: "Email",
    value: "support@foodwastems.com",
    color: "bg-blue-50 text-blue-600",
  },
  {
    icon: FiPhone,
    label: "Phone",
    value: "+977 9800-000-001",
    color: "bg-purple-50 text-purple-600",
  },
];

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim())    e.name    = "Name is required";
    if (!form.email.trim())   e.email   = "Email is required";
    if (!form.subject.trim()) e.subject = "Subject is required";
    if (!form.message.trim()) e.message = "Message is required";
    return e;
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    setSubmitted(true);
  };

  const inputCls = (key) =>
    `w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-green-500 transition ${
      errors[key] ? "border-red-400 bg-red-50" : "border-gray-200 bg-white"
    }`;

  return (
    <div className="min-h-screen bg-white">

      {/* ── Hero banner ── */}
      <section className="bg-gradient-to-br from-green-900 via-green-800 to-green-700 text-white px-6 py-16 text-center">
        <span className="text-xs font-semibold tracking-widest uppercase text-green-300">Get In Touch</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold mt-3 mb-3">Contact Us</h1>
        <p className="text-green-100 text-base max-w-xl mx-auto leading-relaxed">
          Have a question, suggestion, or want to partner with us?
          We'd love to hear from you.
        </p>
      </section>

      {/* ── Main content ── */}
      <section className="max-w-5xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-3 gap-10">

        {/* ── Contact info ── */}
        <div className="flex flex-col gap-5">
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-1">Reach us directly</h2>
            <p className="text-sm text-gray-500 leading-relaxed">
              Our team is available Monday to Friday, 10am – 6pm.
              We usually respond within one business day.
            </p>
          </div>

          {CONTACT_INFO.map((item) => (
            <div key={item.label} className="flex items-start gap-4">
              <div className={`p-3 rounded-xl flex-shrink-0 ${item.color}`}>
                <item.icon size={18} />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{item.label}</p>
                <p className="text-sm font-medium text-gray-700 mt-0.5">{item.value}</p>
              </div>
            </div>
          ))}

          {/* Office hours */}
          <div className="mt-2 bg-green-50 border border-green-100 rounded-xl p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-green-600 mb-2">Office Hours</p>
            <div className="space-y-1 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Monday – Friday</span>
                <span className="font-medium">10:00 AM – 6:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Sunday & Sunday</span>
                <span className="text-red-400 font-medium">Closed</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Contact form ── */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-8">

            {submitted ? (
              <div className="flex flex-col items-center justify-center py-12 text-center gap-4">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                  <FiCheckCircle size={32} className="text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Message Sent!</h3>
                <p className="text-sm text-gray-500 max-w-sm">
                  Thanks for reaching out. We've received your message and will
                  get back to you within one business day.
                </p>
                <button
                  onClick={() => { setSubmitted(false); setForm({ name: "", email: "", subject: "", message: "" }); }}
                  className="mt-2 px-5 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <>
                <h2 className="text-xl font-bold text-gray-800 mb-6">Send us a message</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  {/* Name */}
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                      className={inputCls("name")}
                      placeholder="Your Name"
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                      className={inputCls("email")}
                      placeholder="you@example.com"
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>
                </div>

                {/* Subject */}
                <div className="mb-4">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={form.subject}
                    onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
                    className={inputCls("subject")}
                    placeholder="e.g. Partnership enquiry"
                  />
                  {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject}</p>}
                </div>

                {/* Message */}
                <div className="mb-6">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">
                    Message
                  </label>
                  <textarea
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                    className={`${inputCls("message")} resize-none`}
                    placeholder="Tell us how we can help..."
                  />
                  {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
                </div>

                <button
                  onClick={handleSubmit}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition"
                >
                  <FiSend size={15} />
                  Send Message
                </button>
              </>
            )}

          </div>
        </div>

      </section>
    </div>
  );
};

export default Contact;