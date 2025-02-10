<?php //Выход из системы

//Подключение RedBeanPHP и БД
require 'db.php';

if ($_SESSION['auth_user_id']) {
  unset($_SESSION['auth_user_id']);
  echo 'Осуществлён выход из системы.';
  echo 'Сессия пользователя завершена';
} else {
  echo 'Сессия пользователя была неактивна';
}

?>