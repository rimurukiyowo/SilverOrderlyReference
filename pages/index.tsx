'use client';

import React, { useState, useEffect } from "react";

type FileItem = {
  id: string;
  name: string;
  link: string;
}; 

export default function Home() {
  const [folderInput, setFolderInput] = useState("");
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const apiKey = "AIzaSyD71nWVbtMxWK4T05Ty4qMuIRTP4ij2i48";

  const extractFolderId = (input: string) => {
    const match = input.match(/[-\w]{25,}/);
    return match ? match[0] : "";
  };

  const fetchFiles = async () => {
    const folderId = extractFolderId(folderInput);
    if (!folderId) {
      alert("Masukkan link atau ID folder Google Drive yang valid.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        `https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents&key=${apiKey}&fields=files(id,name)`
      );

      const data = await res.json();

      if (data.error) {
        setError(data.error.message);
        setFiles([]);
      } else {
        const fetchedFiles = data.files.map((file: any) => ({
          id: file.id,
          name: file.name,
          link: `https://drive.google.com/file/d/${file.id}/view`,
        }));
        setFiles(fetchedFiles);
      }
    } catch (e) {
      setError("Terjadi kesalahan saat mengambil data.");
      setFiles([]);
    }
    setLoading(false);
  };

  const copyAllNames = () => {
    const allNames = files.map((file) => file.name).join("\n");
    navigator.clipboard
      .writeText(allNames)
      .then(() => alert("Semua nama berhasil disalin!"))
      .catch(() => alert("Gagal menyalin."));
  };

  const copyAllLinks = () => {
    const allLinks = files.map((file) => file.link).join("\n");
    navigator.clipboard
      .writeText(allLinks)
      .then(() => alert("Semua link berhasil disalin!"))
      .catch(() => alert("Gagal menyalin."));
  };

  const copyAllNamesAndLinks = () => {
    const all = files.map((file) => `${file.name} ${file.link}`).join("\n");
    navigator.clipboard
      .writeText(all)
      .then(() => alert("Semua nama dan link berhasil disalin!"))
      .catch(() => alert("Gagal menyalin."));
  };

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/service-worker.js')
          .then(reg => console.log('Service Worker registered:', reg))
          .catch(err => console.error('Service Worker registration failed:', err));
      });
    }
  }, []);

  return (
    <div
      style={{
        padding: "1rem",
        maxWidth: "800px",
        margin: "auto",
        fontFamily: "Arial, sans-serif",
        background: "#f5f5f5",
        minHeight: "100vh"
      }}
    >
      <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem", color: "#4B0082", textAlign: "center" }}>
        WinterLinkFindU
      </h1>
      <p style={{ marginBottom: "1rem", textAlign: "center" }}>
        winter uhuyyy!! 💖💖💖
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="Paste Link atau ID Folder Google Drive"
          value={folderInput}
          onChange={(e) => setFolderInput(e.target.value)}
          style={{
            padding: "0.5rem",
            fontSize: "1rem",
            border: "1px solid #ccc",
            borderRadius: "4px",
            width: "100%",
          }}
        />
        <button
          onClick={fetchFiles}
          disabled={loading}
          style={{
            padding: "0.5rem 1rem",
            fontSize: "1rem",
            background: "#4B0082",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          {loading ? "Memuat..." : "Tampilkan File"}
        </button>
      </div>

      {error && (
        <div style={{ color: "red", marginBottom: "1rem", textAlign: "center" }}>{error}</div>
      )}

      {files.length > 0 && (
        <>
          <div style={{ marginBottom: "1rem", textAlign: "right", display: "flex", gap: "0.5rem", flexWrap: "wrap", justifyContent: "flex-end" }}>
            <button
              onClick={copyAllNames}
              style={{
                padding: "0.5rem 1rem",
                background: "#8A2BE2", // ungu 1
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer"
              }}
            >
              Copy Nama🧡
            </button>
            <button
              onClick={copyAllNamesAndLinks}
              style={{
                padding: "0.5rem 1rem",
                background: "#9932CC", // ungu 2
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer"
              }}
            >
              Copy Semua❤
            </button>
            <button
              onClick={copyAllLinks}
              style={{
                padding: "0.5rem 1rem",
                background: "#BA55D3", // ungu 3
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer"
              }}
            >
              Copy Link💜
            </button>
          </div>

           <div style={{ marginTop: "0.5rem" }}><strong>Total File: {files.length}</strong></div>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                background: "#fff",
                borderRadius: "8px",
              }}
            >
              <thead>
                <tr>
                  <th style={thStyle}>No</th>
                  <th style={thStyle}>Nama File</th>
                  <th style={thStyle}>Link File</th>
                </tr>
              </thead>
              <tbody>
                {files.map((file, index) => (
                  <tr key={file.id}>
                    <td style={tdStyle}>{index + 1}</td>
                    <td style={tdStyle}>{file.name}</td>
                    <td style={tdStyle}>
                      <a
                        href={file.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: "#1a0dab", textDecoration: "underline", wordBreak: "break-word" }}
                      >
                        {file.link}
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

const thStyle = {
  border: "1px solid #ccc",
  padding: "0.5rem",
  backgroundColor: "#eee",
  textAlign: "left" as const,
};

const tdStyle = {
  border: "1px solid #ccc",
  padding: "0.5rem",
  wordWrap: "break-word" as const,
};
