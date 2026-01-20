import { useState } from "react";
import API from "../services/api";

function ForgotPassword() {
  const [email, setEmail] = useState("");

  const submit = async () => {
    await API.post("/auth/forgot-password", { email });
    alert("If email exists, reset link sent");
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-slate-800 p-6 rounded">
        <h2 className="text-xl mb-4">Forgot Password</h2>
        <input
          className="p-2 rounded bg-slate-700"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          onClick={submit}
          className="block w-full mt-4 bg-green-500 py-2 rounded"
        >
          Send Reset Link
        </button>
      </div>
    </div>
  );
}

export default ForgotPassword;
