#!/bin/bash

docker build -t plossys/seal-printer-simulator:latest .

# Push
if [ "$1" == "--push" ]; then
  echo "Pushing plossys/seal-printer-simulator..."
  docker push plossys/seal-printer-simulator:latest
fi

echo "Done."
