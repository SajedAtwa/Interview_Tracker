import { useState } from "react";
import Papa from "papaparse";
import api from "../api";
import { getToken } from "../auth";

function normalizeHeader(h) {
  return (h || "").toLowerCase().trim();
}

function toIsoInstant(value) {
  // value might be empty, a date, or date+time
  if (!value) return null;

  // Try Date parsing in browser (works for many CSV formats)
  const d = new Date(value);
  if (isNaN(d.getTime())) return null;

  return d.toISOString(); // backend expects Instant.parse(...)
}

export default function CsvImport({ onImported }) {
  const [headers, setHeaders] = useState([]);
  const [rows, setRows] = useState([]);
  const [mapping, setMapping] = useState({
    company: "",
    role: "",
    interviewDate: "",
    status: "",
    notes: "",
  });

  const handleFile = (file) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const data = results.data || [];
        const cols = results.meta?.fields || [];

        setHeaders(cols);
        setRows(data);

        // attempt auto-map for common tracker headers
        const guess = {};
        for (const h of cols) {
          const nh = normalizeHeader(h);
          if (!guess.company && nh.includes("company")) guess.company = h;
          if (
            !guess.role &&
            (nh.includes("job title") || nh.includes("title") || nh.includes("role"))
          )
            guess.role = h;
          if (!guess.interviewDate && nh.includes("interview")) guess.interviewDate = h;
          if (
            !guess.status &&
            (nh.includes("status") || nh.includes("application status"))
          )
            guess.status = h;
          if (!guess.notes && nh.includes("notes")) guess.notes = h;
        }

        setMapping((m) => ({ ...m, ...guess }));
      },
    });
  };

  const doImport = async () => {
    // convert raw csv rows -> normalized DTO rows
    const payload = rows.map((r) => ({
      company: mapping.company ? r[mapping.company] : "",
      role: mapping.role ? r[mapping.role] : "",
      interviewDate: mapping.interviewDate
        ? toIsoInstant(r[mapping.interviewDate])
        : null,
      status: mapping.status ? r[mapping.status] : "",
      notes: mapping.notes ? r[mapping.notes] : "",
    }));

    // OPTIONAL: filter out fully empty
    const cleaned = payload.filter(
      (p) =>
        (p.company || "").trim() || (p.role || "").trim() || (p.notes || "").trim()
    );

    await api.post("/api/interviews/import", cleaned, {
    headers: { Authorization: `Bearer ${getToken()}` },
    });

    alert(`Imported ${cleaned.length} rows`);
    if (onImported) onImported();

    alert(`Imported ${cleaned.length} rows`);

    if (typeof onImported === "function") {
      await onImported();
    }
  };

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <label className="field">
        <span className="labelText">Import CSV</span>

        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <label className="btn btnPrimary" style={{ cursor: "pointer" }}>
            Choose File
            <input
                type="file"
                accept=".csv,text/csv"
                style={{ display: "none" }}
                onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            />
            </label>

            <span style={{ fontSize: 14, color: "#555" }}>
            {rows.length > 0 ? `${rows.length} rows loaded` : "No file chosen"}
            </span>
        </div>
        </label>

      {headers.length > 0 && (
        <>
          <div style={{ display: "grid", gap: 10 }}>
            <div style={{ fontWeight: 800 }}>Map columns</div>

            {["company", "role", "interviewDate", "status", "notes"].map((field) => (
              <label key={field} className="field">
                <span className="labelText">{field}</span>
                <select
                  className="input"
                  value={mapping[field]}
                  onChange={(e) =>
                    setMapping((m) => ({ ...m, [field]: e.target.value }))
                  }
                >
                  <option value="">(ignore)</option>
                  {headers.map((h) => (
                    <option key={h} value={h}>
                      {h}
                    </option>
                  ))}
                </select>
              </label>
            ))}
          </div>

          <div className="actionsRow">
            <button className="btn btnPrimary" type="button" onClick={doImport}>
                Import
            </button>
            <div />
            </div>
        </>
      )}
    </div>
  );
}