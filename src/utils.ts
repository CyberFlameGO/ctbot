import Levenshtein from 'levenshtein';

// Couldn't figure out how to use these modules without typescript yelling at me
// so I just copy-pasted them here
//
// https://github.com/sindresorhus/strip-indent/blob/main/index.js
// https://github.com/jamiebuilds/min-indent/blob/master/index.js

const indentRegex = /^[ \t]*(?=\S)/gm;

const minIndent = (str: string): number => {
    const match = str.match(indentRegex);
    if (!match)
        return 0;
    return match.reduce((r, a) => Math.min(r, a.length), Infinity);
};

export const trimIndent = (template: TemplateStringsArray, ...substitutions: string[]): string => {
    let string = template[0];
    for (let i = 0; i < substitutions.length; i++)
        string += substitutions[i] + template[i + 1];

    const indent = minIndent(string);
    if (indent === 0)
        return string;
    
    const regex = new RegExp(`^[ \\t]{${indent}}`, 'gm');
    return string.replace(regex, '').trim();
};

export const sanitizeInput = (input: string): string => input
    .replaceAll('@', '\\@')
    .replaceAll('~~', '\\~\\~')
    .replaceAll('*', '\\*')
    .replaceAll('`', '\\`')
    .replaceAll('_', '\\_');

export const ratio = (a: string, b: string) => new Levenshtein(a, b).distance;

export function extractTop<T>(target: string, options: T[], stringProducer: (arg: T) => string, count: number): T[] {
    return options
        .map(option => {
            const str = stringProducer(option);
            return { option, string: str, distance: ratio(target, str) };
        })
        .sort((a, b) => a.distance - b.distance)
        .slice(0, count)
        .map(t => t.option);
}
