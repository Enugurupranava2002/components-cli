import { Args, Command, Flags } from "@oclif/core";
import { Project } from "ts-morph";

import params from "../../params.json";

// .\\bin\\dev components new "message" -n="custom"
export default class ComponentsNew extends Command {
  static usage = "components new MESSAGE [-n <value>]";

  static description = "Generate component with given name and props";

  static examples = [
    '<%= config.bin %> <%= command.id %> "YOUR_MESSAGE" --name "YOUR_NAME"',
  ];

  // static flags = {
  //   // flag with a value (-n, --name=VALUE)
  //   name: Flags.string({
  //     char: "n",
  //     description: "name of component",
  //     default: "GeneratedComponent",
  //   }),
  // };

  // static args = {
  //   message: Args.string({
  //     description: "Message you want to set in component.",
  //     required: true,
  //   }),
  // };

  public async run(): Promise<void> {
    // const { args, flags } = await this.parse(ComponentsNew);

    const project = new Project();

    project.createDirectory("gene");

    const srcFile = project.createSourceFile(
      "gene/generated-component.tsx",
      undefined,
      {
        overwrite: true,
      }
    );

    srcFile.addImportDeclaration({
      defaultImport: "React",
      moduleSpecifier: "react",
    });

    const componentInterfaceName = `${params.name}Props`;

    srcFile.addInterface({
      name: componentInterfaceName,
      isExported: false,
      properties: [
        {
          name: "message",
          type: "string",
        },
      ],
    });

    const componentFunction = srcFile.addFunction({
      name: `${params.name}Component`,
      isDefaultExport: true,
      parameters: [
        {
          name: "props",
          type: componentInterfaceName,
        },
      ],
      returnType: "JSX.Element",
    });

    componentFunction.setBodyText((wr) => {
      wr.writeLine("return (");
      wr.writeLine("<div>");
      params.inputs.map((param) => {
        wr.writeLine("<div>");
        wr.writeLine(`<label>${param.name}</label>`);
        wr.writeLine(
          `<input type="${param.type}" name="${param.name}" value="${param.value}"/>`
        );
        wr.writeLine("</div>");
      });
      wr.writeLine("</div>");
      wr.writeLine(");");
    });

    srcFile.formatText();

    srcFile.saveSync();
  }
}
