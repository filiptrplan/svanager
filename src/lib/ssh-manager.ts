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
   * @returns True if the folder is newly created.
   */
  private static checkSSHFolder(): boolean {
    if (!fs.existsSync(Configuration.confFolder)) {
      fs.mkdirSync(Configuration.confFolder);
    }
    if (!fs.existsSync(this.sshFolder)) {
      fs.mkdirSync(this.sshFolder);
      return true;
    }
    return false;
  }

  static getKeyNames(): Array<string> {
    if (this.checkSSHFolder()) return [];
    const dir = fs.readdirSync(this.sshFolder);
    let names: Array<string> = [];
    dir.forEach((file) => {
      const match = file.match(/(\S+).(priv)$/);
      if (match) names.push(match[1]);
    });
    return names;
  }

  /**
   * Retrieves the SSH key paths.
   */
  static getKeyPaths(): Array<SSHKeyPaths> {
    const names = this.getKeyNames();
    let paths: Array<SSHKeyPaths> = [];
    names.forEach((e) => {
      const path = this.generateKeyPaths(e);
      if(path.publicKeyPath && fs.existsSync(path.publicKeyPath)) {
        paths.push(path)
      } else {
        paths.push({privateKeyPath: path.privateKeyPath, publicKeyPath: ""});
      }
    });
    return paths;
  }

  /**
   * Adds a SSH key(or keypair) to the `~/.svanager/ssh/` folder.
   */
  static addKey(name: string, privateKeyPath: string, publicKeyPath?: string) {
    this.checkSSHFolder();

    const names = this.getKeyNames();
    names.forEach((currName) => {
      if (currName == name)
        throw new Error("A key with the same name already exists.");
    });

    if (!fs.existsSync(privateKeyPath))
      throw new Error(`The key on ${privateKeyPath} doesn't exist.`);
    if (publicKeyPath && !fs.existsSync(publicKeyPath))
      throw new Error(`The key on ${publicKeyPath} doesn't exist.`);

    fs.copyFileSync(privateKeyPath, pathJoin(this.sshFolder, `${name}.priv`));
    if (publicKeyPath)
      fs.copyFileSync(publicKeyPath, pathJoin(this.sshFolder, `${name}.pub`));
  }

  /**
   * Generates paths for the public and private keys from the key name.
   */
  private static generateKeyPaths(name: string): SSHKeyPaths {
    return {
      privateKeyPath: pathJoin(this.sshFolder, `${name}.priv`),
      publicKeyPath: pathJoin(this.sshFolder, `${name}.pub`),
    };
  }

  /**
   * Used for fetching the contents of a keypair.
   * It also checks if the key is encrypted.
   */
  static getKey(name: string): SSHKey {
    if (this.checkSSHFolder()) throw new Error("No keys exist yet!");
    const keyPaths = this.generateKeyPaths(name);
    if (!fs.existsSync(keyPaths.privateKeyPath)) {
      throw new Error("This key doesn't exist!");
    }

    const privateKey = fs.readFileSync(keyPaths.privateKeyPath).toString();

    let password = false;
    if (privateKey.includes("Proc-Type: 4,ENCRYPTED")) password = true;

    let publicKey;
    if (fs.existsSync(keyPaths.publicKeyPath)) {
      publicKey = fs.readFileSync(keyPaths.publicKeyPath).toString();
    }

    let key: SSHKey = {
      privateKey: privateKey,
      password: password,
    };
    if (publicKey) key.publicKey = publicKey;

    return key;
  }
}

interface SSHKeyPaths {
  privateKeyPath: string;
  publicKeyPath: string;
}

export interface SSHKey {
  privateKey: string;
  publicKey?: string;
  password: boolean;
}
