const core = require('@actions/core');
const wait = require('./wait');


// most @actions toolkit packages have async methods
async function run() {
  try { 
    const ide_path = core.getInput('ide_path');
    const usr_path = core.getInput('usr_path');
    console.log(`IDE_PATH: ${ide_path}, USR_PATH: ${usr_path}`)

    core.debug((new Date()).toTimeString())
    wait(1000);
    core.debug((new Date()).toTimeString())

    core.setOutput('ide_path', ide_path);
    core.setOutput('usr_path', usr_path);
    core.exportVariable('this_is_STUPID', (new Date()).toTimeString());
  } 
  catch (error) {
    core.setFailed(error.message);
  }
}

run()
