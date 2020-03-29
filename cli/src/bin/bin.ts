#!/usr/bin/env node

import sade from 'sade';

import { addBinCommand } from './add.bin';
import { generateBinCommand } from './generate.bin';
import { installBinCommand } from './install.bin';
import { TITLE_CLI } from '../helpers/messages/common.messages';
import pkg from '../../package.json';

const prog = sade('re-space');

console.log(TITLE_CLI);

addBinCommand(prog);
generateBinCommand(prog);
installBinCommand(prog);

prog.version(pkg.version).parse(process.argv);
