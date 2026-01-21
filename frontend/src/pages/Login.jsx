import { useState } from "react";
import API from "../services/api";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        try {
            const res = await API.post("/auth/login", { email, password });
            localStorage.setItem("token", res.data.token);
            window.location.href = "/home";
        } catch {
            alert("Invaid email or password");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
            <div className="bg-slate-800 rounded-2xl shadow-xl w-full max-w-md p-8">
                <h1 className="text-3xl font-bold text-center mb-2 text-white">
                    Welcome Back 💪
                </h1>
                <p className="text-center text-gray-400 mb-6">
                    Consistency builds champions
                </p>

                <div className="space-y-4">
                    <input
                        type="email"
                        placeholder="Email"
                        className="w-full px-4 py-3 rounded-lg bg-slate-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        className="w-full px-4 py-3 rounded-lg bg-slate-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <button
                        onClick={handleLogin}
                        className="w-full bg-green-500 hover:bg-green-600 transition py-3 rounded-lg font-semibold text-black"
                    >
                        Login
                    </button>
                </div>

                <p
                    className="text-center text-sm text-green-400 cursor-pointer mt-4"
                    onClick={() => (window.location.href = "/forgot-password")}
                >
                    Forgot password?
                </p>


                <p className="text-center text-gray-400 mt-6">
                    New here?{" "}
                    <span
                        className="text-green-400 cursor-pointer hover:underline"
                        onClick={() => (window.location.href = "/register")}
                    >
                        Create an account
                    </span>
                </p>
            </div>
        </div>
    );
}

export default Login;
