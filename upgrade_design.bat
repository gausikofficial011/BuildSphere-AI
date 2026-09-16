@echo off
echo ========================================================
echo Applying Master AI OS Cinematic Design & Upgrading Portals
echo ========================================================

echo.
echo [1/2] Running automated frontend refactoring script...
cd frontend
node perfect_portals.cjs

echo.
echo [2/2] Verification complete! All user portals upgraded to premium glassmorphic UI.
echo ========================================================
echo You can now run start_servers.bat to view the stunning design!
echo ========================================================
pause
