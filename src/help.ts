const chalk = require('chalk');

type hInter = { is: boolean, idx?: number };

class Help {
    static reg: string[] = ['help', 'h'];
    static helpDict: { [key: string]: string } = {
        search: 'chalk`search: k {cyan.bold search} [key]`',
        add: 'chalk`add: k {cyan.bold add} [key]=[value]`',
    };
    static commands: string[] = Object.keys(Help.helpDict);

    private commandTime: string[];
    public forHelp: boolean;

    constructor(argvs: Array<string>) {
        const args = argvs.slice(2);
        const res = this.is(args);
        this.exec(args, res);

    }

    public exec(argvs: string[], testData: hInter): void {
        if (!testData.is) {
            this.forHelp = false;
            return;
        }
        this.forHelp = true;
        const command = this.clear(argvs, testData);
        this.commandTime = command ? [command] : Help.commands;
        this.commandTime.forEach((command) => {
            console.log(eval(Help.helpDict[command]));
        });
    }

    private clear(argvs: string[], data: hInter): string | null {
        for (let i = 0; i < argvs.length; i++) {
            if (i !== data.idx) {
                if (~Help.commands.indexOf(argvs[i])) {
                    return argvs[i];
                }
            }
        }
        return null;
    }

    private is(argvs: Array<string>): hInter {
        const args = argvs.map(argv => argv.replace(/-+/g, ''));
        const idx = args.findIndex(arg => ~Help.reg.indexOf(arg));
        if (~idx) {
            return {
                is: true,
                idx,
            }
        }
        return {
            is: false,
        }
    }
}

module.exports = exports = Help;