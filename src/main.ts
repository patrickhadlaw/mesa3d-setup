import * as core from '@actions/core';
import { installWin } from './install-win';
import { installLinux } from './install-linux';

try {
  if (process.platform === 'win32') {
    installWin();
  } else {
    installLinux();
  }
} catch (error) {
  core.setFailed(error);
}

