import * as exec from '@actions/exec';
import * as core from '@actions/core';
import * as github from '@actions/github';
import * as io from '@actions/io';
import * as cache from '@actions/cache';
import { VERSION } from './version';

const CONFIG_FILE = 'dummy.conf';

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

function aptQueryFiles(pkg: string): Promise<string[]> {
  return new Promise((resolve, reject) => {
    let result: string[] = [];
    exec.exec('apt-file', ['list', pkg], <exec.ExecOptions> {
      listeners: {
        stdout: out => result.push(out.toString())
      }
    }).then(_ => resolve(result)).catch(e => reject(e));
  });
}

export async function installLinux(): Promise<any> {
  return new Promise(async (resolve, reject) => {
    core.startGroup('Check cache');
    await exec.exec('sudo apt install apt-file').catch(error => reject(error));
    const vulkanVersion = await execWithOutput(
      `/bin/bash -c "apt-cache show libvulkan1 | grep Version | cut -d ' ' -f2 | head -n 1"`
    ).catch(error => reject(error));
    const mesaVersion = await execWithOutput(
      `/bin/bash -c "apt-cache show mesa-vulkan-drivers | grep Version | cut -d ' ' -f2 | head -n 1"`
    ).catch(error => reject(error));
    await exec.exec('sudo apt-file update');
    let cacheFiles = await aptQueryFiles('libvulkan1');
    cacheFiles.push(...await aptQueryFiles('mesa-vulkan-drivers'));
    const cacheName = `${VERSION}-${process.platform}-vulkan${vulkanVersion}-mesa${mesaVersion}`;
    if (await cache.restoreCache(cacheFiles, cacheName) == null) {
      core.endGroup();
      core.startGroup('Installing Vulkan SDK version latest');
      await exec.exec(`sudo apt install libvulkan1 vulkan-utils`);
      core.endGroup();
      core.startGroup('Installing Mesa3D version latest');
      await exec.exec('sudo add-apt-repository ppa:oibaf/graphics-drivers');
      await exec.exec('sudo apt-get update');
      await exec.exec('sudo apt-get upgrade');
      await exec.exec(`sudo apt-get install mesa-vulkan-drivers`);
      await cache.saveCache(cacheFiles, cacheName).catch(error => reject(`failed to save cache: '${error}'`));
    }
    core.endGroup();
    core.startGroup('Installing X server');
    await exec.exec(`sudo apt-get install xorg openbox xserver-xorg-video-dummy`);
    await io.cp(`${__dirname}/../${CONFIG_FILE}`, '/etc/X11/xorg.conf');
    await exec.exec(`sudo startx`);
    core.endGroup();
    resolve();
  });
}
