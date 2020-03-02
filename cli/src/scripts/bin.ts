#!/usr/bin/env node

import sade from 'sade';
import pkg from '../../package.json';
import { generateBinCommand } from './generate.bin';
import { addBinCommand } from './add.bin';

const prog = sade('re-space');

addBinCommand(prog);
generateBinCommand(prog);

prog.version(pkg.version).parse(process.argv);
