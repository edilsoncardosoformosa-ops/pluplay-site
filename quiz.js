let voiceEnabled=false, currentQuestions=[], currentIndex=0, score=0;

document.addEventListener("DOMContentLoaded", ()=>{
    document.getElementById('userIdBox').value = localStorage.getItem('userId') || crypto.randomUUID();
    document.getElementById('protectedContent').style.display='block';

    document.getElementById('copyIdBtn').addEventListener('click', ()=>{
        const text = document.getElementById('userIdBox').value;
        navigator.clipboard.writeText(text).then(()=>alert('ID copiado!'));
    });

    document.getElementById('confirmPassBtn').addEventListener('click', async ()=>{
        const pass = document.getElementById('manualPassInput').value.trim();
        if(!pass){ alert('Senha não informada'); return; }
        const res = await window.tryManualPass(pass);
        if(res.success){ alert('Acesso liberado via senha!'); renderUserAllowedNote(); }
        else alert(res.msg);
    });

    document.getElementById('toggleVoice').addEventListener('click', ()=>{
        voiceEnabled = !voiceEnabled;
        document.getElementById('toggleVoice').textContent = voiceEnabled?"🔇 Desativar Ler":"🔊 Ativar Ler";
    });

    renderUserAllowedNote();
});

function renderUserAllowedNote(){
    const userId = localStorage.getItem('userId');
    const noteDiv = document.getElementById('userAllowedNote');
    if(window.allowedUsers.includes(userId)){
        noteDiv.innerHTML = `<strong style="color:green">Acesso liberado!</strong>`;
    } else noteDiv.textContent = "Demo: acesso limitado a 5 questões por tópico.";
}

function startQuiz(topic){
    let all = window.quizData[topic] || [];
    const allowed = window.allowedUsers.includes(localStorage.getItem('userId'));
    if(!allowed) all = all.slice(0,5); // demo limitado
    if(all.length===0){ alert("Sem questões neste tópico."); return; }
    const num = parseInt(document.getElementById("numQuestions").value)||10;
    currentQuestions = shuffle(all).slice(0,num);
    currentIndex=0; score=0;
    document.getElementById('protectedContent').style.display='none';
    document.getElementById('quiz').style.display='block';
    showQuestion();
}

function showQuestion(){
    if(currentIndex>=currentQuestions.length){ endQuiz(); return; }
    const q = currentQuestions[currentIndex];
    document.getElementById('question').textContent = q.q;
    document.getElementById('comment').textContent='';
    document.getElementById('counter').textContent = `Questão ${currentIndex+1} de ${currentQuestions.length}`;
    if(voiceEnabled){
        let u = new SpeechSynthesisUtterance(q.q);
        u.lang='pt-BR'; u.rate=1.5;
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(u);
    }
}

function answer(choice){
    const q = currentQuestions[currentIndex];
    const txt = (choice===q.a?"✓ Correto! ":"✗ Errado! ") + (q.c||'');
    document.getElementById('comment').textContent = txt;
    if(choice===q.a) score++;
    if(voiceEnabled){
        let u = new SpeechSynthesisUtterance(txt); u.lang='pt-BR'; u.rate=1.2;
        window.speechSynthesis.speak(u);
    }
}

function nextQuestion(){ currentIndex++; showQuestion(); }
function backToMenu(){
    document.getElementById('quiz').style.display='none';
    document.getElementById('result').style.display='none';
    document.getElementById('protectedContent').style.display='block';
}
function endQuiz(){
    document.getElementById('quiz').style.display='none';
    document.getElementById('result').style.display='block';
    document.getElementById('score').textContent=`Você acertou ${score} de ${currentQuestions.length} questões.`;
}
function restartQuiz(){
    document.getElementById('result').style.display='none';
    document.getElementById('protectedContent').style.display='block';
}

function shuffle(a){ return a.slice().sort(()=>Math.random()-0.5); }