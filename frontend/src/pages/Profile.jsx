import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import API from "../services/api";
import Navbar from "../components/Navbar";

function Profile() {
  const [user, setUser] = useState(null);
  const [edit, setEdit] = useState(false);
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchProfile = async () => {
    const res = await API.get("/workout/profile");
    setUser(res.data);
    setName(res.data.name);
    setMobile(res.data.mobile);
  };

  useEffect(() => {
    fetchProfile().catch(() => {
      localStorage.removeItem("token");
      window.location.href = "/";
    });
  }, []);

  const handleUpdate = async () => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("mobile", mobile);
    if (image) formData.append("profileImage", image);

    try {
      setLoading(true);
      await API.put("/workout/update-profile", formData);
      setEdit(false);
      fetchProfile();
    } catch {
      alert("Update failed");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <p className="text-center mt-10">Loading...</p>;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-800 rounded-2xl shadow-xl max-w-md w-full p-8"
        >
          {/* IMAGE */}
          <img
            src={
              user.profileImage
                ? `http://localhost:5000/uploads/${user.profileImage}`
                : "https://via.placeholder.com/150"
            }
            className="w-32 h-32 rounded-full mx-auto mb-4 object-cover border-4 border-green-500"
          />

          {edit && (
            <input
              type="file"
              accept="image/*"
              className="mb-4 mx-auto block"
              onChange={(e) => setImage(e.target.files[0])}
            />
          )}

          <h1 className="text-2xl font-bold text-center mb-6">
            👤 Profile
          </h1>

          {/* DETAILS */}
          <div className="space-y-4">
            {/* NAME */}
            <div>
              <p className="text-gray-400">Name</p>
              {edit ? (
                <input
                  className="w-full p-2 rounded bg-slate-700"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              ) : (
                <p>{user.name}</p>
              )}
            </div>

            {/* MOBILE */}
            <div>
              <p className="text-gray-400">Mobile</p>
              {edit ? (
                <input
                  className="w-full p-2 rounded bg-slate-700"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                />
              ) : (
                <p>{user.mobile}</p>
              )}
            </div>

            {/* EMAIL (READ ONLY) */}
            <div>
              <p className="text-gray-400">Email</p>
              <p>{user.email}</p>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="mt-6 flex gap-4">
            {edit ? (
              <>
                <button
                  onClick={handleUpdate}
                  disabled={loading}
                  className="flex-1 bg-green-500 py-2 rounded text-black font-semibold"
                >
                  {loading ? "Saving..." : "Save"}
                </button>
                <button
                  onClick={() => setEdit(false)}
                  className="flex-1 bg-gray-600 py-2 rounded"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setEdit(true)}
                className="w-full bg-blue-500 py-2 rounded font-semibold"
              >
                Edit Profile
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </>
  );
}

export default Profile;
