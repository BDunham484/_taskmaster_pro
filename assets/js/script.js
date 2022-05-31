var tasks = {};

var createTask = function(taskText, taskDate, taskList) {
  // create elements that make up a task item
  var taskLi = $("<li>").addClass("list-group-item");
  var taskSpan = $("<span>")
    .addClass("badge badge-primary badge-pill")
    .text(taskDate);
  var taskP = $("<p>")
    .addClass("m-1")
    .text(taskText);

  // append span and p element to parent li
  taskLi.append(taskSpan, taskP);


  // append to ul list on the page
  $("#list-" + taskList).append(taskLi);
};





var loadTasks = function() {
  tasks = JSON.parse(localStorage.getItem("tasks"));

  // if nothing in localStorage, create a new object to track all task status arrays
  if (!tasks) {
    tasks = {
      toDo: [],
      inProgress: [],
      inReview: [],
      done: []
    };
  }

  // loop over object properties
  $.each(tasks, function(list, arr) {
    console.log(list, arr);
    // then loop over sub-array
    arr.forEach(function(task) {
      createTask(task.text, task.date, list);
    });
  });
};





var saveTasks = function() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
};




//create event delegation to dynamic p elements whose parent has a class of .list-group
$(".list-group").on("click", "p", function() {
  //capture the <p> element's text in var text
  var text = $(this)
  .text()
  .trim();
  console.log(text);
  //create and capture a textarea with a class of .form-control and assign it's value to be the previously captured text
  var textInput = $("<textarea>")
    .addClass("form-control")
    .val(text);
  //replace the <p> elemnet with the new <textarea>
  $(this).replaceWith(textInput);
  //automatically highlight the <textarea> for editing
  textInput.trigger("focus");
});





//create a function that describes what happens when the  <textarea> whose parent has  a class of .list-group  is out of focus
$(".list-group").on("blur", "textarea", function() {
  //capture the textares's current value/text
  var text = $(this)
  .val()
  .trim();
  //capture the parent ul's id attribute
  var status = $(this) 
  .closest(".list-group")
  .attr("id")
  .replace("list-", "");
  console.log(status)
  //get the task's position in the list of other li elements
  var index = $(this)
  .closest(".list-group-item")
  .index();

  //use this captured data to update the appropriate arrays in the task object
  tasks[status][index].text = text;
  saveTasks();

  //recreate p element
  var taskP = $("<p>")
    .addClass("m-1")
    .text(text);

  //replace textarea with a p element
  $(this).repalceWith(taskP);
})





// modal was triggered
$("#task-form-modal").on("show.bs.modal", function() {
  // clear values
  $("#modalTaskDescription, #modalDueDate").val("");
});

// modal is fully visible
$("#task-form-modal").on("shown.bs.modal", function() {
  // highlight textarea
  $("#modalTaskDescription").trigger("focus");
});

// save button in modal was clicked
$("#task-form-modal .btn-primary").click(function() {
  // get form values
  var taskText = $("#modalTaskDescription").val();
  var taskDate = $("#modalDueDate").val();

  if (taskText && taskDate) {
    createTask(taskText, taskDate, "toDo");

    // close modal
    $("#task-form-modal").modal("hide");

    // save in tasks array
    tasks.toDo.push({
      text: taskText,
      date: taskDate
    });

    saveTasks();
  }
});

// remove all tasks
$("#remove-tasks").on("click", function() {
  for (var key in tasks) {
    tasks[key].length = 0;
    $("#list-" + key).empty();
  }
  saveTasks();
});

// load tasks for the first time
loadTasks();


