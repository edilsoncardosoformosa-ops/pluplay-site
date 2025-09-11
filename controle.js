// controle.js - banco de questões vazio, master poderá adicionar
window.quizData = JSON.parse(localStorage.getItem('quizData') || '{}');

// Apenas para testes iniciais, pode adicionar tópicos vazios
if(!window.quizData.Lport) window.quizData.Lport = [];
if(!window.quizData.ride) window.quizData.ride = [];
if(!window.quizData.Legisla) window.quizData.Legisla = [];
if(!window.quizData.TemaEdu) window.quizData.TemaEdu = [];
if(!window.quizData.Eduincl) window.quizData.Eduincl = [];