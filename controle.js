// ====== CONFIGURAÇÃO SUPABASE ======
const SUPABASE_URL = "https://nqhthypeljupfftlmwsz.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5xaHRoeXBlbGp1cGZmdGxtd3N6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc2ODIwNzcsImV4cCI6MjA3MzI1ODA3N30.4JcgkPqt-yMrLCNdP65nQL99xyhDs2DrgR-C-CrT4z4";
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ====== GERENCIAMENTO DE USUÁRIO ======
let userType = localStorage.getItem('userType') || 'demo';
let userId = localStorage.getItem('userId') || crypto.randomUUID();
localStorage.setItem('userId', userId);

// Atualiza input e link WhatsApp
document.getElementById('userIdBox').value = userId;
document.getElementById('waLink').href = 'https://wa.me/5561999251102?text=Meu%20ID:'+encodeURIComponent(userId);

// Copiar ID
document.getElementById('copyIdBtn').addEventListener('click', () => {
  const t = document.getElementById('userIdBox').value;
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(t).then(()=>alert('ID copiado!')).catch(()=>fallbackCopy(t));
  } else fallbackCopy(t);
});

function fallbackCopy(t){
  const e = document.createElement('textarea');
  e.value = t;
  document.body.appendChild(e);
  e.select();
  document.execCommand('copy');
  document.body.removeChild(e);
  alert('ID copiado!');
}

// Senha Master
function enterPassword(){
  let senha = prompt("Digite a senha fornecida pelo Master:");
  if(senha === "12345"){ // troque para sua senha real
    userType = "full";
    localStorage.setItem("userType","full");
    alert("Acesso liberado!");
    document.getElementById("protectedContent").style.display="none";
  } else alert("Senha incorreta.");
}

// Exibir se não master
if(userType !== 'master'){
  document.getElementById('protectedContent').style.display='block';
  if(userType==='demo') document.getElementById('demoNote').classList.remove('hidden');
}

// Voz
let voiceEnabled = false;
document.getElementById('toggleVoice').onclick = ()=>{
  voiceEnabled = !voiceEnabled;
  document.getElementById('toggleVoice').innerText = voiceEnabled?'🔉 Desativar Ler':'🔊 Ativar Ler';
};

// ====== MAPA DOS BLOCOS ======
const blocoMap = {
  Lport:"11111111-1111-1111-1111-111111111111",
  ride:"22222222-2222-2222-2222-222222222222",
  Legisla:"33333333-3333-3333-3333-333333333333",
  TemaEdu:"44444444-4444-4444-4444-444444444444",
  Eduincl:"55555555-5555-5555-5555-555555555555"
};

// ====== QUIZ ======
let quizCurrent = [], currentIndex = 0, score = 0;
const maxDemo = 5;

function shuffleArray(arr){ return arr.sort(()=>Math.random()-0.5); }

async function startQuiz(topic){
  let numQ = parseInt(document.getElementById('numQuestions').value) || 10;
  let blocoId = blocoMap[topic];
  let tableName = (userType==='demo') ? "questoes_demo" : "questoes";
  
  const { data, error } = await supabase.from(tableName).select("*").eq("bloco_id", blocoId);
  
  if(error){
    console.error("Erro ao carregar questões:", error);
    alert("Não foi possível carregar as questões. Veja o console.");
    return;
  }
  
  quizCurrent = data || [];
  if(userType==='demo') quizCurrent = quizCurrent.slice(0,maxDemo);
  quizCurrent = shuffleArray(quizCurrent).slice(0,numQ);
  
  currentIndex = 0;
  score = 0;
  showQuestion();
}
