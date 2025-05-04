import json
from decimal import Decimal

import boto3


def upload_data():
    file_path = "portfolio.json"

    with open(file_path, "r") as file:
        data = json.load(file)
    dynamodb = boto3.resource("dynamodb", region_name="ap-southeast-1")

    table = dynamodb.Table("PEAFSGJPY")

    for security in data:
        security["cost_price"] = Decimal(str(security["cost_price"]))
        security["position"] = int(security["position"])
        response = table.put_item(Item=security)
        print(response)


if __name__ == "__main__":
    upload_data()
