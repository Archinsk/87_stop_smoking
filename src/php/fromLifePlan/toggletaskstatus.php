<?php //Редактирование задания

//Сначала разрешим принимать и отправлять запросы на сервер А
header('Access-Control-Allow-Origin: *');
//Установим типы запросов, которые следует разрешить (все неуказанные будут отклоняться)
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
//Разрешим передавать Cookie и Authorization заголовки для указанновго в Origin домена
header('Access-Control-Allow-Credentials: true');
//Установим заголовки, которые можно будет обрабатывать
header('Access-Control-Allow-Headers: Authorization, Origin, X-Requested-With, Accept, X-PINGOTHER, Content-Type');

//Подключение RedBeanPHP и БД
require 'db.php';

//Парсинг входящего JSON'а
$request = json_decode(file_get_contents('php://input'), true);
// echo '<pre>';
// var_dump($request);
// echo '</pre>';

if ( isset($request) ) {
  //Изменение статуса задания с определенным id и запись в БД
  $task = R::load('tasks', $request['id']);
  if ($task->done == false) {
    $task->done = true;
    $task->completionDate = time();
  } else {
    $task->done = false;
    $task->completionDate = NULL;
  }
  R::store($task); 
};

//Формирование ответа
$response = array(
  'task' => $task
);

//Отправка JSON-ответа
echo json_encode($response, JSON_UNESCAPED_UNICODE);

?>