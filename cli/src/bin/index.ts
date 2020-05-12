#!/usr/bin/env node

import sade from 'sade';

import { addBinCommand } from './code-generation/add.bin';
import { generateBinCommand } from './code-generation/generate.bin';
import { installBinCommand } from './dependency/install.bin';
import { buildBinCommand } from './execution/build.bin';
import { serveBinCommand } from './execution/serve.bin';
import { testBinCommand } from './execution/test.bin';
import { lintBinCommand } from './execution/lint.bin';
import { submodulesBinCommand } from './submodules/submodules.bin';
import { workspacesBinCommand } from './workspaces/workspaces.bin';
import { independencyBinCommand } from './code-generation/independency.bin';
import { TITLE_CLI } from '../shared/messages';
import pkg from '../../package.json';

const prog = sade('re-space');

console.log(TITLE_CLI);

addBinCommand(prog);
buildBinCommand(prog);
independencyBinCommand(prog);
generateBinCommand(prog);
installBinCommand(prog);
serveBinCommand(prog);
testBinCommand(prog);
lintBinCommand(prog);
workspacesBinCommand(prog);
submodulesBinCommand(prog);

prog.version(pkg.version).parse(process.argv);
