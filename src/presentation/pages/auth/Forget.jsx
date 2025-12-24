import AuthLayout from "../../component/auth/AuthLayout";
import AuthInput from "../../component/form/AuthInput";
import { BiLogIn } from "react-icons/bi";
import { AiOutlineNumber } from "react-icons/ai";
import '../../styles/Login.css'
import AuthButton from "../../component/auth/AuthButton";
import { useNavigate } from "react-router-dom";
import React from "react";
import { requestPasswordReset } from "../../../domain/authService";

export default function Forget(){
  const [serial_number, setSerial] = React.useState("");
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();

   async function handleSubmit(e) {
  e.preventDefault();

   if (!serial_number) {
      setError("الرجاء إدخال الرقم التسلسلي");
      return;
    }
    try{
const data=await requestPasswordReset({serial_number})
console.log("OTP from API (page) =>", data?.otp);

 navigate("/code", {
        state: { identifier: serial_number }, 
      });
    }catch(err){
       console.error(err);
            setError(err.message || "فشل ارسال الرمز");
    }
 // navigate("/code");
}
    return(
        <AuthLayout
        icoon={<BiLogIn/>}
        title="ForgotPassword"
      subtitle="please enter your S/N  to continue"
        
        > 
            
<form autoComplete="off" onSubmit={handleSubmit}>
    
    <AuthInput
   
    label="serial number"
    id="serial"
    type="text"
    placeholder="enter your s/n"
    icon={<AiOutlineNumber/>}
    value={serial_number}
     onChange={(e) => setSerial(e.target.value)}
    ></AuthInput>
    <div style={{textAlign:"center"}}>
       <AuthButton   type="submit">Send Code</AuthButton>
    </div>
   

</form>
        </AuthLayout>
    )
}