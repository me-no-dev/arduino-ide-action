const core = require('@actions/core');
const github = require('@actions/github');
const exec = require('@actions/exec');
const io = require('@actions/io');
const tc = require('@actions/tool-cache');
//local module
const wait = require('./wait');

wait(1000);//call the local module exported function

// print environment
const payload = JSON.stringify(process.env, undefined, 2)
console.log(`ENV: ${payload}`);

//
// CORE
//

const myInput = core.getInput('inputName', { required: true }); //get action input
core.setOutput('outputKey', 'outputVal'); //set action output
core.exportVariable('envVar', 'Val'); //set environment variable
core.setSecret('myPassword'); //protect string in the logs
core.addPath('/path/to/mytool'); //add path to PATH
core.setFailed(`Action failed with error ${err}`); //logs the message and sets a failing exit code
core.info('Inside try block');
core.debug('Inside try block');
core.warning('myInput was not set');
core.error(`Error ${err}, action may still succeed though`);

// Manually wrap output
core.startGroup('Do some function')
doSomeFunction()
core.endGroup()

// Wrap an asynchronous function call
const result = await core.group('Do something async', async () => {
  const response = await doSomeHTTPRequest()
  return response
})

//
// EXEC
//
// /**
//  * Interface for exec options
//  */
// export interface ExecOptions {
//   /** optional working directory.  defaults to current */
//   cwd?: string

//   /** optional envvar dictionary.  defaults to current process's env */
//   env?: {[key: string]: string}

//   /** optional.  defaults to false */
//   silent?: boolean

//   /** optional out stream to use. Defaults to process.stdout */
//   outStream?: stream.Writable

//   /** optional err stream to use. Defaults to process.stderr */
//   errStream?: stream.Writable

//   /** optional. whether to skip quoting/escaping arguments if needed.  defaults to false. */
//   windowsVerbatimArguments?: boolean

//   * optional.  whether to fail if output to stderr.  defaults to false 
//   failOnStdErr?: boolean

//   /** optional.  defaults to failing on non zero.  ignore will not fail leaving it up to the caller */
//   ignoreReturnCode?: boolean

//   /** optional. How long in ms to wait for STDIO streams to close after the exit event of the process before terminating. defaults to 10000 */
//   delay?: number

//   /** optional. Listeners for output. Callback functions that will be called on these events */
//   listeners?: {
//     stdout?: (data: Buffer) => void
//     stderr?: (data: Buffer) => void
//     stdline?: (data: string) => void
//     errline?: (data: string) => void
//     debug?: (data: string) => void
//   }
// }

// Execute shell command
await exec.exec('node index.js');
await exec.exec('node', ['index.js', 'foo=bar']);

// Capture output or specify other options
let myOutput = '';
let myError = '';
const options = {};
options.cwd = './lib';
options.listeners = {
  stdout: (data: Buffer) => {
    myOutput += data.toString();
  },
  stderr: (data: Buffer) => {
    myError += data.toString();
  }
};
await exec.exec('node', ['index.js', 'foo=bar'], options);

// You can use it in conjunction with the which function from @actions/io to execute tools that are not in the PATH
const pythonPath: string = await io.which('python', true)
await exec.exec(`"${pythonPath}"`, ['main.py']);

//
// IO
//

await io.mkdirP('path/to/make');

// Recursive must be true for directories
const options = { recursive: true, force: false }
await io.cp('path/to/directory', 'path/to/dest', options);

await io.mv('path/to/file', 'path/to/dest');

await io.rmRF('path/to/directory');
await io.rmRF('path/to/file');

const pythonPath: string = await io.which('python', true);

//
// TOOL-CACHE
//

// download and extract file
if (process.platform === 'win32') {
  const node12Path = tc.downloadTool('https://nodejs.org/dist/v12.7.0/node-v12.7.0-win-x64.zip');
  const node12ExtractedFolder = await tc.extractZip(node12Path, 'path/to/extract/to');

  // Or alternately
  const node12Path = tc.downloadTool('https://nodejs.org/dist/v12.7.0/node-v12.7.0-win-x64.7z');
  const node12ExtractedFolder = await tc.extract7z(node12Path, 'path/to/extract/to');
}
else {
  const node12Path = await tc.downloadTool('https://nodejs.org/dist/v12.7.0/node-v12.7.0-linux-x64.tar.gz');
  const node12ExtractedFolder = await tc.extractTar(node12Path, 'path/to/extract/to'); // archive_path, dst_path
}

// Add folder to cache
const cachedPath = await tc.cacheDir(node12ExtractedFolder, 'node', '12.7.0'); // folder, tool, version
core.addPath(cachedPath); // optionally add to path

// Add file to cache
tc.cacheFile('path/to/exe', 'destFileName.exe', 'myExeName', '1.1.0');

// Find tool in cache
const nodeDirectory = tc.find('node', '12.x', 'x64');
core.addPath(nodeDirectory); // optionally add to path

// List all versions
const allNodeVersions = tc.findAllVersions('node');
console.log(`Versions of node available: ${allNodeVersions}`);

//
// GITHUB
//

// See https://octokit.github.io/rest.js for the API.
// This should be a token with access to your repository scoped in as a secret.
// The YML workflow will need to set myToken with the GitHub Secret Token
// myToken: ${{ secrets.GITHUB_TOKEN }
// https://help.github.com/en/articles/virtual-environments-for-github-actions#github_token-secret
const myToken = core.getInput('myToken');
const octokit = new github.GitHub(myToken);
const { data: pullRequest } = await octokit.pulls.get({
    owner: 'octokit',
    repo: 'rest.js',
    pull_number: 123,
    mediaType: {
      format: 'diff'
    }
});
console.log(pullRequest);

// make GraphQL requests. See https://github.com/octokit/graphql.js for the API
const result = await octokit.graphql(query, variables);

// get the context of the current action
const context = github.context;

// conext properties
// github.context.payload: WebhookPayload
// github.context.eventName: string
// github.context.sha: string
// github.context.ref: string
// github.context.workflow: string
// github.context.action: string
// github.context.actor: string
// github.context.repo: {owner: string; repo: string}
// github.context.issue: {owner: string; repo: string; number: number}

// Get the JSON webhook payload for the event that triggered the workflow
const payload = JSON.stringify(context.payload, undefined, 2)
console.log(`The event payload: ${payload}`);

// Create a new issue in thee same context
const newIssue = await octokit.issues.create({
  ...context.repo,
  title: 'New issue!',
  body: 'Hello Universe!'
});
