from unittest.mock import MagicMock, patch

import pytest
from fastapi.testclient import TestClient

from app import main

client = TestClient(main.app)


def test_get_portfolio_missing_params():
    response = client.get("/portfolio")
    assert response.status_code == 422  # pydantic validation


@patch("app.main.get_portfolio_data_from_cache")
@patch("app.main.get_fx")
@patch("app.main.yf.Ticker")
def test_get_portfolio_success(mock_ticker, mock_fx, mock_get_portfolio_securities):
    # Define mock data directly in the test
    mock_data = [
        {"security": "AAPL", "position": 10, "cost_price": 100, "currency": "usd"}
    ]

    # Mock portfolio data
    mock_get_portfolio_securities.return_value = mock_data

    # Mock FX rate
    mock_fx.return_value = {"rate": 1.5}

    # Mock yfinance
    mock_ticker_instance = MagicMock()
    mock_ticker_instance.info = {"previousClose": 150}
    mock_ticker.return_value = mock_ticker_instance

    response = client.get(
        "/portfolio", params={"portfolio_id": "123", "currency": "sgd"}
    )

    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert "total_cost" in data[0]
    assert "closing_price" in data[0]
    assert "total_market_value" in data[0]
