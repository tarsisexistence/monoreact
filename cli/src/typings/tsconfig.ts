import { CompilerOptions } from 'typescript';

export type tsconfigJSON = Partial<{
  extends: string | string[];
  compilerOptions: CompilerOptions;
  include: string[];
  exclude: string[];
}>;
