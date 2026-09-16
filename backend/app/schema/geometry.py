from pydantic import BaseModel, Field
from typing import Optional, List

class Point3D(BaseModel):
    x: float
    y: float
    z: float

class BoundingBox(BaseModel):
    min_pt: Point3D
    max_pt: Point3D

class GeometryFeatures(BaseModel):
    length: Optional[float] = None
    width: Optional[float] = None
    height: Optional[float] = None
    area: Optional[float] = None
    volume: Optional[float] = None
    centroid: Optional[Point3D] = None
    bounding_box: Optional[BoundingBox] = None
