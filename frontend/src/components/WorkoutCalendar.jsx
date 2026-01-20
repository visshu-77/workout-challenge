import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../styles/calender.css";

function WorkoutCalendar({ workouts }) {
  const [selectedWorkout, setSelectedWorkout] = useState(null);

  const findWorkoutByDate = (date) => {
    return workouts.find(
      (w) =>
        new Date(w.date).toDateString() === date.toDateString()
    );
  };

  return (
    <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
      <h2 className="text-xl font-semibold mb-4">
        📅 Workout Calendar
      </h2>

      <Calendar
        onClickDay={(date) => {
          const workout = findWorkoutByDate(date);
          setSelectedWorkout(workout || { empty: true, date });
        }}
        tileClassName={({ date, view }) => {
          if (view === "month") {
            const hasWorkout = findWorkoutByDate(date);
            if (hasWorkout) {
              return "bg-green-500 text-black rounded-lg";
            }
          }
          return null;
        }}
      />

      {/* MODAL */}
      {selectedWorkout && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-slate-900 rounded-xl p-6 max-w-md w-full relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-white"
              onClick={() => setSelectedWorkout(null)}
            >
              ✕
            </button>

            {selectedWorkout.empty ? (
              <>
                <h3 className="text-xl font-bold mb-2">
                  No Workout
                </h3>
                <p className="text-gray-400">
                  No workout uploaded on{" "}
                  {selectedWorkout.date.toDateString()}
                </p>
              </>
            ) : (
              <>
                <h3 className="text-xl font-bold mb-4">
                  Day {selectedWorkout.day} Workout
                </h3>
                <img
                  src={`http://localhost:5000/uploads/${selectedWorkout.image}`}
                  alt="Workout"
                  className="rounded-lg"
                />
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default WorkoutCalendar;
