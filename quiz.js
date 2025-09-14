// ===== Supabase Setup =====
const supabaseUrl = 'https://nqhthypeljupfftlmwsz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5xaHRoeXBlbGp1cGZmdGxtd3N6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc2ODIwNzcsImV4cCI6MjA3MzI1ODA3N30.4JcgkPqt-yMrCLNdP65nQL99xyhDs2DrgR-C-CrT4z4';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// ===== Variáveis do Quiz =====
let quizCurrent = [], currentIndex = 0, score = 0, answered = false;
const maxDemo = 5;
let userType = localStorage.getItem('userType') || 'demo';

// ===== Funções =====
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