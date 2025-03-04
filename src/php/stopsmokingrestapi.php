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

$serverTimezoneOffsetMin = date('Z') / 60;

//Определение метода запроса
if ($_SERVER[REQUEST_METHOD] == 'GET') {
  //Проверка идентификатора авторизованного пользователя в строке запроса (убрать при публикации приложения)
  if ($queries['userid']) {
    $authUserId = $queries['userid'];
  }

  //Проверка наличия пользователя с id из сессии в БД и получение его данных
  $userDB = R::findOne('users', 'id = ?', array($authUserId));
  
  //get-server - данные сервера
  if ($_SERVER[PATH_INFO] == '/server') {
    $response->server = $_SERVER;
    
    $timestampDateTest = date('Z');
    //$timestampDateTestOffset = getOffset($timestampDateTest);
      
    $response->server = $_SERVER;
    $response->dateTestOffset = $timestampDateTest;
    //$response->timestampDateTestOffset = $timestampDateTestOffset;
  };

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
      $timeZoneOffsetSec = $userDB->time_zone_offset * 60;
      $startOfGMTToday = $_SERVER['REQUEST_TIME'] - $timeZoneOffsetSec - ($_SERVER['REQUEST_TIME'] - $timeZoneOffsetSec) % 86400;
      $startOfToday = $startOfGMTToday + $timeZoneOffsetSec;

      $days = $queries['days'];

      $userDataByDays = array();
      for ($i = $days; $i >= 0; $i--) {
        $oneDaySmokingsDB = array();
        $oneDayWeightsDB = array();
        if ($i != 0) {
          $oneDaySmokingsDB = R::find('smokings', 'userid = ? AND TIMESTAMP >= ? AND TIMESTAMP < ? ORDER BY timestamp DESC', array($userDB->id, $startOfToday - $i * 86400, $startOfToday - ($i - 1) * 86400));
          $oneDayWeightsDB = R::find('weights', 'userid = ? AND TIMESTAMP >= ? AND TIMESTAMP < ? ORDER BY timestamp DESC', array($userDB->id, $startOfToday - $i * 86400, $startOfToday - ($i - 1) * 86400));
        } else {
          $oneDaySmokingsDB = R::find('smokings', 'userid = ? AND TIMESTAMP >= ? ORDER BY timestamp DESC', array($userDB->id, $startOfToday));
          $oneDayWeightsDB = R::find('weights', 'userid = ? AND TIMESTAMP >= ? ORDER BY timestamp DESC', array($userDB->id, $startOfToday));
        };
        $oneDaySmokings = array();
        foreach( $oneDaySmokingsDB as $smokingItem) {
          $smoking = new stdClass();
          $smoking->id = $smokingItem->id;
          $smoking->type = $smokingItem->type;
          $smoking->timestamp = $smokingItem->timestamp * 1000;
          array_push($oneDaySmokings, $smoking);
        };
        $oneDayWeights = array();
        foreach( $oneDayWeightsDB as $weightItem) {
          $weight = new stdClass();
          $weight->id = $weightItem->id;
          $weight->weight = $weightItem->weight;
          $weight->timestamp = $weightItem->timestamp * 1000;
          array_push($oneDayWeights, $weight);
        };
        $oneDay = new stdClass();
        $oneDay->dayStartTimestamp = ($startOfToday - $i * 86400) * 1000;
        $oneDay->smokings = $oneDaySmokings;
        $oneDay->weights = $oneDayWeights;
        array_push($userDataByDays, $oneDay);
      };

      $weekdaysdays = $queries['weekdays'];

      $weekdaySmokings = array();
      for ($i = $weekdaysdays; $i >= 0; $i--) {
        $oneDaySmokingsDB = array();
        if ($i != 0) {
          $oneDaySmokingsDB = R::find('smokings', 'userid = ? AND TIMESTAMP >= ? AND TIMESTAMP < ? ORDER BY timestamp DESC', array($userDB->id, $startOfToday - $i * 7 * 86400, $startOfToday - ($i * 7 - 1) * 86400));
        } else {
          $oneDaySmokingsDB = R::find('smokings', 'userid = ? AND TIMESTAMP >= ? ORDER BY timestamp DESC', array($userDB->id, $startOfToday));
        };
        $oneDaySmokings = array();
        foreach( $oneDaySmokingsDB as $smokingItem) {
          $smoking = new stdClass();
          $smoking->id = $smokingItem->id;
          $smoking->type = $smokingItem->type;
          $smoking->timestamp = $smokingItem->timestamp * 1000;
          array_push($oneDaySmokings, $smoking);
        };
        $oneDay = new stdClass();
        $oneDay->dayStartTimestamp = ($startOfToday - $i * 7 * 86400) * 1000;
        $oneDay->smokings = $oneDaySmokings;
        array_push($weekdaySmokings, $oneDay);
      };

      $smokedFromStopSmokingStart = R::count('smokings', 'userid = ? AND TIMESTAMP >= ? AND TIMESTAMP < ? ORDER BY timestamp DESC', array($userDB->id, $userDB->stop_smoking_start, $startOfToday));

      $response->userDataByDays = $userDataByDays;
      $response->lastDays = $userDataByDays;
      $response->weekdaySmokings = $weekdaySmokings;
      $response->byWeekday = $weekdaySmokings;
      $response->stopSmokingStart = $userDB->stop_smoking_start * 1000;
      $response->stopSmokingFinish = $userDB->stop_smoking_finish * 1000;
      $response->cigarettesPackPrice = $userDB->cigarettes_pack_price;
      $response->smokingsCount = $userDB->smokings_count;
      $response->lastSmokingDate = $userDB->last_smoking_date * 1000;
      $response->name = $userDB->login;
      $response->smokedFromStopSmokingStart = $smokedFromStopSmokingStart;
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

if ($_SERVER[REQUEST_METHOD] == 'POST') {
  //Парсинг входящего JSON'а
  $request = json_decode(file_get_contents('php://input'), true);

  //Проверка идентификатора авторизованного пользователя в теле запроса (убрать при публикации приложения)
  if ( isset($request) && $request['userid']) {
    $authUserId = $request['userid'];
  }

  //Проверка наличия пользователя с id из сессии в БД и получение его данных
  $userDB = R::findOne('users', 'id = ?', array($authUserId));

  if ($userDB) {
    //set-weight - установка веса
    if ($_SERVER[PATH_INFO] == '/weight') {
      $weight = R::dispense('weights');
      $weight->userid = $userDB->id;
      $weight->weight = $request['weight'];
      $weight->timestamp = $_SERVER['REQUEST_TIME'];
      $id = R::store($weight);

      $response->id = $id;
      $response->weight = $request['weight'];
      $response->timestamp = $time;
    };
    
    //set-smoking - запись курения
    if ($_SERVER[PATH_INFO] == '/smoking') {
      $smoking = R::dispense('smokings');
      $smoking->userid = $userDB->id;
      $smoking->type = $request['smokingType'];
      $smoking->timestamp = $_SERVER['REQUEST_TIME'];
      $id = R::store($smoking);

      //Запись последнего курения в данные пользователя
      $updatedUser = R::load('users', $userDB->id);
      $updatedUser->lastSmokingDate = $_SERVER['REQUEST_TIME'];
      R::store($updatedUser);

      $response->id = $id;
      $response->type = $request['smokingType'];
      $response->timestamp = $_SERVER['REQUEST_TIME'];
    };

    //set-stop-smoking - установка данных для бросания курить
    if ($_SERVER[PATH_INFO] == '/stopsmoking') {
      $updatedUser = R::load('users', $userDB->id);
      $dateStopSmokingStart = new DateTime($request['stopSmokingStart']);
      $timestampStopSmokingStart = $dateStopSmokingStart->getTimestamp();
      $updatedUser->stopSmokingStart = $timestampStopSmokingStart + ($userDB->time_zone_offset + $serverTimezoneOffsetMin) * 60;
      $dateStopSmokingFinish = new DateTime($request['stopSmokingFinish']);
      $timestampStopSmokingFinish = $dateStopSmokingFinish->getTimestamp();
      $updatedUser->stopSmokingFinish = $timestampStopSmokingFinish + ($userDB->time_zone_offset + $serverTimezoneOffsetMin) * 60;
      $updatedUser->smokingsCount = $request['smokingsCount'];
      $updatedUser->cigarettesPackPrice = $request['cigarettesPackPrice'];
      R::store($updatedUser);

      $date = new DateTime('2008-09-22');
      echo $date->getTimestamp();

      $response->userUpdated = true;
    };

    //auth - авторизация
    if ($_SERVER[PATH_INFO] == '/auth') {
      if ( password_verify($request['password'], $userDB->password) ) {
        $response->id = $userDB->id;
	      $response->name = $userDB->login;
        $response->auth = true;
      } else {
        $error = new stdClass();
        $error->type = 'password';
        $error->text = 'Неверно введен пароль!';
        $response->error = $error;
      };
    };
  } else {
    //auth - ошибка поиска пользователя в БД при авторизации
    if ($_SERVER[PATH_INFO] == '/auth') {
      $error = new stdClass();
      $error->type = 'login';
      $error->text = 'Пользователь не зарегистрирован!';
      $response->error = $error; 
      $response->auth = false;
    };
  };
  
  //user - регистрация пользователя
  if ($_SERVER[PATH_INFO] == '/user') {
    $userAlreadyExist = R::findOne('users', 'login = ?', array($request['login']));
    if ($userAlreadyExist) {
      $error = new stdClass();
      $error->type = 'login';
      $error->text = 'Логин уже занят!';
      $response->error = $error;
      $response->registration = false;
    } else {
      $regUser = R::dispense('users');
      $regUser->login = $request['login'];
      $regUser->password = password_hash($request['password'], PASSWORD_DEFAULT);
      $id = R::store($regUser);

      $userDB = R::findOne('users', 'id = ?', array($id));
      $response->id = $userDB->id;
	    $response->name = $userDB->login;
      $response->registration = true;
    };
  };
};

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