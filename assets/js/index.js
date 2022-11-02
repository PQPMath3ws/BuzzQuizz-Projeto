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
        alert("Erro ao remover quizz!");
    }
}

function listQuizzes(quizzes) {
    let parent = document.getElementById("");
    for (let i = 0; i < quizzes.length; i++) {
        //make logical to fill index page
    }
}

async function config() {
    document.getElementById("container").innerHTML = "";
    document.getElementById("buzzquizz-text").removeEventListener("click", deleteQuizzConfirmation, true);
    document.getElementById("buzzquizz-text").addEventListener("click", deleteQuizzConfirmation, true);
}

window.onload = async function() {
    await config();
};