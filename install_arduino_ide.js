const core = require('@actions/core');
const github = require('@actions/github');
const exec = require('@actions/exec');
const io = require('@actions/io');
const tc = require('@actions/tool-cache');
const wait = require('./wait');


// platform: [darwin, linux, win32]
// arch: [arm, arm64, x32, x64]
async function run() {
  try { 
    const ide_path = core.getInput('ide_path');
    const usr_path = core.getInput('usr_path');
    const os_type = process.platform;
    const os_arch = process.arch;
    console.log(`IDE_PATH: ${ide_path}, USR_PATH: ${usr_path}, OS_TYPE: ${os_type}, OS_ARCH: ${os_arch}`)

    core.debug((new Date()).toTimeString())
    wait(1000);
    core.debug((new Date()).toTimeString())

    core.exportVariable('ARDUINO_IDE_PATH', ide_path);
    core.exportVariable('ARDUINO_USR_PATH', usr_path);

    const payload = JSON.stringify(process.env, undefined, 2)
    console.log(`ENV: ${payload}`);
  } 
  catch (error) {
    core.setFailed(error.message);
  }
}

run()
