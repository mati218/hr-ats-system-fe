import React from "react";

const InputField = ({
  label,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
}) => {
  return (
    <div className="mb-4">
      <label className="mb-2 block text-sm font-medium">
        {label}
      </label>

      <input
        type={type}
        name={name}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        className="w-full rounded-md border p-3 outline-none focus:border-purple-700"
      />
    </div>
  );
};

export default InputField;