@echo off
echo Setting up Zaui Coffee Database...

REM Set PostgreSQL path
set PGPATH="C:\Program Files\PostgreSQL\17\bin"
set PGPASSFILE=%~dp0.pgpass

REM Create database
echo Creating database...
%PGPATH%\psql.exe -U postgres -h localhost -c "CREATE DATABASE zaui_coffee_db;"

REM Run schema
echo Running schema...
%PGPATH%\psql.exe -U postgres -h localhost -d zaui_coffee_db -f "%~dp0database\schema.sql"

echo Database setup completed!
pause
