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

function fillQuizzInfosToPage(quizz) {
    // make logical to set quizz infos to whole page
}

document.body.onload = async function() {
    let quizz = await getQuizzById();
    fillQuizzInfosToPage(quizz);
}