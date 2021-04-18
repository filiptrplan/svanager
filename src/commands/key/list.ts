import {Command, flags} from "@oclif/command"
import { cli } from "cli-ux"
import { SSHManager } from "../../lib/ssh-manager"

export default class KeyList extends Command {
  static description = "Lists all your added SSH keys"

  static flags = {
    help: flags.help({char: "h"}),
  }

  async run() {
    const names = SSHManager.getKeyNames();
    console.log("Names".bold);
    names.forEach(name => {
      console.log(` - ${name}`);
    });
  }
}
