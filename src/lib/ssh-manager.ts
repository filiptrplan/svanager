import { homedir } from "os";
import { join as pathJoin } from "path";
import * as fs from "fs";
import { Configuration } from "./configuration";

/**
 * Manages the SSH keys that are used to connect to machines.
 */
export class SSHManager {
  static sshFolder = pathJoin(homedir(), "/.svanager/ssh/");

  /**
   * Checks whether the `~/.svanager/ssh/` folder exists
   * and creates it if it doesn't.
   */
  private static checkSSHFolder() {
    if (!fs.existsSync(Configuration.confFolder)) {
      fs.mkdirSync(Configuration.confFolder);
    }
    if (!fs.existsSync(this.sshFolder)) {
      fs.mkdirSync(this.sshFolder);
    }
  }

  /**
   * Retrieves the SSH key paths.
   * @returns {Array<string>} Array of paths to separate SSH keys.
   */
  static getKeyPaths(): Array<string> {
    this.checkSSHFolder();
    const dir = fs.readdirSync(this.sshFolder);
    let files: Array<string> = [];
    dir.forEach((file) => {
      files.push(pathJoin(this.sshFolder, file));
    });
    return files;
  }

  /**
   * Adds a SSH key(or keypair) to the `~/.svanager/ssh/` folder.
   * @param {string} name - Name of the key
   * @param {string} privateKey - The private key
   * @param {string} [publicKey] - The public key, not used for connecting.
   */
  static addKey(name: string, privateKey: string, publicKey?: string) {
    this.checkSSHFolder();
    const files = fs.readdirSync(this.sshFolder);
    files.forEach((file) => {
      const match = file.match(/(\S+).(pub|priv)$/);
      if(match != null) {
        if(match[1] == name) throw new Error("A key with the same name already exists.");
      }
    });
    fs.writeFileSync(pathJoin(this.sshFolder, `${name}.priv`), privateKey);
    if(publicKey) fs.writeFileSync(pathJoin(this.sshFolder, `${name}.pub`), publicKey);
  }

  /**
   * Generates paths for the public and private keys from the key name.
   * @param name - Name of the key
   * @returns {SSHKeyPaths} Paths for the public and private key
   */
  private static generateKeyPaths(name: string): SSHKeyPaths {
    return {
      privateKeyPath: pathJoin(this.sshFolder, `${name}.priv`),
      publicKeyPath: pathJoin(this.sshFolder, `${name}.pub`)
    };
  }

  /**
   * Used for fetching the contents of a keypair.
   * It also checks if the key is encrypted.
   * @param name - Name of the key
   * @returns {SSHKey} A keypair 
   */
  static getKey(name: string): SSHKey {
    this.checkSSHFolder();
    const keyPaths = this.generateKeyPaths(name);
    if(!fs.existsSync(keyPaths.privateKeyPath)) {
      throw new Error("This key doesn't exist!");
    }

    const privateKey = fs.readFileSync(keyPaths.privateKeyPath).toString();

    let password = false;
    if(privateKey.includes("Proc-Type: 4,ENCRYPTED")) password = true;

    let publicKey;
    if(fs.existsSync(keyPaths.publicKeyPath)) {
      publicKey = fs.readFileSync(keyPaths.publicKeyPath).toString();
    }

    let key: SSHKey = {
      privateKey: privateKey,
      password: password,
    };
    if(publicKey) key.publicKey = publicKey;

    return key;
  }


}

interface SSHKeyPaths {
  privateKeyPath: string,
  publicKeyPath: string,
}

export interface SSHKey {
  privateKey: string,
  publicKey?: string,
  password: boolean,
}
