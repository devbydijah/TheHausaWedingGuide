import React, { useState, useEffect } from "react";

function SuccessPage() {
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const finalizePurchase = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const tx_ref = urlParams.get("reference");

        if (!tx_ref) {
          throw new Error("No transaction reference found.");
        }

        const response = await fetch("/api/finalize-purchase", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ tx_ref }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to finalize purchase.");
        }

        const data = await response.json();
        setDownloadUrl(data.downloadUrl);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    finalizePurchase();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center text-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-3xl font-bold text-green-600 mb-4">
          Payment Successful!
        </h1>
        <p className="text-gray-700 mb-6">
          Thank you for your purchase. Your transaction has been confirmed.
        </p>

        {loading && (
          <div>
            <p className="text-lg font-semibold animate-pulse">
              Verifying your purchase and generating your secure download
              link...
            </p>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            <strong className="font-bold">Error:</strong>
            <span className="block sm:inline"> {error}</span>
            <p className="text-sm mt-2">
              Please contact support with your transaction reference if this
              issue persists.
            </p>
          </div>
        )}

        {downloadUrl && (
          <div>
            <p className="text-gray-800 mb-4">
              Click the button below to download your guide. A copy has also
              been sent to your email.
            </p>
            <a
              href={downloadUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition duration-300 ease-in-out inline-block"
            >
              Download PDF
            </a>
            <p className="text-xs text-gray-500 mt-4">
              This link will expire in 24 hours.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default SuccessPage;
