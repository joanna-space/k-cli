const fs = require('fs');
import * as chalk from 'chalk';

module.exports = class K {
    static dir = require.resolve('../store/data.json');

    private data: { [key: string]: string };

    constructor(options: Array<string>){
        this.data = this.read();
        const argvs = options.slice(2);
        switch (argvs[0]) {
            case 'add':
                this.saveDict(argvs.slice(1));
                this.write(this.data);
                break;
            case 'search':
                this.printSearch(this.search(argvs.slice(1)));
                break;
            case 'remove':
                this.removeKey(argvs.slice(1));
                this.write(this.data);
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

    search(argvs: Array<string>): Array<string> {
        const outputs: Array<string> = [];
        const dataKey: Array<string> = Object.keys(this.data);
        if ((argvs[0] || '').replace(/^-/, '') === 'a') {
            dataKey.forEach(argv => {
                outputs.push(`${chalk.red(argv)}: ${this.data[argv]}`);
            });
        } else {
            //  支持不完全匹配
            const dictMap: Array<{ key: string, series: string[] }> = [];
            argvs.forEach((argv) => {
                dataKey.forEach((d: string) => {
                    if (d === argv) {
                        dictMap.push({ key: d, series: ['', d, ''] });
                        return;
                    }
                    const startIdx = d.indexOf(argv);
                    if (startIdx > -1) {
                        const end = startIdx + argv.length;
                        dictMap.push({ key: d, series: [
                            d.substring(0, startIdx),
                            d.substring(startIdx, end),
                            d.substring(end),
                        ]});
                    }
                });
            });
            dictMap.forEach(({ key, series: [pre, hl, end]}) => {
                outputs.push(pre + chalk.red(hl) + end + ': ' + this.data[key]);
            });
        }

        return outputs;
    }

    printSearch(valueMap: string[]):void {
        this.prompt(chalk.red('* Your Highness *\n'));
        valueMap.forEach(v => {
            this.prompt(v + '\n');
        })
    }

    removeKey(removeKeys: string[]): void {
        removeKeys.forEach(rKey => {
            if (rKey in this.data) {
                delete this.data[rKey];
            }
        });
        this.prompt('remove succeed.');
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