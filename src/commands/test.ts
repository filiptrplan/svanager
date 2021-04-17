import Command from "@oclif/command";
import { SSHManager } from "../lib/ssh-manager";
import "colors";
import { SSHConnection } from "../lib/ssh-connection";

export class Test extends Command {
  static description = "description of this example command";

  async run() {
    try {
      const ssh = new SSHConnection('localhost', 'filip', {privateKey: "", password: true});
    } catch(e) {
      console.log(e.message.red);
    }
  }
}
