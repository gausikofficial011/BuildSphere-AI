import pytest
import json
import os
from app.adapters.dynamo.parser import DynamoGraphParser

def test_dynamo_parsing_and_security():
    """
    Acceptance Test 59: Dynamo parsing and Python node sandboxing.
    """
    fixture_path = os.path.join(os.path.dirname(__file__), "fixtures", "synthetic_dynamo.json")
    with open(fixture_path, "r") as f:
        content = f.read()
        
    parser = DynamoGraphParser()
    result = parser.parse(content)
    
    # 1. Version extraction
    assert result["dynamoVersion"] == "2.13.0.0"
    
    # 2. Metrics calculation
    metrics = result["metrics"]
    assert metrics["nodeCount"] == 3
    assert metrics["edgeCount"] == 2
    assert metrics["pythonNodeCount"] == 1
    assert metrics["customNodeCount"] == 1
    assert metrics["revitNodeCount"] == 1
    
    # 3. Python node security check
    python_nodes = [n for n in result["nodes"] if n["isPython"]]
    assert len(python_nodes) == 1
    assert python_nodes[0]["scriptMetadata"] == "UNTRUSTED_DO_NOT_EXECUTE"
    
    # 4. Connection validation
    conns = result["connections"]
    assert len(conns) == 2
    assert conns[0]["sourceNodeId"] == "node-1"
    assert conns[0]["targetNodeId"] == "node-2"
