import { Args, Command, Flags } from "@oclif/core";
import { Project, StructureKind } from "ts-morph";

import reducer from "./reducers.json";

export default class ReducersNew extends Command {
  static description = "generates reducer";

  static examples = ["<%= config.bin %> <%= command.id %>"];

  public async run(): Promise<void> {
    const project = new Project();
    const sourceFile = project.createSourceFile(
      `gene/${reducer.name}.ts`,
      undefined,
      {
        overwrite: true,
      }
    );

    const reducerStateInterfaceName = `${reducer.name}State`;

    // Add type script interfaces
    sourceFile.addInterface({
      name: reducerStateInterfaceName,
      isExported: false,
      properties: [
        { name: "state", type: "{[key:string]:{[key:string]:string}}" },
      ],
    });

    // Add import statements
    sourceFile.addImportDeclaration({
      namedImports: ["Reducer"],
      moduleSpecifier: "react",
    });
    sourceFile.addImportDeclaration({
      namedImports: ["Action"],
      moduleSpecifier: "redux",
    });

    // Create reducer function
    const reducerFunction = sourceFile.addFunction({
      name: reducer.name,
      isExported: true,
      parameters: [
        {
          name: "state",
          type: reducerStateInterfaceName,
        },
        {
          name: "action",
          type: "Action",
        },
      ],
      returnType: reducerStateInterfaceName,
    });

    // Add reducer implementation
    reducerFunction.setBodyText((writer) => {
      writer.writeLine("switch (action.type) {");
      writer.writeLine(`  default: return state;`);
      writer.writeLine("}");
    });

    // Create rootReducer function
    const rootReducerFunction = sourceFile.addFunction({
      name: "rootReducer",
      isExported: true,
      returnType: `Reducer<${reducerStateInterfaceName}, Action>`,
    });

    // Add rootReducer implementation
    rootReducerFunction.setBodyText((writer) => {
      writer.writeLine(`return ${reducer.name};`);
    });

    // Format the source code
    sourceFile.formatText();

    // Save the file
    sourceFile.saveSync();
  }
}
