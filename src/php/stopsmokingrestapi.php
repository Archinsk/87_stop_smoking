<?php

//Снятие защиты CORS для принятия запросов со сторонних адресов в процессе разработки (убрать при публикации приложения)
//Сначала разрешим принимать и отправлять запросы на сервер А
header('Access-Control-Allow-Origin: *');
//Установим типы запросов, которые следует разрешить (все неуказанные будут отклоняться)
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
//Разрешим передавать Cookie и Authorization заголовки для указанновго в Origin домена
header('Access-Control-Allow-Credentials: true');
//Установим заголовки, которые можно будет обрабатывать
header('Access-Control-Allow-Headers: Authorization, Origin, X-Requested-With, Accept, X-PINGOTHER, Content-Type');

//Подключение RedBeanPHP
require 'rb.php';
R::setup( 'mysql:host=localhost; dbname=stopsmoking', 'mikhail', '9039033661!' );

//Запуск сессии
session_start();

$response = new stdClass();

//Проверка идентификатора авторизованного пользователя в данных сессии
$authUserId = $_SESSION['auth_user_id'];

//Проверка строки запроса 
$queries = array();
parse_str($_SERVER[QUERY_STRING], $queries);

//Определение метода запроса
if ($_SERVER[REQUEST_METHOD] == 'GET') {
  //Проверка идентификатора авторизованного пользователя в строке запроса (убрать при публикации приложения)
  if ($queries['userid']) {
    $authUserId = $queries['userid'];
  }
  
  //get-auth - проверка авторизации
  if ($_SERVER[PATH_INFO] == '/auth') {
    if ($authUserId) {
      $response->auth = true;
	} else {
	  $response->auth = false;
	};
  };
  
  //get-user - данные пользователя
  if ($_SERVER[PATH_INFO] == '/user') {
    if ($authUserId) {
      $response->user = new stdClass();
	} else {
	  $response->auth = false;
	};
  };
  
  //get-userId - идентификатор текущего пользователя
  if ($_SERVER[PATH_INFO] == '/userid') {
    if ($authUserId) {
      $response->userId = $authUserId;
	} else {
	  $response->auth = false;
	};
  };
  
  //get-logout - разлогинивание пользователя
  if ($_SERVER[PATH_INFO] == '/logout') {
    $response->logout = true;
	$response->auth = false;
	session_destroy();
  };
};

//if ($_SERVER[REQUEST_METHOD] == 'POST') {
//};

//$response->server = $_SERVER;
$response->requestMethod = $_SERVER[REQUEST_METHOD];
$response->path = $_SERVER[PATH_INFO];
//$response->queries = $queries;
  
// Отправка JSON-ответа
// echo json_encode($_SERVER, JSON_UNESCAPED_UNICODE);
echo json_encode($response, JSON_UNESCAPED_UNICODE);

// Отправка ответа
//echo $response;

?>