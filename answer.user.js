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

function fetchAnswer(exam_id) {
    $.get(`/api/exams/${exam_id}/submissions/storage`, { "exam_paper_instance_id": 0 }, ({ id }) => {
        $.get(`/api/exams/${exam_id}/submissions/${id}`, ansDataCallback)
    })
        .fail(() => fetchAnswer(exam_id))
}

// Overide this callback
function ansDataCallback(data) {
    // Operate with data
    // Example:
    alert('Doing ansData parsing')
    data.correct_answers_data.correct_answers.forEach(
        ans => {
            ans.correct_answers.forEach(c => (console.log(c.content)))
        }
    )
}


fetchAnswer(document.getElementById("examId").value)