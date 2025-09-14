// Supabase já criado no HTML
let quizCurrent = [], currentIndex = 0, score = 0, answered = false;
const maxDemo = 5;

function shuffleArray(arr){ return arr.sort(()=>Math.random()-0.5); }

function showQuestion(){
    if(currentIndex >= quizCurrent.length){ endQuiz(); return; }
    const q = quizCurrent[currentIndex];
    answered = false;
    document.getElementById('quiz').style.display = 'block';
    document.getElementById('question').innerText = q.q;
    document.getElementById('comment').innerText = '';
    document.getElementById('counter').innerText = `Questão ${currentIndex+1} de ${quizCurrent.length}`;
    if(voiceEnabled){
        let u = new SpeechSynthesisUtterance(q.q);
        u.lang = 'pt-BR';
        u.rate = 1.5;
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(u);
    }
}

function answer(val){
    if(answered) return;
    answered = true;
    const q = quizCurrent[currentIndex];
    let result = (q.a === val) ? "Você acertou!" : "Você errou!";
    document.getElementById('comment').innerHTML = `<span class="${q.a===val?'correct':'incorrect'}">${result} ${q.c}</span>`;
    if(q.a === val) score++;
    if(voiceEnabled){
        let u = new SpeechSynthesisUtterance(result + " " + q.c);
        u.lang='pt-BR'; u.rate=1.5;
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(u);
    }
}

function nextQuestion(){ currentIndex++; showQuestion(); }
function backToMenu(){ 
    document.getElementById('quiz').style.display='none'; 
    document.getElementById('result').style.display='none'; 
    document.getElementById('menu').style.display='block';
}
function endQuiz(){
    document.getElementById('quiz').style.display='none';
    document.getElementById('result').style.display='block';
    document.getElementById('score').innerText = `Você acertou ${score} de ${quizCurrent.length} questões.`;
}
function restartQuiz(){
    currentIndex = 0;
    score = 0;
    document.getElementById('result').style.display='none';
    document.getElementById('menu').style.display='block';
}
