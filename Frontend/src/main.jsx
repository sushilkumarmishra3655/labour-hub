
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import JobProvider from "./context/JobContext";
import AuthProvider from "./context/AuthContext.jsx";
import ApplicationProvider from "./context/ApplicationContext";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthProvider>
      <JobProvider>
        <ApplicationProvider>
          <App />
        </ApplicationProvider>
      </JobProvider>
    </AuthProvider>
  </BrowserRouter>

);

