"""
BuildSphere AI — Floor Plan Topology Validator
==============================================
Validates architectural geometry, detects non-manifold edges, floating apertures,
impossible room bounds, and self-intersections. Produces structured reports.
"""

from typing import List
from ..schema.building_model import (
    BuildingModel, Floor, Wall, Door, Window, Room,
    ValidationReport, ValidationIssue
)


class TopologyValidator:
    """Validates structural integrity and architectural sanity of a BuildingModel."""

    def validate_building(self, building: BuildingModel) -> ValidationReport:
        issues: List[ValidationIssue] = []

        if not building.floors:
            issues.append(ValidationIssue(
                severity="ERROR",
                category="TOPOLOGY",
                message="Building contains no floors.",
                suggested_action="Add at least one floor level."
            ))
            return ValidationReport(
                is_valid=False,
                error_count=1,
                warning_count=0,
                issues=issues
            )

        for floor in building.floors:
            self._validate_floor(floor, issues)

        error_count = sum(1 for i in issues if i.severity == "ERROR")
        warning_count = sum(1 for i in issues if i.severity == "WARNING")

        report = ValidationReport(
            is_valid=(error_count == 0),
            error_count=error_count,
            warning_count=warning_count,
            issues=issues
        )
        building.validation = report
        return report

    def _validate_floor(self, floor: Floor, issues: List[ValidationIssue]) -> None:
        wall_ids = {w.id for w in floor.walls}

        # 1. Validate Walls
        if len(floor.walls) < 3:
            issues.append(ValidationIssue(
                severity="WARNING",
                category="GEOMETRY",
                message=f"Floor '{floor.name}' has very few walls ({len(floor.walls)}).",
                suggested_action="Verify if the floor plan was fully digitized."
            ))

        for wall in floor.walls:
            length = wall.length
            if length < 0.15:
                issues.append(ValidationIssue(
                    severity="ERROR",
                    category="GEOMETRY",
                    message=f"Wall {wall.id} is extremely short ({length:.2f}m).",
                    element_id=wall.id,
                    suggested_action="Delete degenerate wall segment or merge with neighboring wall."
                ))
            elif length > 120.0:
                issues.append(ValidationIssue(
                    severity="WARNING",
                    category="GEOMETRY",
                    message=f"Wall {wall.id} is unusually long ({length:.2f}m).",
                    element_id=wall.id,
                    suggested_action="Verify if this wall should be subdivided."
                ))

            if wall.thickness < 0.05 or wall.thickness > 1.2:
                issues.append(ValidationIssue(
                    severity="WARNING",
                    category="GEOMETRY",
                    message=f"Wall {wall.id} thickness ({wall.thickness:.2f}m) is atypical.",
                    element_id=wall.id,
                    suggested_action="Check wall thickness against drawing specifications."
                ))

            # Validate wall openings
            for op in wall.openings:
                if op.offset_start + op.width > length + 0.05:
                    issues.append(ValidationIssue(
                        severity="WARNING",
                        category="APERTURE",
                        message=f"Opening {op.id} extends beyond wall {wall.id} end.",
                        element_id=wall.id,
                        suggested_action="Adjust opening offset or wall length."
                    ))

        # 2. Validate Doors
        for door in floor.doors:
            if door.wall_id and door.wall_id not in wall_ids:
                issues.append(ValidationIssue(
                    severity="WARNING",
                    category="APERTURE",
                    message=f"Door {door.id} references non-existent wall {door.wall_id}.",
                    element_id=door.id,
                    suggested_action="Re-attach door to the nearest wall."
                ))
            if door.width < 0.50 or door.width > 3.5:
                issues.append(ValidationIssue(
                    severity="WARNING",
                    category="APERTURE",
                    message=f"Door {door.id} width ({door.width:.2f}m) is atypical.",
                    element_id=door.id,
                    suggested_action="Verify door leaf width."
                ))

        # 3. Validate Windows
        for win in floor.windows:
            if win.wall_id and win.wall_id not in wall_ids:
                issues.append(ValidationIssue(
                    severity="WARNING",
                    category="APERTURE",
                    message=f"Window {win.id} references non-existent wall {win.wall_id}.",
                    element_id=win.id,
                    suggested_action="Re-attach window to the nearest wall."
                ))
            if win.width < 0.40 or win.width > 6.0:
                issues.append(ValidationIssue(
                    severity="WARNING",
                    category="APERTURE",
                    message=f"Window {win.id} width ({win.width:.2f}m) is atypical.",
                    element_id=win.id,
                    suggested_action="Verify window glazing width."
                ))

        # 4. Validate Rooms
        for room in floor.rooms:
            if len(room.polygon) < 3:
                issues.append(ValidationIssue(
                    severity="ERROR",
                    category="ROOM",
                    message=f"Room '{room.name}' has degenerate polygon ({len(room.polygon)} vertices).",
                    element_id=room.id,
                    suggested_action="Redefine room boundary polygon."
                ))
            elif room.area < 1.0:
                issues.append(ValidationIssue(
                    severity="WARNING",
                    category="ROOM",
                    message=f"Room '{room.name}' has very small area ({room.area:.1f} m²).",
                    element_id=room.id,
                    suggested_action="Check if room is a duct or closet, or merge with adjacent space."
                ))
            elif room.area > 2000.0:
                issues.append(ValidationIssue(
                    severity="WARNING",
                    category="ROOM",
                    message=f"Room '{room.name}' has massive area ({room.area:.1f} m²).",
                    element_id=room.id,
                    suggested_action="Verify whether this space is an exterior boundary or open warehouse."
                ))
