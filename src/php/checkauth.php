<?php //Авторизация пользователя

//Подключение RedBeanPHP и БД
require 'db.php';

if ($_SESSION['auth_user_id']) {
  //Проверка наличия пользователя в базе и соответствия пароля
  $userDB = R::findOne('users', 'id = ?', array( $_SESSION['auth_user_id'] ) );
  if ( $userDB ) {
	$user = array(
	  'id' => $userDB->id,
	  'name' => $userDB->login,
	);
	$response = array(
	  'user' => $user
	);  
  }
} else {
  $error = array(
	'id' => '10',
	'type' => 'auth',
	'errorText' => 'Текущий пользователь не авторизован!'
  );
  $response = array(
	'error' => $error
  );
};

//Отправка JSON-ответа
echo json_encode($response, JSON_UNESCAPED_UNICODE);

?>