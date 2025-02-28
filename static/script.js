
let time = Date.now();
let correctAnswers = 0, wrongAnswers = 0, wrongAnswersCurrentQuestion = 0;

const BROWSER_ID_LENGTH = 15;
const NUMBER_OF_FONTS = 2;

if (!localStorage.getItem('browser-id')) {
    const browserId = Array.from({length: BROWSER_ID_LENGTH}, () => Math.floor(Math.random() * 36).toString(36)).join('');
    localStorage.setItem('browser-id', browserId);
}
const browserId = localStorage.getItem('browser-id');
console.log('Browser ID:', browserId);

let response = {
    responses: [],
    totals: Array.from({length: NUMBER_OF_FONTS}, (_, index) => ({
        font: index, time: 0, errors: 0, browser_id: browserId
    })),
    totalTime: 0,
}

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
    response.responses.push({
        browser_id: browserId,
        question_number: questionId,
        font: question.data().font,
        time: timeSpent,
        errors: wrongAnswers,
    });
    response.totals[parseInt(question.data().font)].time += timeSpent;
    response.totals[parseInt(question.data().font)].errors += wrongAnswers;
    response.totalTime += timeSpent;
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

    // Increment progress bar
    const elem = $('#survey-progress-bar');
    elem.find('.progress-bar').css('width', (100 * (parseInt(parent.data().nextQuestion) / parseInt(elem.attr('aria-valuemax')))) + '%');
    wrongAnswersCurrentQuestion = 0;

    // Activate next question if there is one
    if (!parent.data().lastQuestion) {
        activateQuestion(parent.data().nextQuestion);
        return;
    }
    
    // Otherwise, submit response and display feedback
    $('#submit-message').removeClass('d-none');
    const ret = await submitResponse(response);
    console.log(ret);
    const json = await ret.json();
    console.log(json);
    $('#submit-message').addClass('d-none');
    
    let fastestTime = Math.min(response.totalTime, $('#fastest-time').data().fastestTime);
    $('#fastest-time').text((fastestTime / 1000).toFixed(2))
    $('#total-time').text((response.totalTime / 1000).toFixed(2));
    $(`#wrong-answers-text`).text(wrongAnswers);
    $(`#response-id`).text(json.responseId);
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