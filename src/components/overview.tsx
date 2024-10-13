"use client"

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface OverviewProps {
  data: {
    companies_data: Record<string, {
      'Company Name': string;
      'Fund': string[] | string;
      'Investment ($M)': number;
      'Theme': string[] | string;
      'Total Emissions by Fund (tons of CO2e)': number;
    }>;
    committed_capital_by_fund: Record<string, number>;
    deals_by_fund: Record<string, number>;
  };
  selectedCompany: string | null;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const Overview: React.FC<OverviewProps> = ({ data, selectedCompany }) => {
  const isOverallView = !selectedCompany;

  const calculateCommittedCapitalByFund = (funds: string[] | string) => {
    const fundArray = Array.isArray(funds) ? funds : [funds];
    return fundArray.map(fund => ({
      name: fund,
      value: data.committed_capital_by_fund[fund] || 0
    }));
  };

  const calculateDealsByFund = (funds: string[] | string) => {
    const fundArray = Array.isArray(funds) ? funds : [funds];
    return fundArray.map(fund => ({
      name: fund,
      value: data.deals_by_fund[fund] || 0
    }));
  };

  const renderPieChart = (data: { name: string; value: number }[], title: string, valueFormatter: (value: number) => string) => (
    <div className="w-full h-96">
      <h3 className="text-xl font-semibold mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            fill="#8884d8"
            label={({ name, value }) => `${name}: ${valueFormatter(value)}`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => valueFormatter(value as number)} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );

  if (isOverallView) {
    const committedCapitalData = Object.entries(data.committed_capital_by_fund).map(([name, value]) => ({ name, value }));
    const dealsByFundData = Object.entries(data.deals_by_fund).map(([name, value]) => ({ name, value }));

    return (
      <div className="space-y-8">
        <h2 className="text-2xl font-bold mb-4">Overall Dashboard</h2>
        <div className="grid grid-cols-2 gap-8">
          {renderPieChart(committedCapitalData, 'Committed Capital by Fund', (value) => `$${value.toFixed(2)}M`)}
          {renderPieChart(dealsByFundData, 'Deals by Fund', (value) => value.toString())}
        </div>
      </div>
    );
  } else {
    const company = data.companies_data && selectedCompany ? data.companies_data[selectedCompany] : null;
    return company ? (
      <div>
        <h2 className="text-2xl font-bold mb-4">{company['Company Name']}</h2>
        <div className="grid grid-cols-2 gap-4">
          {renderPieChart(calculateCommittedCapitalByFund(company.Fund), 'Committed Capital by Fund', (value) => `$${value.toFixed(2)}M`)}
          {renderPieChart(calculateDealsByFund(company.Fund), 'Deals by Fund', (value) => value.toString())}
        </div>
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">Investment Details</h3>
          <p>Fund: {Array.isArray(company.Fund) ? company.Fund.join(', ') : company.Fund}</p>
          <p>Theme: {Array.isArray(company.Theme) ? company.Theme.join(', ') : company.Theme}</p>
          <p>Total Investment: ${company['Investment ($M)'].toFixed(2)}M</p>
          <p>Total Emissions: {company['Total Emissions by Fund (tons of CO2e)'].toFixed(2)} tons CO2e</p>
        </div>
      </div>
    ) : (
      <div>No company data available</div>
    );
  }
};

export default Overview;
