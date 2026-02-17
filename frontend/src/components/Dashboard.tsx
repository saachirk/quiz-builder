import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from "recharts";
import "../styles/Dashboard.css";

const pieData = [
  { name: "Correct", value: 78 },
  { name: "Wrong", value: 22 },
];

const barData = [
  { name: "Mon", attempts: 12 },
  { name: "Tue", attempts: 19 },
  { name: "Wed", attempts: 7 },
  { name: "Thu", attempts: 15 },
  { name: "Fri", attempts: 22 },
];

const COLORS = ["#22c55e", "#ef4444"];

const Dashboard: React.FC = () => {
  return (
    <div className="dashboard">
      <h1 className="dashboard-title">Quiz Analytics Dashboard</h1>

      {/* Stats Cards */}
      <div className="dashboard-grid">
        <div className="card">
          <h3>Total Quizzes</h3>
          <p>15</p>
        </div>

        <div className="card">
          <h3>Total Attempts</h3>
          <p>320</p>
        </div>

        <div className="card">
          <h3>Active Users</h3>
          <p>52</p>
        </div>

        <div className="card highlight">
          <h3>Average Score</h3>
          <p>78%</p>
        </div>
      </div>

      {/* Charts */}
      <div className="charts-grid">
        <div className="chart-card">
          <h2>Performance Overview</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
                label
              >
                {pieData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h2>Weekly Attempts</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <XAxis dataKey="name" stroke="#cbd5e1" />
              <YAxis stroke="#cbd5e1" />
              <Tooltip />
              <Bar
                dataKey="attempts"
                fill="#6366f1"
                radius={[10, 10, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="dashboard-section">
        <h2>Recent Activity</h2>
        <ul>
          <li>JavaScript Quiz Created</li>
          <li>React Quiz Attempted</li>
          <li>DSA Quiz Updated</li>
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
