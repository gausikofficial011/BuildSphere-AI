@echo off
cd /d "%~dp0"
echo ======================================================================
echo   BuildSphere AI — Blender 3D Building Synthesizer ^& Bake Engine
echo ======================================================================
echo.
echo [*] Executing headless Blender 5.2 3D mesh generator...

"C:\Program Files\Blender Foundation\Blender 5.2\blender.exe" -b -P Blender/Scripts/ai_2d_to_3d_builder.py -- --stories 3 --width 15 --length 20

echo.
echo ======================================================================
echo [SUCCESS] 3D Building baked and exported!
echo - Blender file : Blender\Buildings\AI_Generated_Building_3D.blend
echo - FBX 3D mesh  : Blender\Exports\AI_Generated_Building_3D.fbx
echo ======================================================================
pause
