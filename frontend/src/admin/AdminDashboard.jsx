import { useState } from "react";
import { BookOpen, FolderKanban, Inbox, Users } from "lucide-react";
import Messages from "./Messages";
import RecordsManager from "./RecordsManager";
import UsersPanel from "./UsersPanel";

const tabs = [
  { id: "messages", label: "Messages", icon: Inbox },
  { id: "projects", label: "Projects", icon: FolderKanban },
  { id: "qualifications", label: "Qualifications", icon: BookOpen },
  { id: "users", label: "Users", icon: Users },
];

export default function AdminDashboard() {
  const [active, setActive] = useState("messages");

  function handleKeyDown(event) {
    const index = tabs.findIndex(tab => tab.id === active);
    let next = null;
    if (event.key === "ArrowRight") next = (index + 1) % tabs.length;
    if (event.key === "ArrowLeft") next = (index - 1 + tabs.length) % tabs.length;
    if (next === null) return;
    event.preventDefault();
    setActive(tabs[next].id);
    document.getElementById(`tab-${tabs[next].id}`)?.focus();
  }

  return (
    <section className="page">
      <div className="page-heading">
        <p className="eyebrow">ADMIN</p>
        <h1>Dashboard</h1>
        <p className="lead">Read contact messages and manage your portfolio content and users.</p>
      </div>

      <div className="tabs" role="tablist" aria-label="Admin sections" onKeyDown={handleKeyDown}>
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            id={`tab-${id}`}
            type="button"
            role="tab"
            className="tab"
            aria-selected={active === id}
            aria-controls={`panel-${id}`}
            tabIndex={active === id ? 0 : -1}
            onClick={() => setActive(id)}
          >
            <Icon size={16} aria-hidden="true" /> {label}
          </button>
        ))}
      </div>

      <div id={`panel-${active}`} role="tabpanel" aria-labelledby={`tab-${active}`} className="tab-panel">
        {active === "messages" && <Messages />}
        {active === "projects" && <RecordsManager resource="projects" singular="project" />}
        {active === "qualifications" && <RecordsManager resource="qualifications" singular="qualification" />}
        {active === "users" && <UsersPanel />}
      </div>
    </section>
  );
}
