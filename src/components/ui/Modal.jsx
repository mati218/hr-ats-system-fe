const Modal = ({ isOpen, onClose, title, subtitle, children, size = "max-w-lg" }) => {

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      ></div>

      <div className={`relative bg-white w-full ${size} rounded-xl shadow-lg z-10 max-h-[90vh] flex flex-col`}>

        <div className="flex justify-between items-start p-6 pb-5 border-b border-gray-100">

          <div>
            <h2 className="text-xl text-left font-bold text-gray-900">
              {title}
            </h2>

            <p className="text-sm text-gray-500 mt-1 text-left">
              {subtitle}
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl leading-none"
          >
            ✕
          </button>

        </div>

        <div className="space-y-4 p-6 overflow-y-auto">
          {children}
        </div>

      </div>

    </div>
  );
};

export default Modal;