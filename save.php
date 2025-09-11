<?php
// Recebe dados via POST (JSON)
$data = file_get_contents("php://input");
if(!$data){
    echo json_encode(["success"=>false,"msg"=>"Nenhum dado recebido"]);
    exit;
}

// Arquivo JS que armazena as questões
$file = "quiz.js"; // ou "controle.js" se preferir
$versionFile = "version.txt";

// Cria o conteúdo JS com a variável global quizData
$js = "var quizData = " . $data . ";";

// Salva no arquivo
if(file_put_contents($file, $js)){
    // Gera nova versão (timestamp)
    $version = time();
    file_put_contents($versionFile, $version);
    echo json_encode(["success"=>true,"msg"=>"Banco salvo em $file (versão $version)","version"=>$version]);
}else{
    echo json_encode(["success"=>false,"msg"=>"Erro ao salvar"]);
}
?>