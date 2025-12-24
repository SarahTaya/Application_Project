// src/presentation/pages/auth/NewPassword.jsx
import React, { useState } from "react";
import AuthLayout from "../../component/auth/AuthLayout";
import AuthInput from "../../component/form/AuthInput";
import AuthButton from "../../component/auth/AuthButton";

import { BiLogIn } from "react-icons/bi";
import { TbLockPassword } from "react-icons/tb";

import { useLocation, useNavigate } from "react-router-dom";
import { resetPasswordService } from "../../../domain/authService";

export default function NewPassword() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
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

    if (!password || !confirm) {
      setError("الرجاء إدخال كلمة السر والتأكيد.");
      return;
    }

    if (password !== confirm) {
      setError("كلمتا السر غير متطابقتين.");
      return;
    }

    try {
      setLoading(true);

      await resetPasswordService({
        identifier,
        password,
        password_confirmation: confirm,
      });

      navigate("/");
    } catch (err) {
      console.error(err);
      setError("فشل تغيير كلمة السر، حاول مرة ثانية.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      icoon={<BiLogIn />}
      title="Reset Password"
      subtitle="Please enter a new password and confirm it"
    >
      <form autoComplete="off" onSubmit={handleSubmit}>
        <AuthInput
          label="New password"
          id="password"
          type="password"
          placeholder="Enter new password"
          icon={<TbLockPassword />}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <AuthInput
          label="Confirm password"
          id="password_confirm"
          type="password"
          placeholder="Confirm new password"
          icon={<TbLockPassword />}
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />

        {error && (
          <p className="error" style={{ textAlign: "center", marginTop: 10 }}>
            {error}
          </p>
        )}

        <div style={{ textAlign: "center", marginTop: 20 }}>
          <AuthButton type="submit">
            {loading ? "Saving..." : "Reset password"}
          </AuthButton>
        </div>
      </form>
    </AuthLayout>
  );
}
