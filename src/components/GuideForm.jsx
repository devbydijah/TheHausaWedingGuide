import { useEffect, useState } from "react";

export default function GuideForm({ onValidated }) {
  const params = new URLSearchParams(window.location.search);
  const [email, setEmail] = useState(params.get("email") || "");
  const [token, setToken] = useState(
    params.get("download") || params.get("token") || ""
  );
  const [status, setStatus] = useState(null); // null | 'valid' | 'missing'

  function handleSubmit(e) {
    e.preventDefault();
    if (!email || !token) return setStatus("missing");
    setStatus("valid");
    onValidated({ email, token });
  }

  // Auto-continue if params prefill both
  useEffect(() => {
    if (email && token) onValidated({ email, token });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-2">Unlock Interactive Guide</h1>
      <p className="text-sm text-gray-600 mb-4">
        Paste the link from your email or fill the fields below.
      </p>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          className="w-full border rounded p-2"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="w-full border rounded p-2"
          placeholder="Token"
          value={token}
          onChange={(e) => setToken(e.target.value)}
        />
        <button
          className="w-full bg-black text-white py-2 rounded"
          disabled={!email || !token}
        >
          Continue
        </button>
      </form>
      {status === "missing" && (
        <p className="mt-3 text-sm text-red-600">
          Please enter email and token.
        </p>
      )}
    </div>
  );
}
