
let time = Date.now();
let totalTime = 0;
let correctAnswers = 0, wrongAnswers = 0, wrongAnswersCurrentQuestion = 0;

if (!localStorage.getItem('browser-id') || localStorage.getItem('browser-id').length > 15) {
    const browserId = Array.from({length: 15}, () => Math.floor(Math.random() * 36).toString(36)).join('');
    localStorage.setItem('browser-id', browserId);
}
const browserId = localStorage.getItem('browser-id');
console.log('Browser ID:', browserId);

let response = {browser_id: browserId};

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

function deactivateQuestion(questionIndex, wrongAnswers) {
    // Hide the question
    questionIndex = parseInt(questionIndex);
    const question = $(`#question-${questionIndex}`);
    question.addClass('d-none');

    // Record time spent on question + whether correct answer was chosen
    const questionId = question.data().questionId;
    const timeSpent = Date.now() - time;
    response[`${questionId}_wrong`] = wrongAnswers;
    response[`${questionId}_time`] = timeSpent;
    totalTime += timeSpent;
}

async function chooseOption(option) {
    // If wrong answer chosen, only increment incorrect answers counter
    if (!option.data().correctOption) {
        ++wrongAnswersCurrentQuestion;
        $(`#wrong-answers`).text(++wrongAnswers);
        return;
    }

    // Otherwise, deactivate this question
    const parent = option.closest('.question');
    deactivateQuestion(parent.data().thisQuestion, wrongAnswersCurrentQuestion);

    // Increment correct answers counter
    wrongAnswersCurrentQuestion = 0;

    // Activate next question if there is one
    if (!parent.data().lastQuestion) {
        activateQuestion(parent.data().nextQuestion);
        return;
    }

    response.totalTime = totalTime;
    
    // Otherwise, submit response and display feedback
    $('#submit-message').removeClass('d-none');
    await submitResponse(response);
    $('#submit-message').addClass('d-none');
    let fastestTime = $('#fastest-time').data().fastestTime;
    if (totalTime < fastestTime) {
        fastestTime = totalTime;
    }
    $('#fastest-time').text((fastestTime / 1000).toFixed(2))
    $('#total-time').text((totalTime / 1000).toFixed(2));
    $(`#wrong-answers-text`).text(wrongAnswers);
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