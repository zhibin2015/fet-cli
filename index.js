const program = require('commander');
const list = require('./src/list');
const init = require('./src/init');

exports.main = () => {
    program
        .version('0.0.2')
        .usage('<command> [options]');

    program
        .command('list')
        .description('显示模板列表')
        .action(() => {
            list();
        });

    program
        .command('init (template)')
        .description('创建新项目')
        .action((template) => {
            init(typeof template === 'object' ?  '' : template);
        });

    program.parse(process.argv);

    if (program.args.length == 0) {
        program.help();
    }
};