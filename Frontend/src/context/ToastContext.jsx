import { createContext, useContext, useState, useCallback, useRef } from "react";
import "../component/Toast.css";

const ToastContext = createContext(null);

export const useToast = () => useContext(ToastContext);

let _id = 0;

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, exiting: true } : t)));
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 350);
  }, []);

  const showToast = useCallback(
    ({ message, type = "success", duration = 3500 }) => {
      const id = ++_id;
      setToasts((prev) => [...prev, { id, message, type, exiting: false }]);
      setTimeout(() => removeToast(id), duration);
    },
    [removeToast]
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="toast-container" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className={`toast toast-${t.type} ${t.exiting ? "toast-exit" : "toast-enter"}`}>
            <span className="toast-icon">
              {t.type === "success" && "✅"}
              {t.type === "error" && "❌"}
              {t.type === "info" && "ℹ️"}
              {t.type === "warning" && "⚠️"}
            </span>
            <span className="toast-message">{t.message}</span>
            <button className="toast-close" onClick={() => removeToast(t.id)}>×</button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
