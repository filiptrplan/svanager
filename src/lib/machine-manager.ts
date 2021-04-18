import {join as pathJoin} from "path";
import {homedir} from "os";
import * as fs from "fs";
import { Machine } from "./machine";

export class MachineManager {
  private static confFile = pathJoin(homedir(), '.svanager/machines.json');

  private static checkForFile(): boolean {
    if(fs.existsSync(this.confFile)) return false;
    const initialData = {"machines": []};
    fs.writeFileSync(this.confFile, JSON.stringify(initialData));
    return true;
  }

  static getAllMachines(): Array<Machine> {
    if(this.checkForFile()) return [];
    const file = JSON.parse(fs.readFileSync(this.confFile).toString());
    return file.machines;
  }

  static addMachine(machine: Machine) {
    this.checkForFile();
    let machines = this.getAllMachines();
    machines.push(machine);
    fs.writeFileSync(this.confFile, JSON.stringify({"machines": machines}));
  }
}