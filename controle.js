// Configuração do Supabase
const SUPABASE_URL = "https://nqhthypeljupfftlmwsz.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5xaHRoeXBlbGp1cGZmdGxtd3N6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc2ODIwNzcsImV4cCI6MjA3MzI1ODA3N30.4JcgkPqt-yMrLCNdP65nQL99xyhDs2DrgR-C-CrT4z4";
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

let userType = localStorage.getItem('userType') || 'demo';
let userId = localStorage.getItem('userId') || crypto.randomUUID();
localStorage.setItem('userId', userId);
document.getElementById('userIdBox').value = userId;
document.getElementById('waLink').href = 'https://wa.me/5561999251102?text=Meu%20ID:' + encodeURIComponent(userId);

document.getElementById('copyIdBtn').addEventListener('click', () => {
  const text = document.getElementById('userIdBox').value;
  if(navigator.clipboard && navigator.clipboard.writeText){
    navigator.clipboard.writeText(text).then(()=>alert('ID copiado!')).catch(()=>fallbackCopy(text));
  } else fallbackCopy(text);
});

function fallbackCopy(text){
  const ta = document.createElement('textarea');
  ta.value = text;
  document.body.appendChild(ta);
  ta.select();
  document.execCommand('copy');
  document.body.removeChild(ta);
  alert('ID copiado!');
}

function enterPassword(){
  let senha = prompt("Digite a senha fornecida pelo Master:");
  if(senha === "12345"){
    userType="full";
    localStorage.setItem("userType","full");
    alert("Acesso liberado!");
    document.getElementById("protectedContent").style.display="none";
  } else {
    alert("Senha incorreta.");
  }
}

if(userType!=='master'){
  document.getElementById('protectedContent').style.display='block';
  if(userType==='demo') document.getElementById('demoNote').classList.remove('hidden');
}

let voiceEnabled=false;
document.getElementById('toggleVoice').onclick = ()=>{ 
  voiceEnabled=!voiceEnabled; 
  document.getElementById('toggleVoice').innerText=voiceEnabled?'🔉 Desativar Ler':'🔊 Ativar Ler'; 
};

// Mapeamento blocos
const blocoMap = {
  Lport: "11111111-1111-1111-1111-111111111111",
  RIDE: "22222222-2222-2222-2222-222222222222",
  Legisla: "33333333-3333-3333-3333-333333333333",
  TemaEdu: "44444444-4444-4444-4444-444444444444",
  Eduincl: "55555555-5555-5555-5555-555555555555"
};

// Função para carregar questões do Supabase
async function fetchQuestions(topic){
  const table = (userType==="demo") ? "questoes_demo" : "questoes";
  const bloco_id = blocoMap[topic];
  const {data, error} = await supabase.from(table).select("*").eq("bloco_id", bloco_id);
  if(error){
    console.error("Erro ao carregar questões:", error);
    alert("Não foi possível carregar as questões. Veja o console.");
    return [];
  }
  return data || [];
}
