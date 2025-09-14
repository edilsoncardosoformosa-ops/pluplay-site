let quizCurrent = [];
let currentIndex = 0;
let score = 0;

const maxDemo = 5;

const blocoMap = {
  Lport: "11111111-1111-1111-1111-111111111111",
  RIDE: "22222222-2222-2222-2222-222222222222",
  Legisla: "33333333-3333-3333-3333-333333333333",
  TemaEdu: "44444444-4444-4444-4444-444444444444",
  Eduincl: "55555555-5555-5555-5555-555555555555"
};

function shuffleArray(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

async function startQuiz(topic) {
  const numQ = parseInt(document.getElementById('numQuestions').value) || 10;
  const blocoId = blocoMap[topic];
  const tabela = userType === 'demo' ? 'questoes_demo' : 'questoes';

  // Busca questões no Supabase
  const { data, error } = await supabase
    .from(tabela)
    .select('*')
    .eq('bloco_id', blocoId);

  if (error) {
    console.error("Erro ao carregar questões:", error);
    alert("Não foi possível carregar as questões. Veja o console.");
    return;
  }

  quizCurrent = data || [];
  if (!quizCurrent.length) {
    alert("Sem questões neste tópico.");
    return;
  }

  if (userType === 'demo') quizCurrent = quizCurrent.slice(0, maxDemo);
  quizCurrent = shuffleArray(quizCurrent).slice(0, numQ);

  currentIndex = 0;
  score = 0;

  document.getElementById('menu').style.display = 'none';
  document.getElementById('quiz').classList.remove('hidden');

  showQuestion();
}

function showQuestion() {
  if (currentIndex >= quizCurrent.length) {
    endQuiz();
    return;
  }

  const q = quizCurrent[currentIndex];
  document.getElementById('question').textContent = q.pergunta;
  document.getElementById('comment').textContent = '';
  document.getElementById('counter').textContent = `Questão ${currentIndex + 1} de ${quizCurrent.length}`;

  if (voiceEnabled) {
    const u = new SpeechSynthesisUtterance(q.pergunta);
    u.lang = 'pt-BR';
    u.rate = 1.5;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  }
}

function answer(val) {
  const q = quizCurrent[currentIndex];
  const isCorrect = (q.resposta === val);
  const txt = isCorrect ? "✓ Correto! " : "✗ Errado! ";
  document.getElementById('comment').textContent = txt + (q.comentario || "");
  if (isCorrect) score++;

  if (voiceEnabled) {
    const u = new SpeechSynthesisUtterance(txt + (q.comentario || ""));
    u.lang = 'pt-BR';
    u.rate = 1.5;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  }
}

function nextQuestion() { currentIndex++; showQuestion(); }

function backToMenu() {
  document.getElementById('quiz').classList.add('hidden');
  document.getElementById('result').style.display = 'none';
  document.getElementById('menu').style.display = 'block';
}

function endQuiz() {
  document.getElementById('quiz').classList.add('hidden');
  document.getElementById('result').classList.remove('hidden');
  document.getElementById('score').textContent = `Você acertou ${score} de ${quizCurrent.length}`;
}

function restartQuiz() {
  currentIndex = 0;
  score = 0;
  document.getElementById('result').classList.add('hidden');
  document.getElementById('menu').style.display = 'block';
}

function toggleVoice() {
  voiceEnabled = !voiceEnabled;
  alert(voiceEnabled ? "Leitura ativada" : "Leitura desativada");
}
