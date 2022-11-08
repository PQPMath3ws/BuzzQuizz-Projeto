let quizz = null;
let finishedQuizz = [];

async function getQuizzById() {
    let quizz = null;
    let quizzId = parseInt(localStorage.getItem("quizzId"));
    if (!quizzId) {
        window.location.href = window.location.href.substring(0, window.location.href.lastIndexOf('/')) + "/" + "index.html";
    } else {
        try {
            let request = await fetch("https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes/" + quizzId);
            if (request.ok) {
                quizz = await request.json();
            } else {
                if (request.status === 404) {
                    window.location.href = window.location.href.substring(0, window.location.href.lastIndexOf('/')) + "/" + "index.html";
                } else {
                    window.location.href = window.location.href.substring(0, window.location.href.lastIndexOf('/')) + "/" + "quiz.html";
                }
            }
        } catch (error) {
            window.location.href = window.location.href.substring(0, window.location.href.lastIndexOf('/')) + "/" + "quiz.html";
        }
    }
    return quizz;
}

function addLoadingDiv() {
    let spinnerContent = `<div id="loading-content">
        <div class="spinner"></div>
        <p id="loading-text">Carregando...</p>
    </div>`;
    document.body.innerHTML += spinnerContent;
}

function addQuizzHeader() {
    let quizzHeader = `<div id="info-quizz">
        <img src="${quizz.image}" alt="">
        <h2>${quizz.title}</h2>
    </div>`;
    document.body.innerHTML += quizzHeader;
}

function setQuizzToPage() {
    let questions = "";
    finishedQuizz = [];
    for (let i = 0; i < quizz.questions.length; i++) {
        finishedQuizz[i] = false;
        let sortAnswers = quizz.questions[i].answers.sort(() => Math.random() * 0.5);
        let question = `<div id="${i + 1}" class="question">
            <div class="question-header" style="background-color: ${quizz.questions[i].color}">
                <h1>${quizz.questions[i].title}</h1>
            </div>
            <div class="alternatives">
                ${sortAnswers[0] ? `<div class="alternative" onclick="verifyQuestion(this)"><input type="hidden" value="${sortAnswers[0].isCorrectAnswer}"><img src="${sortAnswers[0].image}" alt=""><h1>${sortAnswers[0].text}</h1></div>` : ""}
                ${sortAnswers[1] ? `<div class="alternative" onclick="verifyQuestion(this)"><input type="hidden" value="${sortAnswers[1].isCorrectAnswer}"><img src="${sortAnswers[1].image}" alt=""><h1>${sortAnswers[1].text}</h1></div>` : ""}
                ${sortAnswers[2] ? `<div class="alternative" onclick="verifyQuestion(this)"><input type="hidden" value="${sortAnswers[2].isCorrectAnswer}"><img src="${sortAnswers[2].image}" alt=""><h1>${sortAnswers[2].text}</h1></div>` : ""}
                ${sortAnswers[3] ? `<div class="alternative" onclick="verifyQuestion(this)"><input type="hidden" value="${sortAnswers[3].isCorrectAnswer}"><img src="${sortAnswers[3].image}" alt=""><h1>${sortAnswers[3].text}</h1></div>` : ""}
            </div>
        </div>`;
        questions += question;
    }
    let containerLess = `<div id="container-less">
        ${questions}
    </div>`;
    document.body.innerHTML += containerLess;
}

let finished = false;

function verifyQuestion(element) {
    let parentNodeElement = element.parentNode;
    let indexOf = Array.prototype.indexOf.call(parentNodeElement.children, element);
    for (let i = 0; i < parentNodeElement.children.length; i++) {
        if (!parentNodeElement.children[i].classList.contains("clicked")) {
            parentNodeElement.children[i].classList.add("clicked");
            if (i === indexOf) {
                parentNodeElement.children[i].classList.add("normal");
            }
            if (parentNodeElement.children[i].children[0].value === "true") {
                parentNodeElement.children[i].classList.add("correct");
            } else {
                parentNodeElement.children[i].classList.add("incorrect");
            }
            let parentIndexOf = Array.prototype.indexOf.call(document.getElementById("container-less").children, parentNodeElement.parentNode);
            finishedQuizz[parentIndexOf] = true;
            setTimeout(function() {
                if (document.getElementById("container-less").children[parentIndexOf + 1]) {
                    const id = document.getElementById("container-less").children[parentIndexOf + 1].id;
                    document.getElementById(id).scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }, 2000);
            if (!finishedQuizz.includes(false)) {
                if (finished === false) {
                    finished = true;
                    setTimeout(function() {
                        finishQuizz();
                    }, 2000);
                }
            }
        }
    }
}

function finishQuizz() {
    let selectedItems = document.querySelectorAll(".normal");
    selectedItems = [...selectedItems].filter(item => item.children[0].value === "true");
    let qtd = (selectedItems.length / quizz.questions.length) * 100;
    let index = 0;
    for (let i = 0; i < quizz.levels.length; i++) {
        if (Number(quizz.levels[i].minValue) <= qtd) {
            index = i;
        }
    }
    let containerLess = document.getElementById("container-less");
    let result = `<div id="response">
        <div id="result-header">
            <h1>${Math.round(qtd)} % de acerto - ${quizz.levels[index].title}</h1>
        </div>
        <div id="result-itens">
            <img src="${quizz.levels[index].image}" alt="">
            <p>${quizz.levels[index].text}</p>
        </div>
    </div>
    <button class="next-btn" onclick="restartQuizz()">
        Refazer Quizz
    </button>
    <p id="p-index-link"><a href="/index.html">Voltar pra Início</a></p>`;
    containerLess.innerHTML += result;
}

function restartQuizz() {
    window.location.reload();
}

async function config() {
    addLoadingDiv();
    quizz = await getQuizzById();
    document.getElementById("loading-content").remove();
    addQuizzHeader();
    setQuizzToPage();
}

document.body.onload = async function() {
    await config();
}