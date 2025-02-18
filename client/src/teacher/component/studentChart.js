import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function StudentChart({ courses }) {
    const courseNames = courses.map((course) => course.Course_name);
    const studentCounts = courses.map((course) => course.users?.length || 0);

    const chartData = {
        labels: courseNames,
        datasets: [
            {
                label: "Number of Students",
                data: studentCounts,
                backgroundColor: "rgba(54, 162, 235, 0.6)",
                borderColor: "rgba(54, 162, 235, 1)",
                borderWidth: 1,
            },
        ],
    };

    return (
        <div className="mt-10 p-6 bg-white shadow-lg rounded-lg">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Student Enrollment Chart 📊</h2>
            <Bar data={chartData} />
        </div>
    );
}

export default StudentChart;
