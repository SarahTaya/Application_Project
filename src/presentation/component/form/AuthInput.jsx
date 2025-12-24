export default function AuthInput({label,id,type="text",placeholder,icon,value,
  onChange}){
  return(
<div className="field">
  {label&& <label htmlFor={id} >{label}</label>}
  {icon&&<span className="input-icon">{icon}</span>}
  <input
  id={id}
  type={type}
  placeholder={placeholder}
   value={value}       
        onChange={onChange}   
  ></input>
</div>
  )
}