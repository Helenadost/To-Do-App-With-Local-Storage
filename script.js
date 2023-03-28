'use strict';

document.addEventListener('DOMContentLoaded', () => {
    //Initial References
    const newTask = document.getElementById('newTask');
    const addButton = document.getElementById('addTask');
    const tasksList = document.getElementById('tasksList');
    let tasksArr = [];

    loadData();

    // if the new task value is empty, display alert, else create a task object and push it to the tasksArr array
    addButton.onclick = function () {
        if (newTask.value.trim() == '') {
            alert("Please Enter a Task");
        } else {
            const task = {
                text: newTask.value.trim(),
                state: false
            };
            tasksArr.push(task);
            // execute renderTodo function
            renderTodo();
        }
    };

    function renderTodo() {
        // before adding new task empty tasksList 
        tasksList.innerHTML = '';
        // loop through an array of tasks
        for (let i = 0; i < tasksArr.length; i++) {
            const value = tasksArr[i];
            // create a div element with class="task" and innerText to the task object text value
            const taskDiv = document.createElement("div");
            taskDiv.classList.add("task");
            taskDiv.innerText = value.text;

            // create a checkBox button element
            const checkBox = document.createElement("button");
            // if task object state is false set and add classes below
            if (value.state) {
                checkBox.className = "btnGroup done";
                taskDiv.classList.add("crossOut");
            } else {
                // else set undone class instead of done class
                checkBox.className = "btnGroup undone";
            }
            // append a button element to a taskDiv
            taskDiv.appendChild(checkBox);

            // create a delete button element
            const deleteBtn = document.createElement("button");
            // add classes
            deleteBtn.classList.add("delete");
            deleteBtn.classList.add("btnGroup");
            // append a delete button element to a taskDiv
            taskDiv.appendChild(deleteBtn);

            // append a taskDiv to a tasksList and empty newTask value
            tasksList.appendChild(taskDiv);
            newTask.value = '';

            // execute all functions clicking on delete button
            deleteBtn.onclick = function () {
                deleteTask(i);
                renderTodo();
                saveData();
            }

            checkBox.onclick = function () {
                // get parentElement which is taskDiv
                const parentElement = this.parentElement;
                // toggle class crossOut
                parentElement.classList.toggle("crossOut");

                // assign the current checkBox element to the check variable
                const check = this;
                // check if the "check" has the "undone" class
                if (check.classList.contains("undone")) {
                    // update the class and the state of the task in the tasksArr array
                    check.className = "btnGroup done";
                    tasksArr[i].state = true;
                } else {
                    //update the class and the state of the task in the tasksArr array
                    check.className = "btnGroup undone";
                    tasksArr[i].state = false;
                }
                saveData();
            }
        }
        saveData();
    };

    function deleteTask(index) {
        // remove the task at the specified index from the tasksArr array
        tasksArr.splice(index, 1);
        // call the updateIndexes function
        updateIndexes();
    }

    function updateIndexes() {
        // loop over each task in the tasksArr array
        for (let i = 0; i < tasksArr.length; i++) {
            // update the index property of each task in the tasksArr array to match its new position after a task has been deleted
            tasksArr[i].index = i;
        }
    }

    function saveData() {
        // if taskArr is empty, remove the "dataText" item from local storage
        if (tasksArr.length === 0) {
            localStorage.removeItem("dataText");
            return;
        }

        // empty string 
        let dataText = "";
        // loop over each task in the tasksArr array
        tasksArr.forEach((value, index) => {
            // concatenate the text and state properties of each task in the tasksArr array with the "&&" separator and adds them to the dataText string
            dataText += value.text + "&&" + value.state;
            // adds the "||" separator to the dataText string if the current task is not the last task in the tasksArr array
            if (index != (tasksArr.length - 1)) {
                dataText += "||";
            }
        });

        // set the "dataText" item in local storage to the dataText string
        localStorage.setItem("dataText", dataText);
    };

    function loadData() {
        // retrieves the "dataText" item from local storage and assigns it to the dataText constant
        const dataText = localStorage.getItem("dataText");
        // checks if the dataText constant is not null
        if (dataText != null) {
            // splits the dataText string into an array of task strings using the "||" separator and assigns it to the tasksData constant
            const tasksData = dataText.split("||");
            // loop over each task in the tasksData array
            tasksData.forEach((value) => {
                // splits each task string into an array of task properties using the "&&" separator and assigns it to the taskSplit constant
                const taskSplit = value.split("&&");
                // checks if the state property of the current task is false or true, create a new object and push it to the tasksArr array 
                if (taskSplit[1] == "false") {
                    const task = {
                        text: taskSplit[0],
                        state: false
                    };
                    tasksArr.push(task);
                } else {
                    const task = {
                        text: taskSplit[0],
                        state: true
                    };
                    tasksArr.push(task);
                }
            });
        }

        // call the renderTodo function to render the tasks from the tasksArr array in the UI
        renderTodo();
    };
});


