// src/presentation/components/form/CodeInput.jsx
import React, { useRef } from "react";

export default function CodeInput({ length = 4, onChange }) {
  const inputsRef = useRef([]);

  const handleInput = (index, e) => {
    const value = e.target.value.replace(/[^0-9]/g, ""); 
    e.target.value = value;

    if (value && index < length - 1) {
      inputsRef.current[index + 1].focus();
    }

    if (typeof onChange === "function") {
      const code = inputsRef.current.map((input) => input?.value || "").join("");
      onChange(code);
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !e.target.value && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  return (
    <div className="code-container">
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          maxLength="1"
          type="text"
          className="code-box"
          ref={(el) => (inputsRef.current[index] = el)}
          onChange={(e) => handleInput(index, e)}
          onKeyDown={(e) => handleKeyDown(index, e)}
        />
      ))}
    </div>
  );
}
