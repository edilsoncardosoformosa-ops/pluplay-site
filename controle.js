// Função genérica para obter questões de um bloco específico
async function fetchQuizData(topic){
    const bloco_id = blocoMap[topic];
    const tabela = (userType==='demo') ? 'questoes_demo' : 'questoes';

    const { data, error } = await supabase
        .from(tabela)
        .select("*")
        .eq("bloco_id", bloco_id);

    if(error){
        console.error("Erro ao carregar questões:", error);
        alert("Não foi possível carregar as questões. Veja console.");
        return [];
    }
    return data || [];
}