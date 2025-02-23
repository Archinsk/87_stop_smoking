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

  //Проверка наличия пользователя с id из сессии в БД и получение его данных
  $userDB = R::findOne('users', 'id = ?', array($authUserId));
  
  //get-auth - проверка авторизации
  if ($_SERVER[PATH_INFO] == '/auth') {
    if ($userDB) {
      $user = new stdClass();
      $user->name = $userDB->login;
      $response->auth = true;
      $response->user = $user;
	} else {
	  $response->auth = false;
	};
  };
  
  //get-user - данные пользователя
  if ($_SERVER[PATH_INFO] == '/user') {
    if ($userDB) {
      $timeZoneOffset = $userDB->time_zone_offset;
      $requestTimeStamp = $_SERVER['REQUEST_TIME'];
      $timeFromTodayStart = ($_SERVER['REQUEST_TIME'] - $timeZoneOffset * 60) % 86400;
      $days = $queries['days'];

      userDataByDays = new stdClass();
      for ($i = $days; $i >= 0; $i--) {
        $oneDaySmokingsDB = array();
        $oneDayWeightsDB = array();
        if ($i != 0) {
          $oneDaySmokingsDB = R::find('smokings', 'userid = ? AND TIMESTAMP >= ? AND TIMESTAMP < ? ORDER BY timestamp DESC', array($userDB->id, $startOfToday - $i * 86400 + $timeZoneOffset * 60, $startOfToday - ($i - 1) * 86400 + $timeZoneOffset * 60));
          $oneDayWeightsDB = R::find('weights', 'userid = ? AND TIMESTAMP >= ? AND TIMESTAMP < ? ORDER BY timestamp DESC', array($userDB->id, $startOfToday - $i * 86400 + $timeZoneOffset * 60, $startOfToday - ($i - 1) * 86400 + $timeZoneOffset * 60));
        } else {
          $oneDaySmokingsDB = R::find('smokings', 'userid = ? AND TIMESTAMP >= ? ORDER BY timestamp DESC', array($userDB->id, $startOfToday - $i * 86400 + $timeZoneOffset * 60));
          $oneDayWeightsDB = R::find('weights', 'userid = ? AND TIMESTAMP >= ? ORDER BY timestamp DESC', array($userDB->id, $startOfToday - $i * 86400 + $timeZoneOffset * 60));
        };
        $oneDaySmokings = array();
        foreach( $oneDaySmokingsDB as $smokingItem) {
            $smoking = array(
            'id' => $smokingItem->id,
            'type' => $smokingItem->type,
            'timestamp' => $smokingItem->timestamp * 1000,
          );
          array_push($oneDaySmokings, $smoking);
          };
        $oneDayWeights = array();
        foreach( $oneDayWeightsDB as $weightItem) {
            $weight = array(
            'id' => $weightItem->id,
            'type' => $weightItem->type,
            'timestamp' => $weightItem->timestamp * 1000,
          );
          array_push($oneDayWeights, $weight);
          };
        $oneDay = array(
          'dayStartTimestamp' => ($startOfToday - $i * 86400) * 1000,
          'smokings' => $oneDaySmokings,
          'weights' => $oneDayWeights,
        );
        array_push(userDataByDays, $oneDay);
      };

      //Сборка массива заданий
      $smokings = array();
      foreach( $smokingsDB as $smokingItem) {
        $smoking = array(
          'id' => $smokingItem->id,
          'type' => $smokingItem->type,
          'timestamp' => $smokingItem->timestamp * 1000,
        );
        array_push($smokings, $smoking);
      };
      $weights = array();
      foreach( $weightsDB as $weightItem) {
        $smoking = array(
          'id' => $weightItem->id,
          'weight' => $weightItem->weight,
          'timestamp' => $weightItem->timestamp * 1000,
        );
        array_push($weights, $smoking);
      };
      $smokingsDays = array();
      foreach( $smokingsThreeDays as $smokingItem) {
        $smoking = array(
          'id' => $smokingItem->id,
          'type' => $smokingItem->type,
          'timestamp' => $smokingItem->timestamp * 1000,
        );
        array_push($smokingsDays, $smoking);
      };

      $response = array(
        'smokings' => $smokings,
        'weights' => $weights,
        'byDays' => $smokingsDays,
        'offset' => $timeZoneOffset,
        'user' => $userDB->login,
        'session' => $_SESSION,
        'userDataByDays' => $userDataByDays,
      );
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