<?php //Регистрация пользователя

//Подключение RedBeanPHP и БД
require 'db.php';

//Парсинг входящего JSON'а
$request = json_decode(file_get_contents('php://input'), true);

if ( isset($request) ) {
  //Проверка уникальности выбранного логина
  if ( R::count('users', 'login = ?', array($request['login'])) > 0) {
    $error = array(
	    'id' => '3',
	    'type' => 'login',
	    'errorText' => 'Логин уже занят!'
	  );
	  $response = array(
	    'error' => $error
	  );
  } else {
    //Регистрация пользователя в БД
    $regUser = R::dispense('users');
      $regUser->login = $request['login'];
      $regUser->password = password_hash($request['password'], PASSWORD_DEFAULT);
    R::store($regUser);
	
    //Чтение идентификатора зарегистрированного пользователя
    $userDB = R::findOne('users', 'login = ?', array($request['login']) );
    if ( $userDB ) {
      if ( password_verify($request['password'], $userDB->password) ) {
        $user = array(
	      'id' => $userDB->id,
	      'name' => $userDB->login,
	    );    
        $response = array(
	      'user' => $user
        ); 
      };
	  $_SESSION['auth_user_id'] = $userDB->id;
    };
  };

  //Отправка JSON-ответа
  echo json_encode($response, JSON_UNESCAPED_UNICODE);
}
?>