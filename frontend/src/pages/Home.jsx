// import { useEffect, useState } from "react";
// import { motion } from "framer-motion";
// import API from "../services/api";
// import Navbar from "../components/Navbar";
// import WorkoutCalendar from "../components/WorkoutCalendar";
// import MonthlyStats from "../components/MonthlyStats";



// const quotes = [
//     "Discipline beats motivation.",
//     "No excuses. Just results.",
//     "Consistency is the real power.",
//     "Your body can do it. Convince your mind.",
// ];

// function Home() {
//     const [user, setUser] = useState(null);
//     const [image, setImage] = useState(null);
//     const [loading, setLoading] = useState(false);

//     const quote = quotes[new Date().getDate() % quotes.length];

//     const fetchProfile = async () => {
//         try {
//             const res = await API.get("/workout/profile");
//             setUser(res.data);
//         } catch {
//             localStorage.removeItem("token");
//             window.location.href = "/";
//         }
//     };

//     useEffect(() => {
//         fetchProfile();
//     }, []);

//     // 🔥 STREAK BREAK DETECTION
//     const missedYesterday = () => {
//         if (!user || !user.lastUploadDate) return false;

//         const last = new Date(user.lastUploadDate);
//         const today = new Date();
//         const yesterday = new Date();
//         yesterday.setDate(today.getDate() - 1);

//         return (
//             last.toDateString() !== today.toDateString() &&
//             last.toDateString() !== yesterday.toDateString()
//         );
//     };

//     const handleUpload = async () => {
//         if (!image) return alert("Select image first");

//         const formData = new FormData();
//         formData.append("image", image);

//         try {
//             setLoading(true);
//             await API.post("/workout/upload", formData);
//             setImage(null);
//             fetchProfile();
//         } catch (err) {
//             alert(err.response?.data?.message || "Upload failed");
//         } finally {
//             setLoading(false);
//         }
//     };

//     if (!user) return <p className="text-center mt-10">Loading...</p>;

//     return (
//         <>
//             <Navbar />

//             {/* ================= HERO SECTION ================= */}
//             <section className="h-[400px] w-full bg-gradient-to-br from-slate-900 via-slate-800 to-black flex items-center justify-center text-center px-6">
//                 <motion.div
//                     initial={{ opacity: 0, y: 30 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     className="max-w-3xl"
//                 >
//                     <h1 className="text-6xl font-extrabold mb-6 text-white">
//                         🔥 {user.streak} Day Streak
//                     </h1>
//                     <p className="text-xl italic text-gray-300">
//                         “{quote}”
//                     </p>

//                     {missedYesterday() && (
//                         <motion.div
//                             initial={{ x: -20 }}
//                             animate={{ x: [0, -10, 10, -10, 0] }}
//                             transition={{ duration: 0.5 }}
//                             className="mt-8 bg-red-500/20 border border-red-500 text-red-400 p-4 rounded-lg"
//                         >
//                             ⚠️ You missed a day! Your streak has been reset.
//                             Start again today 💪
//                         </motion.div>
//                     )}
//                 </motion.div>
//             </section>

//             {/* ================= DASHBOARD SECTION ================= */}
//             <section className="w-full px-6 py-16 bg-slate-900">
//                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">

//                     {/* CALENDAR CARD */}
//                     <div className="bg-slate-800 rounded-2xl shadow-lg p-6 h-full flex flex-col">
//                         <WorkoutCalendar workouts={user.workouts} />
//                     </div>

//                     {/* UPLOAD CARD */}
//                     <div className="bg-slate-800 rounded-2xl shadow-lg p-6 h-full flex flex-col justify-between">
//                         <div>
//                             <h2 className="text-2xl font-semibold mb-4 text-center">
//                                 Upload Today’s Workout
//                             </h2>

//                             <input
//                                 type="file"
//                                 accept="image/*"
//                                 className="mb-6 block mx-auto"
//                                 onChange={(e) => setImage(e.target.files[0])}
//                             />
//                         </div>

//                         <button
//                             onClick={handleUpload}
//                             disabled={loading}
//                             className="bg-green-500 hover:bg-green-600 px-6 py-3 rounded-lg font-semibold text-black w-full"
//                         >
//                             {loading ? "Uploading..." : "Upload Workout"}
//                         </button>
//                     </div>

