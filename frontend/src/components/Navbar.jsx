import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <nav className="bg-slate-800 px-6 py-4 flex justify-between items-center shadow-md">
      <h1
        className="text-[45px] font-bold cursor-pointer text-white"
        onClick={() => navigate("/home")}
      >
        💪 Daily Streak
      </h1>

      <div className="flex gap-4">
        <button
          onClick={() => navigate("/profile")}
          className="bg-slate-700 px-4 py-2 rounded-lg hover:bg-slate-600"
        >
          Profile
        </button>

        <button
          onClick={logout}
          className="bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
