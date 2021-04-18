import {join as pathJoin} from "path";
import {homedir} from "os";
import * as fs from "fs";
import { Machine } from "./machine";

export class MachineManager {
  private static confFile = pathJoin(homedir(), 'machines.json');

  private static checkForFile(): boolean {
    if(fs.existsSync(this.confFile)) return false;
    const initialData = {"machines": []};
    fs.writeFileSync(this.confFile, JSON.stringify(initialData));
    return true;
  }

  static getAllMachines(): Array<Machine> {
    if(this.checkForFile()) return [];
    const file = JSON.parse(fs.readFileSync(this.confFile).toString());
    let machines: Array<Machine> = [];
    file.machines.forEach(element => {
      machines.push(new Machine(element.name, element.hostname, element.sshPort, element.sshUsername, element.sshKeyName));
    });
    return machines;
  }

  static addMachine(machine: Machine) {
    this.checkForFile();
    let machines = this.getAllMachines();
    machines.push(machine);
    fs.writeFileSync(this.confFile, JSON.stringify({"machines": machines}));
  }
}