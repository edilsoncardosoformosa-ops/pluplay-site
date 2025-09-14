// ===== Variáveis do Quiz =====
let quizCurrent = [], currentIndex = 0, score = 0, answered = false;
const maxDemo = 5;

// ===== Inicia Quiz =====
async function startQuiz(blocoKey) {
    const bloco_id = blocoMap[blocoKey];
    if(!bloco_id){
        alert("Bloco não encontrado!");
        return;
    }

    // Busca questões do Supabase
    let questoes = await fetchQuizData(blocoKey);
    if(userType === 'demo') questoes = questoes.slice(0, maxDemo);

    if(questoes.length === 0){
        alert("Nenhuma questão encontrada para este tópico.");
        return;
    }

    quizCurrent = shuffleArray(questoes);
    currentIndex = 0;
    score = 0;

    showQuestion();
    document.getElementById('quiz').style.display='block';
    document.getElementById('menu').style.display='none';
}

// ===== Funções Auxiliares =====
function shuffleArray(arr){ return arr.sort(()=>Math.random()-0.5); }

function showQuestion(){
    if(currentIndex >= quizCurrent.length){ endQuiz(); return; }
    answered = false;
    const q = quizCurrent[currentIndex];
    document.getElementById('question').innerText = q.enunciado;
    document.getElementById('comment').innerText = '';
    document.getElementById('counter').innerText = `Questão ${currentIndex+1} de ${quizCurrent.length}`;
}

function answer(val){
    if(answered) return;
    answered = true;
    const q = quizCurrent[currentIndex];
    const correct = (q.correta === val);
    document.getElementById('comment').innerHTML = `<span class="${correct?'correct':'incorrect'}">${correct?'Você acertou!':'Você errou!'} ${q.comentario || ''}</span>`;
    if(correct) score++;
}

function nextQuestion(){ currentIndex++; showQuestion(); }

function backToMenu(){
    document.getElementById('quiz').style.display='none';
    document.getElementById('menu').style.display='block';
}

function endQuiz(){
    document.getElementById('quiz').style.display='none';
    document.getElementById('result').style.display='block';
    document.getElementById('score').innerText=`Você acertou ${score} de ${quizCurrent.length} questões.`;
}

function restartQuiz(){
    currentIndex=0; score=0;
    document.getElementById('result').style.display='none';
    document.getElementById('menu').style.display='block';
}