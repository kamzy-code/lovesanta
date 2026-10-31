"use client";

// Rendered when the root layout itself fails, so it can't rely on Chakra's provider
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  console.error(error);

  return (
    <html lang="en" translate="no">
      <body
        style={{
          margin: 0,
          minHeight: "100dvh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
          padding: 16,
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: 360 }}>
          <h2>Something went wrong</h2>
          <p style={{ color: "#666" }}>Please try again.</p>
          <button
            onClick={() => reset()}
            style={{
              width: "100%",
              padding: "14px 16px",
              fontSize: 16,
              borderRadius: 12,
              border: "none",
              background: "#111",
              color: "#fff",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
