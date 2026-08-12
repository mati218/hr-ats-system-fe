const FormInput = (props) => {
  return (
    <div>
      <input
        type={props.type}
        placeholder={props.placeholder}
        min={props.min}
        className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
        {...props.register(props.name, props.rules)}
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