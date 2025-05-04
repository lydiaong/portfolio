# Solutions Engineer Applicaiton

## Use Case A
You are tasked with developing a user-friendly web application for a financial services company. The purpose of this application is to help users monitor and manage their investments. Specifically, the application will focus on mutual funds, which are investment products that pool money from many investors to purchase a diversified portfolio of stocks, bonds, or other securities. The goal is to provide users with a clear and comprehensive view of their investments, enabling them to track their performance and make informed decisions. For this use case, please consider mutual funds available in Singapore or Japan.

## Repository Structure
3 main folders
```
capital_group
    ├── backend
    ├── frontend
    └── infrastructure
```
** Each folder has a README.md file for prerequisites

## Prerequisites

### Backend
- Python 3.9+
- [uv](https://github.com/astral-sh/uv) package manager
- FastAPI and dependencies (see backend/requirements.txt)
- AWS credentials (for DynamoDB access)

### Frontend
- Node.js 16+ and npm
- React 18+
- Required dependencies (listed in package.json)

### Infrastructure
- AWS account with appropriate permissions
- AWS CLI configured with credentials
- Terraform (optional, for infrastructure management)

### Steps to start application
1. Deploy AWS DynamoDB (Update the region accordingly) [Optional]

    If you want to use the actual DynamoDB service:\
        - Follow the README.md in the infrastructure directory

    **Alternative**: 
    - If you do not wish to deploy a DynamoDB, a mock dataset is available at `backend/setup/portfolio.json`. Update the `get_portfolio_securities` function in `backend/app/helper.py` to use this data instead.(Refer to `screenshot/mock_db_data.png`)

2. Start the FastAPI backend `uv run fastapi dev`
    - The API will be available at http://localhost:8000
    - Once the backend is running, access the Swagger documentation at:
    http://localhost:8000/docs

3. Start the frontend `npm start`
    - The web application will be accessible at http://localhost:3000