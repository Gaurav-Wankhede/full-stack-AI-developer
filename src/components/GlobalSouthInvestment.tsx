import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface GlobalSouthInvestmentsProps {
  data: {
    countries: string[];
    capital_by_theme: Record<string, number>;
  };
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const GlobalSouthInvestments: React.FC<GlobalSouthInvestmentsProps> = ({ data }) => {
  const capitalByThemeData = Object.entries(data.capital_by_theme).map(([name, value]) => ({ name, value }));

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Global South Investments</h2>
      <div>
        <h3 className="text-xl font-semibold mb-4">Countries with Global South Investments</h3>
        <ul className="list-disc pl-5">
          {data.countries.map((country, index) => (
            <li key={index}>{country}</li>
          ))}
        </ul>
      </div>
      <div>
        <h3 className="text-xl font-semibold mb-4">GS Capital Catalyzed by Theme</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={capitalByThemeData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              label
            >
              {capitalByThemeData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default GlobalSouthInvestments;
