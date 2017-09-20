#!/bin/bash
set -e

docker tag ledprinter sealsystems/ledprinter:linux-$ARCH-$TRAVIS_TAG
docker push sealsystems/ledprinter:linux-$ARCH-$TRAVIS_TAG

if [ $ARCH == "amd64" ]; then
  set +e
  echo "Waiting for other images sealsystems/ledprinter:linux-arm-$TRAVIS_TAG"
  until docker run --rm stefanscherer/winspector sealsystems/ledprinter:linux-arm-$TRAVIS_TAG
  do
    sleep 15
    echo "Try again"
  done
  until docker run --rm stefanscherer/winspector sealsystems/ledprinter:linux-arm64-$TRAVIS_TAG
  do
    sleep 15
    echo "Try again"
  done
  set -e

  echo "Downloading manifest-tool"
  wget https://github.com/estesp/manifest-tool/releases/download/v0.6.0/manifest-tool-linux-amd64
  mv manifest-tool-linux-amd64 manifest-tool
  chmod +x manifest-tool
  ./manifest-tool

  echo "Pushing manifest sealsystems/ledprinter:$TRAVIS_TAG"
  ./manifest-tool push from-args \
    --platforms linux/amd64,linux/arm,linux/arm64 \
    --template sealsystems/ledprinter:OS-ARCH-$TRAVIS_TAG \
    --target sealsystems/ledprinter:$TRAVIS_TAG

  echo "Pushing manifest sealsystems/ledprinter:latest"
  ./manifest-tool push from-args \
    --platforms linux/amd64,linux/arm,linux/arm64 \
    --template sealsystems/ledprinter:OS-ARCH-$TRAVIS_TAG \
    --target sealsystems/ledprinter:latest
fi
