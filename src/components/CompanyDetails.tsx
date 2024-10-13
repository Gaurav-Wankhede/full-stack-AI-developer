import React from 'react';

interface CompanyDetailsProps {
  company: string;
  data: {
    'Investment ($M)': number;
    Fund: string[];
    Theme: string[];
    'Total Emissions by Fund (tons of CO2e)': number;
    'Scope 1 Emissions (tons of CO2e)': number;
    'Scope 2 Emissions (tons of CO2e)': number;
    'Scope 3 Emissions (tons of CO2e)': number;
  };
}

const CompanyDetails: React.FC<CompanyDetailsProps> = ({ company, data }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">{company}</h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-blue-100 p-4 rounded">
          <h3 className="text-lg font-semibold">Total Investment</h3>
          <p className="text-2xl font-bold">${data['Investment ($M)'].toFixed(2)}M</p>
        </div>
        <div className="bg-green-100 p-4 rounded">
          <h3 className="text-lg font-semibold">Funds</h3>
          <ul>
            {data.Fund.map((fund, index) => (
              <li key={index}>{fund}</li>
            ))}
          </ul>
        </div>
        <div className="bg-yellow-100 p-4 rounded">
          <h3 className="text-lg font-semibold">Themes</h3>
          <ul>
            {data.Theme.map((theme, index) => (
              <li key={index}>{theme}</li>
            ))}
          </ul>
        </div>
        <div className="bg-red-100 p-4 rounded">
          <h3 className="text-lg font-semibold">Total Emissions</h3>
          <p className="text-2xl font-bold">{data['Total Emissions by Fund (tons of CO2e)'].toFixed(2)} tons CO2e</p>
        </div>
      </div>
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Emissions Breakdown</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-purple-100 p-4 rounded">
            <h4 className="text-lg font-semibold">Scope 1</h4>
            <p className="text-xl font-bold">{data['Scope 1 Emissions (tons of CO2e)'].toFixed(2)} tons CO2e</p>
          </div>
          <div className="bg-indigo-100 p-4 rounded">
            <h4 className="text-lg font-semibold">Scope 2</h4>
            <p className="text-xl font-bold">{data['Scope 2 Emissions (tons of CO2e)'].toFixed(2)} tons CO2e</p>
          </div>
          <div className="bg-pink-100 p-4 rounded">
            <h4 className="text-lg font-semibold">Scope 3</h4>
            <p className="text-xl font-bold">{data['Scope 3 Emissions (tons of CO2e)'].toFixed(2)} tons CO2e</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyDetails;