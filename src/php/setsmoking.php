<?php //Добавление задания в список заданий

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

//echo '--------------------------';
//var_dump($request);
//echo '--------------------------';

//Фиксация даты создания
$time = time();

//Запись в БД
if ( isset($request) && $_SESSION['auth_user_id']) {
  $smoking = R::dispense('smokings');
    $smoking->userid = $_SESSION['auth_user_id'];
    $smoking->type = $request['smokingType'];
    $smoking->timestamp = $time;
  $id = R::store($smoking);
}

//Формирование ответа
$smokingResponse = array(
  'id' => $id,
  'type' => $request['smokingType'],
  'timestamp' => $time,
  'server' => $_SERVER,
  'headers' => apache_request_headers(),
  'body' => file_get_contents('php://input')
);
//$response = array(
//  'task' => $weightResponse
//);
$response = $weightResponse;

//Отправка JSON-ответа
echo json_encode($response, JSON_UNESCAPED_UNICODE);

?>
