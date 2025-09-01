@echo off
echo Setting up Keyboard Warrior...
echo.

echo Installing root dependencies...
call npm install

echo.
echo Installing frontend dependencies...
cd frontend
call npm install

echo.
echo Installing backend dependencies...
cd ../backend
call npm install

cd ..
echo.
echo Setup complete! Run 'npm run dev' to start the development servers.
pause