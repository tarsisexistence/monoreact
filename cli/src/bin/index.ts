#!/usr/bin/env node

import sade from 'sade';

import { submodulesBins } from './submodules/submodules.bins';
import { workspacesBins } from './workspaces/workspaces.bins';
import { migrationBins } from './migration/migration.bins';
import { scaffoldingBins } from './scaffolding/scaffolding.bins';
import { executionBins } from './execution/execution.bins';
import { TITLE_CLI } from '../shared/messages';
import pkg from '../../package.json';

const prog = sade('re-space');

console.log(TITLE_CLI);

executionBins(prog);
migrationBins(prog);
scaffoldingBins(prog);
submodulesBins(prog);
workspacesBins(prog);

prog.version(pkg.version).parse(process.argv);
