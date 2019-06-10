const exec = require('child_process').exec;

let platform = process.platform;

const contains = function () {
    let flag = false;
    for (let i = 1; i < arguments.length; i++)
        flag = flag || arguments[0].includes(arguments[i]);
    return flag;
};

export const check_firewall = function(){
    if (platform === 'win32') {
        return new Promise(resolve => {
            exec('chcp 65001 | netsh advfirewall show allprofiles',
                function (error, stdout) {
                    exec('chcp 866', function() {
                        let arr = stdout.split('\r\n').filter(el => contains(el, 'State', 'Состояние'));
                        resolve(contains(arr[1], 'ON', 'ВКЛЮЧИТЬ') || contains(arr[2], 'ON', 'ВКЛЮЧИТЬ'));
                    });
                });
        });
    }
    else if (platform === 'linux'){
        return new Promise(resolve => {
            exec('sudo ufw status',
                function (error, stdout, stderr) {
                    let parsedStatus = stdout.split(': ');
                    if ((parsedStatus[1] === 'активен\n') ||
                        (parsedStatus[1] === 'active\n'))
                        resolve(true);
                    resolve(false);
                });
        });
    }
};

const disable_firewall = function () {
    if (platform === 'win32') {
        return new Promise(resolve => {
            exec('netsh advfirewall set publicprofile state off | netsh advfirewall set privateprofile state off',
                function (error, stdout) {
                    if (error)
                        resolve(false);
                    resolve(true);
                });
        });
    } else if (platform === 'linux'){
        return new Promise(resolve => {
            exec('sudo ufw disable',
                function (error) {
                    if (error)
                        resolve(false);
                    resolve(true);
                });
        });
    }
};
