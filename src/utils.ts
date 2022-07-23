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

export const truncate = (str: string, limit: number): string => {
    if (str.length <= limit)
        return str;
    return str.substring(0, limit - 3) + '...';
};

const trigrams = (s: string): Set<string> => {
    const l = new Set<string>();
    for (let i = 0; i < s.length - 2; i++) {
        l.add(s.substring(i, i + 3));
    }
    return l;
};

export const trigramSimilarity = (a: string, b: string): number => {
    const aTrigrams = trigrams(a);
    const bTrigrams = trigrams(b);

    const intersections = new Set<string>();
    const union = new Set<string>();

    for (const value of aTrigrams) {
        union.add(value);
        if (bTrigrams.has(value))
            intersections.add(value);
    }

    for (const value of bTrigrams)
        union.add(value);

    return intersections.size / union.size;
};

export const sanitizeInput = (input: string): string => input
    .replaceAll('@', '\\@')
    .replaceAll('~~', '\\~\\~')
    .replaceAll('*', '\\*')
    .replaceAll('`', '\\`')
    .replaceAll('_', '\\_');

export function extractTop<T>(target: string, options: T[], stringProducer: (arg: T) => string, count: number): T[] {
    target = target.toLowerCase();
    return options
        .map(option => {
            return { 
                option, 
                similarity: trigramSimilarity(target, stringProducer(option).toLowerCase()),
            };
        })
        .sort((a, b) => b.similarity - a.similarity)
        .map(t => t.option)
        .slice(0, count);
}