//                     {/* MONTHLY STATS CARD */}
//                     <div className="bg-slate-800 rounded-2xl shadow-lg p-6 h-full flex flex-col">
//                         <MonthlyStats
//                             workouts={user.workouts}
//                             currentStreak={user.streak}
//                         />
//                     </div>

//                 </div>
//             </section>


//             {/* ================= PROGRESS SECTION ================= */}
//             <section className="w-full px-6 py-16 bg-slate-900">
//                 <h2 className="text-3xl font-bold mb-8 text-center">
//                     Your Progress
//                 </h2>

//                 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//                     {user.workouts.map((w) => (
//                         <motion.div
//                             key={w._id}
//                             whileHover={{ scale: 1.05 }}
//                             className="bg-slate-800 rounded-xl overflow-hidden shadow-md"
//                         >
//                             <div className="p-4 font-semibold">
//                                 Day {w.day}
//                             </div>
//                             <img
//                                 src={`http://localhost:5000/uploads/${w.image}`}
//                                 className="w-full h-48 object-cover"
//                             />
//                         </motion.div>
//                     ))}
//                 </div>
//             </section>
//         </>
//     );
// }

// export default Home;

import { useRef } from "react";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import API from "../services/api";
import Navbar from "../components/Navbar";
import WorkoutCalendar from "../components/WorkoutCalendar";
import MonthlyStats from "../components/MonthlyStats";


const quotes = [
    "Discipline beats motivation.",
    "No excuses. Just results.",
    "Consistency is the real power.",
    "Your body can do it. Convince your mind.",
];

