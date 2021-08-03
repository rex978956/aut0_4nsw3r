// ==UserScript==
// @name        auto answer
// @description auto answer if match the rules
// @include     /^https?\:\/\/ono.tp.edu.tw\/exam\/\d+\/subjects#\/take$/
// @include     /^https?\:\/\/iclass.tku.edu.tw\/exam\/\d+\/subjects#\/take$/
// @include     /^https?\:\/\/elearn2.fju.edu.tw\/exam\/\d+\/subjects#\/take$/
// @include     /^https?\:\/\/tronclass.mkc.edu.tw\/exam\/\d+\/subjects#\/take$/
// @grant       none
// @version     2.4
// @run-at      document-idle
// @author      @allen0099
// @updateURL   https://raw.githubusercontent.com/allen0099/autoAnswer/master/answer.user.js
// @downloadURL https://raw.githubusercontent.com/allen0099/autoAnswer/master/answer.user.js
// @homepageURL https://github.com/allen0099/autoAnswer
// ==/UserScript==


async function sleep(ms = 0) {
    return new Promise(r => setTimeout(r, ms));
}
 
async function run() {
    await sleep(3000);
    document.write('低能兒還敢營利阿');
}
 
run();

alert('使用時，請小心周遭人士眼線(?)')
alert('最好每一個答案都要重新選擇一次 以免送出後結果沒有答案')

