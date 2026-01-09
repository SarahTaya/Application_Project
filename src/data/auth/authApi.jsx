// import { httpClient } from "../http/client";

// export async  function loginApi({ serial_number, password }){
//     const res=  await httpClient.post("login",{
//         serial_number,
//         password
//     });
//      const employee = res.data?.user;
//   const depId = employee?.department_id ?? null;
//   const empId = employee?.id ?? null;        // employee_id

//     const innerUser = employee?.user ?? null;  // 👈 user المرتبط
//     const userId = innerUser?.id ?? null;

//   if (empId) {
//     localStorage.setItem("employee_id", String(empId));
//   }
//     if (depId) {
//     // خزن رقم القسم باسم واضح
//     localStorage.setItem("department_id", String(depId));
//     console.log("saved department_id =", depId);
//   } else {
//     console.warn("NO department_id in login response", res.data);
//   }

//     return res.data;
// }


// export async function forgotpasswordApi({identifier}) {
//     const res= await httpClient.post("forgotPassword",{identifier})

//     return res.data;
    
// }


// export async function verifyOtpApi({identifier, otp}) {
//     const res=await httpClient.post("verifyOtp",{identifier,
//     otp,})
//     return res.data;
// }

// export async function resetpasswordApi({identifier,password,password_confirmation}) {
//     const res=await httpClient.post("resetPassword",{identifier,password,password_confirmation})
//     return res.data;
    
// }
// src/data/auth/authApi.jsx
import { httpClient } from "../http/client";

// تسجيل الدخول
export async function loginApi({ serial_number, password, fcm_token = null }) {
  const res = await httpClient.post("login", {
    serial_number,
    password,
     fcm_token,
  });

  // شكل الريسبونس عندك (حسب authService):
  // data.user  = employee
  // data.user.user = inner user (فيه token, id, role_id)
  const rootEmployee = res.data?.user ?? null;
  const innerUser = rootEmployee?.user ?? null;

  const depId = rootEmployee?.department_id ?? null; // قسم الموظف
  const empId = rootEmployee?.id ?? null;           // employee_id
  const userId = innerUser?.id ?? null;             // user_id الحقيقي

  // خزن الـ IDs
  if (empId) {
    localStorage.setItem("employee_id", String(empId));
  }

  if (depId) {
    localStorage.setItem("department_id", String(depId));
  }

  if (userId) {
    localStorage.setItem("user_id", String(userId));
  } else {
    console.warn("NO user_id found in login response:", res.data);
  }

  return res.data;
}

// نسيان كلمة السر
export async function forgotpasswordApi({ identifier }) {
  const res = await httpClient.post("forgotPassword", { identifier });
  return res.data;
}

// التحقق من الـ OTP
export async function verifyOtpApi({ identifier, otp }) {
  const res = await httpClient.post("verifyOtp", {
    identifier,
    otp,
  });
  return res.data;
}

// إعادة تعيين كلمة السر
export async function resetpasswordApi({
  identifier,
  password,
  password_confirmation,
}) {
  const res = await httpClient.post("resetPassword", {
    identifier,
    password,
    password_confirmation,
  });
  return res.data;
}
