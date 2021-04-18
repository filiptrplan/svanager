import { Config as SSHConfig, NodeSSH } from "node-ssh";
import cli from "cli-ux";
import { SSHKey, SSHManager } from "./ssh-manager";
import { Question } from "inquirer";
import inquirer = require("inquirer");
import { parsePrivateKey } from "sshpk";

/**
 * Manages the SSH connection, used for executing commands and copying files
 * to a remote machine.
 */
export class SSHConnection {
  private ssh: NodeSSH;
  private sshConfig: SSHConfig;
  private sshKey: SSHKey;

  constructor(host: string, username: string, key: SSHKey, port?: number) {
    this.ssh = new NodeSSH();
    this.sshKey = key;
    this.sshConfig = {
      host: host,
      username: username,
      privateKey: this.sshKey.privateKey,
    };
    if (port) this.sshConfig.port = port;
  }

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.sshKey.password) {
        const passwordQuestion: Question = {
          name: "password",
          type: "password",
          message: "Enter SSH key passphrase",
          prefix: "",
          suffix: ": ",
          validate: (pass) => {
            try {
              let key = parsePrivateKey(this.sshKey.privateKey, "auto", {
                passphrase: pass
              });
              return true;
            } catch {
              return "Incorrect password.";
            }
          },
        };
        inquirer.prompt([passwordQuestion]).then((answers) => {
          this.sshConfig.passphrase = answers.password;
          this.ssh
            .connect(this.sshConfig)
            .then(() => {
              resolve();
            })
            .catch((e) => {
              if (e.errno == "ECONNREFUSED") {
                reject("The SSH connection was refused.");
              } else {
                reject(e.errno);
              }
            });
        });
      } else {
        this.ssh.connect(this.sshConfig);
      }
    });
  }

  runCmd(command: string) {
    if (!this.ssh.isConnected()) return;
  }
}
