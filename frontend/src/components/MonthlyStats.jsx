import { motion } from "framer-motion";

function MonthlyStats({ workouts, currentStreak }) {
  const now = new Date();

  // Total workouts this month
  const monthlyWorkouts = workouts.filter((w) => {
    const d = new Date(w.date);
    return (
      d.getMonth() === now.getMonth() &&
      d.getFullYear() === now.getFullYear()
    );
  });

  // Calculate longest streak
  const getLongestStreak = () => {
    if (workouts.length === 0) return 0;

    const dates = workouts
      .map((w) => new Date(w.date))
      .sort((a, b) => a - b);

    let longest = 1;
    let current = 1;

    for (let i = 1; i < dates.length; i++) {
      const diff =
        (dates[i] - dates[i - 1]) /
        (1000 * 60 * 60 * 24);

      if (diff === 1) {
        current++;
        longest = Math.max(longest, current);
      } else {
        current = 1;
      }
    }

    return longest;
  };

  const longestStreak = getLongestStreak();

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-800 rounded-xl p-6 shadow-lg mb-10"
    >
      <h2 className="text-xl font-semibold mb-6">
        📊 Monthly Stats
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Monthly workouts */}
        <div className="bg-slate-900 rounded-xl p-4 text-center">
          <p className="text-gray-400">Workouts This Month</p>
          <p className="text-3xl font-bold text-green-400">
            {monthlyWorkouts.length}
          </p>
        </div>

        {/* Current streak */}
        <div className="bg-slate-900 rounded-xl p-4 text-center">
          <p className="text-gray-400">Current Streak</p>
          <p className="text-3xl font-bold text-orange-400">
            🔥 {currentStreak}
          </p>
        </div>

        {/* Longest streak */}
        <div className="bg-slate-900 rounded-xl p-4 text-center">
          <p className="text-gray-400">Longest Streak</p>
          <p className="text-3xl font-bold text-blue-400">
            🏆 {longestStreak}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export default MonthlyStats;
