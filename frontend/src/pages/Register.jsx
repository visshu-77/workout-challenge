import { useState } from "react";
import { motion } from "framer-motion";
import API from "../services/api";

function Register() {
  const [form, setForm] = useState({
    name: "",
    mobile: "",
    email: "",
    password: "",
    workoutTime: "",
  });
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(false);

//   const handleRegister = async () => {
//     if (!form.name || !form.email || !form.password || !form.mobile) {
//       return alert("Please fill all required fields");
//     }

//     const formData = new FormData();
//     Object.entries(form).forEach(([key, value]) =>
//       formData.append(key, value)
//     );

//     if (profileImage) {
//       formData.append("profileImage", profileImage);
//     }

//     try {
//       setLoading(true);
//       await API.post("/auth/register", formData);
//       alert("🎉 Registration successful! Check your email.");
//       window.location.href = "/";
//     } catch {
//       alert("Registration failed");
//     } finally {
//       setLoading(false);
//     }
//   };

    const handleRegister = async () => {
  if (!form.name || !form.email || !form.password || !form.mobile) {
    return alert("Please fill all required fields");
  }

  const formData = new FormData();
  Object.entries(form).forEach(([key, value]) =>
    formData.append(key, value)
  );

  if (profileImage) {
    formData.append("profileImage", profileImage);
  }

  try {
    setLoading(true);
    await API.post("/auth/register", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    alert("🎉 Registration successful!");
    window.location.href = "/";
  } catch (error) {
    console.error(error);
    alert(error.response?.data?.message || "Registration failed");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-800 rounded-2xl shadow-2xl w-full max-w-lg p-8"
      >
        {/* HEADER */}
        <h1 className="text-3xl font-bold text-center mb-2 text-white">
          Join the Challenge 💪
        </h1>
        <p className="text-center text-gray-400 mb-8">
          Build discipline. Track progress. Stay consistent.
        </p>

        {/* FORM */}
        <div className="space-y-4">
          {/* NAME */}
          <input
            type="text"
            placeholder="Full Name"
            className="w-full px-4 py-3 rounded-lg bg-slate-700 focus:ring-2 focus:ring-green-500 outline-none"
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
            required
          />

          {/* MOBILE */}
          <input
            type="tel"
            placeholder="Mobile Number"
            className="w-full px-4 py-3 rounded-lg bg-slate-700 focus:ring-2 focus:ring-green-500 outline-none"
            onChange={(e) =>
              setForm({ ...form, mobile: e.target.value })
            }
            required
          />

          {/* EMAIL */}
          <input
            type="email"
            placeholder="Email Address"
            className="w-full px-4 py-3 rounded-lg bg-slate-700 focus:ring-2 focus:ring-green-500 outline-none"
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
            required
          />

          {/* PASSWORD */}
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-3 rounded-lg bg-slate-700 focus:ring-2 focus:ring-green-500 outline-none"
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
            required
          />

          {/* WORKOUT TIME */}
          <input
            type="text"
            placeholder="Workout Time (e.g. 6 AM)"
            className="w-full px-4 py-3 rounded-lg bg-slate-700 focus:ring-2 focus:ring-green-500 outline-none"
            onChange={(e) =>
              setForm({ ...form, workoutTime: e.target.value })
            }
            required
          />

          {/* PROFILE IMAGE */}
          <div className="bg-slate-700 rounded-lg p-3">
            <label className="block text-sm text-gray-300 mb-2">
              Profile Image
            </label>
            <input
              type="file"
              accept="image/*"
              className="text-sm text-gray-300"
              onChange={(e) => setProfileImage(e.target.files[0])}
              required
            />
          </div>

          {/* BUTTON */}
          <button
            onClick={handleRegister}
            disabled={loading}
            className="w-full bg-green-500 hover:bg-green-600 transition py-3 rounded-lg font-semibold text-black"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </div>

        {/* FOOTER */}
        <p className="text-center text-gray-400 mt-6">
          Already have an account?{" "}
          <span
            className="text-green-400 cursor-pointer hover:underline"
            onClick={() => (window.location.href = "/")}
          >
            Login
          </span>
        </p>
      </motion.div>
    </div>
  );
}

export default Register;
