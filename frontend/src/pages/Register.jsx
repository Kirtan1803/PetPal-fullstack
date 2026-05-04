import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import AuthLayout from "../components/AuthLayout";
import { notify } from "../utils/toast";

function Register() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    const username = form.username.trim();
    const email = form.email.trim();
    const password = form.password.trim();

    if (!username || !email || !password) {
      notify.error("Please fill all fields");
      return;
    }

    if (!email.includes("@")) {
      notify.error("Enter a valid email");
      return;
    }

    if (loading) return;
    setLoading(true);

    try {
      await api.post("/users/register/", {
        username,
        email,
        password,
      });

      notify.success("Registered successfully!");
      navigate("/login");
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
        <h4 className="mt-0 fw-bold">Create Account</h4>
      </div>

      <form onSubmit={handleRegister}>
        <input
          type="text"
          className="form-control mb-3"
          placeholder="Username"
          value={form.username}
          onChange={(e) =>
            setForm({ ...form, username: e.target.value })
          }
        />

        <input
          type="email"
          className="form-control mb-3"
          placeholder="Email"
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <div className="input-group mb-3">
          <input
            type={showPassword ? "text" : "password"}
            className="form-control"
            placeholder="Password"
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
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
          type="submit"
          disabled={loading}
          className="btn auth-submit w-100 mt-2"
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>

      <p className="text-center mt-3">
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </AuthLayout>
  );
}

export default Register;
