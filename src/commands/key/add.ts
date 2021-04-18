import { Command, flags } from "@oclif/command";
import { cli } from "cli-ux";
import { SSHManager } from "../../lib/ssh-manager";
import "colors";
import { Question } from "inquirer";
import { existsSync } from "fs";
import inquirer = require("inquirer");
import { homedir } from "os";
import { join } from "path";

export default class KeyAdd extends Command {
  static description = "Adds an SSH key";
  static examples = [
    "$ svanager key:add my_key -r /home/user/.ssh/id_rsa -u /home/user/.ssh/id_rsa.pub",
  ];

  static flags = {
    help: flags.help({ char: "h" }),
    privateKeyPath: flags.string({
      char: "r",
      description: "path of the private key",
    }),
    publicKeyPath: flags.string({
      char: "u",
      description: "path of the public key",
    }),
  };

  static args = [{ name: "name" }];

  async run() {
    const { args, flags } = this.parse(KeyAdd);
    inquirer.registerPrompt("fuzzypath", require("inquirer-fuzzy-path"));
    let questions: Array<Question> = [];
    let cliInputs: any = {};

    const pathValidate = (str: string) => {
      return existsSync(str) ?? "This path is invalid.";
    };

    const nameValidate = (str: string) => {
      return str.match(/^[\w_]+$/) != null
        ? true
        : "Only alphanumeric characters and underscored are allowed.";
    };
    const nameQuestion: Question = {
      name: "name",
      message: "Name of the key",
      validate: nameValidate,
    };

    const privKeyQuestion = {
      type: "fuzzypath",
      name: "privateKey",
      message: "Private key path",
      default: join(homedir(), ".ssh/id_rsa"),
      itemType: "file",
      rootPath: homedir(),
      suggestOnly: false,
      depthLimit: 2,
      excludePath: (nodePath: string) => nodePath.startsWith("node_modules"),
    };
    const ynPubKeyQuestion: Question = {
      name: "publicKeyConfirm",
      type: "confirm",
      message: "Do you want to add a public key(used for adding new keys to a machine)?",
    };

    const pubKeyQuestion = {
      type: "fuzzypath",
      name: "publicKey",
      message: "Public key path",
      default: join(homedir(), ".ssh/id_rsa.pub"),
      itemType: "file",
      rootPath: homedir(),
      suggestOnly: false,
      depthLimit: 2,
      excludePath: (nodePath: string) => nodePath.startsWith("node_modules"),
    };

    if (!args.name || nameValidate(args.name) != true) {
      questions.push(nameQuestion);
    } else {
      cliInputs.name = args.name;
    }

    if (!flags.privateKeyPath || !existsSync(flags.privateKeyPath)) {
      questions.push(privKeyQuestion);
    } else {
      cliInputs.privateKey = flags.privateKeyPath;
    }

    if (!flags.publicKeyPath || !existsSync(flags.publicKeyPath)) {
      questions.push(ynPubKeyQuestion);
    } else {
      cliInputs.publicKey = flags.publicKeyPath;
    }

    inquirer.prompt(questions).then((answers) => {
      let data = { ...answers, ...cliInputs };
      if(answers.publicKeyConfirm) {
        inquirer.prompt([pubKeyQuestion]).then((answers2) => {
          data = {...data, ...answers2};
          SSHManager.addKey(data.name, data.privateKey, data.publicKey);
          console.log("The SSH key " + `${data.name}`.bgBlue + " was added.");
        });
      } else {
        SSHManager.addKey(data.name, data.privateKey);
        console.log("The SSH key " + `${data.name}`.bgBlue + " was added.");
      }
    });

  }
}
