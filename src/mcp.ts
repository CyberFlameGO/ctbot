import fs from 'fs/promises';
import { extractTop } from './utils';

export interface Field {
    name: string;
    obfName: string;
    owner: string;
}

export interface Method {
    name: string;
    obfName: string;
    signature: string;
    owner: string;
    static: boolean;
}

export interface Class {
    name: string;
    path: string;
}

const STATIC_METHOD_FILE = './assets/static_methods.txt';
const MCP_SRG_FILE = './assets/mcp-srg.srg';

let classes: Class[] = [];
let fields: Field[] = [];
let methods: Method[] = [];
let staticMethods = new Set<string>();

const init = async () => {
    staticMethods = new Set((await fs.readFile(STATIC_METHOD_FILE)).toString().split('\n'));

    const mcpLines = (await fs.readFile(MCP_SRG_FILE)).toString().split('\n');

    const mcpFields = mcpLines.filter(l => l.startsWith('FD: ')).map(l => l.substring('FD: '.length));
    const mcpMethods = mcpLines.filter(l => l.startsWith('MD: ')).map(l => l.substring('MD: '.length));

    classes = mcpLines
        .filter(l => l.startsWith('CL: '))
        .map(l => l.substring('CL: '.length).split(' ')[0])
        .map(path => {
            const name = path.split('/');
            return { name: name[name.length - 1], path: path };
        })
        .filter(clazz => !clazz.name.match(/\$\d+$/));

    fields = mcpFields.map(field => {
        const [path, obfPath] = field.split(' ');
        const nameParts = path.split('/');
        const name = nameParts[nameParts.length - 1];
        const obfParts = obfPath.split('/');
        const obfName = obfParts[obfParts.length - 1];
        const ownerParts = path.split('/');
        const owner = ownerParts.slice(0, -1).join('/');

        return { name, obfName, owner };
    });

    methods = mcpMethods.map(method => {
        const [path, signature, obfPath] = method.split(' ');
        const nameParts = path.split('/');
        const name = nameParts[nameParts.length - 1];
        const obfParts = obfPath.split('/');
        const obfName = obfParts[obfParts.length - 1];
        const ownerParts = path.split('/');
        const owner = ownerParts.slice(0, -1).join('/');

        return { 
            name,
            obfName,
            signature: signature.replace(')', ')\u200B'),
            owner,
            static: staticMethods.has(obfName),
        };
    });
};

init();

export const fieldsFromName = (name: string, obf: boolean) => extractTop(
    name,
    fields,
    field => obf ? field.obfName : field.name,
    5,
);

export const methodsFromName = (name: string, obf: boolean) => extractTop(
    name,
    methods,
    method => obf ? method.obfName : method.name,
    5,
);

export const classesFromName = (name: string) => extractTop(
    name,
    classes,
    clazz => clazz.name,
    5,
);
