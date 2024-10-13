import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { PieChart, Pie, Cell } from 'recharts';

interface ThematicOverviewProps {
  data: {
    deals_by_theme: Record<string, number>;
    total_capital_by_theme: Record<string, number>;
    alterra_capital_by_theme: Record<string, number>;
  };
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const ThematicOverview: React.FC<ThematicOverviewProps> = ({ data }) => {
  const dealsByThemeData = Object.entries(data.deals_by_theme).map(([name, value]) => ({ name, value }));
  const capitalData = Object.entries(data.total_capital_by_theme).map(([name, total]) => ({
    name,
    total,
    alterra: data.alterra_capital_by_theme[name] || 0,
  }));

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Thematic Overview</h2>
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Number of Deals by Theme</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={dealsByThemeData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div>
        <h3 className="text-xl font-semibold mb-4">Capital Investment by Theme</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={capitalData}
              dataKey="total"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              label
            >
              {capitalData.map((entry, index) => (
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

export default ThematicOverview;