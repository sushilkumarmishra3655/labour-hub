import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Auth.css";
import { AuthContext } from "../context/AuthContext";
import { Phone, Lock, ArrowRight } from "lucide-react";
import Swal from "sweetalert2";

const Login = () => {
  const { login, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({ phone: "", password: "" });
  const [loading, setLoading] = useState(false);

  // Auto-redirect if already logged in
  useEffect(() => {
    if (user?.isLoggedIn) {
      const routes = { worker: "/worker-dashboard", employer: "/employer-dashboard", admin: "/admin-dashboard" };
      navigate(routes[user.role] || "/", { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (res.ok) {
        login(data); // Context update
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: data.message || "Invalid phone or password",
        });
      }
    } catch {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: "Server error. Try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    const { value: contact } = await Swal.fire({
      title: 'Forgot Password',
      input: 'text',
      inputLabel: 'Enter your registered Email or Phone',
      inputPlaceholder: 'email@example.com or 10-digit phone',
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) return 'You need to write something!'
      }
    });

    if (contact) {
      Swal.fire({ title: 'Sending OTP...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });

      try {
        const res = await fetch("http://localhost:5000/api/auth/forgot-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contact })
        });
        const data = await res.json();

        if (res.ok) {
          const { value: otp } = await Swal.fire({
            title: 'Verify OTP',
            input: 'text',
            inputLabel: 'Enter the 6-digit OTP sent to your contact',
            inputPlaceholder: 'xxxxxx',
            showCancelButton: true,
            inputValidator: (value) => {
              if (!value) return 'OTP is required'
            }
          });

          if (otp) {
            const verifyRes = await fetch("http://localhost:5000/api/auth/verify-otp", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ contact, otp })
            });

            if (verifyRes.ok) {
              const { value: newPassword } = await Swal.fire({
                title: 'Set New Password',
                input: 'password',
                inputLabel: 'Password',
                inputPlaceholder: 'Minimum 6 characters',
                showCancelButton: true,
                inputAttributes: { minlength: 6, autocapitalize: 'off', autocorrect: 'off' }
              });

              if (newPassword && newPassword.length >= 6) {
                const resetRes = await fetch("http://localhost:5000/api/auth/reset-password", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ contact, otp, newPassword })
                });

                if (resetRes.ok) {
                  Swal.fire({
                    icon: 'success',
                    title: 'Updated!',
                    text: 'Your password has been updated successfully!',
                  });
                } else {
                  const resetData = await resetRes.json();
                  Swal.fire('Error', resetData.message || 'Failed to update password', 'error');
                }
              } else if (newPassword) {
                Swal.fire('Error', 'Password must be at least 6 characters', 'error');
              }
            } else {
              Swal.fire('Error', 'Invalid or expired OTP', 'error');
            }
          }
        } else {
          Swal.fire('Error', data.message || 'Failed to send OTP', 'error');
        }
      } catch (err) {
        Swal.fire('Error', 'Something went wrong. Please try again.', 'error');
      }
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card narrow">
        <div className="auth-header">
          <h1>Welcome Back</h1>
          <p>Login to manage your profile and job listings.</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="form-group">
            <label>Phone Number</label>
            <div className="input-wrapper">
              <Phone size={18} />
              <input type="text" placeholder="Enter phone" onChange={e => setForm({ ...form, phone: e.target.value })} />
            </div>
          </div>

          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label>Password</label>
              <button type="button" onClick={handleForgotPassword} className="forgot-btn" style={{ background: 'none', border: 'none', color: '#3b82f6', fontSize: '0.85rem', cursor: 'pointer', padding: 0 }}>
                Forgot Password?
              </button>
            </div>
            <div className="input-wrapper">
              <Lock size={18} />
              <input type="password" placeholder="Enter password" onChange={e => setForm({ ...form, password: e.target.value })} />
            </div>
          </div>

          <button className="auth-btn-main" disabled={loading}>
            {loading ? "Verifying..." : "Login Account"}
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>

        <p className="auth-footer">New to Labour Hub? <Link to="/register">Register Free</Link></p>
      </div>
    </div>
  );
};

export default Login;