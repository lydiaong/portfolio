# Deploy DynamoDB table

Prerequisites: Install terraform from the official portal

Run the below 3 commands in order to deploy the DynamoDB database
1. `terraform init`
2. `terraform plan`
3. `terraform apply`

Once completed,
- Set your AWS credentials / sso login in your shell
- Navigate to the backend/setup directory, run the script setup_db.py to populate the dynamoDB
**Alternative**: If you prefer not to use DynamoDB, a mock dataset is available at `backend/setup/portfolio.json`. Update the `get_portfolio_securities` function in `backend/app/helper.py` to use this data instead.(Refer to .screenshot/dynamodb_mock_data.png)