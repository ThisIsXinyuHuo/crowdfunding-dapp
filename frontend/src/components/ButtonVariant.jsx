const ButtonVariant = ({type, text, clickHandler, style, disabled}) => {
    // type is the button type
    // text is the text shown in the button
    // clickHandler goes into onClick
    // style is customized style added to the default style
    return (
        <button
            type = {type}
            // default style with customized style
            className = {`px-6 py-2.5 bg-gray-600 hover:bg-gray-700  text-white font-semibold text-xs leading-tight rounded-full shadow-md ${style}`}
            
            onClick={clickHandler}
            disabled = {disabled}
        >
            {text}
        </button>
    )
}

export default ButtonVariant