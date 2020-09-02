import * as core from '@actions/core';
import * as exec from '@actions/exec';
import * as cache from '@actions/cache';
import * as tc from '@actions/tool-cache';
import * as io from '@actions/io';
import { resolve } from 'path';

const VULKAN_VERSION = '1.2.135.0';
const MESA_VERSION = '20.2.0-rc3';

// TODO: finish implementing windows installation
export async function installWin(): Promise<any> {
  return new Promise(async (resolve, reject) => {
    const githubWorkspacePath = process.env['GITHUB_WORKSPACE'];
    const libPath = `${githubWorkspacePath}/lib`;
    await io.mkdirP(libPath);
    core.info(`Installing Vulkan SDK version v${VULKAN_VERSION}`);
    const vulkanSdkPath = `C:/VulkanSDK/${VULKAN_VERSION}`;
    await exec.exec(`echo "::set-env name=VULKAN_SDK::${vulkanSdkPath}"`);
    await exec.exec(`echo "::set-env name=VK_SDK_PATH::${vulkanSdkPath}"`);
    await exec.exec(`choco install vulkan-sdk --version=${VULKAN_VERSION}`);
    const vulkanRuntimePath = await tc.downloadTool(
      `https://sdk.lunarg.com/sdk/download/${VULKAN_VERSION}/windows/vulkan-runtime-components.zip`,
      './vulkan-runtime-components.zip'
    );
    const extracted = await tc.extractZip(vulkanRuntimePath, './vulkan-runtime-components');
    await io.cp(
      `${extracted}/VulkanRT-${VULKAN_VERSION}-Components/x64/.`,
      libPath,
      <io.CopyOptions> { recursive: true }
    );
  
    core.info(`Installing Mesa3D version v${MESA_VERSION}`);
    await exec.exec('choco install winflexbison pkgconfiglite').catch(reason => {
      throw new Error(`failed to install dependencies: '${reason}'`);
    });
    await exec.exec('python -m pip install scons wheel mako==0.8.0').catch(reason => {
      throw new Error(`failed to install python packages: '${reason}'`);
    });
    const mesaTarPath = await tc.downloadTool(
      `https://archive.mesa3d.org/mesa-${MESA_VERSION}.tar.xz`,
      `./mesa-${MESA_VERSION}.tar.xz`
    ).catch(reason => {
      throw new Error(`failed to download Mesa3D tarball: '${reason}'`);
    });
    await exec.exec(`7z e -txz -y -r ./mesa-${MESA_VERSION}.tar.xz`);
    await exec.exec(`7z x -ttar -y ./mesa-${MESA_VERSION}.tar`);
    const mesaSrcDir = `./mesa-${MESA_VERSION}/`;
    process.chdir(mesaSrcDir);
    await exec.exec(`scons`).catch(reason => {
      throw new Error(`failed to build Mesa3D: '${reason}'`);
    });
    await exec.exec('ls -R ./build');
    await io.cp(`${mesaSrcDir}lib64/.`, libPath).catch(reason => {
      throw new Error(`failed to copy Mesa3D binaries: '${reason}'`);
    });
    core.addPath(libPath);
    throw new Error('failed to setup Mesa3D: \'Windows not supported (yet)\'');
  });
}
