<?php
class Task
{
	private $table = 'tasks';
	private $connection;

	public function __construct($db)
	{
		$this->connection = $db;
	}

	public function index()
	{
		$sqlQuery = "
			SELECT *
			FROM " . $this->table . " 
			ORDER BY id ASC";

		$stmt = $this->connection->prepare($sqlQuery);
		$stmt->execute();
		$result = $stmt->get_result();
		$record = $result->fetch_all(MYSQLI_ASSOC);
		echo json_encode($record);
	}

	public function create()
	{
		if ($this->task && $this->priority) {
			$task = $this->connection->prepare("
				INSERT INTO " . $this->table . "(`name`,`completed`,`priority`)
				VALUES(?,0,?)");

			$task->bind_param("ss", $this->task, $this->priority);

			if ($task->execute()) {
				$lastTask = $task->insert_id;

				$sqlQuery = "
					SELECT *
					FROM " . $this->table . " 
					WHERE id = '$lastTask'";

				$getTask = $this->connection->prepare($sqlQuery);
				$getTask->execute();
				$result = $getTask->get_result();
				$record = $result->fetch_assoc();
				echo json_encode($record);
			}
		}
	}

	public function updateCompleted()
	{

		if ($this->id) {
			$stmt = $this->connection->prepare("
				UPDATE " . $this->table . " 
				SET completed = '" . $this->completed . "'
				WHERE id IN (" . $this->id . ")");

			if ($stmt->execute()) {
				return true;
			}
		}
	}

	public function delete()
	{
		if ($this->id) {
			$stmt = $this->connection->prepare("
				DELETE FROM " . $this->table . "
				WHERE id = " . $this->id);

			if ($stmt->execute()) {
				return true;
			}
		}
	}
}
