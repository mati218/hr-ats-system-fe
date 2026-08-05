const Checkbox = ({
  label,
  name,
  register,
  errors,
}) => {
  return (
    <div className="flex justify-center">
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          className="w-5 h-5 cursor-pointer accent-blue-600"
          {...register(name)}
        />

        {label && <span>{label}</span>}
      </label>

      {errors?.[name] && (
        <p className="mt-1 text-sm text-red-500">
          {errors[name].message}
        </p>
      )}
    </div>
  );
};

export default Checkbox;