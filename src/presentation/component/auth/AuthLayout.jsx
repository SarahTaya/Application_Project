// src/presentation/components/auth/AuthLayout.jsx
import React from "react";
import "../../styles/Login.css"; 

export default function AuthLayout({ children, title, subtitle ,icoon}) {
  return (
    <div className="main">
      <div className="second-main">
        <div className="form1">
          {icoon&&<span className="icon">{icoon}</span>}
          {title && <h1>{title}</h1>}
          {subtitle && <h4>{subtitle}</h4>}

          {children}
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
  );
}
