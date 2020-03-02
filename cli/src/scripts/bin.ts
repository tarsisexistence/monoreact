#!/usr/bin/env node

import sade from 'sade';
import { generateBinCommand } from './generate.bin';
import { addBinCommand } from './add.bin';
import pkg from '../../package.json';

const prog = sade('re-space');

addBinCommand(prog);
generateBinCommand(prog);

prog.version(pkg.version).parse(process.argv);
