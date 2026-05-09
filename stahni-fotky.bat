#!/bin/bash
# Spusť tento script ve složce kde máš 4u-olomouc.html
# Mac/Linux: chmod +x stahni-fotky.sh && ./stahni-fotky.sh

mkdir -p img/apartman01 img/apartman02 img/apartman03

BASE="http://www.apartman-4u-olomouc.cz/userFiles/img"

echo "Stahuji apartmán 1..."
for i in $(seq 1 10); do
  curl -s -o "img/apartman01/${i}.jpg" "${BASE}/apartman01/${i}.jpg" && echo "  ✓ apartman01/${i}.jpg"
done

echo "Stahuji apartmán 2..."
for i in $(seq 1 7); do
  curl -s -o "img/apartman02/${i}.jpg" "${BASE}/apartman02/${i}.jpg" && echo "  ✓ apartman02/${i}.jpg"
done

echo "Stahuji apartmán 3..."
for i in $(seq 1 11); do
  curl -s -o "img/apartman03/${i}.jpg" "${BASE}/apartman03/${i}.jpg" && echo "  ✓ apartman03/${i}.jpg"
done

echo ""
echo "✅ Hotovo! Nahraj složku img/ na GitHub spolu s HTML."
