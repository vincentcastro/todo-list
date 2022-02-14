<?php
class Database
{
	private $host  = 'localhost';
	private $user  = 'root';
	private $password   = "";
	private $database  = "todolist";

	public function getConnection()
	{
		$connection = new mysqli($this->host, $this->user, $this->password, $this->database);
		if ($connection->connect_error) {
			die("Error failed to connect to MySQL: " . $connection->connect_error);
		} else {
			return $connection;
		}
	}
}
