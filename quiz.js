// ================= Supabase =================
const SUPABASE_URL = "https://nqhthypeljupfftlmwsz.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5xaHRoeXBlbGp1cGZmdGxtd3N6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc2ODIwNzcsImV4cCI6MjA3MjU4MDc3fQ.4JcgkPqt-yMrLCNdP65nQL99xyhDs2DrgR-C-CrT4z4";
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const blocoMap = {
  Lport: "11111111-1111-1111-1111-111111111111",
  RIDE: "22222222-2222-2222-2222-222222222222",
  Legisla: "33333333-3333-3333-3333-333333333333",
  TemaEdu: "44444444-4444-4444-4444-444444444444",
  Eduincl: "55555555-5555-5555-5555-555555555555"
};

// ================= Quiz =================
let quizCurrent=[], currentIndex=0, score=0;
const maxDemo = 5;

function shuffleArray(arr){ return arr.sort(()=>Math.random()-0.5); }

async function startQuiz(topic){
  const numQ = parseInt(document.getElementById('numQuestions').value) || 10;
  const blocoId = blocoMap[topic];
  const table = (userType==='demo') ? 'questoes_demo' : 'questoes';

  const { data, error } = await supabase.from(table).select("*").eq("bloco_id", blocoId);
  if(error){ console.error("Erro ao carregar questões:", error); alert("Não foi possível carregar as questões."); return; }

  quizCurrent = data || [];
  if(userType==='demo') quizCurrent = quizCurrent.slice(0,maxDemo);
  quizCurrent = shuffleArray(quizCurrent).slice(0,numQ);

  currentIndex = 0; score = 0;
  showQuestion();
}

function showQuestion(){
  if(currentIndex >= quizCurrent.length){ endQuiz(); return; }
  const q = quizCurrent[currentIndex];
  document.getElementById('quiz').style.display='block';
  document.getElementById('question').innerText = q.pergunta;
  document.getElementById('comment').innerText = '';
  document.getElementById('counter').innerText = `Questão ${currentIndex+1} de ${quizCurrent.length}`;
  if(voiceEnabled){
    let u = new SpeechSynthesisUtterance(q.pergunta);
    u.lang='pt-BR'; u.rate=1.5;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  }
}

function answer(val){
  const q = quizCurrent[currentIndex];
  let result = (q.correta===val) ? "Você acertou!" : "Você errou!";
  document.getElementById('comment').innerHTML = `<span class="${q.correta===val?'correct':'incorrect'}">${result} ${q.comentario||''}</span>`;
  if(q.correta===val) score++;
  currentIndex++;
  if(currentIndex < quizCurrent.length) showQuestion();
}

function nextQuestion(){ showQuestion(); }
function backToMenu(){ document.getElementById('quiz').style.display='none'; document.getElementById('result').style.display='none'; }
function endQuiz(){ 
  document.getElementById('quiz').style.display='none'; 
  document.getElementById('result').style.display='block';
  document.getElementById('score').innerText = `Você acertou ${score} de ${quizCurrent.length} questões.`;
}
function restartQuiz(){ currentIndex=0; score=0; document.getElementById('result').style.display='none'; document.getElementById('menu').style.display='block'; }
