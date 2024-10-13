import React, { useState } from 'react';

interface SidebarProps {
  companies: string[];
  onCompanySelect: (company: string | null) => void;
  selectedCompany: string | null;
}

const Sidebar: React.FC<SidebarProps> = ({ companies, onCompanySelect, selectedCompany }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCompanies = companies.filter(company =>
    company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-64 bg-background p-4 border-r border-border">
      <h2 className="text-xl font-bold mb-4 text-foreground">Companies</h2>
      <input
        type="text"
        placeholder="Search companies..."
        className="w-full p-2 mb-4 border rounded bg-input text-foreground placeholder-muted-foreground"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <ul>
        <li
          className={`cursor-pointer hover:bg-accent hover:text-accent-foreground p-2 mb-2 rounded-md ${selectedCompany === null ? 'bg-primary text-primary-foreground' : ''}`}
          onClick={() => onCompanySelect(null)}
        >
          All Companies
        </li>
        {filteredCompanies.map((company) => (
          <li
            key={company}
            className={`cursor-pointer hover:bg-accent hover:text-accent-foreground p-2 rounded-md ${selectedCompany === company ? 'bg-primary text-primary-foreground' : ''}`}
            onClick={() => onCompanySelect(company)}
          >
            {company}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
