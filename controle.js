// IDs dos blocos no Supabase
const blocoMap = {
  Lport: "11111111-1111-1111-1111-111111111111",
  RIDE: "22222222-2222-2222-2222-222222222222",
  Legisla: "33333333-3333-3333-3333-333333333333",
  TemaEdu: "44444444-4444-4444-4444-444444444444",
  Eduincl: "55555555-5555-5555-5555-555555555555"
};

// Função para carregar questões do Supabase e iniciar o quiz
async function startQuiz(topic){
    const bloco_id = blocoMap[topic];
    if(!bloco_id){
        alert("Bloco não encontrado!");
        return;
    }

    let tabela = (userType==="demo") ? "questoes_demo" : "questoes";

    try {
        let { data: questoes, error } = await supabase
            .from(tabela)
            .select("*")
            .eq("bloco_id", bloco_id);

        if(error) throw error;
        if(userType==="demo") questoes = questoes.slice(0, 5);

        quizCurrent = shuffleArray(questoes);
        currentIndex = 0;
        score = 0;
        showQuestion();
        document.getElementById('quiz').style.display='block';
        document.getElementById('menu').style.display='none';
    } catch(err){
        console.error(err);
        alert("Erro ao carregar questões. Veja console.");
    }
}