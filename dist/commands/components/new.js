"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const core_1 = require("@oclif/core");
const ts_morph_1 = require("ts-morph");
const params_json_1 = tslib_1.__importDefault(require("../../params.json"));
// .\\bin\\dev components new "message" -n="custom"
class ComponentsNew extends core_1.Command {
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
    async run() {
        // const { args, flags } = await this.parse(ComponentsNew);
        const project = new ts_morph_1.Project();
        project.createDirectory("gene");
        const srcFile = project.createSourceFile("gene/generated-component.tsx", undefined, {
            overwrite: true,
        });
        srcFile.addImportDeclaration({
            defaultImport: "React",
            moduleSpecifier: "react",
        });
        const componentInterfaceName = `${params_json_1.default.name}Props`;
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
            name: `${params_json_1.default.name}Component`,
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
            params_json_1.default.inputs.map((param) => {
                wr.writeLine("<div>");
                wr.writeLine(`<label>${param.name}</label>`);
                wr.writeLine(`<input type="${param.type}" name="${param.name}" value="${param.value}"/>`);
                wr.writeLine("</div>");
            });
            wr.writeLine("</div>");
            wr.writeLine(");");
        });
        srcFile.formatText();
        srcFile.saveSync();
    }
}
exports.default = ComponentsNew;
ComponentsNew.usage = "components new MESSAGE [-n <value>]";
ComponentsNew.description = "Generate component with given name and props";
ComponentsNew.examples = [
    '<%= config.bin %> <%= command.id %> "YOUR_MESSAGE" --name "YOUR_NAME"',
];
