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




//create event delegation to dynamic p elements whose parent have a class of .list-group
$(".list-group").on("click", "p", function() {
  //capture the <p> element's text in var text
  var text = $(this)
  .text()
  .trim();
  //create and capture a textarea with a class of .form-control and assign it's value to be the previously captured text
  var textInput = $("<textarea>")
    .addClass("form-control")
    .val(text);
  //replace the <p> elemnet with the new <textarea>
  $(this).replaceWith(textInput);
  //automatically highlight the <textarea> for editing
  textInput.trigger("focus");
});





//create a function to assign what happens when the <textarea> whose parent has  a class of .list-group  is out of focus
$(".list-group").on("blur", "textarea", function() {
  //capture the textares's current value/text
  var text = $(this)
  .val()
  .trim();
  //capture the parent ul's id attribute and edit it to get the current status
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
  $(this).replaceWith(taskP);
})




//create event listener/delegation on dynamic spans whose parent has a class of .list-group
//due date was clicked
$(".list-group").on("click", "span", function() {
  //capture current text
  var date = $(this)
  .text()
  .trim();
  //create new input element
  var dateInput = $("<input>")
  .attr("type", "text")
  .addClass("form-control")
  .val(date);
  //swap out elements
  $(this).replaceWith(dateInput);
  //automatically focus on new element
  dateInput.trigger("focus");
});




//event listener that converts the input back to span when the user clicks outside of the input area
//value of the date was changed
$(".list-group").on("blur", "input[type='text']", function() {
  //get current text
  var date = $(this)
  .val()
  .trim()
  //get the parent ul"s id attribute
  var status = $(this)
    .closest(".list-group")
    .attr("id")
    .replace("list-", "");
    //get the task's position in the list of otyher li elements
    var index = $(this)
    .closest(".list-group-item")
    .index();
    //update task in array and re-save to local storage
    tasks[status][index].date = date;
    saveTasks();
    //recreate span element with bootstrap classes
    var taskSpan = $("<span>")
    .addClass("badge badge-primary badge-pill")
    .text(date);
    //replace input with span element
    $(this).replaceWith(taskSpan);
});





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




//enable li's with the class of list-group to be sortable
$(".card .list-group").sortable({
  connectWith: $(".card .list-group"),
  scroll: false,
  tolerance: "pointer",
  helper: "clone",
  activate: function(event) {
    console.log("activate", this);
  },
  deactivate: function(event) {
    console.log("deactivate", this);
  },
  over: function(event) {
    console.log("over", event.target);
  },
  out: function(event) {
    console.log("out", event.target);
  },
  update: function(event) {
    //array to store the task data in
    var tempArr = [];
    //loop over current set of children in sortable list
    $(this).children().each(function() {
      var text = $(this)
        .find("p")
        .text()
        .trim();
      var date = $(this)
      .find("span")
      .text()
      .trim();
      //add task data to the temp array as an object
      tempArr.push({
        text: text,
        date: date
      });
    });
     //trim down list's ID to match object property
     var arrName = $(this)
     .attr("id")
     .replace("list-", "");

    //update array on tasks object and save
    tasks[arrName] = tempArr;
    saveTasks();
    console.log(tempArr);
  }
});




//trash icon can be dropped onto
$("#trash").droppable({
  accept: ".card .list-group-item",
  tolerance: "touch",
  drop: function(event, ui) {
    console.log("DROP")
    //remove dragged element from the dom
    ui.draggable.remove();
  },
  over: function(event, ui) {
    console.log("over");
  },
  out: function(event, ui) {
    console.log("out");
  }
});
