import { exec } from "child_process";

/**
 * Executes a command in the command line.
 *
 * @param {string} command - The command to execute.
 * @returns {Promise<string>} - A promise that resolves with the output of the command if successful, or rejects with an error if unsuccessful.
 */
export function executeCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else {
        resolve(stdout);
      }
    });
  });
}
