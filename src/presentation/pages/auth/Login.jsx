import { BiLogIn } from "react-icons/bi";
import { AiOutlineNumber } from "react-icons/ai";
import { TbLockPassword } from "react-icons/tb";
import { FaEye } from "react-icons/fa";
import { Link } from "react-router-dom";
import React from "react";
import { useNavigate } from "react-router-dom";
import { loginEmployee } from "../../../domain/authService";
import ThemeToggle from "../../../Theme/ThemeToggle";
<FaEye />


export default function Login() {
    const [serial_number, setSerialNum] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [accept, setAccept] = React.useState(false);
    const [error, setError] = React.useState("");
    const [loading, setLoading] = React.useState(false);
    const navigate = useNavigate();

    async function handleSubmit(e) {

        e.preventDefault();
        setAccept(true);

        if (!serial_number || !password) {
            setError("الرجاء إدخال الرقم التسلسلي وكلمة المرور");
            return;
        }
        try {
          const{roleId}=  await loginEmployee({ serial_number, password })
           if (roleId === 1) {
      navigate("/adminadmin");   
    } 
    else
         if (roleId === 2) {
      navigate("/admindash"); 
    }
        } catch (err) {
            console.error(err);
            setError(err.message || "فشل تسجيل الدخول");
        }
    }
    return <div className="main">
        <div className="second-main">
                              {/* زر التبديل */}
      {/* <div style={{ padding: "16px" }}>
        <ThemeToggle />
      </div> */}
            <div className="form1">

                <form autoComplete="off" onSubmit={handleSubmit} >
                    <div className="icon"><BiLogIn /></div>
                    <h1> LogIN</h1>
      
                    <h4>please enter your S/N and password to continue</h4>
                    <div className="field">
                        <label htmlFor="1">  Serial Number: </label>
                        <AiOutlineNumber className="input-icon" />
                        <input type="text" placeholder="please enter your serial num" id="1"

                            name="new-email"
                            value={serial_number}
                            onChange={(e) => setSerialNum(e.target.value)}

                        ></input>
                    </div>

                    <div className="field">
                        <TbLockPassword className="input-icon" />
                        <label htmlFor="2">password</label>
                        <input type="password" id="2" placeholder="please enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        >
                        </input>
                    </div>



                    <div className="forgot-wrapper">
                        <Link to="/forget" href="/forgot-password" className="forgot-link" >
                            Forgot Password?

                        </Link>
                    </div>



                    <div style={{ textAlign: "center" }}>


                        <button type='submit' className='buttonl' > {loading ? "Loading..." : "LogIn"}</button>
                    </div>
                </form>

            </div>
            <div className="picture">
                <div>
                    <h1>ComplaintsApp</h1>
                </div>
                <div>
                    <img src="/image/logo.svg" alt="App logo" className="logo" />
                </div>

            </div>
        </div>
    </div>
}




