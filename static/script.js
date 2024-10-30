
let time = Date.now();
let response = {};

function startSurvey() {
    $('#intro-message').addClass('d-none');
    $('#progress').removeClass('d-none');
    activateQuestion(0);
}

function activateQuestion(questionIndex) {
    // Display the question
    questionIndex = parseInt(questionIndex);
    $(`#question-${questionIndex}`).removeClass('d-none');

    // Increment counter
    $('#current-question').text(questionIndex + 1);

    // Record start time
    time = Date.now();
}

function deactivateQuestion(questionIndex, answeredCorrectly) {
    // Hide the question
    questionIndex = parseInt(questionIndex);
    const question = $(`#question-${questionIndex}`);
    question.addClass('d-none');

    // Record time spent on question + whether correct answer was chosen
    const questionId = question.data().questionId;
    response[`q${questionId}_correct`] = answeredCorrectly;
    response[`q${questionId}_time`] = Date.now() - time;
}

async function chooseOption(option) {
    option = $(option);
    const parent = option.closest('.question');
    deactivateQuestion(parent.data().thisQuestion, option.data().correctOption);

    // Increment relevant counter
    const counterId = (option.data().correctOption ? 'correct' : 'wrong');
    const counter = parseInt($(`#${counterId}-answers`).text()) + 1;
    $(`#${counterId}-answers`).text(counter);

    // Activate next question if there is one
    if (!parent.data().lastQuestion) {
        activateQuestion(parent.data().nextQuestion);
        return;
    }
    
    // Otherwise, submit response and display feedback
    $('#submit-message').removeClass('d-none');
    await submitResponse(response);
    $('#submit-message').addClass('d-none');
    $('#exit-message').removeClass('d-none');
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