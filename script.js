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
	task: {
		add: function (title) {
			console.log(title);
			TDAPP._db.transaction( function (tx) {
				tx.executeSql('INSERT INTO tasks (title) VALUES (?);', [title], function (tx, result) {
					tx.executeSql('SELECT max(id) AS amount FROM tasks;', [], function (tx, result) {						
						TDAPP._tasksList.append('<li><input type="checkbox" name="task[]" value="' + result.rows.item(0).amount + '" /><span class="title">' + title + '</span></li>');
					});
					
				}, function (tx, e) {
					console.log(e);
				});
			});
		},
		'delete': function () {
		
		},
		refreshList: function () {
			TDAPP._db.transaction( function (tx) {
				tx.executeSql('SELECT * FROM tasks ORDER BY id', [], function (tx, result) {
					var html = '';
					for (var i = 0; i < result.rows.length; i++) {
						row = result.rows.item(i);
						html += '<li><input type="checkbox" name="task[]" value="' + row.id + '" /><span class="title">' + row.title + '</span>';
					}
					console.log(result.rows.length);
					TDAPP._tasksList.data('num-items', result.rows.length).html( html );
				});
			});
		}
	}
	
};

jQuery(document).ready( TDAPP.init );