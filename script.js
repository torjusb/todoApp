TDAPP = {
	init: function () {
		TDAPP._addTaskForm = $('#addTask'),
		TDAPP._tasksList = $('#tasks'),
		TDAPP._db = TDAPP.db.open();
		
		TDAPP.task.refreshList();
		TDAPP._addTaskForm.bind('submit', function (e) {
			e.preventDefault();
			
			var input = $('input:text', this),
				title = input.val();			
			
			input.val('');
			
			TDAPP.task.add( title );
		});
		TDAPP._tasksList.delegate('input', 'change', function () {
			TDAPP.task.complete( this.value );
		});
		
		if (!localStorage.getItem('isDBsetup')) {
			TDAPP.db.setup();
			localStorage.setItem('isDBsetup', true);
		}
	},
	db: {
		setup: function () {
			TDAPP._db.transaction( function (tx) {
				tx.executeSql(
					'CREATE TABLE IF NOT EXISTS tasks ( \
						id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, \
						title TEXT NOT NULL, \
						completed INTEGER DEFAULT 0 \
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
		},
	},
	task: {
		add: function ( title ) {
			TDAPP._db.transaction( function (tx) {
				tx.executeSql('INSERT INTO tasks (title) VALUES (?);', [title], function (tx, result) {
					tx.executeSql('SELECT max(id) AS amount FROM tasks;', [], function (tx, result) {						
						TDAPP._tasksList.append('<li id="task-' + result.rows.item(0).amount + '"><input type="checkbox" name="task[]" value="' + result.rows.item(0).amount + '" /><span class="title">' + title + '</span></li>');
					});
					
				});
			});
		},
		'delete': function ( id ) {
			
		},
		refreshList: function () {
			TDAPP._db.transaction( function (tx) {
				tx.executeSql('SELECT t.id AS tid, t.title AS tname, t.completed, t.id, projects.id AS pid, projects.title AS pname FROM tasks AS t INNER JOIN projects ON t.project_id = projects.id GROUP BY t.id, t.title', [], function (tx, result) {

				var html = '';
					for (var i = 0; i < result.rows.length; i++) {
						row = result.rows.item(i);
						console.log(row);
						html += '<li id="task-' + row.id + '"><input type="checkbox" name="task[]" value="' + row.id + '" /><span class="title">' + row.title + '</span>';
					}
					TDAPP._tasksList.data('num-items', result.rows.length).html( html );
				});
			});
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
	}
	
};

jQuery(document).ready( TDAPP.init );