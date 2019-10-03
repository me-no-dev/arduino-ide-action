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
    const ainfo = await exec.exec('ls', ['-l', archive]);
    console.log(`LS: ${ainfo}`);
    var arduino_ide = "";
    if (os_type === "linux"){
      await io.mv(archive, 'arduino.tar.xz');
      await exec.exec('tar', ['xf', 'arduino.tar.xz']);
      await io.mv('arduino-nightly', ide_path);
      arduino_ide = ide_path;
    } else {
      await io.mv(archive, 'arduino.zip');
      
      if(os_type === "darwin"){
        try {
          await exec.exec('unzip', ['arduino.zip']);
        } catch (error) {console.log(`UNZIP ERROR: ${error.message}`);}
        ide_path = ide_path + "/Contents/Java"
      } else {
        arduino_ide = await tc.extractZip('arduino.zip', ide_path); // archive_path, dst_path
      }
    }
    console.log(`Archive: ${archive}, Extracted: ${arduino_ide}`);
    const aiinfo = await exec.exec('ls', ['-l', arduino_ide]);
    console.log(`LS IDE: ${aiinfo}`);



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
