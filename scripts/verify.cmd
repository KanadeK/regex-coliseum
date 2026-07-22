@echo off
setlocal
call npm.cmd run lint || exit /b 1
call npm.cmd run typecheck || exit /b 1
call npm.cmd run test:coverage || exit /b 1
call npm.cmd run test:e2e || exit /b 1
call npm.cmd run build || exit /b 1
