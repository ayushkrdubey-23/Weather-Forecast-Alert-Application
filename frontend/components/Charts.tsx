"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface ChartPoint {
  name: string;
  value: number;
}

export function LineChartWidget({
  data,
  title,
  unit,
  color = "#3b82f6",
}: {
  data: ChartPoint[];
  title: string;
  unit: string;
  color?: string;
}) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-gray-800 rounded-xl p-5 border border-gray-700 h-64 flex items-center justify-center text-gray-500">
        No {title.toLowerCase()} data available
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
      <h3 className="text-sm font-medium text-gray-300 mb-4">{title}</h3>
      <div className="h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
            <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
            <YAxis stroke="#94a3b8" fontSize={11} />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={2}
              dot={{ fill: color, strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function BarChartWidget({
  data,
  title,
  unit,
  color = "#14b8a6",
}: {
  data: ChartPoint[];
  title: string;
  unit: string;
  color?: string;
}) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-gray-800 rounded-xl p-5 border border-gray-700 h-64 flex items-center justify-center text-gray-500">
        No {title.toLowerCase()} data available
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
      <h3 className="text-sm font-medium text-gray-300 mb-4">{title}</h3>
      <div className="h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
            <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
            <YAxis stroke="#94a3b8" fontSize={11} />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill={color} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

import { BarChart, Bar } from "recharts";
