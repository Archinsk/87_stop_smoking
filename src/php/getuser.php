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

$userId = $_SESSION['auth_user_id'];

$queries = array();
parse_str($_SERVER['QUERY_STRING'], $queries);
if (!$_SESSION['auth_user_id']) {
  $userId = $queries['userid'];
}
$days = $queries['days'];

if ($userId) {
//Чтение записей
$smokingsDB = R::find('smokings', 'userid = ? ORDER BY timestamp DESC', array($userId));
$weightsDB = R::find('weights', 'userid = ? ORDER BY timestamp DESC', array($userId));
$userDB = R::findOne('users', 'id = ?', array($userId));
$timeZoneOffset = $userDB->time_zone_offset;
$requestTimeStamp = $_SERVER['REQUEST_TIME'];
$timeFromTodayStart = $_SERVER['REQUEST_TIME'] % 86400;
$startOfToday = $_SERVER['REQUEST_TIME'] - $_SERVER['REQUEST_TIME'] % 86400;

$smokingsThreeDays = R::find('smokings', 'userid = ? AND TIMESTAMP > ? ORDER BY timestamp DESC', array($userId, $startOfToday - 0 * 86400 + $timeZoneOffset * 60));

$userDataByDays = array();
for ($i = $days; $i >= 0; $i--) {
	$oneDaySmokingsDB = array();
	if ($i != 0) {
	  $oneDaySmokingsDB = R::find('smokings', 'userid = ? AND TIMESTAMP >= ? AND TIMESTAMP < ? ORDER BY timestamp DESC', array($userId, $startOfToday - $i * 86400 + $timeZoneOffset * 60, $startOfToday - ($i - 1) * 86400 + $timeZoneOffset * 60));
	} else {
	  $oneDaySmokingsDB = R::find('smokings', 'userid = ? AND TIMESTAMP >= ? ORDER BY timestamp DESC', array($userId, $startOfToday - $i * 86400 + $timeZoneOffset * 60));
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
	$oneDay = array(
	  'dayStartTimestamp' => ($startOfToday - $i * 86400) * 1000,
	  'smokings' => $oneDaySmokings,
	);
	array_push($userDataByDays, $oneDay);
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

// Отправка JSON-ответа
echo json_encode($response, JSON_UNESCAPED_UNICODE);

// echo '<pre>';
// var_dump($response);
// echo '</pre>';
} else {
$queries = array();
parse_str($_SERVER['QUERY_STRING'], $queries);

  if ($queries['userid']) {
	//Чтение записей
	$smokingsDB = R::find('smokings', 'userid = ? ORDER BY timestamp DESC', array($queries['userid']));
	$weightsDB = R::find('weights', 'userid = ? ORDER BY timestamp DESC', array($queries['userid']));

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

	$response = array(
	'smokings' => $smokings,
	'weights' => $weights
	);

	// Отправка JSON-ответа
    echo json_encode($response, JSON_UNESCAPED_UNICODE);
  }
}

?>
