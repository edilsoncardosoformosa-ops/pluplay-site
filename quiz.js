// ====== QUIZ GLOBAL ======
let currentQuestions = [], currentIndex = 0, score = 0;
let answered = false;
const maxDemo = 5;
let voiceEnabled = false;

// Habilitar/desabilitar voz
document.getElementById('toggleVoice').onclick = () => {
    voiceEnabled = !voiceEnabled;
    document.getElementById('toggleVoice').innerText = voiceEnabled ? '🔉 Desativar Ler' : '🔊 Ativar Ler';
};

// Embaralhar array
function shuffleArray(arr) {
    return arr.sort(() => Math.random() - 0.5);
}

// Mostrar questão
function showQuestion() {
    if (currentIndex >= currentQuestions.length) {
        endQuiz();
        return;
    }
    answered = false;
    const q = currentQuestions[currentIndex];

    document.getElementById('quiz').style.display = 'block';
    document.getElementById('question').innerText = q.q;
    document.getElementById('comment').innerText = '';
    document.getElementById('counter').innerText = `Questão ${currentIndex + 1} de ${currentQuestions.length}`;

    if (voiceEnabled) {
        let utter = new SpeechSynthesisUtterance(q.q);
        utter.lang = 'pt-BR';
        utter.rate = 1.5;
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utter);
    }
}

// Responder questão
function answer(val) {
    if (answered) return;
    answered = true;

    const q = currentQuestions[currentIndex];
    let resultText = (q.a === val) ? "Você acertou!" : "Você errou!";

    document.getElementById('comment').innerHTML =
        `<span class="${q.a === val ? 'correct' : 'incorrect'}">${resultText} ${q.c}</span>`;

    if (q.a === val) score++;

    if (voiceEnabled) {
        let utter = new SpeechSynthesisUtterance(resultText + " " + q.c);
        utter.lang = 'pt-BR';
        utter.rate = 1.5;
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utter);
    }
}

// Próxima questão
function nextQuestion() {
    currentIndex++;
    showQuestion();
}

// Voltar ao menu
function backToMenu() {
    document.getElementById('quiz').style.display = 'none';
    document.getElementById('result').style.display = 'none';
}

// Final do quiz
function endQuiz() {
    document.getElementById('quiz').style.display = 'none';
    document.getElementById('result').style.display = 'block';
    document.getElementById('score').innerText =
        `Você acertou ${score} de ${currentQuestions.length} questões.`;
}

// Reiniciar quiz
function restartQuiz() {
    currentIndex = 0;
    score = 0;
    document.getElementById('result').style.display = 'none';
}

// ====== Função para iniciar quiz usando Supabase ======
async function startQuiz(topic) {
    const numQ = parseInt(document.getElementById('numQuestions').value) || 10;
    const blocoId = blocoMap[topic];
    const tableName = (userType === 'demo') ? 'questoes_demo' : 'questoes';

    const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .eq('bloco_id', blocoId);

    if (error) {
        console.error("Erro ao carregar questões:", error);
        alert("Não foi possível carregar as questões. Veja o console.");
        return;
    }

    currentQuestions = data || [];
    if (userType === 'demo') currentQuestions = currentQuestions.slice(0, maxDemo);
    currentQuestions = shuffleArray(currentQuestions).slice(0, numQ);
    currentIndex = 0;
    score = 0;

    showQuestion();
}
