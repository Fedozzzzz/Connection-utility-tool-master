//export const check_wifi = function () {
//    return true;
//};

const check_port = function () {
    return false;
};

const check_security_apps = function () {
    return true;
};

const firewallCheck = () => {
    return true
};


let exec = require('child_process').exec,child;
const autoenc = require('node-autodetect-utf8-cp1251-cp866');
const iconv = require('iconv-lite');

const WirelessWindowsE = "Wireless";
const WirelessWindowsR = "Беспроводная сеть";

let platform = process.platform;

const contains = function () {
    let flag = false;
    for (let i = 1; i < arguments.length; i++)
        flag = flag || arguments[0].includes(arguments[i]);
    return flag;
};

const check_wifi = function(){
    if (platform === 'win32') {
        return new Promise(resolve => {
            child = exec('chcp 65001 | netsh interface show interface',
                function (error, stdout) {
                    exec('chcp 866', function(){
                        console.log(stdout);
                        resolve(stdout.toString().split('\r\n')
                            .filter(el => contains(el, WirelessWindowsR, WirelessWindowsE) && contains(el, 'Connected'))
                            .length !== 0);
                    });
                });
        });
    }
    else if (platform === 'linux'){
        return new Promise(resolve => {
            child = exec('iwconfig',
                function (error, stdout, stderr) {
                    let parsedStr = stdout.split('ESSID:')[1].split(' ');
                    if (parsedStr[0] !== 'off/any')
                        resolve(true);
                    resolve(false);
                });
            child.stdout.setEncoding('utf8');
        });
    }
};

const disable_wifi = function () {
    if (platform === 'win32') {
        return new Promise(resolve => {
            exec('netsh wlan disconnect',
                function (error, stdout) {
                    if (error) resolve(false);
                    resolve(true);
                });
        });
    } else if (platform === 'linux'){
        return new Promise(resolve => {
            exec('nmcli radio wifi off',
                function (error) {
                    if (error)
                        resolve(false);
                    resolve(true);
                });
        });
    }
};

//disable_wifi().then(res => console.log(res));
check_wifi().then(res => console.log(res));