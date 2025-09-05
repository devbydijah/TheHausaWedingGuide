import React, { useEffect, useState } from "react";

export default function Success() {
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState(null);
  const [password, setPassword] = useState(null);
  const [url, setUrl] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const reference = params.get("reference") || params.get("ref") || "";
    if (!reference) {
      setError("Missing reference");
      setStatus("error");
      return;
    }

    (async () => {
      try {
        setStatus("verifying");
        const res = await fetch("/api/get-download-details", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reference }),
        });
        const j = await res.json();
        if (!res.ok) throw new Error(j.error || j.message || "verify failed");
        setPassword(j.password || null);
        setUrl(j.url || null);
        setStatus("ready");
      } catch (err) {
        setError(err.message || String(err));
        setStatus("error");
      }
    })();
  }, []);

  if (status === "loading" || status === "verifying") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Verifying payment...</p>
          </div>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md">
          <div className="text-center">
            <div className="text-red-500 text-4xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              Payment Error
            </h1>
            <p className="text-red-600">{error}</p>
            <a
              href="/"
              className="mt-4 inline-block bg-amber-600 text-white px-6 py-2 rounded hover:bg-amber-700"
            >
              Back to Home
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md">
        <div className="text-center">
          <div className="text-green-500 text-4xl mb-4">✅</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Payment Successful!
          </h1>
          <p className="text-gray-600 mb-4">
            Your Hausa Wedding Guide is ready for download.
          </p>

          {password && (
            <div className="bg-amber-50 p-4 rounded-lg mb-4">
              <p className="text-sm text-gray-600 mb-2">
                Your download password:
              </p>
              <p className="font-mono text-lg font-bold text-amber-800 bg-white p-2 rounded border">
                {password}
              </p>
            </div>
          )}

          {url ? (
            <a
              href={url}
              target="_blank"
              rel="noreferrer"
              className="w-full bg-amber-600 text-white px-6 py-3 rounded hover:bg-amber-700 inline-block mb-4"
            >
              Download Your Guide
            </a>
          ) : (
            <p className="text-gray-500 mb-4">
              The download link has been emailed to you.
            </p>
          )}

          <p className="text-xs text-gray-500">
            You can also access your guide anytime at{" "}
            <a href="/download.html" className="text-amber-600 hover:underline">
              /download.html
            </a>{" "}
            using your email and password.
          </p>
        </div>
      </div>
    </div>
  );
}
