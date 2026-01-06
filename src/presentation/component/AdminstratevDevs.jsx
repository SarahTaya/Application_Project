export default function AdminstratevDevs({title,type,onClick,icon, buttonText,children}){
    return <div className=" mainDev">
        <div className="header">
          <div className="header-title">
             {icon}
            {  title&&<h1>{title}</h1>}
          </div>
          
            {buttonText && (
          <button className="buttonl" type={type} onClick={onClick}>
            {buttonText}
          </button>
        )}

        </div>


         <div className="body">
            <div className="data-box">
                {children}
            </div>
         </div>
    </div>
}