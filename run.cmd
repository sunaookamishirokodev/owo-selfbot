@echo off

echo Installing dependencies...
call npm run init
IF %ERRORLEVEL% NEQ 0 (
    echo Failed to install dependencies.
    exit /b 1
)

echo Starting Tool...
npm start

pause