const chalk = require('chalk');
const templates = require("./template");

module.exports = () => {
    let list = templates.list;

    if (!templates.list || list.length == 0) {
        console.log('\n' + chalk.red('当前无可用模板') + '\n');

        return false;
    }

    for (let key in list) {
        console.log(
            '  ' + chalk.rgb(69, 189, 207)((Number(key) + 1) + '.') +
            chalk.rgb(69, 189, 207)(list[key].name) +' - ' +
            list[key].desc
        );
    }
    console.log('\n');
};