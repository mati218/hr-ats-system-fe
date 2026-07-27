import React from "react";

const Button = ({
  title,
  type = "button",
  className = "",
  onClick,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`w-full rounded-md bg-purple-700 p-3 text-white hover:bg-purple-800 ${className}`}
    >
      {title}
    </button>
  );
};

export default Button;