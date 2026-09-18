import { useEffect } from "react";

export const modalOverlayClass =
  "fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-[10px] px-4";

const CloseIcon = () => (
  <svg
    viewBox="0 0 24 24"
    aria-hidden="true"
    className="h-5 w-5"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M6 6L18 18M18 6L6 18" />
  </svg>
);

const Modal = ({ open, title, onClose, children, scrollable = true }) => {
  useEffect(() => {
    if (!open) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className={modalOverlayClass}>
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[80vh] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red-500 transition hover:bg-red-100 hover:text-red-600"
          >
            <CloseIcon />
          </button>
        </div>
        <div className={scrollable ? "px-6 py-5 overflow-y-auto" : "px-6 py-5 overflow-hidden"}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
