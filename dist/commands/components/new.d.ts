import { Command } from "@oclif/core";
export default class ComponentsNew extends Command {
    static usage: string;
    static description: string;
    static examples: string[];
    run(): Promise<void>;
}
