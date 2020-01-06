var chalk = require('chalk');
var Help = /** @class */ (function () {
    function Help(argvs) {
        var args = argvs.slice(2);
        var res = this.is(args);
        this.exec(args, res);
    }
    Help.prototype.exec = function (argvs, testData) {
        if (!testData.is) {
            this.forHelp = false;
            return;
        }
        this.forHelp = true;
        var command = this.clear(argvs, testData);
        this.commandTime = command ? [command] : Help.commands;
        this.commandTime.forEach(function (command) {
            console.log(eval(Help.helpDict[command]));
        });
    };
    Help.prototype.clear = function (argvs, data) {
        for (var i = 0; i < argvs.length; i++) {
            if (i !== data.idx) {
                if (~Help.commands.indexOf(argvs[i])) {
                    return argvs[i];
                }
            }
        }
        return null;
    };
    Help.prototype.is = function (argvs) {
        var args = argvs.map(function (argv) { return argv.replace(/-+/g, ''); });
        var idx = args.findIndex(function (arg) { return ~Help.reg.indexOf(arg); });
        if (~idx) {
            return {
                is: true,
                idx: idx
            };
        }
        return {
            is: false
        };
    };
    Help.reg = ['help', 'h'];
    Help.helpDict = {
        search: 'chalk`search: k {cyan.bold search} [key]`',
        add: 'chalk`add: k {cyan.bold add} [key]=[value]`'
    };
    Help.commands = Object.keys(Help.helpDict);
    return Help;
}());
module.exports = exports = Help;
