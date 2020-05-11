import { CompilerOptions } from 'typescript';

export type TsconfigJSON = Partial<{
  extends: string | string[];
  compilerOptions: CompilerOptions;
  include: string[];
  exclude: string[];
}>;
