<?php
include_once 'config/database.php';
include_once 'class/Task.php';
$database = new Database();
$db = $database->getConnection();
$task = new Task($db);


if ($_SERVER['REQUEST_METHOD'] === 'GET' && !empty($_GET['action'])) {
	if ($_GET['action'] == 'getAll') {
		$task->index();
	}
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && !empty($_POST['action'])) {
	if ($_POST['action'] == 'add') {
		$task->task = $_POST['task'];
		$task->priority = $_POST['priority'];
		$task->create();
	}

	if ($_POST['action'] == 'updateCompletedTask') {
		$task->id = $_POST['id'];
		$task->completed = $_POST['completed'];
		$task->updateCompleted();
	}

	if ($_POST['action'] == 'deleteTask') {
		$task->id = $_POST['id'];
		$task->delete();
	}
}
