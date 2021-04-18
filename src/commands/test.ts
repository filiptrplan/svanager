import Command from "@oclif/command";
import { SSHManager } from "../lib/ssh-manager";
import "colors";
import { SSHConnection } from "../lib/ssh-connection";
import * as sshpk from "sshpk";
import { MachineManager } from "../lib/machine-manager";

export class Test extends Command {
  static description = "description of this example command";

  async run() {
  }
}
