$(document).ready(function () {
  // Get All Task on Initial Load
  getAllTask();

  // Saving Task
  $(document).on("submit", "#taskForm", function (event) {
    var formData = $(this).serialize();
    createTask(formData);
    return false;
  });

  // Completing Tasks
  $(".tasklist").on(
    "change",
    '#sortable li input[type="checkbox"]',
    function () {
      if ($(this).prop("checked")) {
        $(this).parent().addClass("done");
      } else {
        $(this).parent().removeClass("done");
      }
      let id = $(this).val();
      let value = $(this).prop("checked") ? 1 : 0;
      completeTask(id, value);
    }
  );

  // Sorting Tasks
  $(".tasklist").on("click", ".sort", function () {
    var type = $(this).attr("data-sort");
    var sortType = $(this).attr("data-sort-type");
    if (sortType == "asc") {
      $(this).attr("data-sort-type", "desc");
      $(this).find("i").removeClass("bi-arrow-down");
      $(this).find("i").addClass("bi-arrow-up");
    } else {
      $(this).attr("data-sort-type", "asc");
      $(this).find("i").removeClass("bi-arrow-up");
      $(this).find("i").addClass("bi-arrow-down");
    }

    sortListDir(type, sortType);
  });

  // Deleting Tasks
  $(".tasklist").on("click", ".remove-item", function () {
    removeItem(this);
    var id = $(this).attr("data-id");
    deleteTask(id);
  });
});

function getAllTask() {
  var action = "getAll";
  $.ajax({
    url: "action.php",
    method: "GET",
    data: { action: action },
    success: function (data) {
      if (data) {
        const tasks = JSON.parse(data);
        let tasksHtml = "";
        tasks.forEach((task) => {
          tasksHtml += renderTaskHtml(task);
        });
        $("#sortable").append(tasksHtml).fadeIn("slow");
        countTodos();
      }
    },
  });
}

function createTask(formData) {
  $.ajax({
    url: "action.php",
    method: "POST",
    data: formData,
    dataType: "json",
    success: function (data) {
      if (data) {
        $("#sortable").append(renderTaskHtml(data)).fadeIn("slow");
        $("#task").val("");
        $("#priority").val("");
        countTodos();
      }
    },
  });
}

function completeTask(taskId, value) {
  var action = "updateCompletedTask";
  $.ajax({
    url: "action.php",
    method: "POST",
    data: { id: taskId, completed: value, action: action },
    success: function (data) {
      console.log("completed");
      countTodos();
    },
  });
}

function deleteTask(taskId) {
  var action = "deleteTask";
  $.ajax({
    url: "action.php",
    method: "POST",
    data: { id: taskId, action: action },
    success: function (data) {
      console.log("deleted");
      countTodos();
    },
  });
}

function renderTaskHtml(task) {
  return (
    "<li class='task' data-name='" +
    task.name +
    "' data-prio='" +
    (task.priority == "low" ? "1" : task.priority == "medium" ? "2" : "3") +
    "'>" +
    "<div class='form-check " +
    (task.completed ? "done" : "") +
    "'>" +
    "<input type='checkbox' value='" +
    task.id +
    "' " +
    (task.completed ? "checked" : "") +
    "/>" +
    "<label class=''>" +
    task.name +
    "<span class='badge bg-" +
    (task.priority == "low"
      ? "green"
      : task.priority == "medium"
      ? "blue"
      : "red") +
    "'>" +
    task.priority +
    "</span>" +
    "</label>" +
    "<button class='remove-item btn btn-default btn-xs float-end' data-id='" +
    task.id +
    "'><i class='bi bi-x-circle'></i></button>" +
    "</div>" +
    "</li>"
  );
}

function removeItem(element) {
  $(element).parent().parent().remove();
}

function countTodos() {
  var countTotal = $("#sortable li").length;
  var countCompleted = $("#sortable li input:checkbox:checked").length;
  $(".completed-tasks").html(countCompleted);
  $(".total-tasks").html(countTotal);
}

function sortListDir(type, dir) {
  var list,
    i,
    switching,
    b,
    shouldSwitch,
    dir,
    switchcount = 0;
  list = document.getElementById("sortable");
  switching = true;
  // Set the sorting direction to ascending:
  // Make a loop that will continue until no switching has been done:
  while (switching) {
    // Start by saying: no switching is done:
    switching = false;
    b = list.getElementsByTagName("li");
    // Loop through all list-items:
    for (i = 0; i < b.length - 1; i++) {
      // Start by saying there should be no switching:
      shouldSwitch = false;
      /* Check if the next item should switch place with the current item,
      based on the sorting direction (asc or desc): */
      if (dir == "asc") {
        if (
          b[i].getAttribute(type).toLowerCase() >
          b[i + 1].getAttribute(type).toLowerCase()
        ) {
          /* If next item is alphabetically lower than current item,
          mark as a switch and break the loop: */
          shouldSwitch = true;
          break;
        }
      } else if (dir == "desc") {
        if (
          b[i].getAttribute(type).toLowerCase() <
          b[i + 1].getAttribute(type).toLowerCase()
        ) {
          /* If next item is alphabetically higher than current item,
          mark as a switch and break the loop: */
          shouldSwitch = true;
          break;
        }
      }
    }
    if (shouldSwitch) {
      /* If a switch has been marked, make the switch
      and mark that a switch has been done: */
      b[i].parentNode.insertBefore(b[i + 1], b[i]);
      switching = true;
      // Each time a switch is done, increase switchcount by 1:
      switchcount++;
    } else {
      /* If no switching has been done AND the direction is "asc",
      set the direction to "desc" and run the while loop again. */
      if (switchcount == 0 && dir == "asc") {
        dir = "desc";
        switching = true;
      }
    }
  }
}
