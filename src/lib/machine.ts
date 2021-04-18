import { SSHConnection } from "./ssh-connection";
import { SSHKey, SSHManager } from "./ssh-manager";

export class Machine {
  public name: string;
  public sshConn?: SSHConnection;
  public hostname: string;
  public sshPort: number;
  public sshUsername: string;
  public sshKeyName: string;

  constructor(name: string, hostname: string, sshPort: number, sshUsername: string, sshKeyName: string) {
    this.name = name;
    this.hostname = hostname;
    this.sshPort = sshPort;
    this.sshUsername = sshUsername;
    this.sshKeyName = sshKeyName;
  }

  connect() {
    const key = SSHManager.getKey(this.sshKeyName);
    this.sshConn = new SSHConnection(this.hostname, this.sshUsername, key, this.sshPort);
  }

}