const Checkbox = ({
  label,
  name,
  register,
  errors,
}) => {
  return (
    <div>
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          className="size-6"
          {...register(name)}
        />

        <span>{label}</span>
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