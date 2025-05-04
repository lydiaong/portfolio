from unittest.mock import MagicMock, patch

import pytest
from fastapi.testclient import TestClient

from app import main

client = TestClient(main.app)


def test_health_endpoint():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"message": "Passed health check!"}
