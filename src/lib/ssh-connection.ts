import { Config as SSHConfig, NodeSSH } from "node-ssh";
import cli from "cli-ux";
import { SSHKey } from "./ssh-manager";

/**
 * Manages the SSH connection, used for executing commands and copying files
 * to a remote machine.
 */
export class SSHConnection {
  private ssh: NodeSSH;

  constructor(host: string, username: string, key: SSHKey, port?: number) {
    this.ssh = new NodeSSH();
    let config: SSHConfig = {
      host: host,
      username: username,
      privateKey: "/home/filip/.ssh/id_rsa",
    };
    if (port) config.port = port;
    this.connect(config, key.password);

    // TODO: implement passwords for keys
    // TODO: implement custom ports for the ssh connection
  }


  private connect(config: SSHConfig, password: boolean, passRetries: number = 0) {
    if (passRetries == 3) {
      console.log("Too many password retries! Exiting.".red);
      return;
    }
    if (password) {
      cli.prompt("SSH key password", { type: "hide" }).then((pass) => {
        config.passphrase = pass;
        this.ssh.connect(config).catch((e) => {
          if (e.errno == "ECONNREFUSED") {
            console.log("The SSH connection was refused.".red);
          } else if (e.message.includes("OpenSSH key integrity check failed")) {
            console.log("Incorrect password!".red);
            this.connect(config, password, ++passRetries);
          } else {
            console.log(e.red);
          }
        });
      });
    } else {
      this.ssh.connect(config);
    }
  }
}
