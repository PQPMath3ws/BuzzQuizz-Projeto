let quizz = null;

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

const validateQuizzText = (text, min, max) => (text && !Number.isNaN(Number(min)) && !Number.isNaN(Number(max)) && text.length >= min && text.length <= max) ? true : false;

const validateQuizzUrlImage = (imageUrl) => {
    try {
        let url = new URL(imageUrl);
        return (imageUrl.match(/\.(jpeg|jpg|png)$/) != null);
    } catch (_) {
        return false;
    }
}

const validateQuizzNumber = (number, min) => (number && min && !Number.isNaN(Number(number)) && !Number.isNaN(Number(number)) && number >= min) ? true : false;

const validateHexColor = (color) => (/^#[0-9A-F]{6}$/i).test(color) ? true : false;

const validatePercentNumber = (percent) => (percent && !Number.isNaN(Number(percent)) && Number(percent) >= 0 && Number(percent) <= 100) ? true : false;

function createDivs() {
    let container = document.getElementById("container");
    let containerInner = `<div id="create-quizz">
        <p class="titulo">Edite seu quiz</p>
        <div class="items">
            <input id="quizz-title" class="custom-input" type="text" placeholder="Título do seu quizz" value="${quizz.title}">
            <p class="error-message">Digite um título válido para seu quizz</p>
            <input id="quizz-url" class="custom-input" type="text" placeholder="URL da imagem do seu quizz" value="${quizz.image}">
            <p class="error-message">O valor informado não é uma URL válida</p>
            <input id="quizz-number-questions" class="custom-input" type="number" placeholder="Quantidade de perguntas do quizz" value="${quizz.questions.length}">
            <p class="error-message">O quizz deve ter no mínimo 3 perguntas</p>
            <input id="quizz-number-levels" class="custom-input" type="number" placeholder="Quantidade de níveis do quizz" value="${quizz.levels.length}">
            <p class="error-message">O quizz deve ter no mínimo 2 níveis</p>
        </div>
        <button class="next-btn" onclick="setInitialValuesForQuizz()">
            Prosseguir pra editar perguntas
        </button>
    </div>
    <div id="create-questions">
        <p class="titulo">Edite suas perguntas</p>
        <div class="items">
        </div>
    </div>
    <div id="create-levels">
        <p class="titulo">Agora, edite os níveis</p>
        <div class="items">
        </div>
    </div>
    <div id="quizz-ready">
        <p class="titulo">Seu quizz foi alterado!</p>
        <div id="quizz">
            <img src="" alt="">
            <p></p>
        </div>
        <button class="next-btn" onclick="goQuizz()">
            Acessar Quizz
        </button>
        <p id="p-index-link"><a href="/index.html">Voltar pra Início</a></p>
    </div>`;
    container.innerHTML = containerInner;
}

function setInitialValuesForQuizz() {
    let container = document.getElementById("container");
    let quizzTitle = document.getElementById("quizz-title");
    let quizzUrl = document.getElementById("quizz-url");
    let quizzNumberQuestions = document.getElementById("quizz-number-questions");
    let quizzNumberLevels = document.getElementById("quizz-number-levels");
    let errorsMessages = document.getElementById("create-quizz").getElementsByClassName("error-message");
    let canProceed = [false, false, false, false];
    canProceed[0] = validateQuizzText(quizzTitle.value, 20, 65);
    canProceed[1] = validateQuizzUrlImage(quizzUrl.value);
    canProceed[2] = validateQuizzNumber(quizzNumberQuestions.value, 3);
    canProceed[3] = validateQuizzNumber(quizzNumberLevels.value, 2);
    for (let i = 0; i < canProceed.length; i++) {
        if (!canProceed[i]) {
            errorsMessages[i].setAttribute("style", "display: inline-block !important");
        } else {
            errorsMessages[i].setAttribute("style", "display: none !important");
        }
    }
    if (canProceed.includes(false)) return;
    else {
        quizz.title = quizzTitle.value;
        quizz.image = quizzUrl.value;
        quizz.qtdQuestions = Number(quizzNumberQuestions.value);
        quizz.qtdLevels = Number(quizzNumberLevels.value);
        container.setAttribute("style", "margin-left: -50%;");
        container.classList.add("move-left");
        setTimeout(function () {
            container.classList.remove("move-left");
            document.getElementById("create-questions").setAttribute("style", "display: flex !important;");
            document.getElementById("create-quizz").setAttribute("style", "display: none !important;");
            setTimeout(function() {
                fillQuestionsDiv();
                container.setAttribute("style", "margin-left: 50%;");
                container.classList.add("move-right");
                setTimeout(function () {
                    container.classList.remove("move-right");
                }, 300);
            }, 50);
        }, 300);
    }
}

function fillQuestionsDiv() {
    let items = document.getElementById("create-questions").querySelector(".items");
    items.innerHTML = "";
    for (let i = 0; i < quizz.qtdQuestions; i++) {
        let modelDiv = `<div class="question-collapsed${i === 0 ? " collapsed" : ""}" onclick="validateAndOpenQuestion(this)">
            <p class="new-question-title">Pergunta ${i + 1}</p>
            <div class="icone">
                <ion-icon name="create-outline"></ion-icon>
            </div>
        </div>
        <div id="pergunta-${i + 1}"${i !== 0 ? ' class="collapsed"' : ''}>
            <p class="question-title">Pergunta ${i + 1}</p>
            <input class="custom-input question-text" clastype="text" placeholder="Texto da pergunta" value="${quizz.questions[i] ? quizz.questions[i].title : ""}">
            <p class="error-message">Digite um título válido para seu quizz</p>
            <input class="custom-input background-question-color" type="text" placeholder="Cor de fundo da pergunta" value="${quizz.questions[i] ? quizz.questions[i].color : ""}">
            <p class="error-message">Digite uma cor válida (em hex) para seu quizz</p>
            <p class="question-title">Resposta correta</p>
            <input class="custom-input correct-answer" type="text" placeholder="Resposta correta" value="${quizz.questions[i] ? quizz.questions[i] ? quizz.questions[i].answers[0] ? quizz.questions[i].answers[0].text : "" : "" : ""}">
            <p class="error-message">Digite uma resposta correta válida para seu quizz</p>
            <input class="custom-input correct-image-url" type="text" placeholder="URL da imagem" value="${quizz.questions[i] ? quizz.questions[i] ? quizz.questions[i].answers[0] ? quizz.questions[i].answers[0].image : "" : "" : ""}">
            <p class="error-message">O valor informado não é uma URL válida</p>
            <p class="question-title">Respostas incorretas</p>
            <input class="custom-input incorrect-answer-1" type="text" placeholder="Resposta incorreta 1" value="${quizz.questions[i] ? quizz.questions[i] ? quizz.questions[i].answers[1] ? quizz.questions[i].answers[1].text : "" : "" : ""}">
            <p class="error-message">Digite uma resposta incorreta válida para seu quizz</p>
            <input class="custom-input incorrect-image-url-1" type="text" placeholder="URL da imagem 1" value="${quizz.questions[i] ? quizz.questions[i] ? quizz.questions[i].answers[1] ? quizz.questions[i].answers[1].image : "" : "" : ""}">
            <p class="error-message">O valor informado não é uma URL válida</p>
            <input class="custom-input incorrect-answer-2" type="text" placeholder="Resposta incorreta 2" value="${quizz.questions[i] ? quizz.questions[i] ? quizz.questions[i].answers[2] ? quizz.questions[i].answers[2].text : "" : "" : ""}">
            <p class="error-message">Digite uma resposta incorreta válida para seu quizz</p>
            <input class="custom-input incorrect-image-url-2" type="text" placeholder="URL da imagem 2" value="${quizz.questions[i] ? quizz.questions[i] ? quizz.questions[i].answers[2] ? quizz.questions[i].answers[2].image : "" : "" : ""}">
            <p class="error-message">O valor informado não é uma URL válida</p>
            <input class="custom-input incorrect-answer-3" type="text" placeholder="Resposta incorreta 3" value="${quizz.questions[i] ? quizz.questions[i] ? quizz.questions[i].answers[3] ? quizz.questions[i].answers[3].text : "" : "" : ""}">
            <p class="error-message">Digite uma resposta incorreta válida para seu quizz</p>
            <input class="custom-input incorrect-image-url-3" type="text" placeholder="URL da imagem 3" value="${quizz.questions[i] ? quizz.questions[i] ? quizz.questions[i].answers[3] ? quizz.questions[i].answers[3].image : "" : "" : ""}">
            <p class="error-message">O valor informado não é uma URL válida</p>
        </div>`;
        items.innerHTML += modelDiv;
    }
    document.getElementById("create-questions").innerHTML += `<p class="error-message">Preencha todas as perguntas corretamente</p>
    <button class="next-btn" onclick="canEditLevels()">
        Prosseguir pra editar níveis
    </button>`;
}

function validateAndOpenQuestion(element) {
    let notCollapsedQuestionDiv = [...element.parentNode.children].filter(child => child.id && !child.classList.contains("collapsed"));
    let questionText = notCollapsedQuestionDiv[0].querySelector(".question-text");
    let backgroundQuestionColor = notCollapsedQuestionDiv[0].querySelector(".background-question-color");
    let correctAnswer = notCollapsedQuestionDiv[0].querySelector(".correct-answer");
    let correctImageUrl = notCollapsedQuestionDiv[0].querySelector(".correct-image-url");
    let incorrectAnswer1 = notCollapsedQuestionDiv[0].querySelector(".incorrect-answer-1");
    let incorrectImageUrl1 = notCollapsedQuestionDiv[0].querySelector(".incorrect-image-url-1");
    let incorrectAnswer2 = notCollapsedQuestionDiv[0].querySelector(".incorrect-answer-2");
    let incorrectImageUrl2 = notCollapsedQuestionDiv[0].querySelector(".incorrect-image-url-2");
    let incorrectAnswer3 = notCollapsedQuestionDiv[0].querySelector(".incorrect-answer-3");
    let incorrectImageUrl3 = notCollapsedQuestionDiv[0].querySelector(".incorrect-image-url-3");
    let errorsMessages = notCollapsedQuestionDiv[0].getElementsByClassName("error-message");
    let canProceed = [false, false, false, false, false, false];
    canProceed[0] = validateQuizzText(questionText.value, 20, 65);
    canProceed[1] = validateHexColor(backgroundQuestionColor.value);
    canProceed[2] = validateQuizzText(correctAnswer.value, 1, 65);
    canProceed[3] = validateQuizzUrlImage(correctImageUrl.value);
    canProceed[4] = validateQuizzText(incorrectAnswer1.value, 1, 65);
    canProceed[5] = validateQuizzUrlImage(incorrectImageUrl1.value);
    for (let i = 0; i < canProceed.length; i++) {
        if (!canProceed[i]) {
            errorsMessages[i].setAttribute("style", "display: inline-block !important");
        } else {
            errorsMessages[i].setAttribute("style", "display: none !important");
        }
    }
    let optionalProceed = [false, false, false, false];
    optionalProceed[0] = validateQuizzText(incorrectAnswer2.value, 1, 65);
    optionalProceed[1] = validateQuizzUrlImage(incorrectImageUrl2.value);
    optionalProceed[2] = validateQuizzText(incorrectAnswer3.value, 1, 65);
    optionalProceed[3] = validateQuizzUrlImage(incorrectImageUrl3.value);
    for (let i = 0; i < optionalProceed.length; i++) {
        if (i === 0 || i === 1) {
            if (optionalProceed[0] !== optionalProceed[1] || (optionalProceed[0] === false && optionalProceed[1] === false && incorrectImageUrl2.value.length > 0)) {
                errorsMessages[6 + i].setAttribute("style", "display: inline-block !important");
            } else {
                errorsMessages[6 + i].setAttribute("style", "display: none !important");
            }
        } else {
            if (optionalProceed[2] !== optionalProceed[3] || (optionalProceed[2] === false && optionalProceed[3] === false && incorrectImageUrl3.value.length > 0)) {
                errorsMessages[6 + i].setAttribute("style", "display: inline-block !important");
            } else {
                errorsMessages[6 + i].setAttribute("style", "display: none !important");
            }
        }
    }
    if (canProceed.includes(false) || ((optionalProceed[0] !== optionalProceed[1] || (optionalProceed[0] === false && optionalProceed[1] === false && incorrectImageUrl2.value.length > 0)) || (optionalProceed[2] !== optionalProceed[3] || (optionalProceed[2] === false && optionalProceed[3] === false && incorrectImageUrl3.value.length > 0)))) return;
    else {
        let allChildren = [...element.parentNode.children];
        let indexOf = Array.prototype.indexOf.call(allChildren, element);
        let childrenHasId = allChildren.filter(child => child.id);
        let childrenHasntId = allChildren.filter(child => !child.id);
        childrenHasntId.forEach(child => {
            if (child.classList.contains("collapsed")) child.classList.remove("collapsed");
        });
        childrenHasId.forEach(child => {
            if (!child.classList.contains("collapsed")) child.classList.add("collapsed");
        });
        allChildren[indexOf].classList.add("collapsed");
        allChildren[indexOf + 1].classList.remove("collapsed");
    }
}

function canEditLevels() {
    let questions = [...document.getElementById("create-questions").querySelector(".items").children].filter(child => child.id);
    let errorMessage = document.getElementById("create-questions").children[2];
    let arrQuestions = [];
    questions.forEach(child => {
        let questionText = child.querySelector(".question-text");
        let backgroundQuestionColor = child.querySelector(".background-question-color");
        let correctAnswer = child.querySelector(".correct-answer");
        let correctImageUrl = child.querySelector(".correct-image-url");
        let incorrectAnswer1 = child.querySelector(".incorrect-answer-1");
        let incorrectImageUrl1 = child.querySelector(".incorrect-image-url-1");
        let incorrectAnswer2 = child.querySelector(".incorrect-answer-2");
        let incorrectImageUrl2 = child.querySelector(".incorrect-image-url-2");
        let incorrectAnswer3 = child.querySelector(".incorrect-answer-3");
        let incorrectImageUrl3 = child.querySelector(".incorrect-image-url-3");
        let obj = {
            title: questionText.value,
            color: backgroundQuestionColor.value,
            answers: []
        }
        if (correctAnswer.value && correctImageUrl.value && validateQuizzUrlImage(correctImageUrl.value)) {
            obj.answers.push({
                text: correctAnswer.value,
                image: correctImageUrl.value,
                isCorrectAnswer: true
            });
        } else return;
        if (incorrectAnswer1.value && incorrectImageUrl1.value && validateQuizzUrlImage(incorrectImageUrl1.value)) {
            obj.answers.push({
                text: incorrectAnswer1.value,
                image: incorrectImageUrl1.value,
                isCorrectAnswer: false
            });
        } else return;
        if (incorrectAnswer2.value && incorrectImageUrl2.value && validateQuizzUrlImage(incorrectImageUrl2.value)) {
            obj.answers.push({
                text: incorrectAnswer2.value,
                image: incorrectImageUrl2.value,
                isCorrectAnswer: false
            });
        }
        if (incorrectAnswer3.value && incorrectImageUrl3.value && validateQuizzUrlImage(incorrectImageUrl3.value)) {
            obj.answers.push({
                text: incorrectAnswer3.value,
                image: incorrectImageUrl3.value,
                isCorrectAnswer: false
            });
        }
        arrQuestions.push(obj);
    });
    if (arrQuestions.length < quizz.qtdQuestions) {
        errorMessage.setAttribute("style", "display: inline-block !important");
        return;
    } else {
        let canProceed = false;
        arrQuestions.forEach(question => {
            if (question.answers.length < 2) {
                canProceed = false;
                return;
            } else {
                canProceed = true;
            }
        });
        if (canProceed) {
            errorMessage.setAttribute("style", "display: none !important");
            quizz.questions = arrQuestions;
            delete quizz.qtdQuestions;
            let container = document.getElementById("container");
            container.setAttribute("style", "margin-left: -50%;");
            container.classList.add("move-left");
            setTimeout(function () {
                container.classList.remove("move-left");
                document.getElementById("create-levels").setAttribute("style", "display: flex !important;");
                document.getElementById("create-questions").setAttribute("style", "display: none !important;");
                setTimeout(function() {
                    fillLevelsDiv();
                    container.setAttribute("style", "margin-left: 50%;");
                    container.classList.add("move-right");
                    setTimeout(function () {
                        container.classList.remove("move-right");
                    }, 300);
                }, 50);
            }, 300);
            
        } else {
            errorMessage.setAttribute("style", "display: inline-block !important");
        }
    }
}

function fillLevelsDiv() {
    let items = document.getElementById("create-levels").querySelector(".items");
    items.innerHTML = "";
    for (let i = 0; i < quizz.qtdLevels; i++) {
        let modelDiv = `<div class="level-collapsed${i === 0 ? " collapsed" : ""}" onclick="validateAndOpenLevels(this)">
            <p class="new-question-title">Level ${i + 1}</p>
            <div class="icone">
                <ion-icon name="create-outline"></ion-icon>
            </div>
        </div>
        <div id="level-${i + 1}"${i !== 0 ? ' class="collapsed"' : ''}>
            <p class="question-title">Level ${i + 1}</p>
            <input class="custom-input level-title" clastype="text" placeholder="Título do nível" value="${quizz.levels[i] ? quizz.levels[i].title : ""}">
            <p class="error-message">Digite um título válido para o level de seu quizz</p>
            <input class="custom-input level-percent" type="number" placeholder="% de acerto mínima" value="${quizz.levels[i] ? quizz.levels[i].minValue : ""}">
            <p class="error-message">O valor informado não é válido</p>
            <input class="custom-input level-url-image" type="text" placeholder="URL da imagem do nível" value="${quizz.levels[i] ? quizz.levels[i].image : ""}">
            <p class="error-message">O valor informado não é uma URL válida</p>
            <input class="custom-input level-description" type="text" placeholder="Descrição do nível" value="${quizz.levels[i] ? quizz.levels[i].text : ""}">
            <p class="error-message">Digite uma descrição válida para o level de seu quizz</p>
        </div>`;
        items.innerHTML += modelDiv;
    }
    document.getElementById("create-levels").innerHTML += `<p class="error-message">Preencha todos os níveis corretamente</p>
    <button class="next-btn" onclick="canFinishQuiz()">
        Finalizar Quizz
    </button>`;
}

function validateAndOpenLevels(element) {
    let notCollapsedQuestionDiv = [...element.parentNode.children].filter(child => child.id && !child.classList.contains("collapsed"));
    let levelTitle = notCollapsedQuestionDiv[0].querySelector(".level-title");
    let levelPercent = notCollapsedQuestionDiv[0].querySelector(".level-percent");
    let levelUrlImage = notCollapsedQuestionDiv[0].querySelector(".level-url-image");
    let levelDescription = notCollapsedQuestionDiv[0].querySelector(".level-description");
    let errorsMessages = notCollapsedQuestionDiv[0].getElementsByClassName("error-message");
    let canProceed = [false, false, false, false];
    canProceed[0] = validateQuizzText(levelTitle.value, 10, 65);
    canProceed[1] = validatePercentNumber(levelPercent.value);
    canProceed[2] = validateQuizzUrlImage(levelUrlImage.value);
    canProceed[3] = validateQuizzText(levelDescription.value, 30, 500);
    for (let i = 0; i < canProceed.length; i++) {
        if (!canProceed[i]) {
            errorsMessages[i].setAttribute("style", "display: inline-block !important");
        } else {
            errorsMessages[i].setAttribute("style", "display: none !important");
        }
    }
    if (canProceed.includes(false)) return;
    else {
        let allChildren = [...element.parentNode.children];
        let indexOf = Array.prototype.indexOf.call(allChildren, element);
        let childrenHasId = allChildren.filter(child => child.id);
        let childrenHasntId = allChildren.filter(child => !child.id);
        childrenHasntId.forEach(child => {
            if (child.classList.contains("collapsed")) child.classList.remove("collapsed");
        });
        childrenHasId.forEach(child => {
            if (!child.classList.contains("collapsed")) child.classList.add("collapsed");
        });
        allChildren[indexOf].classList.add("collapsed");
        allChildren[indexOf + 1].classList.remove("collapsed");
    }
}

function canFinishQuiz() {
    let levels = [...document.getElementById("create-levels").querySelector(".items").children].filter(child => child.id);
    let errorMessage = document.getElementById("create-levels").children[2];
    let arrLevels = [];
    levels.forEach(level => {
        let levelTitle = level.querySelector(".level-title");
        let levelPercent = level.querySelector(".level-percent");
        let levelUrlImage = level.querySelector(".level-url-image");
        let levelDescription = level.querySelector(".level-description");
        if (validateQuizzText(levelTitle.value, 10, 65) && validatePercentNumber(levelPercent.value) && validateQuizzUrlImage(levelUrlImage.value) && validateQuizzText(levelDescription.value, 30, 500)) {
            let obj = {
                title: levelTitle.value,
                image: levelUrlImage.value,
                text: levelDescription.value,
                minValue: Number(levelPercent.value)
            };
            arrLevels.push(obj);
        }
    });
    if (arrLevels.length < quizz.qtdLevels) {
        errorMessage.innerHTML = "Preencha todos os níveis corretamente";
        errorMessage.setAttribute("style", "display: inline-block !important");
        return;
    } else {
        let canProceed = false;
        arrLevels.forEach(level => {
            if (level.minValue == 0) {
                canProceed = true;
                return;
            }
        });
        if (canProceed) {
            errorMessage.setAttribute("style", "display: none !important");
            quizz.levels = arrLevels;
            delete quizz.qtdLevels;
            let container = document.getElementById("container");
            container.setAttribute("style", "margin-left: -50%;");
            container.classList.add("move-left");
            setTimeout(function() {
                container.classList.remove("move-left");
                document.getElementById("quizz-ready").setAttribute("style", "display: flex !important;");
                document.getElementById("create-levels").setAttribute("style", "display: none !important;");
                setTimeout(function() {
                    finishQuizz();
                    container.setAttribute("style", "margin-left: 50%;");
                    container.classList.add("move-right");
                    setTimeout(function () {
                        container.classList.remove("move-right");
                    }, 300);
                }, 50);
            }, 300);
        } else {
            errorMessage.innerHTML = "Você teve ter ao menos um nível com 0% de acerto mínimo";
            errorMessage.setAttribute("style", "display: inline-block !important");
        }
    }
}

function finishQuizz() {
    let quizzObj = [...JSON.parse(localStorage.getItem("myQuizzes"))].filter(myQuizz => myQuizz.id === quizz.id);
    document.getElementById("quizz").children[0].src = quizz.image;
    document.getElementById("quizz").children[1].innerHTML = quizz.title;
    fetch("https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Secret-Key": quizzObj[0].key ? quizzObj[0].key : ""
        },
        body: JSON.stringify(quizz)
    }).then(response => {
        if (response.ok) {
            response.json().then(json => {
                let myQuizzes = JSON.parse(localStorage.getItem("myQuizzes"));
                myQuizzes.forEach(myQuizz => {
                    if (myQuizz.id === quizz.id) {
                        myQuizz.id = json.id;
                        myQuizz.key = json.key;
                        myQuizz.createdAt = json.createdAt;
                        myQuizz.image = json.image;
                        myQuizz.title = json.title;
                        myQuizz.updatedAt = json.updatedAt;
                    }
                });
                localStorage.setItem("myQuizzes", JSON.stringify(myQuizzes));
            });
        }
    });
}

function goQuizz() {
    window.location.href = window.location.href.substring(0, window.location.href.lastIndexOf('/')) + "/" + "quiz.html";
}

document.body.onload = async function() {
    addLoadingDiv();
    quizz = await getQuizzById();
    document.body.children[4].remove();
    document.title = "Editar Quizz - " + quizz.title;
    createDivs();
}