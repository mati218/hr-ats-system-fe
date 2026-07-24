const FormInput = (props) => {
  return (
    <div>
      <input
        type={props.type}
        placeholder={props.placeholder}
        className="h-12 sm:h-14 w-full rounded-xl border px-4 text-base sm:text-lg outline-none"
        {...props.register(props.name, {
          required: `${props.label} is required`,
        })}
      />

      {props.errors[props.name] && (
        <p className="mt-1 text-sm text-red-500">
          {props.errors[props.name].message}
        </p>
      )}
    </div>
  );
};

export default FormInput;