import React, { useState, useEffect, useRef } from "react";

function Icon({ children, className }) {
  return (
    <span className={"nav-icon " + (className || "")} aria-hidden>
      {children}
    </span>
  );
}

function Navbar({ onLogout }) {
  const name = localStorage.getItem("name") || "User";
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const onDocClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  return (
    <header className="navbar navbar--professional">
      <div className="navbar__inner">
        <div className="navbar__left">
          <div className="logo">
            <div className="logo-mark" aria-hidden>LC</div>
            <div className="logo-text">LinkedIn Clone</div>
          </div>
        </div>

        <div className="navbar__center">
          <div className="nav-search">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16zm8.707 2.293-4.387-4.387" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <input type="search" placeholder="Search" aria-label="Search" />
          </div>
        </div>

        <div className="navbar__right">
          <nav className="nav-links" aria-label="Main navigation">
            <button className="nav-link always-show"><Icon>🏠</Icon><span className="nav-label">Home</span></button>
            <button className="nav-link hide-mobile"><Icon>👥</Icon><span className="nav-label">My Network</span></button>
            <button className="nav-link always-show"><Icon>💼</Icon><span className="nav-label">Jobs</span></button>
            <button className="nav-link hide-mobile"><Icon>💬</Icon><span className="nav-label">Messaging</span></button>
            <button className="nav-link always-show"><Icon>🔔</Icon><span className="nav-label">Notifications</span></button>
          </nav>

          <div className="nav-profile" ref={dropdownRef}>
            <button className="profile-button" onClick={() => setOpen((v) => !v)} aria-haspopup="true" aria-expanded={open}>
              <span className="avatar" aria-hidden>{(name || "U").charAt(0).toUpperCase()}</span>
              <span className="profile-name">{name}</span>
              <span className="chev">▾</span>
            </button>

            {open && (
              <div className="profile-dropdown" role="menu">
                <button className="dropdown-item" onClick={() => { setOpen(false); /* navigate to profile */ }}>
                  View profile
                </button>
                <button className="dropdown-item" onClick={() => { setOpen(false); /* navigate to settings */ }}>
                  Settings & Privacy
                </button>
                <div className="dropdown-divider" />
                <button className="dropdown-item" onClick={() => { setOpen(false); onLogout && onLogout(); }}>
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
