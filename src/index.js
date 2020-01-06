var _a;
var fs = require('fs');
var chalk = require('chalk');
module.exports = (_a = /** @class */ (function () {
        function K(options) {
            this.data = this.read();
            var argvs = options.slice(2);
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
        K.prototype.saveDict = function (args) {
            var _this = this;
            try {
                args.forEach(function (arg) {
                    if (!arg.includes('=')) {
                        _this.prompt('error: key & value should be splited by =');
                        throw new Error();
                    }
                    var kv = arg.split('=');
                    if (kv[0] in _this.data) {
                        var originV = _this.data[kv[0]];
                        if (!originV.includes(kv[1])) {
                            _this.data[kv[0]] = [_this.data[kv[0]], kv[1]].join(' ');
                        }
                    }
                    else {
                        _this.data[kv[0]] = kv[1];
                    }
                });
            }
            catch (e) {
                return;
            }
            this.prompt('save succeed.');
        };
        K.prototype.search = function (argvs) {
            var _this = this;
            var outputs = [];
            var dict = (argvs[0] || '').replace(/^-/, '') === 'a'
                ? Object.keys(this.data)
                : argvs;
            dict.forEach(function (argv) {
                outputs.push(argv + ": " + _this.data[argv]);
            });
            return chalk.red('* Your Highness *\n') + outputs.join('\n');
        };
        K.prototype.prompt = function (msg) {
            console.log("" + (msg || 'error: Error'));
        };
        K.prototype.read = function () {
            var content = fs.readFileSync(K.dir, { encoding: 'utf-8' });
            return JSON.parse(content);
        };
        K.prototype.write = function (data) {
            fs.writeFileSync(K.dir, JSON.stringify(data));
        };
        return K;
    }()),
    _a.dir = require.resolve('./data.json'),
    _a);
