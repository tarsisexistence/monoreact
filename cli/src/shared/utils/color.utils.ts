import kleur from 'kleur';

export const bold = (msg: string): string => kleur.bold(msg);
export const info = (msg: string): string => kleur.bold().cyan(msg);
export const details = (msg: string): string => kleur.bold().blue(msg);
export const error = (msg: string): string => kleur.bold().red(msg);
export const success = (msg: string): string => kleur.bold().green(msg);
export const highlight = (msg: string): string => kleur.bold().yellow(msg);
export const inverse = (msg: string): string => kleur.inverse(`${msg}`);
export const underline = (msg: string): string => kleur.underline(msg);
