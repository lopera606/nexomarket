'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div style={{ padding: '2rem', fontFamily: 'sans-serif', background: '#0f172a', color: 'white', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Algo salió mal</h2>
            <p style={{ color: '#94a3b8', marginBottom: '1.5rem' }}>{error.message}</p>
            <button onClick={() => reset()} style={{ padding: '0.75rem 1.5rem', background: '#7c3aed', color: 'white', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', fontSize: '1rem' }}>
              Intentar de nuevo
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
