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
    const home = (os_type === "win32")?(process.env['HOMEDRIVE'] + process.env['HOMEPATH']):process.env['HOME'];
    const path_delimiter = (os_type === "win32")?'\\':'/';

    var arduino_ide = ide_path;
    if (!arduino_ide.startsWith("/")){
      arduino_ide = home + path_delimiter + arduino_ide;
    }

    var arduino_usr = usr_path;
    if (!arduino_usr.startsWith("/")){
      arduino_usr = home + path_delimiter + arduino_usr;
    }

    console.log(`IDE_PATH: ${arduino_ide}, USR_PATH: ${arduino_usr}, OS_TYPE: ${os_type}, OS_ARCH: ${os_arch}`)

    var arduino_archive = "linux64.tar.xz";
    if (os_type === "win32"){
      arduino_archive = "windows.zip";
    } else if(os_type === "darwin"){
      arduino_archive = "macosx.zip";
    }
    const ide_url = `https://www.arduino.cc/download.php?f=/arduino-nightly-${arduino_archive}`;
    const archive = await tc.downloadTool(ide_url);

    if (os_type === "linux"){
      await io.mv(archive, 'arduino.tar.xz');
      await exec.exec('tar', ['xf', 'arduino.tar.xz']);
      await io.mv('arduino-nightly', arduino_ide);
      await io.rmRF('arduino.tar.xz');
    } else {
      await io.mv(archive, 'arduino.zip');
      if(os_type === "darwin"){
        core.startGroup('UnZip IDE')
        await exec.exec('unzip', ['arduino.zip']);
        core.endGroup()
        await io.mv('Arduino.app', arduino_ide);
        arduino_ide += "/Contents/Java"
      } else {
        const arduino_unzip = await tc.extractZip('arduino.zip', 'arduino_unzip');
        await io.cp(arduino_unzip + path_delimiter + "arduino-nightly", arduino_ide, { recursive: true, force: false });
        await io.rmRF(arduino_unzip);
      }
      await io.rmRF('arduino.zip');
    }

    await io.mkdirP(arduino_usr+'/libraries');
    await io.mkdirP(arduino_usr+'/hardware');

    core.exportVariable('ARDUINO_IDE_PATH', arduino_ide);
    core.exportVariable('ARDUINO_USR_PATH', arduino_usr);
  } 
  catch (error) {
    core.setFailed(error.message);
  }
}

run()
