<?php
$data = file_get_contents("php://input");
if(!$data){
  echo "Nenhum dado recebido";
  exit;
}

$file = "controle.js";
$versionFile = "version.txt";

$js = "var quizData = " . $data . ";";

if(file_put_contents($file, $js)){
  // gera versão nova (timestamp)
  $version = time();
  file_put_contents($versionFile, $version);
  echo "Banco salvo em controle.js (versão $version)";
}else{
  echo "Erro ao salvar";
}
?>