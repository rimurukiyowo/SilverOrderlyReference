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
        const fetchedFiles: FileItem[] = data.files
          .map((file: any) => ({
            id: file.id,
            name: file.name,
            link: `https://drive.google.com/file/d/${file.id}/view`,
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
      {/* Animasi background */}
      <div style={styles.animatedBackground}></div>
      {/* Efek salju */}
      <SnowEffect />

      {/* Tambahkan CSS keyframes langsung */}
      <style>{`
        @keyframes gradientMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>

      {/* Konten utama */}
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

// Komponen efek salju
function SnowEffect() {
  const [flakes, setFlakes] = useState<
    { id: number; x: number; y: number; size: number; speed: number }[]
  >([]);

  useEffect(() => {
    const newFlakes = Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 4 + 2,
      speed: Math.random() * 1 + 0.5,
    }));
    setFlakes(newFlakes);

    const interval = setInterval(() => {
      setFlakes(prev =>
        prev.map(flake => {
          let y = flake.y + flake.speed;
          if (y > window.innerHeight) {
            y = -flake.size;
          }
          return { ...flake, y };
        })
      );
    }, 30);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
      zIndex: -1
    }}>
      {flakes.map(flake => (
        <div
          key={flake.id}
          style={{
            position: 'absolute',
            top: flake.y,
            left: flake.x,
            width: flake.size,
            height: flake.size,
            background: 'white',
            borderRadius: '50%',
            opacity: 0.8,
          }}
        ></div>
      ))}
    </div>
  );
}

// Styling
const styles: { [key: string]: React.CSSProperties } = {
  wrapper: {
    position: 'relative',
    minHeight: '100vh',
    overflow: 'hidden',
  },
  animatedBackground: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'linear-gradient(-45deg, #ff9a9e, #fad0c4, #fbc2eb, #a1c4fd)',
    backgroundSize: '400% 400%',
    animation: 'gradientMove 15s ease infinite',
    zIndex: -2,
  },
  container: {
    padding: '1rem',
    maxWidth: '800px',
    margin: 'auto',
    fontFamily: 'Arial, sans-serif',
    background: 'rgba(245, 245, 245, 0.85)',
    minHeight: '100vh',
    borderRadius: '8px',
    backdropFilter: 'blur(5px)',
  },
  title: {
    fontSize: '2rem',
    marginBottom: '0.5rem',
    color: '#4B0082',
    textAlign: 'center',
  },
  subtitle: {
    marginBottom: '1rem',
    textAlign: 'center',
  },
  inputContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    marginBottom: '1rem',
  },
  input: {
    padding: '0.5rem',
    fontSize: '1rem',
    border: '1px solid #ccc',
    borderRadius: '4px',
    width: '100%',
  },
  buttonPrimary: {
    padding: '0.5rem 1rem',
    fontSize: '1rem',
    background: '#4B0082',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  error: {
    color: 'red',
    marginBottom: '1rem',
    textAlign: 'center',
  },
  copyButtons: {
    marginBottom: '1rem',
    display: 'flex',
    gap: '0.5rem',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
  },
  copyButton: {
    padding: '0.5rem 1rem',
    background: '#8A2BE2',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  totalInfo: {
    marginTop: '0.5rem',
    display: 'flex',
    justifyContent: 'flex-end',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    background: '#fff',
    borderRadius: '8px',
  },
  th: {
    border: '1px solid #ccc',
    padding: '0.5rem',
    backgroundColor: '#eee',
    textAlign: 'left',
  },
  td: {
    border: '1px solid #ccc',
    padding: '0.5rem',
    wordBreak: 'break-word',
  },
  link: {
    color: '#1a0dab',
    textDecoration: 'underline',
    wordBreak: 'break-word',
  },
};
