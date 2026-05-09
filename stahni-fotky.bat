@echo off
REM Spusť tento script ve složce kde máš 4u-olomouc.html
REM Windows: dvojklik na stahni-fotky.bat

mkdir img\apartman01 2>nul
mkdir img\apartman02 2>nul
mkdir img\apartman03 2>nul

set BASE=http://www.apartman-4u-olomouc.cz/userFiles/img

echo Stahuji apartman 1...
for /l %%i in (1,1,10) do curl -s -o "img\apartman01\%%i.jpg" "%BASE%/apartman01/%%i.jpg" && echo   OK apartman01/%%i.jpg

echo Stahuji apartman 2...
for /l %%i in (1,1,7) do curl -s -o "img\apartman02\%%i.jpg" "%BASE%/apartman02/%%i.jpg" && echo   OK apartman02/%%i.jpg

echo Stahuji apartman 3...
for /l %%i in (1,1,11) do curl -s -o "img\apartman03\%%i.jpg" "%BASE%/apartman03/%%i.jpg" && echo   OK apartman03/%%i.jpg

echo.
echo Hotovo! Nahraj slozku img\ na GitHub spolu s HTML.
pause
