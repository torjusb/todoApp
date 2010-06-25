(function () {
	TDAPP = {
		init: function () {
			TDAPP._db = TDAPP.db.open(),
			TDAPP._addTaskToProject,
			TDAPP._colors = ['FFFE00', 'FF0E00', '0AFF00', '00FCFF', '0081FF', '7E88FF'];
			
			TDAPP.db.setup();
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
			add: function ( title, project_id ) {
				TDAPP._db.transaction( function (tx) {
					tx.executeSql('INSERT INTO tasks (title, project_id) VALUES (?, ?);', [title, project_id], function (tx, result) {
						tx.executeSql('SELECT max(id) AS amount FROM tasks;', [], function (tx, result) {						
							TDAPP._tasksList.find('li[data-project-id=' + project_id + ']').find('ul').append('<li id="task-' + result.rows.item(0).amount + '"><input type="checkbox" name="task[]" value="' + result.rows.item(0).amount + '" /><span class="title">' + title + '</span></li>');
							
							TDAPP._addTaskForm.hide();
							TDAPP._addTaskToProject = undefined;
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
		refreshList: function ( callback ) {
			var resObj = {};
			
			TDAPP._db.transaction( function (tx) {
				tx.executeSql('SELECT t.id AS tid, t.title AS tname, t.completed, t.id, projects.id AS pid, projects.title AS pname FROM tasks AS t INNER JOIN projects ON t.project_id = projects.id AND t.completed = 0 ORDER BY pid', [], function (tx, result) {
					var x = 0, y = 0, lastProjectId;
						
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
					
					callback(resObj);
				});
			});
		}
		
	};
	
	window.TDAPP = TDAPP;
	
	jQuery(document).ready( TDAPP.init );
})(window);