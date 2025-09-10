// Função para carregar controle.js com versionamento
function loadQuizDataFromServer(callback) {
  fetch("version.txt")
    .then(r => r.text())
    .then(version => {
      var script = document.createElement("script");
      script.src = "controle.js?v=" + version.trim();
      script.onload = () => {
        if (callback) callback();
      };
      document.head.appendChild(script);
    })
    .catch(() => {
      // fallback se version.txt não existir
      var script = document.createElement("script");
      script.src = "controle.js?v=" + new Date().getTime();
      script.onload = () => {
        if (callback) callback();
      };
      document.head.appendChild(script);
    });
}

// Variáveis do quiz
var userId = localStorage.getItem("userId");
if (!userId) {
  userId = crypto.randomUUID();
  localStorage.setItem("userId", userId);
}
var currentQuestions = [], currentIndex = 0, score = 0, voiceEnabled = false;

// Inicializa quiz depois de carregar quizData
loadQuizDataFromServer(function() {
  // quizData já carregado do controle.js
  var quizDataGlobal = window.quizData || {};

  function startQuiz(topic) {
    var all = quizDataGlobal[topic] || [];
    if (!all.length) { alert("Sem questões neste tópico."); return; }
    currentQuestions = all.slice();
    currentIndex = 0; score = 0;
    document.getElementById("menu").style.display = "none";
    document.getElementById("quiz").classList.remove("hidden");
    showQuestion();
  }

  function showQuestion() {
    if (currentIndex >= currentQuestions.length) { endQuiz(); return; }
    var q = currentQuestions[currentIndex];
    document.getElementById("question").textContent = q.q;
    document.getElementById("comment").textContent = "";
    document.getElementById("counter").textContent =
      "Questão " + (currentIndex + 1) + " de " + currentQuestions.length;

    if (voiceEnabled) {
      let u = new SpeechSynthesisUtterance(q.q);
      u.lang = "pt-BR"; u.rate = 1.5;
      window.speechSynthesis.cancel(); window.speechSynthesis.speak(u);
    }
  }

  function answer(choice) {
    var q = currentQuestions[currentIndex];
    var txt = (choice === q.a ? "✓ Correto! " : "✗ Errado! ") + (q.c || "");
    document.getElementById("comment").textContent = txt;
    if (choice === q.a) score++;
    if (voiceEnabled) {
      let u = new SpeechSynthesisUtterance(txt);
      u.lang = "pt-BR"; u.rate = 1.2;
      window.speechSynthesis.speak(u);
    }
  }

  function nextQuestion() { currentIndex++; showQuestion(); }
  function prevQuestion() { if (currentIndex > 0) { currentIndex--; showQuestion(); } }
  function backToMenu() {
    document.getElementById("quiz").classList.add("hidden");
    document.getElementById("menu").style.display = "block";
  }

  function endQuiz() {
    document.getElementById("quiz").classList.add("hidden");
    document.getElementById("result").classList.remove("hidden");
    document.getElementById("score").textContent =
      "Você acertou " + score + " de " + currentQuestions.length;
  }

  function restartQuiz() {
    document.getElementById("result").classList.add("hidden");
    document.getElementById("menu").style.display = "block";
  }

  function toggleVoice() {
    voiceEnabled = !voiceEnabled;
    alert(voiceEnabled ? "Leitura ativada" : "Leitura desativada");
  }

  // Expor funções globalmente para botões
  window.startQuiz = startQuiz;
  window.showQuestion = showQuestion;
  window.answer = answer;
  window.nextQuestion = nextQuestion;
  window.prevQuestion = prevQuestion;
  window.backToMenu = backToMenu;
  window.endQuiz = endQuiz;
  window.restartQuiz = restartQuiz;
  window.toggleVoice = toggleVoice;
});