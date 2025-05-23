const { spawn, spawnSync } = require("child_process");

// spawnSync("python", ["C:/Users/NUK_lab/Desktop/Lung_Segmentation/Lung_Segmentation.py"]);

// spawnSync("C:/Users/NUK_lab/Anaconda3/envs/conda_env/python", ["C:/Users/NUK_lab/Desktop/Lung_Nodule_Segmentation/final.py"]);

const pythonProcess = spawn('python', ['t.py', 'test']);

pythonProcess.stdout.on('data', (data) => {
  const result = data.toString().trim();
  console.log('Result from Python:', result);
});

// const { spawn } = require('cross-spawn');

// // Command to activate the Conda environment
// const activateCommand = 'activate';
// const activateArgs = ['conda_env'];

// // Command to run Python script
// const pythonCommand = 'python';
// const pythonArgs = ['C:/Users/NUK_lab/Desktop/Lung_Nodule_Segmentation/final.py'];

// // Spawn the Conda environment activation
// const activateProcess = spawn(activateCommand, activateArgs);

// activateProcess.on('close', (activateCode) => {
//   if (activateCode === 0) {
//     // Conda environment activation succeeded, now run Python script
//     const pythonProcess = spawn(pythonCommand, pythonArgs, { stdio: 'inherit' });

//     pythonProcess.on('close', (pythonCode) => {
//       console.log(`Python script exited with code ${pythonCode}`);
//     });
//   } else {
//     console.error('Failed to activate Conda environment');
//   }
// });

// const { execSync, spawnSync } = require('child_process');

// const activateCommand = 'conda activate conda_env';

// try {
//   execSync(activateCommand, { stdio: 'inherit', shell: true });
//   spawnSync("python", ["C:/Users/NUK_lab/Desktop/Lung_Nodule_Segmentation/final.py"]);
// } catch (error) {
//   console.error('Failed to activate Conda environment:', error);
// }

