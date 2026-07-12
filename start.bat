@echo off
setlocal EnableExtensions

set "PROJECT_DIR=%~dp0"
set "PROJECT_DIR=%PROJECT_DIR:~0,-1%"
set "VENV_DIR=%PROJECT_DIR%\.venv"
set "VENV_PY=%VENV_DIR%\Scripts\python.exe"
cd /d "%PROJECT_DIR%" || exit /b 1

set "COMMAND=%~1"
if "%COMMAND%"=="" (
  set "COMMAND=ui"
) else (
  if "%COMMAND:~0,1%"=="-" (
    set "COMMAND=ui"
  ) else (
    shift /1
  )
)

if /i "%COMMAND%"=="ui" goto ui
if /i "%COMMAND%"=="setup" goto setup
if /i "%COMMAND%"=="install" goto setup
if /i "%COMMAND%"=="doctor" goto doctor
if /i "%COMMAND%"=="example" goto example
if /i "%COMMAND%"=="shell" goto shell
if /i "%COMMAND%"=="help" goto help
if /i "%COMMAND%"=="-h" goto help
if /i "%COMMAND%"=="--help" goto help

call :usage
echo ERROR: Unknown command: %COMMAND% 1>&2
exit /b 1

:ui
call :ensure_dependencies 0 || exit /b 1
"%VENV_PY%" app.py %*
exit /b %ERRORLEVEL%

:setup
call :ensure_dependencies 1 || exit /b 1
echo ==^> Setup complete. Run start.bat to open the UI.
exit /b 0

:doctor
call :doctor_impl
exit /b %ERRORLEVEL%

:example
call :ensure_dependencies 0 || exit /b 1
"%VENV_PY%" examples\single_synapse.py
exit /b %ERRORLEVEL%

:shell
call :ensure_dependencies 0 || exit /b 1
if "%~1"=="" (
  "%VENV_PY%"
) else (
  "%VENV_PY%" %*
)
exit /b %ERRORLEVEL%

:help
call :usage
exit /b 0

:usage
echo kT-RAM Neural Lane Emulator Windows installation and run helper
echo.
echo Usage:
echo   start.bat [command] [options]
echo.
echo Commands:
echo   ui        Set up dependencies if needed, then start the browser UI. Default.
echo   setup     Create .venv and install all Python dependencies, then exit.
echo   install   Alias for setup.
echo   doctor    Check local prerequisites and installed emulator import.
echo   example   Set up dependencies if needed, then run examples\single_synapse.py.
echo   shell     Set up dependencies if needed, then open Python from the project venv.
echo   help      Show this help.
echo.
echo Common UI options:
echo   start.bat --no-browser
echo   start.bat ui --host 127.0.0.1 --port 8000 --no-browser
echo.
echo Environment:
echo   set PYTHON=C:\Path\To\python.exe
echo   start.bat setup
exit /b 0

:select_python
if defined PYTHON (
  set "PYTHON_CMD="%PYTHON%""
  %PYTHON_CMD% --version >nul 2>nul
  if errorlevel 1 (
    echo ERROR: PYTHON is set, but it could not be executed: %PYTHON% 1>&2
    exit /b 1
  )
  exit /b 0
)

where py >nul 2>nul
if not errorlevel 1 (
  py -3 --version >nul 2>nul
  if not errorlevel 1 (
    set "PYTHON_CMD=py -3"
    exit /b 0
  )
)

where python >nul 2>nul
if not errorlevel 1 (
  python --version >nul 2>nul
  if not errorlevel 1 (
    set "PYTHON_CMD=python"
    exit /b 0
  )
)

echo ERROR: Missing Python 3. Install Python 3 for Windows and rerun start.bat setup. 1>&2
exit /b 1

:check_prerequisites
call :select_python || exit /b 1

where git >nul 2>nul
if errorlevel 1 (
  echo ERROR: Missing Git. Install Git for Windows and rerun start.bat setup. 1>&2
  exit /b 1
)

%PYTHON_CMD% -m venv --help >nul 2>nul
if errorlevel 1 (
  echo ERROR: Python venv support is missing. Reinstall Python with venv support enabled. 1>&2
  exit /b 1
)
exit /b 0

:ensure_venv
call :check_prerequisites || exit /b 1
if not exist "%VENV_PY%" (
  echo ==^> Creating virtual environment at .venv
  %PYTHON_CMD% -m venv "%VENV_DIR%" || exit /b 1
)
exit /b 0

:install_dependencies
echo ==^> Installing Python dependencies
"%VENV_PY%" -m pip install -r requirements.txt
exit /b %ERRORLEVEL%

:ensure_dependencies
set "FORCE_INSTALL=%~1"
call :ensure_venv || exit /b 1
if "%FORCE_INSTALL%"=="1" (
  call :install_dependencies
  exit /b %ERRORLEVEL%
)
"%VENV_PY%" -c "import ktram_neural_core" >nul 2>nul
if errorlevel 1 (
  call :install_dependencies
  exit /b %ERRORLEVEL%
)
exit /b 0

:doctor_impl
call :check_prerequisites || exit /b 1
echo Project: %PROJECT_DIR%
echo Python command: %PYTHON_CMD%
%PYTHON_CMD% --version
for /f "delims=" %%G in ('where git') do (
  echo Git command: %%G
  goto doctor_git_version
)
:doctor_git_version
git --version
if exist "%VENV_PY%" (
  echo Virtual environment: %VENV_DIR%
  "%VENV_PY%" -m pip --version
  "%VENV_PY%" -c "import ktram_neural_core" >nul 2>nul
  if errorlevel 1 (
    echo ktram_neural_core import: missing; run start.bat setup
  ) else (
    echo ktram_neural_core import: ok
  )
) else (
  echo Virtual environment: missing; run start.bat setup
)
exit /b 0
