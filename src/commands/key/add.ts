import { Command, flags } from "@oclif/command";
import { cli } from "cli-ux";
import { SSHManager } from "../../lib/ssh-manager";
import "colors";

export default class KeyAdd extends Command {
  static description = "Adds an SSH key";
  static examples = ["$ svanager key:add -n my_key -r /home/user/.ssh/id_rsa -u /home/user/.ssh/id_rsa.pub" ]

  static flags = {
    help: flags.help({ char: "h" }),
    name: flags.string({ char: "n", description: "Name of the key" }),
    privateKeyPath: flags.string({
      char: "r",
      description: "Path of the private key",
    }),
    publicKeyPath: flags.string({
      char: "u",
      description: "Path of the public key",
    }),
  };

  async run() {
    const { args, flags } = this.parse(KeyAdd);
    let keyName = "";
    if (flags.name && flags.name.match(/^[\w_]+$/) != null) {
      keyName = flags.name;
    } else {
      do {
        keyName = await cli.prompt(
          "Key name? (only alphanumeric and underscores)"
        );
      } while (keyName.match(/^[\w_]+$/) == null);
    }
    const privateKey =
      flags.privateKeyPath ?? (await cli.prompt("Private key path?"));
    const publicKey =
      flags.publicKeyPath ??
      (await cli.prompt("Public key path? (enter to skip)", {
        required: false,
      }));
    if (publicKey) {
      SSHManager.addKey(keyName, privateKey, publicKey);
    } else {
      SSHManager.addKey(keyName, privateKey);
    }
    console.log("The SSH key " + keyName.bgBlue + " was added.");
  }
}
