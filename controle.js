// Controle do quiz e dados do usuário
let userType = localStorage.getItem('userType') || 'demo';
let userId = localStorage.getItem('userId') || crypto.randomUUID();
localStorage.setItem('userId', userId);
document.getElementById('userIdBox').value = userId;
document.getElementById('waLink').href = 'https://wa.me/5561999251102?text=Meu%20ID:' + encodeURIComponent(userId);

document.getElementById('copyIdBtn').addEventListener('click', () => {
  const id = document.getElementById('userIdBox').value;
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(id).then(() => alert('ID copiado!')).catch(() => fallbackCopy(id));
  } else fallbackCopy(id);
});

function fallbackCopy(text) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
  alert('ID copiado!');
}

function enterPassword() {
  let senha = prompt("Digite a senha fornecida pelo Master:");
  if (senha === "12345") { // Troque para sua senha
    userType = "full";
    localStorage.setItem("userType", "full");
    alert("Acesso liberado!");
    document.getElementById("protectedContent").style.display = "none";
  } else {
    alert("Senha incorreta.");
  }
}

if (userType !== 'master') {
  document.getElementById('protectedContent').style.display = 'block';
  if (userType === 'demo') document.getElementById('demoNote').classList.remove('hidden');
}

// Voz
let voiceEnabled = false;
document.getElementById('toggleVoice').onclick = () => {
  voiceEnabled = !voiceEnabled;
  document.getElementById('toggleVoice').innerText = voiceEnabled ? '🔇 Desativar Ler' : '🔊 Ativar Ler';
};
