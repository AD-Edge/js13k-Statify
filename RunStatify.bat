::RunStatify
::Commands and functions to manage your files and generate data
::Might replace this with JS if I can, but this will do for now

::Init
@ECHO "test"


@REM IF NOT EXIST "\test" md \test

@echo off
cls


@REM set backupFilename=%DATE:~10,4%%DATE:~4,2%%DATE:~7,2%

@REM date

@REM echo %DATE%

@REM GOTO EXITPRG

echo Checking for js13K Statify setup...
::just check if folder exists? we could also check if any days are missing, play a warning, give an option to create data for that missing day(s), keep going until all structure is good. 

if not exist "test" ( 
    echo Setup folder does not exist. & echo.
    choice /C:YN /M:"Create initial folder structure?"
    IF ERRORLEVEL ==2 GOTO ENDPRG
    IF ERRORLEVEL ==1 GOTO CREATE_SETUP
    GOTO next
)
@REM if exist "C:\ExamplePath\" ( 
if exist "test" ( 
    echo. & echo Project folder 'test' detected - success!
    @REM echo Re-Creating Folder...
    @REM rmdir /s /q "C:\ExamplePath"
)
::Folder exists
::Skip ahead to main questions and functions
GOTO MAINFUNCTION


@REM ::Create initial folders
:CREATE_SETUP
@REM echo First Setup: What date does the gamejam start?


@REM ::set mytime=%time%
@REM ::echo %mytime%

@REM for /F "tokens=2" %%i in ('date /t') do set mydate=%%i
@REM echo %mydate%
@REM GOTO EXITPRG


echo Creating folder structure... 
mkdir "test"
echo Master folder created... 

echo Creating js13k Day(s) 1-30 folder(s)... 

for /l %%x in (1, 1, 30) do (
    echo Creating folder^(s^) for Day %%x
    mkdir "test/day%%x" && mkdir "test/day%%x/%%xraw" && mkdir "test/day%%x/%%xminified"
)
echo Creating Master-Data file... 
echo.>"test/data.txt"


:MAINFUNCTION
echo What would you like to do next? 
    choice /C:PRCX /M:"P: Process new data, R: Read out data status, C: Check overall file and folder setup, X: Exit Program"
    IF ERRORLEVEL ==4 GOTO EXITPRG
    IF ERRORLEVEL ==3 GOTO CHECK_STATUS
    IF ERRORLEVEL ==2 GOTO READ_STATUS
    IF ERRORLEVEL ==1 GOTO PROCESS_DATA
    GOTO next

::Skip ahead to normal exit
GOTO EXITPRG

:PROCESS_DATA
echo. & echo Processing data...
timeout 1 >nul
echo ...
timeout 1 >nul
echo ....
timeout 1 >nul
echo .....
timeout 1 >nul
echo Processing complete! & echo.
GOTO EXITPRG

:READ_STATUS
echo. & echo Reading out data:
timeout 1 >nul
echo 'some data'
timeout 1 >nul
echo 'some more data'
timeout 1 >nul
echo 'even more data'
timeout 1 >nul
echo End of data! & echo.

GOTO EXITPRG

:CHECK_STATUS
echo Checking status of overall file/folder setup... *todo*
GOTO EXITPRG


::Custom Exit for no folder setup
:ENDPRG
echo. & echo Cannot operate without the correct setup.
echo Run again and go though setup options, or run a check to find issues.
::Just Exit
:EXITPRG
echo Script ending...
pause
::Generate folder structure
::  [DayXX] -> 
::      [raw code]
::      [optimised code]

::Iterate folder structure, create master data file


::basic data record - file size / day

::* read in from webapp 



::Additional/TODO
::Process code via command? 

::Setup purely with JS (if thats even practical/possible)

::Extra stat display information (%increase, decrease, code %s etc)