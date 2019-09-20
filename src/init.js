const co = require('co');
const prompt = require('co-prompt');
const chalk = require('chalk');
const templates = require("./template");
const ora = require('ora');
const exec = require('child_process').exec;
const fs = require('fs');

let generator = function* (name) {
    let templateName = name;
    let originalName,
        originalPath;

    let list = templates.list;

    console.log('    可用模板列表:');

    for (let key in list) {
        console.log(
            '        ' + chalk.rgb(69, 189, 207)((Number(key) + 1) + '.') +
            chalk.rgb(69, 189, 207)(list[key].name) +' - ' +
            list[key].desc
        );
    }
    console.log('\n');
    templateName = yield prompt('    请选择模板类型:');
    templateName = isNumber(templateName) ? templateName - 1 : templateName;

    if (isNumber(templateName)) {
        originalName = list[templateName].name;
        originalPath = list[templateName].path;
    } else {
        for (let key in list) {
            if (templateName == list[key].name) {
                originalName = list[key].name;
                originalPath = list[key].path;
            }
        }
    }

    downloadTemplate(originalPath, function(spanner) {
        console.log('    ', chalk.green('项目构建成功'));

        fs.rename(originalName, name, (err) => {
            deleteFolderRecursive(name + '/.git');

            spanner.stop();
            process.exit(0);
        });
    });
};

function isNumber(num) {
    return !isNaN(parseFloat(num)) && isFinite(num);
}

function downloadTemplate(path, func) {
    let spanner = ora('   正在构建，请稍等......');

    spanner.start();

    let cmdStr = `git clone ` + path;

    exec(cmdStr, (error, stdout, stderr) => {
        if (error) {
            console.log(error)
            process.exit(0)
        }

        func && func(spanner);
    });
}

function deleteFolderRecursive(path) {
    if( fs.existsSync(path) ) {
        fs.readdirSync(path).forEach(function(file) {
            var curPath = path + "/" + file;
            if(fs.statSync(curPath).isDirectory()) { // recurse
                deleteFolderRecursive(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
};

module.exports = (name) => {
    co(generator(name));
};