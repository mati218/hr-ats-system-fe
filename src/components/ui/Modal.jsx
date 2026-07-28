const Modal = ({ isOpen, onClose, title, subtitle, children, footer }) => {

  if (!isOpen) {
    return null;
  }


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">

      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      ></div>

      <div className="relative bg-white w-full max-w-lg rounded-xl p-6 shadow-lg z-10">


        <div className="flex justify-between items-start mb-5">

          <div>

            <h2 className="text-xl font-bold text-gray-900">
              {title}
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              {subtitle}
            </p>

          </div>

          

        </div>

        <div className="space-y-4">
          {children}
        </div>

        <div className="flex justify-end gap-3 mt-6 border-t pt-4">

          {footer}

        </div>


      </div>


    </div>
  );
};


export default Modal;