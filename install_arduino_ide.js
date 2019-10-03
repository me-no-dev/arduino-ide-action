const core = require('@actions/core');
const github = require('@actions/github');
const exec = require('@actions/exec');
const io = require('@actions/io');
const tc = require('@actions/tool-cache');


// platform: [darwin, linux, win32]
async function run() {
  try { 
    const ide_path = core.getInput('ide_path');
    const usr_path = core.getInput('usr_path');
    const os_type = process.platform;
    const os_arch = process.arch;
    console.log(`IDE_PATH: ${ide_path}, USR_PATH: ${usr_path}, OS_TYPE: ${os_type}, OS_ARCH: ${os_arch}`)

    var arduino_archive = "linux64.tar.xz";
    if (os_type === "win32"){
      arduino_archive = "windows.zip";
    } else if(os_type === "darwin"){
      arduino_archive = "macosx.zip";
    }
    const ide_url = `https://www.arduino.cc/download.php?f=/arduino-nightly-${arduino_archive}`;
    const archive = await tc.downloadTool(ide_url);
    var arduino_ide = "";
    if (os_type === "linux"){
      arduino_ide = await tc.extractTar(archive, ide_path); // archive_path, dst_path
    } else {
      arduino_ide = await tc.extractZip(archive, ide_path); // archive_path, dst_path
    }
    console.log(`Archive: ${archive}, Extracted: ${arduino_ide}`);
    // core.exportVariable('ARDUINO_IDE_PATH', ide_path);
    // core.exportVariable('ARDUINO_USR_PATH', usr_path);

    // const payload = JSON.stringify(process.env, undefined, 2)
    // console.log(`ENV: ${payload}`);
  } 
  catch (error) {
    core.setFailed(error.message);
  }
}

run()
