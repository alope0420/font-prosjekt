
let time = Date.now();
let response = {};

function startSurvey() {
    $('#intro-message').addClass('d-none');
    $('#progress').removeClass('d-none');
    activateQuestion(0);
}

function activateQuestion(questionIndex) {
    questionIndex = parseInt(questionIndex);
    $(`#question-${questionIndex}`).removeClass('d-none');
    $('#current-question').text(questionIndex + 1);
    time = Date.now();
}

function deactivateQuestion(questionIndex, answeredCorrectly) {
    questionIndex = parseInt(questionIndex);
    $(`#question-${questionIndex}`).addClass('d-none');
    response['q' + $(`#question-${questionIndex}`).data().questionId + '_correct'] = answeredCorrectly;
    response['q' + $(`#question-${questionIndex}`).data().questionId + '_time'] = Date.now() - time;
}

async function chooseOption(option) {
    option = $(option);
    const parent = option.closest('.question');
    deactivateQuestion(parent.data().thisQuestion, option.data().correctOption);

    // Increment relevant counter
    const counterId = (option.data().correctOption ? 'correct' : 'wrong');
    const counter = parseInt($(`#${counterId}-answers`).text()) + 1;
    $(`#${counterId}-answers`).text(counter);

    if (parent.data().lastQuestion) {
        console.log(response);
        $('#submit-message').removeClass('d-none');
        await submitResponse(response);
        $('#submit-message').addClass('d-none');
        $('#exit-message').removeClass('d-none');
    } else {
        activateQuestion(parent.data().nextQuestion);
    }
}

async function submitResponse(response) {
    return fetch('/submit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(response),
    });
}