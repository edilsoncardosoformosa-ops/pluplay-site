// ---------------------
// Configuração Supabase
// ---------------------
const SUPABASE_URL = "https://nqhthypeljupfftlmwsz.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5xaHRoeXBlbGp1cGZmdGxtd3N6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc2ODIwNzcsImV4cCI6MjA3MzI1ODA3N30.4JcgkPqt-yMrLCNdP65nQL99xyhDs2DrgR-C-CrT4z4";

const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ---------------------
// Identificação do usuário
// ---------------------
let userType = localStorage.getItem('userType') || 'demo';
let userId = localStorage.getItem('userId') || crypto.randomUUID();
localStorage.setItem('userId', userId);

document.getElementById('userIdBox').value = userId;
document.getElementById('waLink').href = 'https://wa.me/5561999251102?text=Meu%20ID:' + encodeURIComponent(userId);

document.getElementById('copyIdBtn').addEventListener('click', () => {
  const t = document.getElementById('userIdBox').value;
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(t).then(() => alert('ID copiado!')).catch(() => fallbackCopy(t));
  } else fallbackCopy(t);
});

function fallbackCopy(t) {
  const e = document.createElement('textarea');
  e.value = t;
  document.body.appendChild(e);
  e.select();
  document.execCommand('copy');
  document.body.removeChild(e);
  alert('ID copiado!');
}

// ---------------------
// Senha Master
// ---------------------
function enterPassword() {
  let senha = prompt("Digite a senha fornecida pelo Master:");
  if (senha === "12345") {
    userType = "full";
    localStorage.setItem("userType", "full");
    alert("Acesso liberado!");
    document.getElementById("protectedContent").style.display = "none";
  } else {
    alert("Senha incorreta.");
  }
}

// ---------------------
// Mostrar conteúdo protegido
// ---------------------
if (userType !== 'master') {
  document.getElementById('protectedContent').style.display = 'block';
  if (userType === 'demo') document.getElementById('demoNote').classList.remove('hidden');
}

// ---------------------
// Voz
// ---------------------
let voiceEnabled = false;
document.getElementById('toggleVoice').onclick = () => {
  voiceEnabled = !voiceEnabled;
  document.getElementById('toggleVoice').innerText = voiceEnabled ? '🔇 Desativar Ler' : '🔊 Ativar Ler';
};
