import { homedir } from "os";
import { join as pathJoin } from "path";
import * as fs from "fs";

/**
 * Class that can retrieve and edit different configuration keys
 * in the `conf.json` file. Used for storing settings of the program.
 */
export class Configuration {
  static confFolder = pathJoin(homedir() + "/.svanager/");
  static confFile = "conf.json";
  static confPath = pathJoin(Configuration.confFolder, Configuration.confFile);

  /**
   * Checks whether the `conf.json` and `~/.svanager` paths exist
   * and creates them if they don't.
   */
  private static checkForFile(): void {
    if (fs.existsSync(this.confPath)) return;
    if (!fs.existsSync(this.confFolder)) {
      fs.mkdirSync(this.confFolder);
    }
    fs.writeFileSync(this.confPath, "{}");
  }

  /**
   * Retrieves a key from the `conf.json` file.
   * @param {string} name - The name of the key
   * @returns {any} Value of the key
   */
  static getKey(name: string): any {
    this.checkForFile();
    const file = fs.readFileSync(this.confPath);
    const json = JSON.parse(file.toString());
    return json[name];
  }

  /**
   * Sets a value of a key in the `conf.json` file.
   * @param {string} name - The name of the key 
   * @param {any} value - The value to be set
   */
  static setKey(name: string, value: any) {
    this.checkForFile();
    const file = fs.readFileSync(this.confPath);
    const json = JSON.parse(file.toString());
    json[name] = value;
    fs.writeFileSync(this.confPath, JSON.stringify(json));
  }

  /**
   * Retrieves an object representation of the configuration.
   * Used in tandem with {@link Configuration#setConfiguration} to set more
   * complex keys.
   * @returns {object} An object representation of the configuration
   */
  static getConfiguration(): object {
    this.checkForFile();
    const file = fs.readFileSync(this.confPath);
    const json = JSON.parse(file.toString());
    return json;
  }

  /**
   * Sets the configuration according to the `json` parameter.
   * The parameter is usually a modified version of the object retrieved
   * by the {@link Configuration#getConfiguration} function.
   * @param {object} json - A JSON representation of the whole configuration
   */
  static setConfiguration(json: object) {
    this.checkForFile();
    fs.writeFileSync(this.confPath, JSON.stringify(json));
  }
}
