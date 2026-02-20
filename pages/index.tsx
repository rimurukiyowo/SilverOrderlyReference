'use client';

import React, { useState, useEffect } from 'react';

type FileItem = {
  id: string;
  name: string;
  link: string;
};

export default function Home() {
  const [folderInput, setFolderInput] = useState('');
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const apiKey = 'AIzaSyD71nWVbtMxWK4T05Ty4qMuIRTP4ij2i48';

  // ✅ USER TAG (TIDAK TERLIHAT DI UI)
 const getUserTag = () => {
  if (typeof window === "undefined") return "server";

  let tag = localStorage.getItem("winter_tag");
  if (!tag) {
    tag = "flowers_" + Math.random().toString(36).substring(2, 8);
    localStorage.setItem("winter_tag", tag);
  }
  return tag;
};

  const extractFolderId = (input: string) => {
    const match = input.match(/[-\w]{25,}/);
    return match ? match[0] : '';
  };

  const naturalSort = (a: string, b: string) => {
    return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
  };

  const fetchFiles = async () => {
    const folderId = extractFolderId(folderInput);
    if (!folderId) {
      setError('Masukkan link atau ID folder Google Drive yang valid.');
      setFiles([]);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(
        `https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents&orderBy=name&key=${apiKey}&fields=files(id,name)`
      );
      const data = await response.json();

      if (data.error) {
        setError(data.error.message);
        setFiles([]);
      } else {
        const userTag = getUserTag(); // ambil sekali

        const fetchedFiles: FileItem[] = data.files
          .map((file: any) => ({
            id: file.id,
            name: file.name,
            // ✅ LINK SUDAH ADA TANDA FLOWERS
            link: `https://drive.google.com/file/d/${file.id}/view?ref=${userTag}`,
          }))
          .sort((a, b) => naturalSort(a.name, b.name));

        setFiles(fetchedFiles);
      }
    } catch {
      setError('Terjadi kesalahan saat mengambil data.');
      setFiles([]);
    }

    setLoading(false);
  };

  const copyToClipboard = (content: string, message: string) => {
    navigator.clipboard
      .writeText(content)
      .then(() => alert(message))
      .catch(() => alert('Gagal menyalin.'));
  };

  const copyAllNames = () => {
    const names = files.map(file => file.name).join('\n');
    copyToClipboard(names, 'Semua nama berhasil disalin!');
  };

  const copyAllLinks = () => {
    const links = files.map(file => file.link).join('\n');
    copyToClipboard(links, 'Semua link berhasil disalin!');
  };

  const copyAllNamesAndLinks = () => {
    const combined = files.map(file => `${file.name} ${file.link}`).join('\n');
    copyToClipboard(combined, 'Semua nama dan link berhasil disalin!');
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
    <div style={styles.wrapper}>
      <div style={styles.animatedBackground}></div>
      <SnowEffect />

      <style>{`
        @keyframes gradientMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>

      <div style={styles.container}>
        <h1 style={styles.title}>WinterLinkFindU</h1>
        <p style={styles.subtitle}>winter uhuyyy!! 💖💖💖</p>

        <div style={styles.inputContainer}>
          <input
            type="text"
            placeholder="Paste Link atau ID Folder Google Drive"
            value={folderInput}
            onChange={(e) => setFolderInput(e.target.value)}
            style={styles.input}
          />
          <button onClick={fetchFiles} disabled={loading} style={styles.buttonPrimary}>
            {loading ? 'Memuat...' : 'Tampilkan File'}
          </button>
        </div>

        {error && <div style={styles.error}>{error}</div>}

        {files.length > 0 && (
          <>
            <div style={styles.copyButtons}>
              <button onClick={copyAllNames} style={styles.copyButton}>Copy Nama</button>
              <button onClick={copyAllNamesAndLinks} style={styles.copyButton}>Copy Semua</button>
              <button onClick={copyAllLinks} style={styles.copyButton}>Copy Link</button>
            </div>

            <div style={styles.totalInfo}>
              <strong>Total File: {files.length}</strong>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>No</th>
                    <th style={styles.th}>Nama File</th>
                    <th style={styles.th}>Link File</th>
                  </tr>
                </thead>
                <tbody>
                  {files.map((file, index) => (
                    <tr key={file.id}>
                      <td style={styles.td}>{index + 1}</td>
                      <td style={styles.td}>{file.name}</td>
                      <td style={styles.td}>
                        <a
                          href={file.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={styles.link}
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
    </div>
  );
}
