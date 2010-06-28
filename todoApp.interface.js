jQuery( function ($) {
	var addProjectForm = $('#addProject'),
		addTaskForm = $('#addTask'),
		taskList = $('#tasks')
		
		
	addTaskForm.hide().bind('submit', function (e) {
		e.preventDefault();
		
		var input = $('input:text', this),
			title = input.val(),
			project_id = TDAPP._addTaskToProject,
			
			properties = {
				label: $(this).data('selectedColor').attr('data-color-code')
			};
		
		input.val('');
		
		
		TDAPP.task.add(title, project_id, properties);
	});
	taskList.delegate('input[type="checkbox"]', 'change', function () {
		TDAPP.task.complete( this.value );
	}).delegate('input[type="button"]', 'click', function () {
		var button = $(this);
		
		TDAPP._addTaskToProject = button.parent().attr('data-project-id');
		addTaskForm.show();
	});
	
	TDAPP.refreshList( function (obj) {
		var html = '',	
			addTaskButton = '<input type="button" value="Add task" />';
		
		for (i in obj) {
			var project = obj[i];

			html += '<li data-project-id="' + project.id + '">' + project.title + addTaskButton + '<ul class="tasks">';
			for (y in project.tasks) {
				var task = project.tasks[y],
					background = task.label !== 'none' ? ' style="background:#' + task.label + '"' : '';
				
				html += '<li' + background + ' id="task-' + task.id + '"><input type="checkbox" name="task[]" value="' + task.id + '" /><span class="title">' + task.title + '</span>';
			}
			html += '</ul></li>';
		}
		
		taskList.html( html );
	});
	
	(function () {
		var html = '<ul id="colors">',
			elem;
		for (i = 1; i < TDAPP._colors.length; i++) {
			html += '<li style="background:#' + TDAPP._colors[i] + '" data-color-code="' + TDAPP._colors[i] + '"></li>';
		}
		html += '</ul>';
		
		elem = $(html);
		
		elem.appendTo(addTaskForm).delegate('li', 'click', function () {
			if (addTaskForm.data('selectedColor')) {
				addTaskForm.data('selectedColor').empty();
			}
			
			addTaskForm.data('selectedColor', $(this).text('selected'));
			
		});
	})();
});