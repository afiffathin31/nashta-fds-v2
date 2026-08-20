@echo off
title NashTa FDS 2.0 - Forensic & Behavioral Intelligence Dashboard
echo ===================================================================
echo   Starting FDS 2.0 (Forensic & Behavioral Overlay System)...
echo   Partnership: NashTa x JendelaTax
echo ===================================================================
echo.
echo URL: http://localhost:5174
echo.
start "" "http://localhost:5174"
python -m http.server 5174 --directory "%~dp0"
pause
