from unittest.mock import MagicMock, patch

import pytest
from fastapi.testclient import TestClient

from app import main

client = TestClient(main.app)


# Mock get returns endpoint
def test_returns_endpoint_missing_params():
    response = client.get("/returns")
    assert response.status_code == 422


mock_data = [{"Date": "2025-8-25", "Total": "798760867"}]


@patch("app.main.get_total_returns")
@patch("app.main.get_portfolio_data_from_cache")
def test_returns_endpoint_success(mock_portfolio_securities, mock_get_total_returns):
    mock_portfolio_securities.return_value = None

    mock_get_total_returns.return_value = mock_data

    response = client.get("/returns", params={"portfolio_id": "123", "currency": "sgd"})

    assert response.status_code == 200
    assert response.json() == mock_data
