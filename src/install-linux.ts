import * as exec from '@actions/exec';
import * as core from '@actions/core';

const CONFIG_FILE = 'dummy-1920x1080.conf';

export async function installLinux() {
  await exec.exec('sudo add-apt-repository ppa:oibaf/graphics-drivers');
  await exec.exec('sudo apt update');
  await exec.exec('sudo apt upgrade');
  core.info(`Installing Vulkan SDK version latest`);
  await exec.exec(`sudo apt install libvulkan1 vulkan-utils`);
  core.info(`Installing Mesa3D version latest`);
  await exec.exec(`sudo apt install mesa-vulkan-drivers xorg openbox xserver-xorg-video-dummy`);
  await exec.exec(`startx -config ${CONFIG_FILE}`);
}