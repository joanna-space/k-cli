#!/usr/bin/env node
require('../dist/preface');
const K = require('../dist/index');
const Help = require('../dist/help');

const help = new Help(process.argv);

if (!help.forHelp) {
    const k = new K(process.argv);
}