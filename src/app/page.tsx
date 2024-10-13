"use client"

import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Overview from '../components/overview';
import GlobalSouthInvestments from '../components/GlobalSouthInvestment';
import ThematicOverview from '../components/ThematicOverview';
import EmissionDashboard from '../components/EmissionDashboard';

interface DashboardData {
  emission_dashboard: { total_emissions_by_fund: Record<string, number>; scope1_emissions_by_fund: Record<string, number>; scope2_emissions_by_fund: Record<string, number>; scope3_emissions_by_fund: Record<string, number> }
  overview: {
    committed_capital_by_fund: Record<string, number>;
    deals_by_fund: Record<string, number>;
  }
  companies_data: Record<string, {
    'Company Name': string;
    'Fund': string[] | string;
    'Investment ($M)': number;
    'Fund Size ($M)': number;
    'Theme': string[] | string;
    'Total Emissions by Fund (tons of CO2e)': number;
    'Scope 1 Emissions (tons of CO2e)': number;
    'Scope 2 Emissions (tons of CO2e)': number;
    'Scope 3 Emissions (tons of CO2e)': number;
  }>;
  global_south_investments: { countries: string[]; capital_by_theme: Record<string, number> };
  thematic_overview: { deals_by_theme: Record<string, number>; total_capital_by_theme: Record<string, number>; alterra_capital_by_theme: Record<string, number> };
}

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [activeSection, setActiveSection] = useState("overview")
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/dashboard_data")
        if (!response.ok) {
          throw new Error("Failed to fetch dashboard data")
        }
        const data = await response.json()
        setDashboardData(data)
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      }
    }

    fetchData()
  }, [])

  if (!dashboardData) {
    return <div>Loading...</div>
  }

  const filteredData = selectedCompany && dashboardData ? filterData(dashboardData, selectedCompany) : dashboardData;
  const companies = dashboardData ? Object.keys(dashboardData.companies_data) : [];

  return (
    <div className="flex bg-background text-foreground">
      <Sidebar
        companies={companies}
        onCompanySelect={setSelectedCompany}
        selectedCompany={selectedCompany}
      />
      <div className="flex-1 p-8">
        <nav className="mb-8">
          <ul className="flex space-x-4">
            {["overview", "global_south_investments", "thematic_overview", "emission_dashboard"].map((section) => (
              <li key={section}>
                <button
                  className={`px-4 py-2 rounded-md ${
                    activeSection === section
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-accent hover:text-accent-foreground"
                  }`}
                  onClick={() => setActiveSection(section)}
                >
                  {section.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </button>
              </li>
            ))}
          </ul>
        </nav>
        {activeSection === "overview" && <Overview data={{...filteredData.overview, companies_data: filteredData.companies_data}} selectedCompany={selectedCompany} />}
        {activeSection === "global_south_investments" && <GlobalSouthInvestments data={filteredData.global_south_investments} />}
        {activeSection === "thematic_overview" && <ThematicOverview data={filteredData.thematic_overview} />}
        {activeSection === "emission_dashboard" && <EmissionDashboard data={filteredData.emission_dashboard} />}
      </div>
    </div>
  )
}

function filterData(data: DashboardData, selectedCompany: string | null): DashboardData {
  if (!selectedCompany) return data;

  const companyData = data.companies_data[selectedCompany];
  if (!companyData) {
    console.error(`Company data not found for ${selectedCompany}`);
    return data;
  }

  const companyFunds = Array.isArray(companyData.Fund) ? companyData.Fund : [companyData.Fund];
  const companyThemes = Array.isArray(companyData.Theme) ? companyData.Theme : [companyData.Theme];

  return {
    ...data,
    overview: {
      committed_capital_by_fund: Object.fromEntries(
        Object.entries(data.overview.committed_capital_by_fund).filter(([fund]) => companyFunds.includes(fund))
      ),
      deals_by_fund: Object.fromEntries(
        Object.entries(data.overview.deals_by_fund).filter(([fund]) => companyFunds.includes(fund))
      ),
    },
    emission_dashboard: {
      total_emissions_by_fund: Object.fromEntries(
        Object.entries(data.emission_dashboard.total_emissions_by_fund).filter(([fund]) => companyFunds.includes(fund))
      ),
      scope1_emissions_by_fund: Object.fromEntries(
        Object.entries(data.emission_dashboard.scope1_emissions_by_fund).filter(([fund]) => companyFunds.includes(fund))
      ),
      scope2_emissions_by_fund: Object.fromEntries(
        Object.entries(data.emission_dashboard.scope2_emissions_by_fund).filter(([fund]) => companyFunds.includes(fund))
      ),
      scope3_emissions_by_fund: Object.fromEntries(
        Object.entries(data.emission_dashboard.scope3_emissions_by_fund).filter(([fund]) => companyFunds.includes(fund))
      ),
    },
    global_south_investments: {
      ...data.global_south_investments,
      capital_by_theme: Object.fromEntries(
        Object.entries(data.global_south_investments.capital_by_theme).filter(([theme]) => companyThemes.includes(theme))
      ),
    },
    thematic_overview: {
      deals_by_theme: Object.fromEntries(
        Object.entries(data.thematic_overview.deals_by_theme).filter(([theme]) => companyThemes.includes(theme))
      ),
      total_capital_by_theme: Object.fromEntries(
        Object.entries(data.thematic_overview.total_capital_by_theme).filter(([theme]) => companyThemes.includes(theme))
      ),
      alterra_capital_by_theme: Object.fromEntries(
        Object.entries(data.thematic_overview.alterra_capital_by_theme).filter(([theme]) => companyThemes.includes(theme))
      ),
    },
    companies_data: {
      [selectedCompany]: companyData
    },
  };
}
