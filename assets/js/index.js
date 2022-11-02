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

function listQuizzes(quizzes) {
    let parent = document.getElementById("");
    for (let i = 0; i < quizzes.length; i++) {
    }
}