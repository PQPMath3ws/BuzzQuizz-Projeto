async function getQuizzes() {
    let quizzes = [];
    try {
        let request = await fetch("https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes");
        if (request.ok) {
            quizzes = await request.json();
            listQuizzes(quizzes);
        } else {
            window.location.reload();
        }
        console.log(quizzes);
    } catch (error) {
        window.location.reload();
    }
}

async function deleteQuizzConfirmation(event) {
    let cMessage = confirm("Você deseja realmente remover esse quiz?");
    if (cMessage) await deleteQuizz(event);
}

async function deleteQuizz(quizz) {
    //get element to get quizz id
    try {
        let options = {
            method: "DELETE"
        };
        // if has key on div insert on options
        await fetch("https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes/" + 10000, options);
        await config();
    } catch (error) {
        window.location.reload();
    }
}

function listQuizzes(quizzes) {
    document.getElementById("container").innerHTML = "";
    let parent = document.getElementById("");
    for (let i = 0; i < quizzes.length; i++) {
        //make logical to fill index page
    }
}

function addLoadingDiv() {
    let spinnerContent = `<div id="loading-content">
        <div class="spinner"></div>
        <p id="loading-text">Carregando...</p>
    </div>`;
    document.body.innerHTML += spinnerContent;
}

async function config() {
    document.getElementById("container").innerHTML = "";
    addLoadingDiv();
    document.getElementById("buzzquizz-text").removeEventListener("click", deleteQuizzConfirmation, true);
    document.getElementById("buzzquizz-text").addEventListener("click", deleteQuizzConfirmation, true);
}

window.onload = async function() {
    if (localStorage.getItem("quizzId")) localStorage.removeItem("quizzId");
    await config();
};