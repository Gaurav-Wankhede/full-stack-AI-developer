import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface EmissionDashboardProps {
  data: {
    total_emissions_by_fund: Record<string, number>;
    scope1_emissions_by_fund: Record<string, number>;
    scope2_emissions_by_fund: Record<string, number>;
    scope3_emissions_by_fund: Record<string, number>;
  };
}

const EmissionDashboard: React.FC<EmissionDashboardProps> = ({ data }) => {
  const emissionData = Object.entries(data.total_emissions_by_fund).map(([fund, total]) => ({
    fund,
    total,
    scope1: data.scope1_emissions_by_fund[fund] || 0,
    scope2: data.scope2_emissions_by_fund[fund] || 0,
    scope3: data.scope3_emissions_by_fund[fund] || 0,
  }));

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Emission Dashboard</h2>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={emissionData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="fund" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="total" fill="#8884d8" name="Total Emissions" />
          <Bar dataKey="scope1" fill="#82ca9d" name="Scope 1 Emissions" />
          <Bar dataKey="scope2" fill="#ffc658" name="Scope 2 Emissions" />
          <Bar dataKey="scope3" fill="#ff7300" name="Scope 3 Emissions" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EmissionDashboard;