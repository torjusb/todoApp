TDAPP = {
	init: function () {
		TDAPP._addTaskForm = $('#addTask'),
		TDAPP._addProjectForm = $('#addProject'),
		TDAPP._tasksList = $('#tasks'),
		TDAPP._db = TDAPP.db.open();
		
		TDAPP._addTaskForm.add(TDAPP._addProjectForm).bind('submit', function (e) {
			e.preventDefault();
			
			var input = $('input:text', this),
				title = input.val();			
			
			input.val('');
			
			TDAPP[ input.attr('data-add-type') ].add(title);
		});
		TDAPP._tasksList.delegate('input', 'change', function () {
			TDAPP.task.complete( this.value );
		});
		
		TDAPP.db.setup();
		TDAPP.refreshList();
	},
	db: {
		setup: function () {
			TDAPP._db.transaction( function (tx) {
				tx.executeSql(
					'CREATE TABLE IF NOT EXISTS tasks ( \
						id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, \
						title TEXT NOT NULL, \
						completed INTEGER DEFAULT 0, \
						project_id INTEGER NOT NULL \
					);'
				);
				tx.executeSql(
					'CREATE TABLE IF NOT EXISTS projects ( \
						id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, \
						title TEXT NOT NULL \
					);'
				);
			});
		},
		open: function () {
			var shortName = 'TDAPP',
				version = '1.0',
				displayName = 'TodoApp',
				maxSize = 65536;
				
			return openDatabase(shortName, version, displayName, maxSize);
		}
	},
	project: {
		add: function ( title ) {
			TDAPP._db.transaction( function (tx) {
				tx.executeSql('INSERT INTO projects (title) VALUES (?);', [title], function  (tx, result) {
						
				});
			});
		},
		'delete': function ( id ) {
		
		}
	},
	task: {
		add: function ( title ) {
			TDAPP._db.transaction( function (tx) {
				tx.executeSql('INSERT INTO tasks (title, project_id) VALUES (?, ?);', [title, 2], function (tx, result) {
					tx.executeSql('SELECT max(id) AS amount FROM tasks;', [], function (tx, result) {						
						TDAPP._tasksList.append('<li id="task-' + result.rows.item(0).amount + '"><input type="checkbox" name="task[]" value="' + result.rows.item(0).amount + '" /><span class="title">' + title + '</span></li>');
					});
					
				});
			});
		},
		'delete': function ( id ) {
			
		},
		complete: function ( id ) {
			TDAPP._db.transaction( function (tx) {
				tx.executeSql('UPDATE tasks SET completed = 1 WHERE id = ?', [id], function (tx) {
					var elem = $('#task-' + id);
					elem.slideUp(300, function () {
						elem.remove();
					});
				});
			});
		}
	},
	refreshList: function () {
		TDAPP._db.transaction( function (tx) {
			var res = tx.executeSql('SELECT t.id AS tid, t.title AS tname, t.completed, t.id, projects.id AS pid, projects.title AS pname FROM tasks AS t INNER JOIN projects ON t.project_id = projects.id AND t.completed = 0 GROUP BY t.id, t.title', [], function (tx, result) {
				var resObj = {},
					x = 0, y = 0, lastProjectId,
					listHtml = '';
					
				for (var i = 0; i < result.rows.length; i++) {
					var row = result.rows.item(i);
					
					if (lastProjectId !== row.pid) {
						x++;
						resObj[x] = {
							id: row.pid,
							title: row.pname,
							tasks: {},
						};
						y = 1;
					}
					
					resObj[x]['tasks'][y] = {
						id: row.tid,
						title: row.tname,
						completed: row.completed
					};
					
					y++;
					lastProjectId = row.pid;
				}
				
				listHtml = '<ul>';
				for (i in resObj) {
					var project = resObj[i];
					
					listHtml += '<li>' + project.title + '<ul class="tasks">';
					
					for (y in project.tasks) {
						var task = project.tasks[y];
						
						listHtml += '<li id="task-' + task.id + '"><input type="checkbox" name="task[]" value="' + task.id + '" /><span class="title">' + task.title + '</span>';
					}
					listHtml += '</ul></li>';
				}
				listHtml += '</ul>';
				
				TDAPP._tasksList.html( listHtml );
			});
		});
	}
	
};

jQuery(document).ready( TDAPP.init );