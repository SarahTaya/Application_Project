import { useState } from "react";
import CodeInput from "../../component/form/CodeInput";
import AuthButton from "../../component/auth/AuthButton";
import AuthLayout from "../../component/auth/AuthLayout";
import { useLocation, useNavigate } from "react-router-dom";
import { verifyOtpService } from "../../../domain/authService";

export default function VerifyCode() {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
   const [loading, setLoading] = useState(false);
   const location = useLocation();
const navigate = useNavigate();

 

  const identifier = location.state?.identifier;
  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!identifier) {
      setError("المعرّف مفقود، ارجع خطوة لوراء وحاول من جديد.");
      return;
    }

    if (!code || code.length !== 4) {
      setError("الرجاء إدخال كود مكوَّن من 4 أرقام.");
      return;
    }

    try {
      setLoading(true);

      await verifyOtpService({
        serial_number: identifier, 
        otp: code,
      });

      navigate("/reset", { state: { identifier } });
    } catch (err) {
      console.error(err);
      setError("فشل التحقق من الكود، حاول مرة ثانية.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      title="Verification Code"
      subtitle="Enter the code that was sent to your phone"
    >
      <form onSubmit={handleSubmit}>
        <CodeInput length={4} onChange={setCode} />

        <div style={{ textAlign: "center" }}>
          <AuthButton type="submit">Verify</AuthButton>
        </div>
      </form>
    </AuthLayout>
  );
}
