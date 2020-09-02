import * as core from '@actions/core';
import { installWin } from './install-win';
import { installLinux } from './install-linux';

if (process.platform === 'win32') {
  installWin().catch(error => core.setFailed(error));
} else {
  installLinux().catch(error => core.setFailed(error));
}
