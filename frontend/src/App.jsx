import React, { useEffect, useState } from "react";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Interviews from "./pages/Interviews.jsx";
import { clearToken, isAuthed } from "./auth.js";

export default function App() {
  const [route, setRoute] = useState("login"); // "login" | "register" | "interviews"
  const [authed, setAuthed] = useState(isAuthed());

  const isAuthView = !authed && (route === "login" || route === "register");

  useEffect(() => {
    if (authed) setRoute("interviews");
  }, [authed]);

  function logout() {
    clearToken();
    setAuthed(false);
    setRoute("login");
  }

  return (
    <div className="page">
      <div className={`container ${isAuthView ? "containerNarrow" : ""}`}>
        <div className={`shell ${isAuthView ? "shellNarrow" : ""}`}>
          <div className="topbar">
            <div className="brand">
              <div className="logo" />
              <div>
                <div style={{ fontSize: 16, fontWeight: 800 }}>Interview Tracker</div>
                <div className="muted" style={{ fontSize: 12 }}>
                  Track applications • stay organized
                </div>
              </div>
            </div>

            <div className="nav">
              {!authed && (
                <>
                  <button
                    onClick={() => setRoute("login")}
                    className={`btn ${route === "login" ? "btnPrimary" : ""}`}
                  >
                    Login
                  </button>
                  <button
                    onClick={() => setRoute("register")}
                    className={`btn ${route === "register" ? "btnPrimary" : ""}`}
                  >
                    Register
                  </button>
                </>
              )}

              {authed && (
                <button onClick={logout} className="btn">
                  Logout
                </button>
              )}
            </div>
          </div>

          <div className={`content ${isAuthView ? "authContent" : ""}`}>
            {route === "login" && !authed && (
              <div className="authCard">
                <Login onAuthed={() => setAuthed(true)} />
              </div>
            )}

            {route === "register" && !authed && (
              <div className="authCard">
                <Register onGoLogin={() => setRoute("login")} />
              </div>
            )}

            {route === "interviews" && authed && <Interviews />}
          </div>
        </div>
      </div>
    </div>
  );
}