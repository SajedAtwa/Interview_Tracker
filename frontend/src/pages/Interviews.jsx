import React, { useEffect, useMemo, useState } from "react";
import api from "../api.js";
import CsvImport from "../components/CsvImport.jsx";

function toDatetimeLocalValue(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
}

function toISOFromDatetimeLocal(value) {
  if (!value) return new Date().toISOString();
  return new Date(value + ":00").toISOString();
}

export default function Interviews() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Create form fields
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [interviewDate, setInterviewDate] = useState("");
  const [status, setStatus] = useState("Scheduled");
  const [notes, setNotes] = useState("");

  // Edit modal state
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editCompany, setEditCompany] = useState("");
  const [editRole, setEditRole] = useState("");
  const [editInterviewDate, setEditInterviewDate] = useState("");
  const [editStatus, setEditStatus] = useState("Scheduled");
  const [editNotes, setEditNotes] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(true);

  function collapseImport() {
    setIsImportOpen(false);
  }

  function toggleImport() {
    setIsImportOpen((v) => !v);
  }

  async function load() {
    setError("");
    setLoading(true);
    try {
      const res = await api.get("/api/interviews");
      setItems(Array.isArray(res.data) ? res.data : res.data?.items || []);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.response?.data ||
          err.message ||
          "Failed to load interviews"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function createInterview(e) {
    e.preventDefault();
    setError("");

    try {
      const payload = {
        company,
        role,
        interviewDate: toISOFromDatetimeLocal(interviewDate),
        status,
        notes,
      };

      await api.post("/api/interviews", payload);

      setInterviewDate("");
      setNotes("");
      await load();
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.response?.data ||
          err.message ||
          "Failed to create interview"
      );
    }
  }

  function openEditModal(it) {
    setError("");
    setEditingId(it.id);
    setEditCompany(it.company || "");
    setEditRole(it.role || "");
    setEditInterviewDate(toDatetimeLocalValue(it.interviewDate));
    setEditStatus(it.status || "Scheduled");
    setEditNotes(it.notes || "");
    setIsEditOpen(true);
  }

  function closeEditModal() {
    setIsEditOpen(false);
    setEditingId(null);
    setEditCompany("");
    setEditRole("");
    setEditInterviewDate("");
    setEditStatus("Scheduled");
    setEditNotes("");
    setSavingEdit(false);
  }

  async function saveEdit() {
    if (!editingId) return;
    setError("");
    setSavingEdit(true);

    try {
      const payload = {
        company: editCompany,
        role: editRole,
        interviewDate: toISOFromDatetimeLocal(editInterviewDate),
        status: editStatus,
        notes: editNotes,
      };

      await api.put(`/api/interviews/${editingId}`, payload);
      closeEditModal();
      await load();
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.response?.data ||
          err.message ||
          "Failed to update interview"
      );
    } finally {
      setSavingEdit(false);
    }
  }

  async function deleteInterview(id) {
    setError("");
    try {
      await api.delete(`/api/interviews/${id}`);
      await load();
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.response?.data ||
          err.message ||
          "Failed to delete interview"
      );
    }
  }

  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => {
      const da = a?.interviewDate ? new Date(a.interviewDate).getTime() : 0;
      const db = b?.interviewDate ? new Date(b.interviewDate).getTime() : 0;
      return db - da;
    });
  }, [items]);

  return (
    <div style={{ display: "grid", gap: 14 }}>
      <div className="sectionTitleRow">
        <div>
          <h3 style={{ margin: 0 }}>Interviews</h3>
          <div className="muted" style={{ marginTop: 4 }}>
            Add, view, and manage your interview pipeline.
          </div>
        </div>

        <button
          className="btn"
          type="button"
          onClick={() => {
            collapseImport();
            load();
          }}
          disabled={loading}
        >
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {error && <div className="alert alertError">{String(error)}</div>}

      {/* IMPORT (added) */}
      <div className="panel">
        <div className="panelHeader" style={{ cursor: "pointer" }} onClick={toggleImport}>
          <div style={{ fontWeight: 800, display: "flex", alignItems: "center", gap: 10 }}>
            Import CSV
            <span style={{ fontSize: 12, opacity: 0.7 }}>
              {isImportOpen ? "▲" : "▼"}
            </span>
          </div>

          <div
            style={{
              fontSize: 13,
              fontWeight: 500,
              color: "#555",
              textAlign: "right",
            }}
          >
            Upload a CSV and map columns to bulk add interviews.
          </div>
        </div>

        {isImportOpen && (
          <div style={{ paddingTop: 8 }}>
            {/* IMPORTANT: this needs CsvImport to call onImported() */}
            <CsvImport
              onImported={() => {
                collapseImport(); // collapse after successful import
                load(); // refresh list
              }}
            />
          </div>
        )}
      </div>  

      {/* CREATE (keep your layout the same) */}
      <div className="panel">
        <div className="panelHeader">
          <div style={{ fontWeight: 800 }}>Add Interview</div>
          <div className="muted" style={{ fontSize: 12 }} />
        </div>

        <form onSubmit={createInterview} className="formGrid">
          <div className="twoCol">
            <label className="field">
              <span className="labelText">Company</span>
              <input
                className="input"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g. Google"
              />
            </label>

            <label className="field">
              <span className="labelText">Role</span>
              <input
                className="input"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. Software Engineer"
              />
            </label>
          </div>

          <div className="twoCol">
            <label className="field">
              <span className="labelText">Interview Date/Time</span>
              <input
                className="input"
                type="datetime-local"
                value={interviewDate}
                onChange={(e) => setInterviewDate(e.target.value)}
              />
            </label>

            <label className="field">
              <span className="labelText">Status</span>
              <select
                className="input selectFix"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option>Scheduled</option>
                <option>Completed</option>
                <option>Rejected</option>
                <option>Offer</option>
              </select>
            </label>
          </div>

          <label className="field">
            <span className="labelText">Notes</span>
            <textarea
              className="input"
              style={{ minHeight: 90, resize: "vertical" }}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Prep topics, recruiter notes, links, etc."
            />
          </label>

          <div className="actionsRow">
            <button className="btn btnPrimary" type="submit">
              Add Interview
            </button>
            <div />
          </div>
        </form>
      </div>

      {/* LIST (keep your layout the same) */}
      <div className="panel">
        <div className="panelHeader">
          <div style={{ fontWeight: 800 }}>Your saved interviews</div>
          <div className="muted" style={{ fontSize: 12 }}>
            {loading ? "Loading…" : `${sortedItems.length} total`}
          </div>
        </div>

        {!loading && sortedItems.length === 0 && (
          <div className="emptyState">No interviews yet. Add your first one above.</div>
        )}

        <div className="cardsGrid">
          {sortedItems.map((it) => (
            <div key={it.id} className="cardItem">
              <div className="cardTop">
                <div style={{ display: "grid", gap: 4 }}>
                  <div style={{ fontWeight: 900, fontSize: 20 }}>{it.company || "—"}</div>
                  <div className="muted">{it.role || "—"}</div>
                </div>

                <span className={`pill pill-${(it.status || "").toLowerCase()}`}>
                  {it.status || "—"}
                </span>
              </div>

              <div className="metaRow">
                <span className="muted">Date</span>
                <span style={{ fontWeight: 700 }}>
                  {it.interviewDate ? new Date(it.interviewDate).toLocaleString() : "—"}
                </span>
              </div>

              {it.notes && <div className="notesBox">{it.notes}</div>}

              <div className="cardActions">
                <button className="btn btnOutline" onClick={() => openEditModal(it)}>
                  Edit
                </button>
                <button className="btn btnDanger" onClick={() => deleteInterview(it.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* EDIT MODAL */}
      {isEditOpen && (
        <div className="modalOverlay" onMouseDown={closeEditModal}>
          <div
            className="modalCard"
            role="dialog"
            aria-modal="true"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="modalHeader">
              <div>
                <div style={{ fontWeight: 900, fontSize: 18 }}>Edit Interview</div>
                <div className="muted" style={{ marginTop: 2, fontSize: 12 }}>
                  Update details and save changes
                </div>
              </div>

              <button className="btn modalCloseBtn" onClick={closeEditModal} type="button">
                ✕
              </button>
            </div>

            <div className="modalBody">
              <div className="twoCol">
                <label className="field">
                  <span className="labelText">Company</span>
                  <input
                    className="input"
                    value={editCompany}
                    onChange={(e) => setEditCompany(e.target.value)}
                  />
                </label>

                <label className="field">
                  <span className="labelText">Role</span>
                  <input
                    className="input"
                    value={editRole}
                    onChange={(e) => setEditRole(e.target.value)}
                  />
                </label>
              </div>

              <div className="twoCol">
                <label className="field">
                  <span className="labelText">Interview Date/Time</span>
                  <input
                    className="input"
                    type="datetime-local"
                    value={editInterviewDate}
                    onChange={(e) => setEditInterviewDate(e.target.value)}
                  />
                </label>

                <label className="field">
                  <span className="labelText">Status</span>
                  <select
                    className="input selectFix"
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                  >
                    <option>Scheduled</option>
                    <option>Completed</option>
                    <option>Rejected</option>
                    <option>Offer</option>
                  </select>
                </label>
              </div>

              <label className="field">
                <span className="labelText">Notes</span>
                <textarea
                  className="input"
                  style={{ minHeight: 90, resize: "vertical" }}
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                />
              </label>
            </div>

            <div className="modalFooter">
              <button
                className="btn btnPrimary"
                onClick={saveEdit}
                disabled={savingEdit}
                type="button"
              >
                {savingEdit ? "Saving…" : "Save"}
              </button>

              <button
                className="btn btnOutline"
                onClick={closeEditModal}
                disabled={savingEdit}
                type="button"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}