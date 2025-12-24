import Cookies from 'universal-cookie';
import { forgotpasswordApi, loginApi, resetpasswordApi, verifyOtpApi } from '../data/auth/authApi';
const cookies = new Cookies();
export async function loginEmployee({
    serial_number,
    password
}) {
    const data = await loginApi({ serial_number, password })
    console.log("login response data =>", data);

    const innerUser = data?.user?.user; 
    const token = innerUser?.token;
    const roleId = innerUser?.role_id;

    if (!token) {
        throw new Error("Token not found in response");
    }
    cookies.set("token", token);
    // return data;
    return {
        roleId,
        user: innerUser,
    };
}



export async function requestPasswordReset({ serial_number }) {
    const data = await forgotpasswordApi({ identifier: serial_number })
    console.log("OTP from API (domain) =>", data?.otp);

    return data;
}


export async function verifyOtpService({ serial_number, otp }) {
    const data = await verifyOtpApi({
        identifier: serial_number,
        otp,
    })

    console.log("Verify OTP response =>", data);
    return data; 

}


export async function resetPasswordService({
  identifier,
  password,
  password_confirmation,
}) {
  const data = await resetpasswordApi({
    identifier,
    password,
    password_confirmation,
  });

  console.log("reset response:", data);

  return data;
}