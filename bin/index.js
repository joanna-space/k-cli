#!/usr/bin/env node
require('../src/preface');
const K = require('../src/index');
const Help = require('../src/help');

const help = new Help(process.argv);

if (!help.forHelp) {
    const k = new K(process.argv);
}