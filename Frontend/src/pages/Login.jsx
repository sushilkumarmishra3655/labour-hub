import React, { useState, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./Auth.css";
import { AuthContext } from "../context/AuthContext";
import { Phone, Lock } from "lucide-react";

const Login = () => {

  const { login } = useContext(AuthContext);

  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from;
  const redirectPath = from && from !== "/login" ? from : "/";

  const [form, setForm] = useState({
    phone: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const validate = () => {

    const e = {};

    if (!form.phone)
      e.phone = "Phone required";
    else if (!/^[0-9]{10}$/.test(form.phone))
      e.phone = "Enter valid number";

    if (!form.password)
      e.password = "Password required";

    setErrors(e);

    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {

    e.preventDefault();

    if (!validate()) return;

    const users =
      JSON.parse(localStorage.getItem("users")) || [];

    const foundUser = users.find(
      (u) =>
        u.phone === form.phone &&
        u.password === form.password
    );

    if (!foundUser) {
      alert("Invalid phone or password");
      return;
    }

    login(foundUser);

    alert("Login successful");

    navigate(redirectPath, { replace: true });
  };

  return (
    <div className="auth-page">
      <div className="auth-card large">

        <h2>Login</h2>
        <p className="auth-subtitle">
          Access your Labour Hub account
        </p>

        <form onSubmit={handleSubmit}>

          <div className="form-group">

            <label>Phone</label>

            <div className="input-box">
              <Phone className="input-icon" size={18} />

              <input
                type="text"
                value={form.phone}
                onChange={(e) =>
                  setForm({ ...form, phone: e.target.value })
                }
                placeholder="Enter phone"
              />
            </div>

            {errors.phone && <small>{errors.phone}</small>}
          </div>

          <div className="form-group">

            <label>Password</label>

            <div className="input-box">
              <Lock className="input-icon" size={18} />

              <input
                type="password"
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
              />
            </div>

            {errors.password && <small>{errors.password}</small>}
          </div>

          <button className="auth-btn">
            Login
          </button>

        </form>

        <p className="auth-switch">
          Don’t have an account? <Link to="/register">Register</Link>
        </p>

      </div>
    </div>
  );
};

export default Login;