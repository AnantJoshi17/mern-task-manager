@echo off
REM setup.bat - run this once to get the project ready.
REM   Windows: double-click this file, or run  setup.bat  in the terminal.
REM
REM It installs dependencies, creates your .env files, and opens VS Code.

echo.
echo Setting up the MERN Task Manager
echo ================================
echo.

REM --- Check Node is installed ---
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js is not installed.
  echo Install it from https://nodejs.org ^(choose the LTS version^), then run this again.
  pause
  exit /b 1
)

for /f "tokens=*" %%v in ('node -v') do echo Node.js %%v found.
echo.

REM --- Create .env files from the examples, but never overwrite existing ones ---
if not exist "server\.env" (
  copy "server\.env.example" "server\.env" >nul
  echo Created server\.env  - you still need to put your MongoDB URI in it.
) else (
  echo server\.env already exists, leaving it alone.
)

if not exist "client\.env" (
  copy "client\.env.example" "client\.env" >nul
  echo Created client\.env  - no changes needed for local work.
) else (
  echo client\.env already exists, leaving it alone.
)

echo.
echo Installing backend packages...
cd server
call npm install --no-audit --no-fund
cd ..

echo.
echo Installing frontend packages...
cd client
call npm install --no-audit --no-fund
cd ..

echo.
echo Installing the script that runs both at once...
call npm install --no-audit --no-fund

REM --- Open VS Code if it is available ---
echo.
where code >nul 2>nul
if errorlevel 1 (
  echo The 'code' command was not found, so I could not open VS Code.
  echo Open VS Code and use File ^> Open Folder to open this folder.
) else (
  start "" code .
  echo VS Code opened.
)

echo.
echo ================================
echo Done. Two things left:
echo.
echo   1. Put your MongoDB connection string in server\.env
echo      ^(free database at https://www.mongodb.com/atlas - see README^)
echo.
echo   2. Run:  npm run dev
echo      Then open http://localhost:5173
echo.
pause
