export default function AuthButton({className,type,onClick,children}){
    return(
        <button
        className="buttonl"
        type={type}
        onClick={onClick}
        >
            {children}
        </button>
    )
}