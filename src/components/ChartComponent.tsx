import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

// Placeholder for actual chart data structure
interface ChartDataPoint {
  name: string;
  value: number;
  // Add other relevant properties for portfolio analytics
  // e.g., label?: string;
}

interface ChartComponentProps {
  data: ChartDataPoint[];
  // Add other props for customization, e.g., color, lines, etc.
}

const ChartComponent: React.FC<ChartComponentProps> = ({ data }) => {
  // Basic styling adhering to Tailwind CSS conventions
  // Framer Motion for potential animations
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full h-64 p-4 bg-white shadow-md rounded-lg overflow-hidden"
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="value" stroke="#8884d8" activeDot={{ r: 8 }} />
          {/* Add more lines if needed for multiple data series */}
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

export default ChartComponent;
