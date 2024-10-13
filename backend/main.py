import os
import pandas as pd
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.encoders import jsonable_encoder
from mangum import Mangum

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Get the directory of the current script
current_dir = os.path.dirname(os.path.abspath(__file__))

# Construct the path to the CSV file
csv_path = os.path.join(current_dir, "dummy_sample.csv")

# Read the CSV file
try:
    df = pd.read_csv(csv_path)
except FileNotFoundError:
    print(f"Error: The file '{csv_path}' was not found.")
    print("Please make sure the CSV file is in the same directory as this script.")
    exit(1)

@app.get("/api/dashboard_data")
async def get_dashboard_data():
    try:
        # Overview
        total_capital_catalyzed = float(df["Theme Capital Catalyzed ($M)"].sum()) / 1000  # Convert to billions
        total_fund_investments = int(df["Fund Investments"].sum())
        total_companies = int(df["Company Name"].nunique())
        
        # Committed Capital by Fund
        committed_capital_by_fund = df.groupby("Fund")["Investment ($M)"].sum().astype(float).to_dict()
        
        # Deals Completed by Funds
        deals_by_fund = df.groupby("Fund")["Fund Investments"].sum().astype(int).to_dict()
        
        # Other Funds
        fund_types = df["Fund"].unique().tolist()
        
        # Global South Investments
        gs_countries = df[df["Global South Deals Funded"] > 0]["Country"].unique().tolist()
        gs_capital_by_theme = df[df["Global South Deals Funded"] > 0].groupby("Theme")["Theme Capital Catalyzed ($M)"].sum().astype(float).to_dict()
        
        # Thematic Overview
        deals_by_theme = df.groupby("Theme")["Fund Investments"].sum().astype(int).to_dict()
        total_capital_by_theme = df.groupby("Theme")["Investment ($M)"].sum().astype(float).to_dict()
        alterra_capital_by_theme = df.groupby("Theme")["Theme Capital Catalyzed ($M)"].sum().astype(float).to_dict()
        
        # Emission Dashboard
        total_emissions_by_fund = df.groupby("Fund")["Total Emissions by Fund (tons of CO2e)"].sum().astype(float).to_dict()
        scope1_emissions_by_fund = df.groupby("Fund")["Scope 1 Emissions (tons of CO2e)"].sum().astype(float).to_dict()
        scope2_emissions_by_fund = df.groupby("Fund")["Scope 2 Emissions (tons of CO2e)"].sum().astype(float).to_dict()
        scope3_emissions_by_fund = df.groupby("Fund")["Scope 3 Emissions (tons of CO2e)"].sum().astype(float).to_dict()
        
        # Company-wise information
        companies_data = df.groupby("Company Name").agg({
            "Investment ($M)": "sum",
            "Fund": lambda x: list(set(x)),
            "Theme": lambda x: list(set(x)),
            "Total Emissions by Fund (tons of CO2e)": "sum",
            "Scope 1 Emissions (tons of CO2e)": "sum",
            "Scope 2 Emissions (tons of CO2e)": "sum",
            "Scope 3 Emissions (tons of CO2e)": "sum",
        }).to_dict(orient="index")

        dashboard_data = {
            "overview": {
                "total_capital_catalyzed": total_capital_catalyzed,
                "total_fund_investments": total_fund_investments,
                "total_companies": total_companies,
                "committed_capital_by_fund": committed_capital_by_fund,
                "deals_by_fund": deals_by_fund,
                "fund_types": fund_types,
            },
            "global_south_investments": {
                "countries": gs_countries,
                "capital_by_theme": gs_capital_by_theme,
            },
            "thematic_overview": {
                "deals_by_theme": deals_by_theme,
                "total_capital_by_theme": total_capital_by_theme,
                "alterra_capital_by_theme": alterra_capital_by_theme,
            },
            "emission_dashboard": {
                "total_emissions_by_fund": total_emissions_by_fund,
                "scope1_emissions_by_fund": scope1_emissions_by_fund,
                "scope2_emissions_by_fund": scope2_emissions_by_fund,
                "scope3_emissions_by_fund": scope3_emissions_by_fund,
            },
            "companies_data": companies_data,
        }

        return jsonable_encoder(dashboard_data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/add_fund")
async def add_fund(fund_data: dict):
    # Add new fund logic here
    return {"message": "Fund added successfully"}

@app.post("/api/add_company")
async def add_company(company_data: dict):
    # Add new company logic here
    return {"message": "Company added successfully"}

handler = Mangum(app)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
