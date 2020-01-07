const fs = require('fs');
import * as chalk from 'chalk';

module.exports = class K {
    static dir = require.resolve('../store/data.json');

    private data: { [key: string]: string };

    constructor (options: Array<string>){
        this.data = this.read();
        const argvs = options.slice(2);
        switch (argvs[0]) {
            case 'add':
                this.saveDict(argvs.slice(1));
                this.write(this.data);
                break;
            case 'search':
                this.prompt(this.search(argvs.slice(1)));
                break;
            default:
                break;
        }
    }

    saveDict(args: Array<string>): void {
        try {
            args.forEach(arg => {
                if (!arg.includes('=')) {
                    this.prompt('error: key & value should be splited by =');
                    throw new Error();
                }
                const kv = arg.split('=');
                if (kv[0] in this.data) {
                    const originV = this.data[kv[0]];
                    if (!originV.includes(kv[1])) {
                        this.data[kv[0]] = [this.data[kv[0]], kv[1]].join(' ');
                    }
                } else {
                    this.data[kv[0]] = kv[1];
                }
            });
        } catch(e) {
            return;
        }
        this.prompt('save succeed.');
    }

    search(argvs: Array<string>): string {
        const outputs: Array<string> = [];
        const dict = (argvs[0] || '').replace(/^-/, '') === 'a'
            ? Object.keys(this.data)
            : argvs;
        dict.forEach(argv => {
            outputs.push(`${argv}: ${this.data[argv]}`);
        });
        return chalk.red('* Your Highness *\n') + outputs.join('\n');
    }

    prompt(msg: string): void {
        console.log(`${msg || 'error: Error'}`);
    }

    read(): { [key: string]: string } {
        const content = fs.readFileSync(K.dir, { encoding: 'utf-8' });
        return JSON.parse(content);
    }

    write(data: { [key: string]: string }): void  {
        fs.writeFileSync(K.dir, JSON.stringify(data));
    }
}