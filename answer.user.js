// ==UserScript==
// @name        auto answer
// @description auto answer if match the rules
// @include     /^https?\:\/\/ono.tp.edu.tw\/exam\/\d+\/subjects#\/take$/
// @include     /^https?\:\/\/iclass.tku.edu.tw\/exam\/\d+\/subjects#\/take$/
// @include     /^https?\:\/\/elearn2.fju.edu.tw\/exam\/\d+\/subjects#\/take$/
// @include     /^https?\:\/\/tronclass.mkc.edu.tw\/exam\/\d+\/subjects#\/take$/
// @grant       none
// @version     2.2
// @run-at      document-idle
// @author      @allen0099
// @updateURL   https://raw.githubusercontent.com/allen0099/autoAnswer/master/answer.user.js
// @downloadURL https://raw.githubusercontent.com/allen0099/autoAnswer/master/answer.user.js
// @homepageURL https://github.com/allen0099/autoAnswer
// ==/UserScript==

function fetchAnswer(exam_id) {
    if (exam_id !== undefined) {
        console.log("examID = " + exam_id);
    }

    $.getJSON(`/api/exams/${exam_id}/submissions/storage`, ({ id }) => {
            console.log("ID = " + id);
            console.log("========== Answer ==========");
            $.getJSON(`/api/exams/${exam_id}/submissions/${id}`, ansDataCallback)
        })
        .fail(() => fetchAnswer(exam_id))
}

function ansDataCallback(data) {
    var subjectHtmlDataList = document.getElementsByClassName("subject-body"); // include analysis
    var real_body = []; // remove analysis

    for (let i = 0; i < subjectHtmlDataList.length; i++) {
        if (subjectHtmlDataList[i].getElementsByClassName("subject-body").length === 0) {
            real_body.push(subjectHtmlDataList[i]);
        }
    }

    var subjects = data.subjects_data.subjects;
    var real_subjects = [];

    for (let i = 0; i < subjects.length; i++) {
        if (subjects[i].type !== "analysis") {
            real_subjects.push(subjects[i]);
        } else {
            for (let j = 0; j < subjects[i].sub_subjects.length; j++) {
                real_subjects.push(subjects[i].sub_subjects[j]);
            }
        }
    }

    var single = [];
    var multiple = [];
    var true_or_false = [];
    var fill_in_blank = [];
    var short_answer = [];
    var analysis = [];

    console.log("===題目分析中===");
    subjects.forEach(function(item, index) {
        switch (item.type) {
            case "single_selection":
                console.log("第 " + (index + 1) + " 單選題");
                single.push(item);
                break;
            case "multiple_selection":
                console.log("第 " + (index + 1) + " 多選題");
                multiple.push(item);
                break;
            case "true_or_false":
                console.log("第 " + (index + 1) + " 是非題");
                true_or_false.push(item);
                break;
            case "fill_in_blank":
                console.log("第 " + (index + 1) + " 填空題");
                fill_in_blank.push(item);
                break;
            case "short_answer":
                console.log("第 " + (index + 1) + " 簡答題");
                short_answer.push(item);
                break;
            case "analysis":
                console.log("第 " + (index + 1) + " 題組");
                analysis.push(item);
                break;
            default:
                console.log("第 " + (index + 1) + " 題，類型 " + item.type + " 尚未支援");
                break;
        }
    });

    console.log("===分析結果===");
    console.log("單選共有 " + single.length + " 題");
    console.log("多選共有 " + multiple.length + " 題");
    console.log("是非共有 " + true_or_false.length + " 題");
    console.log("填空共有 " + fill_in_blank.length + " 題");
    console.log("簡答共有 " + short_answer.length + " 題");
    console.log("題組共有 " + analysis.length + " 題");

    console.log("===試圖作答===");
    real_subjects.forEach(function(item, index) {
        switch (item.type) {
            case "single_selection":
                console.log("第 " + (index + 1) + " 單選題");
                item.options.forEach(function(item_option, index_option) {
                    if (item_option.is_answer) {
                        console.log(String.fromCharCode(parseInt(index_option) + 65));
                        real_body[index].getElementsByTagName("input")[index_option].checked = true;
                        real_body[index].getElementsByTagName("input")[index_option].click();
                    } else {
                        real_body[index].getElementsByTagName("input")[index_option].checked = false;
                    }
                });
                break;
            case "multiple_selection":
                console.log("第 " + (index + 1) + " 多選題");
                item.options.forEach(function(item_option, index_option) {
                    if (item_option.is_answer) {
                        console.log(String.fromCharCode(parseInt(index_option) + 65));
                        if (!real_body[index].getElementsByTagName("input")[index_option].checked) {
                            real_body[index].getElementsByTagName("input")[index_option].click();
                        }
                    } else {
                        if (real_body[index].getElementsByTagName("input")[index_option].checked) {
                            real_body[index].getElementsByTagName("input")[index_option].click();
                        }
                    }
                });
                break;
            case "true_or_false":
                console.log("第 " + (index + 1) + " 是非題");
                item.options.forEach(function(item_option, index_option) {
                    if (item_option.is_answer) {
                        console.log(String.fromCharCode(parseInt(index_option) + 65));
                        if (!real_body[index].getElementsByTagName("input")[index_option].checked) {
                            real_body[index].getElementsByTagName("input")[index_option].click();
                        }
                    } else {
                        if (real_body[index].getElementsByTagName("input")[index_option].checked) {
                            real_body[index].getElementsByTagName("input")[index_option].click();
                        }
                    }
                });
                break;
            case "fill_in_blank":
                console.log("第 " + (index + 1) + " 填空題");
                item.correct_answers.forEach(ans => {
                    // console.log(subjectHtmlDataList[index].getElementsByClassName("content")[ans.sort]);
                    $(subjectHtmlDataList[index].getElementsByClassName("content")[ans.sort]).val(ans.content);
                    $(subjectHtmlDataList[index].getElementsByClassName("content")[ans.sort]).change();
                    console.log("==> 第 " + (ans.sort + 1) + " 格");
                    console.log(ans.content);
                });
                break;
            case "short_answer":
                console.log("第 " + (index + 1) + " 簡答題");
                console.log("==> 簡答題無正確答案，請自行填答");
                break;
            case "analysis":
                console.log("第 " + (index + 1) + " 題組");
                console.log(item.sub_subjects);
                break;
            default:
                console.log("第 " + (index + 1) + " 題，類型 " + item.type + " 尚未支援");
                console.log(item);
                break;
        }
    });
}

fetchAnswer(document.getElementById("examId").value);