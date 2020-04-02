// ==UserScript==
// @name        iclass auto answer
// @include     /^http\:\/\/iclass.tku.edu.tw\/exam\/\d+\/subjects#\/take$/
// @grant       none
// @version     1.0
// @run-at      document-idle
// @author      meow
// @description auto answer if match
// ==/UserScript==


// GET http://iclass.tku.edu.tw/exam/18569/subjects#/take
// GET http://iclass.tku.edu.tw/api/exams/{exam_id}/submissions/storage
// in json["id"] 是 {submission_id}
//
// GET http://iclass.tku.edu.tw/api/exams/{exam_id}/submissions/{submission_id}
// in json["correct_answers_data"]["correct_answers"][0]["correct_answers"][0]["content"] is 第 1 題 第 1 格的答案
//
// angular change value
// need exec onChangeSubmission(subject)

// 需要等待 約 10 秒 來等待第一次的 storage 出現，等待 post 發送完畢
setTimeout(function () {
    // 取 exam_id
    const exam_id = document.getElementById("examId").value;
    console.log("examID = " + exam_id);

    // 取 correct answer
    $.get(`/api/exams/${exam_id}/submissions/storage`, ({id}) => {
        console.log("ID = " + id);

        $.get(`/api/exams/${exam_id}/submissions/${id}`, data => {
            data.correct_answers_data.correct_answers.forEach(
                ans => {
                    ans.correct_answers.forEach(
                        c => (
                            console.log(c.content)
                        )
                    )
                }
            );
            alert('Success! See console logs!');
        })
    });
}, 1500);
