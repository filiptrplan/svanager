import {Command, flags} from "@oclif/command"
import { ListQuestion, Question } from "inquirer"
import inquirer = require("inquirer")
import { Machine } from "../../lib/machine"
import { MachineManager } from "../../lib/machine-manager"
import { SSHManager } from "../../lib/ssh-manager"

export default class MachineAdd extends Command {
  static description = "Adds a new machine"

  static flags = {
    help: flags.help({char: "h"}),
    hostname: flags.string({char: "t", description: "hostname of the machine(IP address or domain)"}),
    port: flags.integer({char: "p", description: "port of the SSH service", default: 22}),
    username: flags.string({char: "u", description: "username used to connect by SSH"}),
    key: flags.string({char: "k", description: "name of the SSH key used to connect"}),
  }

  static args = [{name: "name"}]

  async run() {
    const {args, flags} = this.parse(MachineAdd)
    let questions: Array<Question> = [];
    const nameValidate = (str: string) => {
        return str.match(/^[\w_]+$/) != null
          ? true
          : "Only alphanumeric characters and underscored are allowed.";
      }
    const nameQuestion: Question = {
      name: "name",
      message: "Name of the machine",
      validate: nameValidate,
    };
    // Taken from: https://regexr.com/3dt4r
    const hostnameRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$|^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)+([A-Za-z]|[A-Za-z][A-Za-z0-9\-]*[A-Za-z0-9])$/;
    const hostnameValidate = (str: string) => {
        return str.match(hostnameRegex) != null
          ? true
          : "Invalid hostname.";
      };
    const hostnameQuestion: Question = {
      name: "hostname",
      message: "Hostname of the machine(IP address or domain)",
      validate: hostnameValidate
    };
    const portValidate = (str: any) => {
        if(typeof(str) == "number") return true;
        return str.match(/^[0-9]+$/) != null ? true : "Invalid port.";
      };
    const portQuestion: Question = {
      name: "port",
      type: "number",
      message: "Port of the SSH service",
      default: 22,
      validate: portValidate
    };
    const usernameRegex = /^[a-z_]([a-z0-9_-]{0,31}|[a-z0-9_-]{0,30}\$)$/;
    const usernameValidate = (str: string) => {
      return str.match(usernameRegex) != null ? true : "Invalid username.";
    };
    const usernameQuestion: Question = {
      name: "username",
      message: "Username to login with",
      validate: usernameValidate
    };
    const keyQuestion: ListQuestion = {
      name: "key",
      type: "list",
      message: "Choose the SSH key to login with",
      choices: SSHManager.getKeyNames(),
    };

    if(!args.name || nameValidate(args.name) != true) {
      questions.push(nameQuestion);
    }
    if(!flags.hostname || hostnameValidate(flags.hostname) != true) {
      questions.push(hostnameQuestion);
      questions.push(portQuestion);
    }
    if(!flags.username || usernameValidate(flags.username) != true){
      questions.push(usernameQuestion);
    }
    if(!flags.key || SSHManager.getKeyNames().includes(flags.key) == false) {
      questions.push(keyQuestion);
    }
    inquirer.prompt(questions).then((answers) => {
      const data: any = {...args, ...flags, ...answers};
      const machine = new Machine(data.name, data.hostname, data.port, data.username, data.key);
      MachineManager.addMachine(machine);
      console.log("Machine " + `${data.name}`.bgBlue + " was successfully added.");
    });
  }
}
