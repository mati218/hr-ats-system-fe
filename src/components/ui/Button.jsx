function Button(props) {

  return (
    <button type={props.type}
    onClick={props.onClick}
      className='h-13 w-full rounded-xl bg-blue-600 font-semibold text-2xl text-white hover:bg-blue-700'>
      {props.text}
    </button>
  );
}

export default Button;
