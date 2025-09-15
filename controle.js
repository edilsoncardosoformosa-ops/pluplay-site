// IDs dos blocos no Supabase
const blocoMap = {
  Lport: "11111111-1111-1111-1111-111111111111",
  RIDE: "22222222-2222-2222-2222-222222222222",
  Legisla: "33333333-3333-3333-3333-333333333333",
  TemaEdu: "44444444-4444-4444-4444-444444444444",
  Eduincl: "55555555-5555-5555-5555-555555555555"
};

// Tipo de usuário
let userType = localStorage.getItem('userType') || 'demo';

// Função para buscar questões do Supabase
async function fetchQuizData(topic){
    const bloco_id = blocoMap[topic];
    if(!bloco_id) return [];

    const tabela = (userType === 'demo') ? 'questoes_demo' : 'questoes';

    try {
        const { data, error } = await supabase
            .from(tabela)
            .select("*")
            .eq("bloco_id", bloco_id);

        if(error){
            console.error("Erro ao carregar questões:", error);
            alert("Não foi possível carregar as questões. Veja console.");
            return [];
        }

        return (userType === 'demo') ? data.slice(0,5) : data;
    } catch(err) {
        console.error(err);
        alert("Erro ao conectar com o Supabase.");
        return [];
    }
}