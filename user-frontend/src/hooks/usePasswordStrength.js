
// src/hooks/usePasswordStrength.js
import { useEffect, useState } from "react";

export function usePasswordStrength(password = "") {
  const [score, setScore] = useState(0);     // 0..100
  const [label, setLabel] = useState("Weak");

  useEffect(() => {
    const rules = [
      password.length >= 8,
      /[A-Z]/.test(password),
      /[a-z]/.test(password),
      /\d/.test(password),
      /[^A-Za-z0-9]/.test(password),
    ];
    const passed = rules.filter(Boolean).length;
    const strength = Math.round((passed / 5) * 100);
    setScore(strength);

    if (strength >= 80) setLabel("Strong");
    else if (strength >= 60) setLabel("Medium");
    else setLabel("Weak");
  }, [password]);

  return { score, label };
}
