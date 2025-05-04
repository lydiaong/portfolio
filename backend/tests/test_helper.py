from decimal import Decimal
from unittest.mock import MagicMock, patch

import boto3
import pandas as pd
import pytest
from fastapi import HTTPException

from app.helper import (
    get_fx,
    get_portfolio_data_from_cache,
    get_portfolio_securities_from_db,
    get_total_returns,
)


@patch("app.helper.Cache")
@patch("app.helper.get_portfolio_securities_from_db")
def test_get_data_from_cache_cache_miss(mock_get_from_db, mock_cache_class):
    # Setup mocks
    mock_cache = MagicMock()
    mock_cache.get.return_value = None
    mock_cache_class.return_value = mock_cache

    mock_data = [{"security": "AAPL", "position": 10}]
    mock_get_from_db.return_value = mock_data

    result = get_portfolio_data_from_cache("portfolio-123")

    mock_get_from_db.assert_called_once_with(portfolio_id="portfolio-123")
    mock_cache.set.assert_called_once()
    assert result == mock_data


@patch("app.helper.get_portfolio_securities_from_db")
@patch("app.helper.Cache")
@patch("app.helper.time.time")
def test_get_data_from_cache_expired(mock_time, mock_cache_class, mock_get_from_db):
    mock_cache_data = {"items": [{"security": "AAPL", "position": 10}], "time": 3600}
    mock_db_data = [{"security": "AAPL", "position": 10}]
    mock_cache = MagicMock()
    mock_cache.get.return_value = mock_cache_data
    mock_cache_class.return_value = mock_cache

    mock_time.return_value = 7201
    mock_get_from_db.return_value = mock_db_data

    result = get_portfolio_data_from_cache("portfolio-123")
    mock_cache.delete.assert_called_once()
    mock_cache.set.assert_called_once()
    assert result == mock_db_data


@patch("app.helper.Cache")
@patch("app.helper.time.time")
def test_get_data_from_cache_success(mock_time, mock_cache_class):
    mock_cache_data = {"items": [{"security": "AAPL", "position": 10}], "time": 3600}
    mock_cache = MagicMock()
    mock_cache.get.return_value = mock_cache_data
    mock_cache_class.return_value = mock_cache

    mock_time.return_value = 3600
    result = get_portfolio_data_from_cache("portfolio-123")
    assert result == mock_cache_data["items"]


@patch("app.helper.yf.Ticker")
def test_get_fx_success(mock_yf):
    mock_ticker_instance = MagicMock()
    mock_ticker_instance.info = {"regularMarketPrice": 90}
    mock_yf.return_value = mock_ticker_instance

    result = get_fx("sgdjpy")
    assert result == {"currency": "sgdjpy", "rate": 90}


@patch("app.helper.yf.Ticker")
def test_get_fx_failure(mock_yf):
    mock_ticker_instance = MagicMock()
    mock_ticker_instance.info = {"regularMarketPrice": None}
    mock_yf.return_value = mock_ticker_instance

    result = get_fx("sgdjpy")
    assert result == {"error": "Could not retrieve exchange rate"}


@pytest.fixture
def mock_portfolio_data():
    return [{"security": "AAPL", "position": 10, "cost_price": 100, "currency": "USD"}]


@patch("app.main.get_fx")
@patch("app.helper.yf.Ticker")
def test_get_total_returns_success(mock_yf, mock_get_fx, mock_portfolio_data):
    mock_ticker = MagicMock()
    mock_history_df = pd.DataFrame(
        {"Close": [150.0, 152.0]},
        index=pd.date_range("2023-01-01", periods=2, freq="D"),
    )
    mock_history_df.index.name = "Date"
    mock_ticker.history.return_value = mock_history_df
    mock_ticker.info = {"currency": "USD"}
    mock_yf.return_value = mock_ticker

    mock_get_fx.return_value = {"rate": 1.0}
    result = get_total_returns(mock_portfolio_data, viewing_currency="usd")
    assert isinstance(result, list)
    assert "Date" in result[0]
    assert "Total" in result[0]


@patch("app.helper.boto3.resource")
def test_get_portfolio_securities_from_db_success(mock_db):
    mock_table = MagicMock()
    mock_db.return_value.Table.return_value = mock_table
    mock_table.scan.side_effect = [
        {
            "Items": [
                {
                    "security": "0P0000I116.SI",
                    "shortname": "Schroder Singapore Trust SGD",
                    "position": 700000,
                    "cost_price": Decimal("4.07"),
                    "currency": "sgd",
                }
            ],
            "LastEvaluatedKey": "some_key",
        },
        {
            "Items": [
                {
                    "security": "0P0000I116.SI",
                    "shortname": "Schroder Singapore Trust SGD",
                    "position": 700000,
                    "cost_price": Decimal("4.07"),
                    "currency": "sgd",
                }
            ]
        },
    ]

    result = get_portfolio_securities_from_db("test-portfolio")
    expected_data = [
        {
            "security": "0P0000I116.SI",
            "shortname": "Schroder Singapore Trust SGD",
            "position": int(700000),
            "cost_price": float("4.07"),
            "currency": "sgd",
        },
        {
            "security": "0P0000I116.SI",
            "shortname": "Schroder Singapore Trust SGD",
            "position": (700000),
            "cost_price": float("4.07"),
            "currency": "sgd",
        },
    ]
    assert result == expected_data
    assert mock_table.scan.call_count == 2


@patch("app.helper.boto3.resource")
def test_get_portfolio_securities_from_db_failure(mock_db):
    mock_table = MagicMock()
    mock_db.return_value.Table.return_value = mock_table
    mock_table.scan.side_effect = Exception("error")

    with pytest.raises(HTTPException) as exc_info:
        get_portfolio_securities_from_db("mock-portfolio")

    assert exc_info.value.status_code == 400
    assert exc_info.value.detail == "failed to get data from dynamodb error"
