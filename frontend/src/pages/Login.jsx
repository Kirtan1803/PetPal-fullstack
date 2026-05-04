import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../hooks/useAuth";
import AuthLayout from "../components/AuthLayout";
import { notify } from "../utils/toast";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      notify.error("Please fill all fields");
      return;
    }

    if (loading) return;
    setLoading(true);

    try {
      const res = await api.post("/users/login/", {
        username: email.trim(),
        password: password.trim(),
      });

      login(res.data.access, res.data.refresh);
      notify.success("Login successful");
      navigate("/");
    } catch {
      // handled by interceptor
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="text-center mb-3">
        <img
          src="/assets/img/logo/logo.png"
          alt="PetPal"
          className="auth-logo"
        />
        <h4 className="mt-0 fw-bold">Welcome Back</h4>
      </div>

      <form onSubmit={handleLogin}>
        <input
          type="text"
          className="form-control mb-3"
          placeholder="Email / Username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className="input-group mb-3">
          <input
            type={showPassword ? "text" : "password"}
            className="form-control"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="button"
            className="input-group-text"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            <i className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`} />
          </button>
        </div>

        <button
          className="btn auth-submit w-100 mt-2"
          type="submit"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <p className="text-center mt-3">
        New user? <Link to="/register">Register</Link>
      </p>
    </AuthLayout>
  );
}

export default Login;
