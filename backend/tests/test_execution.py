import pytest
from app.execution.engine import ExecutionEngine
from app.execution.adapters.mock_adapter import MockRevitExecutionAdapter
from app.routers.execution import execute_design
import asyncio

def test_production_environment_safety():
    """
    Rule 92: If Revit is not installed, report REVIT_EXECUTION_UNAVAILABLE.
    Do NOT create simulated 'successful' Revit execution in production routes.
    """
    result = asyncio.run(execute_design({"design": {}}))
    assert result["status"] == "REVIT_EXECUTION_UNAVAILABLE"

def test_topological_sorting():
    """
    Rule 11: Command Dependency Graph.
    Ensures Levels run before Walls, which run before Doors.
    """
    from app.execution.safety.validator import ExecutionValidator
    commands = [
        {"commandId": "3", "commandType": "CREATE_DOOR"},
        {"commandId": "1", "commandType": "CREATE_LEVEL"},
        {"commandId": "2", "commandType": "CREATE_WALL"}
    ]
    
    sorted_cmds = ExecutionValidator.topological_sort(commands)
    assert sorted_cmds[0]["commandType"] == "CREATE_LEVEL"
    assert sorted_cmds[1]["commandType"] == "CREATE_WALL"
    assert sorted_cmds[2]["commandType"] == "CREATE_DOOR"

def test_acceptance_test_simple():
    """
    Rule 89: Phase 5 Acceptance Test - Simple.
    Level -> Wall -> Door.
    Verifies dry-run, execution, element ID generation, read-back, and verification.
    """
    adapter = MockRevitExecutionAdapter()
    engine = ExecutionEngine(adapter)
    
    design = {
        "commands": [
            {"commandId": "cmd_lvl", "commandType": "CREATE_LEVEL", "parameters": {"name": "L1", "elevation": 0.0}},
            {"commandId": "cmd_wall", "commandType": "CREATE_WALL", "parameters": {"geometry": {}}},
            {"commandId": "cmd_door", "commandType": "CREATE_DOOR", "parameters": {"geometry": {}, "host_wall": "cmd_wall"}}
        ]
    }
    
    result = engine.execute_design(design)
    
    assert result["status"] == "SUCCESS"
    assert result["verification"]["expected_elements"] == 3
    assert result["verification"]["verified_elements"] == 3
    assert len(adapter.elements) == 3

def test_partial_failure():
    """
    Rule 52: Partial Failure.
    If 2 items succeed and 1 fails, report PARTIAL_SUCCESS.
    """
    adapter = MockRevitExecutionAdapter()
    # Instruct the mock adapter to fail specifically when creating a Door
    adapter.simulate_failure_on_element = "Door"
    
    engine = ExecutionEngine(adapter)
    
    design = {
        "commands": [
            {"commandId": "cmd_lvl", "commandType": "CREATE_LEVEL", "parameters": {"name": "L1", "elevation": 0.0}},
            # We must create a wall to host the door, otherwise it fails on INVALID_HOST instead of SIMULATED_FAILURE
            {"commandId": "cmd_wall", "commandType": "CREATE_WALL", "parameters": {"geometry": {}}},
            {"commandId": "cmd_door", "commandType": "CREATE_DOOR", "parameters": {"geometry": {}, "host_wall": "cmd_wall"}}
        ]
    }
    
    result = engine.execute_design(design)
    
    # Execution completes but verification flags partial
    assert result["status"] == "PARTIAL_SUCCESS"
    assert result["verification"]["expected_elements"] == 3
    assert result["verification"]["verified_elements"] == 2
    assert "cmd_door" in result["verification"]["failed_commands"]
    assert len(adapter.elements) == 2 # Level and Wall were created
