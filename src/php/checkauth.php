<?php //Авторизация пользователя

//Подключение RedBeanPHP и БД
require 'db.php';

$userId = $_SESSION['auth_user_id'];
if (!$_SESSION['auth_user_id']) {
  $queries = array();
  parse_str($_SERVER['QUERY_STRING'], $queries);
  $userId = $queries['userid'];
}

if ($userId) {
  //Проверка наличия пользователя в базе и соответствия пароля
  $userDB = R::findOne('users', 'id = ?', array($userId) );
  if ( $userDB ) {
	$user = array(
	  'id' => $userDB->id,
	  'name' => $userDB->login,
	);
	$response = array(
	  'user' => $user,
	  'server' => $_SERVER,
	  'headers' => apache_request_headers(),
	  'body' => file_get_contents('php://input')
	);  
  }
} else {
  $error = array(
	'id' => '10',
	'type' => 'auth',
	'errorText' => 'Текущий пользователь не авторизован!',
	'userid' => $userid
  );
  $response = array(
	'error' => $error
  );
};

//Отправка JSON-ответа
echo json_encode($response, JSON_UNESCAPED_UNICODE);

?>
