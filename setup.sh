#!/bin/bash

if [[ -z "$2" ]] ; then
  echo "Invalid arguments, expected setup.sh <vulkan-sdk-version> <mesa3d-version>"
  exit -1
fi

choco install wget

if [ "$1" != "none" ] ; then
  # Install Vulkan SDK
  VULKAN_VERSION=$1
  echo "Installing Vulkan SDK version v$VULKAN_VERSION"
  choco install vulkan-sdk --version=$VULKAN_VERSION

  # Download Vulkan runtime binaries
  wget https://sdk.lunarg.com/sdk/download/$VULKAN_VERSION/windows/vulkan-runtime-components.zip
  unzip vulkan-runtime-components.zip
  cp ./VulkanRT-$VULKAN_VERSION-Components/x64/* ./
fi

MESA_VERSION=$2
echo "Installing Mesa3D version v$MESA_VERSION"
choco install meson
wget https://archive.mesa3d.org/mesa-$MESA_VERSION.tar.xz
tar xf mesa-$MESA_VERSION.tar.xz mesa

meson ./mesa/
ninja -C ./mesa/
sudo ninja -C ./mesa/ install
tree ./mesa/
cp ./mesa/lib64 ./
