<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8" />
	<title>todoApp</title>
	<script src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.js"></script>
	<script src="todoApp.lib.js"></script>
	<script src="todoApp.interface.js"></script>
</head>
<body>
	<h1>Todo App</h1>
	<form id="addProject">
		<input type="text" placeholder="Project name" name="project-name" data-add-type="project" />
		<input type="submit" value="Add project" />
	</form>
	<form id="addTask">
		<input type="text" placeholder="Task name" name="task-name" data-add-type="task" />
		<input type="submit" value="Add task" />
	</form>
	<ul id="tasks">
	</ul>
</body>
</html>