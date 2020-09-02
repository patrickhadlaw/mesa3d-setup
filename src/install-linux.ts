import * as exec from '@actions/exec';
import * as core from '@actions/core';
import * as cache from '@actions/cache';

const CONFIG_FILE = 'dummy-1920x1080.conf';

function execWithOutput(command: string): Promise<String> {
  return new Promise((resolve, reject) => {
    let result = '';
    exec.exec(command, undefined, <exec.ExecOptions> {
      listeners: {
        stdout: out => result += out.toString()
      }
    }).then(_ => resolve(result)).catch(e => reject(e));
  });
}

function dpkgQuery(pkg: string): Promise<string[]> {
  return new Promise((resolve, reject) => {
    let result: string[] = [];
    exec.exec('dpkg-query', ['-L', pkg], <exec.ExecOptions> {
      listeners: {
        stdout: out => result.push(out.toString())
      }
    }).then(_ => resolve(result)).catch(e => reject(e));
  });
}

export async function installLinux(): Promise<any> {
  return new Promise(async (resolve, reject) => {
    core.startGroup('Check cache');
    const vulkanVersion = await execWithOutput(
      `/bin/bash -c "apt-cache show libvulkan1 | grep Version | cut -d ' ' -f2 | head -n 1"`
    ).catch(error => reject(error));
    const mesaVersion = await execWithOutput(
      `/bin/bash -c "apt-cache show mesa-vulkan-drivers | grep Version | cut -d ' ' -f2 | head -n 1"`
    ).catch(error => reject(error));
    let cacheFiles = await dpkgQuery('libvulkan1');
    cacheFiles.push(...await dpkgQuery('mesa-vulkan-drivers'));
    const cacheName = `${process.platform}-vulkan${vulkanVersion}-mesa${mesaVersion}`;
    if (await cache.restoreCache(cacheFiles, cacheName) == null) {
      core.endGroup();
      await exec.exec('sudo add-apt-repository ppa:oibaf/graphics-drivers');
      await exec.exec('sudo apt update');
      await exec.exec('sudo apt upgrade');
      core.startGroup('Installing Vulkan SDK version latest');
      await exec.exec(`sudo apt install libvulkan1 vulkan-utils`);
      core.endGroup();
      core.startGroup('Installing Mesa3D version latest');
      await exec.exec(`sudo apt install mesa-vulkan-drivers`);
      await cache.saveCache(cacheFiles, cacheName).catch(error => reject(`failed to save cache: '${error}'`));
    }
    core.endGroup();
    core.startGroup('Installing X server');
    await exec.exec(`sudo apt install xorg openbox xserver-xorg-video-dummy`);
    await exec.exec(`sudo startx -config ${CONFIG_FILE}`);
    core.endGroup();
    resolve();
  });
}
