// ==UserScript==
// @name        iclass auto answer
// @description auto answer if match
// @include     /^http\:\/\/iclass.tku.edu.tw\/exam\/\d+\/subjects#\/take$/
// @grant       none
// @version     1.1
// @run-at      document-idle
// @author      @allen0099, @isekai, @Rex65537
// @updateURL   https://raw.githubusercontent.com/allen0099/autoAnswer/master/answer.user.js
// @downloadURL https://raw.githubusercontent.com/allen0099/autoAnswer/master/answer.user.js
// @homepageURL https://github.com/allen0099/autoAnswer
// ==/UserScript==

function fetchAnswer(exam_id) {
    if (exam_id !== undefined) {
        console.log("examID = " + exam_id);
    }

    $.getJSON(`/api/exams/${exam_id}/submissions/storage`, ({id}) => {
        console.log("ID = " + id);
        console.log("========== Answer ==========");
        $.getJSON(`/api/exams/${exam_id}/submissions/${id}`, ansDataCallback)
    })
        .fail(() => fetchAnswer(exam_id))
}

function ansDataCallback(data) {
    var subjectHtmlDataList = document.getElementsByClassName("subject-body");

    data.correct_answers_data.correct_answers.forEach(function (item, index) {
        switch (data.correct_answers_data.correct_answers[index].type) {
            case 'single_selection': {
                for (let option in data.subjects_data.subjects[index].options) {
                    if (data.subjects_data.subjects[index].options[option].is_answer) {
                        // console.log(
                        //   subjectHtmlDataList[i].children[0].getElementsByTagName(
                        //     'input'
                        //   )[option].checked
                        // )
                        console.log(
                            '第' + (parseInt(index) + 1) + '題:',
                            String.fromCharCode(parseInt(option) + 65)
                        );
                        subjectHtmlDataList[index].children[0].getElementsByTagName(
                            'input'
                        )[option].checked = true;
                        subjectHtmlDataList[index].children[0]
                            .getElementsByTagName('input')
                            [option].click()
                    } else {
                        subjectHtmlDataList[index].children[0].getElementsByTagName(
                            'input'
                        )[option].checked = false
                    }
                }
            }
                break;
            case 'fill_in_blank': {
                console.log("第 " + (index + 1) + " 題:");
                item.correct_answers.forEach(ans => {
                    // console.log(subjectHtmlDataList[index].getElementsByClassName("content")[ans.sort]);
                    subjectHtmlDataList[index].getElementsByClassName("content")[ans.sort].focus();
                    subjectHtmlDataList[index].getElementsByClassName("content")[ans.sort].value = ans.content + "$";
                    subjectHtmlDataList[index].getElementsByClassName("content")[ans.sort].click();

                    console.log("==> 第 " + (ans.sort + 1) + " 格", ans.content);
                })
            }
                break;
            default: {
                console.log(
                    '[ERROR!!]',
                    data.correct_answers_data.correct_answers[index].type,
                    "isn't in worklist."
                )
                // console.log()
            }
                break;
        }
    });
    alert("記得把文字框最後的 $ 刪除喔");
    alert("確保進度條是完整的 (100%)");
    alert("Success! See console logs!");
}

fetchAnswer(document.getElementById("examId").value);

