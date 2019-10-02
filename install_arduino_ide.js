const core = require('@actions/core');
const github = require('@actions/github');
const exec = require('@actions/exec');
const io = require('@actions/io');
const tc = require('@actions/tool-cache');
const wait = require('./wait');


// most @actions toolkit packages have async methods
async function run() {
  try { 
    const ide_path = core.getInput('ide_path');
    const usr_path = core.getInput('usr_path');
    const os_type = process.platform;
    console.log(`IDE_PATH: ${ide_path}, USR_PATH: ${usr_path}, OS_TYPE: ${os_type}`)

    core.debug((new Date()).toTimeString())
    wait(1000);
    core.debug((new Date()).toTimeString())

    core.exportVariable('ARDUINO_IDE_PATH', ide_path);
    core.exportVariable('ARDUINO_USR_PATH', usr_path);
    
    const payload = JSON.stringify(process, undefined, 2)
    console.log(`The process: ${payload}`);
  } 
  catch (error) {
    core.setFailed(error.message);
  }
}

run()
