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

if ($_SESSION['auth_user_id']) {
//Чтение записей
$smokingsDB = R::find('smokings', 'userid = ? ORDER BY timestamp DESC', array($_SESSION['auth_user_id']));
$weightsDB = R::find('weights', 'userid = ? ORDER BY timestamp DESC', array($_SESSION['auth_user_id']));

//Сборка массива заданий
$smokings = array();
foreach( $smokingsDB as $smokingItem) {
  $smoking = array(
	  'id' => $smokingItem->id,
	  'type' => $smokingItem->type,
	  'timestamp' => $smokingItem->timestamp,
	);
	array_push($smokings, $smoking);
};
$weights = array();
foreach( $weightsDB as $weightItem) {
  $smoking = array(
	  'id' => $weightItem->id,
	  'weight' => $weightItem->weight,
	  'timestamp' => $weightItem->timestamp,
	);
	array_push($weights, $smoking);
};

$response = array(
  'smokings' => $smokings,
  'weights' => $weights
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
