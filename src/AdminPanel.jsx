import React, { useState } from "react";

export default function AdminPanel() {
  const [formData, setFormData] = useState({
    reference: "",
    email: "",
    fileName: "Hausa_Wedding_Guide.pdf",
    adminKey: "",
  });
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.reference || !formData.email || !formData.adminKey) {
      setStatus("Please fill all required fields");
      return;
    }

    setIsLoading(true);
    setStatus("Processing...");

    try {
      const res = await fetch("/api/generate-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": formData.adminKey,
        },
        body: JSON.stringify({
          reference: formData.reference,
          email: formData.email,
          fileName: formData.fileName,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Request failed");

      if (data.warning === "email_failed") {
        setStatus(
          "✅ Password generated and saved to database. Warning: Email delivery failed."
        );
      } else {
        setStatus("✅ Password generated and email sent successfully!");
      }

      // Clear form
      setFormData((prev) => ({ ...prev, reference: "", email: "" }));
    } catch (err) {
      setStatus("❌ Error: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-gray-800">
        Admin: Generate Password
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Paystack Reference *
          </label>
          <input
            type="text"
            value={formData.reference}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, reference: e.target.value }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="TX_REF_123456"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Customer Email *
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, email: e.target.value }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="customer@example.com"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            File Name
          </label>
          <input
            type="text"
            value={formData.fileName}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, fileName: e.target.value }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Hausa_Wedding_Guide.pdf"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Admin Key *
          </label>
          <input
            type="password"
            value={formData.adminKey}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, adminKey: e.target.value }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter admin secret"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Generating..." : "Generate Password & Send Email"}
        </button>
      </form>

      {status && (
        <div
          className={`mt-4 p-3 rounded-md text-sm ${
            status.startsWith("✅")
              ? "bg-green-100 text-green-800"
              : status.startsWith("❌")
              ? "bg-red-100 text-red-800"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {status}
        </div>
      )}

      <div className="mt-6 p-3 bg-gray-50 rounded-md text-xs text-gray-600">
        <strong>Instructions:</strong>
        <ol className="mt-1 list-decimal list-inside space-y-1">
          <li>Verify payment in Paystack dashboard</li>
          <li>Copy the transaction reference</li>
          <li>Enter customer email and reference above</li>
          <li>Click generate to create password and send email</li>
        </ol>
      </div>
    </div>
  );
}