function Home() {

    const progressRef = useRef(null);

    // ================= BASIC STATES =================
    const [user, setUser] = useState(null);
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);

    // ================= BMI STATES =================
    const [height, setHeight] = useState("");
    const [weight, setWeight] = useState("");
    const [age, setAge] = useState("");
    const [bmiResult, setBmiResult] = useState(null);

    const quote = quotes[new Date().getDate() % quotes.length];

    // ================= FETCH PROFILE =================
    const fetchProfile = async () => {
        try {
            const res = await API.get("/workout/profile");
            setUser(res.data);
        } catch {
            localStorage.removeItem("token");
            window.location.href = "/";
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    // ================= SHOW BMI ON SCROLL =================
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 300) {
                setShowBMISection(true);
            }
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // ================= STREAK BREAK LOGIC =================
    const missedYesterday = () => {
        if (!user || !user.lastUploadDate) return false;

        const last = new Date(user.lastUploadDate);
        const today = new Date();
        const yesterday = new Date();
        yesterday.setDate(today.getDate() - 1);

        return (
            last.toDateString() !== today.toDateString() &&
            last.toDateString() !== yesterday.toDateString()
        );
    };

    // ================= UPLOAD WORKOUT =================
    const handleUpload = async () => {
        if (!image) return alert("Select image first");

        const formData = new FormData();
        formData.append("image", image);

        try {
            setLoading(true);
            await API.post("/workout/upload", formData);
            setImage(null);
            fetchProfile();
        } catch (err) {
            alert(err.response?.data?.message || "Upload failed");
        } finally {
            setLoading(false);
        }
    };

    // ================= BMI CALCULATION =================
    const calculateBMI = () => {
        if (!height || !weight) {
            alert("Please enter height and weight");
            return;
        }

        const h = height / 100; // cm → meter
        const bmi = weight / (h * h);

        // Ideal weight range
        const minIdealWeight = 18.5 * h * h;
        const maxIdealWeight = 24.9 * h * h;

        let status = "";
        let color = "";
        let advice = "";

        if (bmi < 18.5) {
            status = "Underweight (kam wajan)";
            color = "text-yellow-400";
            advice = `You should gain approx ${(minIdealWeight - weight).toFixed(
                1
            )} kg to reach a healthy range.`;
        } else if (bmi < 25) {
            status = "Normal / Fit ✅";
            color = "text-green-400";
            advice = "Great! Your weight is in the healthy range.";
        } else if (bmi < 30) {
            status = "Overweight (zyada wajan)";
            color = "text-orange-400";
            advice = `You should lose approx ${(weight - maxIdealWeight).toFixed(
                1
            )} kg to reach a healthy range.`;
        } else {
            status = "Obese (motapa)";
            color = "text-red-400";
            advice = `You should lose approx ${(weight - maxIdealWeight).toFixed(
                1
            )} kg to reach a healthy range.`;
        }

        setBmiResult({
            bmi: bmi.toFixed(1),
            status,
            color,
            minIdealWeight: minIdealWeight.toFixed(1),
            maxIdealWeight: maxIdealWeight.toFixed(1),
            advice,
        });
    };

    if (!user) return <p className="text-center mt-10">Loading...</p>;

    return (
        <>
            <Navbar />

            {/* ================= HERO SECTION ================= */}
            <section className="h-[400px] w-full bg-gradient-to-br from-slate-900 via-slate-800 to-black flex items-center justify-center text-center px-6">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-3xl"
                >
                    <h1 className="text-6xl font-extrabold mb-6 text-white">
                        🔥 {user.streak} Day Streak
                    </h1>
                    <p className="text-xl italic text-gray-300">
                        “{quote}”
                    </p>

                    {missedYesterday() && (
                        <motion.div
                            initial={{ x: -20 }}
                            animate={{ x: [0, -10, 10, -10, 0] }}
                            transition={{ duration: 0.5 }}
                            className="mt-8 bg-red-500/20 border border-red-500 text-red-400 p-4 rounded-lg"
                        >
                            ⚠️ You missed a day! Your streak has been reset.
                            Start again today 💪
                        </motion.div>
                    )}
                </motion.div>
            </section>

            {/* ================= DASHBOARD SECTION ================= */}
            <section className="w-full px-6 py-16 bg-slate-900">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">

                    <div className="bg-slate-800 rounded-2xl shadow-lg p-6 text-white">
                        <WorkoutCalendar workouts={user.workouts} />
                    </div>

                    <div className="bg-slate-800 rounded-2xl shadow-lg p-6 flex flex-col justify-between">
                        <div>
                            <h2 className="text-2xl font-semibold mb-4 text-center text-white">
                                Upload Today’s Workout
                            </h2>
                            <input
                                type="file"
                                accept="image/*"
                                className="mb-6 block mx-auto"
                                onChange={(e) => setImage(e.target.files[0])}
                            />
                        </div>

                        <button
                            onClick={handleUpload}
                            disabled={loading}
                            className="bg-green-500 hover:bg-green-600 px-6 py-3 rounded-lg font-semibold text-black w-full"
                        >
                            {loading ? "Uploading..." : "Upload Workout"}
                        </button>
                    </div>

                    <div className="bg-slate-800 rounded-2xl shadow-lg p-6 text-white">
                        <MonthlyStats
                            workouts={user.workouts}
                            currentStreak={user.streak}
                        />
                    </div>
                </div>
            </section>

            {/* ================= PROGRESS SECTION ================= */}
            {/* <section ref={progressRef} className="w-full px-6 py-16 bg-slate-900">
                <h2 className="text-3xl font-bold mb-8 text-center text-white">
                    Your Progress
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {user.workouts.map((w) => (
                        <motion.div
                            key={w._id}
                            whileHover={{ scale: 1.05 }}
                            className="bg-slate-800 rounded-xl overflow-hidden shadow-md"
                        >
                            <div className="p-4 font-semibold text-[#a6a6a6]">
                                Day {w.day}
                            </div>
                            <img
                                src={`http://localhost:5000/uploads/${w.image}`}
                                className="w-full h-48 object-cover"
                            />
                        </motion.div>
                    ))}
                </div>
            </section> */}

            <section ref={progressRef} className="w-full px-6 py-16 bg-slate-900">
                <h2 className="text-3xl font-bold mb-8 text-center text-white">
                    Your Progress
                </h2>

                {(() => {
                    // get latest day
                    const latestDay = Math.max(...user.workouts.map(w => w.day));

                    // calculate 7-day window
                    const startDay = Math.floor((latestDay - 1) / 7) * 7 + 1;
                    const endDay = startDay + 6;

                    return (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {user.workouts
                                .filter(w => w.day >= startDay && w.day <= endDay)
                                .map((w) => (
                                    <motion.div
                                        key={w._id}
                                        whileHover={{ scale: 1.05 }}
                                        className="bg-slate-800 rounded-xl overflow-hidden shadow-md"
                                    >
                                        <div className="p-4 font-semibold text-[#a6a6a6]">
                                            Day {w.day}
                                        </div>
                                        <img
                                            src={`http://localhost:5000/uploads/${w.image}`}
                                            className="w-full h-48 object-cover"
                                            alt={`Day ${w.day} progress`}
                                        />
                                    </motion.div>
                                ))}
                        </div>
                    );
                })()}
            </section>




            {/* ================= BMI SECTION (ON SCROLL) ================= */}

            {/* ================= BMI SECTION ================= */}
            {/* ================= BMI SECTION ================= */}
            <section className="w-full px-6 py-20 bg-slate-900">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="max-w-6xl mx-auto bg-slate-800 rounded-2xl shadow-2xl p-10"
                >
                    <h2 className="text-3xl font-bold text-center mb-12 text-white">
                        🧠 Check Your Fitness (BMI)
                    </h2>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

                        {/* ================= LEFT: BMI CALCULATOR ================= */}
                        <div className="bg-slate-900 rounded-xl p-8 shadow-lg">
                            {!bmiResult ? (
                                <>
                                    <div className="space-y-5 mb-6">
                                        <input
                                            type="number"
                                            placeholder="Height (cm)"
                                            className="w-full p-4 rounded-lg bg-slate-700 outline-none focus:ring-2 focus:ring-green-500"
                                            onChange={(e) => setHeight(e.target.value)}
                                        />

                                        <input
                                            type="number"
                                            placeholder="Weight (kg)"
                                            className="w-full p-4 rounded-lg bg-slate-700 outline-none focus:ring-2 focus:ring-green-500"
                                            onChange={(e) => setWeight(e.target.value)}
                                        />

                                        <input
                                            type="number"
                                            placeholder="Age (optional)"
                                            className="w-full p-4 rounded-lg bg-slate-700 outline-none focus:ring-2 focus:ring-green-500"
                                            onChange={(e) => setAge(e.target.value)}
                                        />
                                    </div>

                                    <button
                                        onClick={calculateBMI}
                                        className="w-full bg-green-500 hover:bg-green-600 transition py-3 rounded-lg font-semibold text-black"
                                    >
                                        Calculate BMI
                                    </button>
                                </>
                            ) : (
                                <div className="text-center">
                                    {bmiResult && (
                                        <div className="mt-6 text-center space-y-4">
                                            <p className={`text-5xl font-bold ${bmiResult.color}`}>
                                                {bmiResult.bmi}
                                            </p>

                                            <p className={`text-xl font-semibold ${bmiResult.color}`}>
                                                {bmiResult.status}
                                            </p>

                                            <div className="bg-slate-800 rounded-lg p-4 text-white">
                                                <p className="font-semibold">🎯 Ideal Weight Range</p>
                                                <p className="text-green-400">
                                                    {bmiResult.minIdealWeight} kg – {bmiResult.maxIdealWeight} kg
                                                </p>
                                            </div>

                                            <p className="text-gray-300">
                                                {bmiResult.advice}
                                            </p>

                                            <p className="text-sm text-gray-400">
                                                * This is a general fitness estimation, not medical advice.
                                            </p>
                                        </div>
                                    )}

                                </div>
                            )}
                        </div>

                        {/* ================= RIGHT: BMI CATEGORY GUIDE ================= */}
                        <div className="bg-slate-900 rounded-xl p-8 shadow-lg">
                            <h3 className="text-xl font-semibold mb-8 text-center text-white">
                                📊 BMI Categories Guide
                            </h3>

                            <div className="space-y-5">

                                <div className="flex justify-between items-center bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                                    <span className="font-semibold text-[#a6a6a6]">&lt; 18.5</span>
                                    <span className="text-yellow-400">
                                        Underweight (kam wajan)
                                    </span>
                                </div>

                                <div className="flex justify-between items-center bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                                    <span className="font-semibold text-[#a6a6a6]">18.5 – 24.9</span>
                                    <span className="text-green-400">
                                        Normal / Healthy weight
                                    </span>
                                </div>

                                <div className="flex justify-between items-center bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
                                    <span className="font-semibold text-[#a6a6a6]">25 – 29.9</span>
                                    <span className="text-orange-400">
                                        Overweight (zyada wajan)
                                    </span>
                                </div>

                                <div className="flex justify-between items-center bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                                    <span className="font-semibold text-[#a6a6a6]">≥ 30</span>
                                    <span className="text-red-400">
                                        Obese (motapa)
                                    </span>
                                </div>

                            </div>
                        </div>

                    </div>
                </motion.div>
            </section>


        </>
    );
}

export default Home;
