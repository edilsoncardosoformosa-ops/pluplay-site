let quizCurrent=[], currentIndex=0, score=0;

function shuffleArray(arr){ return arr.sort(()=>Math.random()-0.5); }

async function startQuiz(topic){
  const numQ = parseInt(document.getElementById('numQuestions').value) || 10;
  const all = await fetchQuestions(topic);
  if(!all.length){ alert("Sem questões neste tópico."); return; }
  quizCurrent = shuffleArray(all).slice(0, numQ);
  currentIndex=0; score=0;
  document.getElementById('menu').style.display='none';
  document.getElementById('quiz').classList.remove('hidden');
  showQuestion();
}

function showQuestion(){
  if(currentIndex>=quizCurrent.length){ endQuiz(); return; }
  const q = quizCurrent[currentIndex];
  document.getElementById('question').textContent = q.pergunta;
  document.getElementById('comment').textContent = '';
  document.getElementById('counter').textContent = `Questão ${currentIndex+1} de ${quizCurrent.length}`;
  if(voiceEnabled){
    let u = new SpeechSynthesisUtterance(q.pergunta);
    u.lang='pt-BR'; u.rate=1.5; window.speechSynthesis.cancel(); window.speechSynthesis.speak(u);
  }
}

function answer(val){
  const q = quizCurrent[currentIndex];
  const isCorrect = (q.resposta === val);
  const txt = isCorrect ? "✓ Correto! " : "✗ Errado! ";
  document.getElementById('comment').textContent = txt + (q.comentario || "");
  if(isCorrect) score++;
  if(voiceEnabled){
    let u = new SpeechSynthesisUtterance(txt + (q.comentario || ""));
    u.lang='pt-BR'; u.rate=1.5; window.speechSynthesis.cancel(); window.speechSynthesis.speak(u);
  }
}

function nextQuestion(){ currentIndex++; showQuestion(); }
function backToMenu(){ document.getElementById('quiz').classList.add('hidden'); document.getElementById('result').style.display='none'; document.getElementById('menu').style.display='block'; }
function endQuiz(){ document.getElementById('quiz').classList.add('hidden'); document.getElementById('result').classList.remove('hidden'); document.getElementById('score').textContent=`Você acertou ${score} de ${quizCurrent.length}`; }
function restartQuiz(){ document.getElementById('result').classList.add('hidden'); document.getElementById('menu').style.display='block'; }
function toggleVoice(){ voiceEnabled=!voiceEnabled; alert(voiceEnabled?"Leitura ativada":"Leitura desativada"); }
