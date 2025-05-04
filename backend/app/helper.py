import time
from decimal import Decimal
from typing import Any

import boto3
import pandas as pd
import yfinance as yf
from fastapi import HTTPException, status

from app.cache import Cache

pd.set_option("display.float_format", "{:.2f}".format)


def get_portfolio_data_from_cache(portfolio_id: str) -> list[dict[str, Any]]:
    cache = Cache()
    if cache.get(key=portfolio_id) is None:
        portfolio_securities = get_portfolio_securities_from_db(
            portfolio_id=portfolio_id
        )
        cache.set(key=portfolio_id, data=portfolio_securities)
    else:
        cache_data = cache.get(key=portfolio_id)
        portfolio_securities = cache_data["items"]
        if time.time() - cache_data["time"] > 3600:
            cache.delete(key=portfolio_id)
            portfolio_securities = get_portfolio_securities_from_db(
                portfolio_id=portfolio_id
            )
            cache.set(key=portfolio_id, data=portfolio_securities)
    return portfolio_securities


def get_fx(currency: str):
    """Retrieve fx rate"""
    # retrieve currency for exchange
    ticker = yf.Ticker(f"{currency.upper()}=X")
    current_rate = ticker.info.get("regularMarketPrice")

    if current_rate is None:
        return {"error": "Could not retrieve exchange rate"}

    return {"currency": currency, "rate": current_rate}


def convert_decimals(obj):
    """Converts dynamodb decimal to float"""
    if isinstance(obj, Decimal):
        return float(obj)
    return obj


def get_portfolio_securities_from_db(
    portfolio_id: str,
) -> list[dict[str, str | int | float]]:
    """Get portfolio securities from DynamoDB"""
    dynamodb = boto3.resource("dynamodb", region_name="ap-southeast-1")

    table = dynamodb.Table(portfolio_id)
    try:
        response = table.scan()
        data = response["Items"]
        while "LastEvaluatedKey" in response:
            response = table.scan(ExclusiveStartKey=response["LastEvaluatedKey"])
            data.extend(response["Items"])
    except Exception as error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"failed to get data from dynamodb {error}",
        )

    formatted_data = [
        {
            **item,
            "cost_price": float(item["cost_price"]),
            "position": int(item["position"]),
        }
        for item in data
    ]
    return formatted_data


def get_total_returns(
    portfolio_data: list[dict[str, any]], viewing_currency: str
) -> list[dict[str, str | float]]:
    """Calculates the day by day total market value of each security"""
    df_list = []
    for security in portfolio_data:
        fund = yf.Ticker(security["security"])
        hist = fund.history(period="7d").head()
        output = hist.reset_index()
        info = fund.info
        fund_currency = info.get("currency")
        fx_rate = 1
        # perform currency conversion if requested currency to view does not match the currency of fund in market
        if viewing_currency.lower() != fund_currency.lower():
            fx = get_fx(
                currency=f"{security['currency'].upper()}{viewing_currency.upper()}"
            )
            fx_rate = fx["rate"]
        output["Original_Value"] = output["Close"] * security["position"]
        output["Price"] = output["Close"] * fx_rate
        output["Total"] = output["Price"] * security["position"]
        output["Date"] = output["Date"].dt.strftime("%Y-%m-%d")
        df_subset = output[["Date", "Total"]].copy()
        df_list.append(df_subset)
    combined_df = pd.concat(df_list)
    result_df = combined_df.groupby("Date", as_index=False)["Total"].sum()

    json_data = result_df.to_dict("records")
    return json_data
