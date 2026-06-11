@echo off
set NODE_OPTIONS=--max-old-space-size=6144

echo Rebuilding SkyTracker...
docker-compose down
call bun run build
cd backend && call npm run build && cd ..
docker-compose up --build -d
echo Done! Frontend: http://localhost:8080
pause