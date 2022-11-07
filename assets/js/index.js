async function getQuizzes() {
    let quizzes = [];
    try {
        let request = await fetch("https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes");
        if (request.ok) {
            quizzes = await request.json();
            return quizzes;
        } else {
            window.location.reload();
        }
    } catch (error) {
        window.location.reload();
    }
}

async function deleteQuizzConfirmation(element) {
    let cMessage = confirm("Você deseja realmente remover esse quiz?");
    if (cMessage) {
        let id = element.parentNode.parentNode.children[0].children[0].value;
        let userQuizzes = JSON.parse(localStorage.getItem("myQuizzes"));
        userQuizzes = userQuizzes.filter(userQuizz => userQuizz.id === Number(id));
        await deleteQuizz(userQuizzes[0]);
    }
}

function redirectEditQuizz(element) {
    let id = element.parentNode.parentNode.children[0].children[0].value;
    localStorage.setItem("quizzId", id);
    window.location.href = window.location.href.substring(0, window.location.href.lastIndexOf('/')) + "/" + "edit.html";
}

async function deleteQuizz(quizz) {
    try {
        let options = {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Secret-Key": quizz.key ? quizz.key : ""
            }
        };
        let request = await fetch("https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes/" + quizz.id, options);
        if (!request.status.toString().startsWith("4")) {
            let userQuizzes = JSON.parse(localStorage.getItem("myQuizzes"));
            let userQuizz = userQuizzes.filter(userQuizz => userQuizz.id === quizz.id);
            let indexOf = Array.prototype.indexOf.call(userQuizzes, userQuizz[0]);
            userQuizzes.splice(indexOf, 1);
            localStorage.setItem(myQuizzes, JSON.stringify(userQuizzes));
        }
        await config();
    } catch (error) {
        window.location.reload();
    }
}

function addLoadingDiv() {
    let spinnerContent = `<div id="loading-content">
        <div class="spinner"></div>
        <p id="loading-text">Carregando...</p>
    </div>`;
    document.body.innerHTML += spinnerContent;
}

function fillUserQuizzes() {
    let userQuizzes = JSON.parse(localStorage.getItem("myQuizzes"));
    let userQuizzesInnerHtml = null;
    if (userQuizzes && userQuizzes.length > 0) {
        let quizzes = "";
        userQuizzes.forEach(userQuizz => {
            quizzes += `<div class="quiz">
                <div onclick="enterQuizz(this)">
                    <input type="hidden" value="${userQuizz.id}">
                    <img src="${userQuizz.image}" alt="">
                    <h2>${userQuizz.title}</h2>
                </div>
                <div class="quizz-actions-div">
                    <button>
                        <ion-icon name="create-outline"></ion-icon>
                    </button>
                    <button>
                        <ion-icon name="trash-outline"></ion-icon>
                    </button>
                </div>
            </div>`;
        });
        userQuizzesInnerHtml = `<div id="user-quizzes">
            <div id="your-quizzes-title">
                <h1>Seus Quizzes</h1>
                <a href="create.html">
                    <ion-icon name="add-circle"></ion-icon>
                </a>
            </div>
            <div id="user-quizzes-list">
                ${quizzes}
            </div>
        </div>`;
    } else {
        userQuizzesInnerHtml = `<div id="no-user-quizzes">
            <div id="no-quizz">
                <p>Você não criou nenhum</p>
                <p>quizz ainda :(</p>
                <a id="create-quizz-link" href="create.html">Criar Quizz</a>
            </div>
        </div>`;
    }
    document.getElementById("container-extra").innerHTML = userQuizzesInnerHtml;
}

async function fillUserQuizzesActions() {
    if (document.getElementById("user-quizzes-list")) {
        let userQuizzes = document.getElementById("user-quizzes-list").getElementsByClassName("quizz-actions-div");
        for (let i = 0; i < userQuizzes.length; i++) {
            for(let j = 0; j < userQuizzes[i].children.length; j++) {
                userQuizzes[i].children[j].addEventListener("click", async function () {
                    if (j === 0) {
                        redirectEditQuizz(this);
                    } else {
                        await deleteQuizzConfirmation(this);
                    }
                });
            }
        }
    }
}

function fillAllQuizzes(quizzes) {
    let quizzesDivs = "";
    quizzes.forEach(quizz => {
        quizzesDivs += `<div class="quiz" onclick="enterQuizz(this)">
            <input type="hidden" value="${quizz.id}">
            <img src="${quizz.image}" alt="">
            <h2>${quizz.title}</h2>
        </div>`;
    });
    let allQuizzes = `<div id="all-quizzes">
        <div id="all-quizzes-title">
            <h1>Todos os Quizzes</h1>
        </div>
        <div id="all-quizzes-list">
            ${quizzesDivs}
        </div>
    </div>`;
    document.getElementById("container-extra").innerHTML += allQuizzes;
}

function enterQuizz(element) {
    let id = element.children[0].value;
    localStorage.setItem("quizzId", id);
    window.location.href = window.location.href.substring(0, window.location.href.lastIndexOf('/')) + "/" + "quiz.html";
}

async function config() {
    document.getElementById("container-extra").innerHTML = "";
    addLoadingDiv();
    let quizzes = await getQuizzes();
    document.body.children[6].remove();
    fillUserQuizzes();
    fillAllQuizzes(quizzes);
    await fillUserQuizzesActions();
}

window.onload = async function() {
    if (localStorage.getItem("quizzId")) localStorage.removeItem("quizzId");
    await config();
};