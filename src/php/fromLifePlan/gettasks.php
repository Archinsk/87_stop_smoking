<?php //Авторизация пользователя

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

if ( isset($request) ) {
//Чтение записей
$tasksDB = R::find('tasks', 'userid = ? ORDER BY creation_date DESC', array($request['id']));

//Сборка массива заданий
$tasks = array();
foreach( $tasksDB as $taskitem) {
  $task = array(
	  'id' => $taskitem->id,
	  'task' => $taskitem->task,
	  'done' => $taskitem->done,
	  'creationDate' => $taskitem->creation_date,
	  'completionDate' => $taskitem->completion_date,
	  'categoryid' => $taskitem->categoryid,
	);
	array_push($tasks, $task);
};

$response = array(
  'tasks' => $tasks
);

// Отправка JSON-ответа
echo json_encode($response, JSON_UNESCAPED_UNICODE);

// echo '<pre>';
// var_dump($response);
// echo '</pre>';
}

?>
