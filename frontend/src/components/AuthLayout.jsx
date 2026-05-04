import { useEffect } from "react";

function AuthLayout({ children }) {
  useEffect(() => {
    document.body.classList.add("auth-page");

    return () => document.body.classList.remove("auth-page");
  }, []);

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        {children}
      </div>
    </div>
  );
}

export default AuthLayout;
