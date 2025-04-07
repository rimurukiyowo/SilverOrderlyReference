'use client';

import React, { useState } from "react";

type FileItem = {
  id: string;
  name: string;
  link: string;
};

export default function Home() {
  const [folderId, setFolderId] = useState("");
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Ganti dengan API key kamu
  const apiKey = "AIzaSyD71nWVbtMxWK4T05Ty4qMuIRTP4ij2i48";

  const fetchFiles = async () => {
    if (!folderId) {
      alert("Masukkan Folder ID.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        `https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents&key=${apiKey}&fields=files(id,name)`
      );
      
      const data = await res.json();

      // Periksa apakah ada error pada respons API
      if (data.error) {
        setError(data.error.message);
        setFiles([]);
      } else {
        // Jika tidak ada error, ambil file dari respons
        const fetchedFiles = data.files.map((file: any) => ({
          id: file.id,
          name: file.name,
          link: `https://drive.google.com/file/d/${file.id}/view`,
        }));
        setFiles(fetchedFiles);
      }
    } catch (e) {
      // Menangani kesalahan saat mengambil data
      setError("Terjadi kesalahan saat mengambil data.");
      setFiles([]);
    }
    setLoading(false);
  };

  const copyAllLinks = () => {
    const allLinks = files.map((file) => file.link).join("\n");
    navigator.clipboard
      .writeText(allLinks)
      .then(() => alert("Semua link berhasil disalin!"))
      .catch(() => alert("Gagal menyalin link."));
  };

  return (
    <div
      style={{
        padding: "2rem",
        maxWidth: "800px",
        margin: "auto",
        textAlign: "center",
        fontFamily: "Arial, sans-serif",
        background: "#f5f5f5",
      }}
    >
      <h1 style={{ fontSize: "2.5rem", marginBottom: "1rem", color: "#4B0082" }}>
        WinterLinkFindU
      </h1>
      <div style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="Masukkan Folder ID Google Drive"
          value={folderId}
          onChange={(e) => setFolderId(e.target.value)}
          style={{
            padding: "0.5rem",
            width: "100%",
            maxWidth: "500px",
            fontSize: "1rem",
            border: "1px solid #ccc",
            borderRadius: "4px 0 0 4px",
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
            borderRadius: "0 4px 4px 0",
            cursor: "pointer",
          }}
        >
          {loading ? "Memuat..." : "Tampilkan File"}
        </button>
      </div>
      {error && (
        <div style={{ color: "red", marginBottom: "1rem" }}>{error}</div>
      )}
      {files.length > 0 && (
        <>
          <div style={{ marginBottom: "1rem", textAlign: "right" }}>
            <button
              onClick={copyAllLinks}
              style={{
                padding: "0.5rem 1rem",
                background: "#008000",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Copy Semua Link
            </button>
          </div>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginBottom: "1rem",
            }}
          >
            <thead>
              <tr>
                <th style={{ border: "1px solid #ccc", padding: "0.5rem" }}>
                  No
                </th>
                <th style={{ border: "1px solid #ccc", padding: "0.5rem" }}>
                  Nama File
                </th>
                <th style={{ border: "1px solid #ccc", padding: "0.5rem" }}>
                  Link File
                </th>
              </tr>
            </thead>
            <tbody>
              {files.map((file, index) => (
                <tr key={file.id}>
                  <td
                    style={{
                      border: "1px solid #ccc",
                      padding: "0.5rem",
                      textAlign: "center",
                    }}
                  >
                    {index + 1}
                  </td>
                  <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>
                    {file.name}
                  </td>
                  <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>
                    <a
                      href={file.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "#1a0dab", textDecoration: "underline" }}
                    >
                      {file.link}
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ textAlign: "right" }}>
            <strong>Total File: {files.length}</strong>
          </div>
        </>
      )}
    </div>
  );
}