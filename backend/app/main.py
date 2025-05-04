import time
from typing import Any

import yfinance as yf
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware

from app.cache import Cache
from app.helper import get_fx, get_portfolio_data_from_cache, get_total_returns

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["GET"],
    allow_headers=["*"],
)


@app.get("/health")
async def root():
    return {"message": "Passed health check!"}


@app.get("/portfolio")
async def get_portfolio(
    portfolio_id: str,
    currency: str,
) -> list[dict[str, Any]]:
    """Get portfolio based on portfolio_id and currency to be viewed in"""
    if not portfolio_id or not currency:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Missing required query parameters: portfolio_id or currency",
        )
    portfolio_securities = get_portfolio_data_from_cache(portfolio_id=portfolio_id)
    # Retrieve list of funds allocated in this portfolio
    for security in portfolio_securities:
        fx_rate = 1
        if security["currency"] != currency.lower():
            # fx rate for conversion
            exchange = f"{security['currency'].upper()}{currency.upper()}"
            fx_rate = get_fx(exchange)["rate"]
            security["currency"] = currency.lower()
        fund = yf.Ticker(security["security"])
        info = fund.info
        previous_close_price = info.get("previousClose")
        security["total_cost"] = fx_rate * security["position"] * security["cost_price"]
        security["closing_price"] = round(previous_close_price * fx_rate, 2)
        security["cost_price"] = round(security["cost_price"] * fx_rate, 2)
        security["total_market_value"] = (
            fx_rate * security["position"] * previous_close_price
        )
    return portfolio_securities


@app.get("/returns")
async def get_portfolio_returns(portfolio_id: str, currency: str):
    if not portfolio_id or not currency:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Missing required query parameters: portfolio_id or currency",
        )
    portfolio_securities = get_portfolio_data_from_cache(portfolio_id=portfolio_id)
    total_returns_by_date = get_total_returns(
        portfolio_data=portfolio_securities, viewing_currency=currency
    )
    return total_returns_by_date
