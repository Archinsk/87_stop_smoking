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
  $weight = R::dispense('weights');
    $weight->userid = $_SESSION['auth_user_id'];
    $weight->weight = $request['weight'];
    $weight->timestamp = $time;
  $id = R::store($weight);
}

//Формирование ответа
$weightResponse = array(
  'id' => $id,
  'weight' => $request['task'],
  'timestamp' => $time
);
//$response = array(
//  'task' => $weightResponse
//);
$response = $weightResponse;

//Отправка JSON-ответа
echo json_encode($response, JSON_UNESCAPED_UNICODE);

?>
