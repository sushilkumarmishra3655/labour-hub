import React, { createContext, useState, useEffect } from "react";

export const ApplicationContext = createContext();

const ApplicationProvider = ({ children }) => {
  const [applications, setApplications] = useState(() => {
    const saved = localStorage.getItem("applications");
    return saved ? JSON.parse(saved) : [];
  });

  const addApplication = (application) => {
    setApplications((prev) => [...prev, application]);
  };

  const updateStatus = (id, status) => {
    setApplications((prev) =>
      prev.map((app) =>
        app.id === id ? { ...app, status } : app
      )
    );
  };

  // ✅ NEW: Delete Application
  const deleteApplication = (id) => {
    const confirmDelete = window.confirm("Delete this application?");
    if (confirmDelete) {
      setApplications((prev) =>
        prev.filter((app) => app.id !== id)
      );
    }
  };

  useEffect(() => {
    localStorage.setItem("applications", JSON.stringify(applications));
  }, [applications]);

  return (
    <ApplicationContext.Provider
      value={{ applications, addApplication, updateStatus, deleteApplication }}
    >
      {children}
    </ApplicationContext.Provider>
  );
};

export default ApplicationProvider;

