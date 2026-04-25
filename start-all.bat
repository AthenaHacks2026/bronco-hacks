@echo off
start "Backend Server" cmd /k "cd /d %~dp0 && npm run backend"
start "Frontend App" cmd /k "cd /d %~dp0 && npm run frontend"
