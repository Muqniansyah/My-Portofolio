const todos = [];
/*
Variabel RENDER_EVENT bertujuan untuk mendefinisikan
Custom Event dengan nama 'render-todo'. 
*/
const RENDER_EVENT = 'render-todo';


/*
event DOMContentLoaded dibangkitkan alias ketika semua elemen HTML sudah dimuat menjadi DOM dengan baik.
*/
document.addEventListener('DOMContentLoaded', function () {
    const submitForm = document.getElementById('form');
    submitForm.addEventListener('submit', function (event) {
      event.preventDefault();
      addTodo();
    });

    if (isStorageExist()) {
      loadDataFromStorage();
    }
  });

//fungsi addTodo() untuk membuat Todo
function addTodo() {
    const textTodo = document.getElementById('title').value;
    const timestamp = document.getElementById('date').value;
   
    const generatedID = generateId();
    const todoObject = generateTodoObject(generatedID, textTodo, timestamp, false);
    todos.push(todoObject);
   
    document.dispatchEvent(new Event(RENDER_EVENT));

    saveData();
}

//fungsi generateId() untuk menghasilkan identitas unik pada setiap item todo
function generateId() {
    return +new Date();
}

/*
fungsi generateTodoObject()
untuk membuat object baru dari data yang sudah disediakan 
dari inputan (parameter function), 
diantaranya id, nama todo (task), waktu (timestamp), 
dan isCompleted (penanda todo apakah sudah selesai 
atau belum).
*/
function generateTodoObject(id, task, timestamp, isCompleted) {
    return {
        id,
        task,
        timestamp,
        isCompleted
    }
}

//untuk memunculkan array todos
document.addEventListener(RENDER_EVENT, function() {
    const uncompletedTODOList = document.getElementById('todos');
    uncompletedTODOList.innerHTML = '';

    const completedTODOList = document.getElementById('completed-todos');
    completedTODOList.innerHTML = '';
   
    for (const todoItem of todos) {
      const todoElement = makeTodo(todoItem);
      //untuk mem-filter hanya todo “Yang harus dibaca” saja lah yang perlu ditampilkan.
      if (!todoItem.isCompleted) {
        uncompletedTODOList.append(todoElement);
      }
      /*
      apabila ada todo yang sudah ditandai selesai, 
      maka akan masuk ke cabang else statement yang mana 
      nantinya akan menampilkan todoElement pada halaman web.
      */
      else {
        completedTODOList.append(todoElement);
      }
    }
});


/*
fungsi yang menghasilkan sebuah item untuk mengisi container tersebut,
container yang dimaksud yaitu container bagian todo yang harus
dilakukan.
*/
function makeTodo(todoObject) {
    const textTitle = document.createElement('h2');
    textTitle.innerText = todoObject.task;
   
    const textTimestamp = document.createElement('p');
    textTimestamp.innerText = todoObject.timestamp;
   
    const textContainer = document.createElement('div');
    textContainer.classList.add('inner');
    textContainer.append(textTitle, textTimestamp);
   
    const container = document.createElement('div');
    container.classList.add('item', 'shadow');
    container.append(textContainer);
    container.setAttribute('id', `todo-${todoObject.id}`);


    if (todoObject.isCompleted) {
        const undoButton = document.createElement('button');
        undoButton.classList.add('undo-button');
     
        undoButton.addEventListener('click', function () {
          undoTaskFromCompleted(todoObject.id);
        });
     
        const trashButton = document.createElement('button');
        trashButton.classList.add('trash-button');
     
        trashButton.addEventListener('click', function () {
          removeTaskFromCompleted(todoObject.id);
        });
     
        container.append(undoButton, trashButton);
      } 
      else {
        const checkButton = document.createElement('button');
        checkButton.classList.add('check-button');
        
        checkButton.addEventListener('click', function () {
          addTaskToCompleted(todoObject.id);
        });
        
        container.append(checkButton);
      }
     
      return container;
}


//fungsi check, uncheck dan menghapus todo
        /*
        fungsi addTaskToCompleted() digunakan untuk memindahkan 
        todo dari rak “Yang harus dilakukan”
        ke “Yang sudah dilakukan”
        */
    function addTaskToCompleted (todoId) {
      const todoTarget = findTodo(todoId);
     
      if (todoTarget == null) return;
     
      todoTarget.isCompleted = true;
      document.dispatchEvent(new Event(RENDER_EVENT));

      saveData();
    }   

        /*
        fungsi removeTaskFromCompleted() digunakan untuk 
        mengahpus todo berdasarkan index yang didapatkan dari
        pencarian Todo dengan menggunakan findTodoIndex().
        */
    function removeTaskFromCompleted(todoId) {
        const todoTarget = findTodoIndex(todoId);
       
        if (todoTarget === -1) return;
       
        todos.splice(todoTarget, 1);
        document.dispatchEvent(new Event(RENDER_EVENT));

        saveData();
    }
       
       /*
        fungsi undoTaskFromCompleted() digunakan
        agar todo task yang sebelumnya completed (selesai), 
        bisa dipindah menjadi incomplete (belum selesai).
        */
    function undoTaskFromCompleted(todoId) {
        const todoTarget = findTodo(todoId);
       
        if (todoTarget == null) return;
       
        todoTarget.isCompleted = false;
        document.dispatchEvent(new Event(RENDER_EVENT));

        saveData();
    }



    
//fungsi findTodo() untuk mencari todo dengan ID yang sesuai pada array todos.
function findTodo(todoId) {
    for (const todoItem of todos) {
      if (todoItem.id === todoId) {
        return todoItem;
      }
    }
    return null;
}

//fungsi findTodoIndex()
function findTodoIndex(todoId) {
    for (const index in todos) {
      if (todos[index].id === todoId) {
        return index;
      }
    }
   
    return -1;
}

/*
fungsi saveData() digunakan
ketika data pada array todos ada perubahan, 
maka diharapkan perubahan tersebut dapat tersimpan 
pada storage secara langsung,
*/
function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(todos);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

/*
Untuk mempermudah debugging atau tracking ketika terjadi perubahan data, 
kita akan memanggil sebuah custom event baru yang bernama "saved-todo" dalam variabel SAVED_EVENT.
*/
const SAVED_EVENT = 'saved-todo';

/*
Menyimpan data ke storage sesuai dengan key yang kita tentukan. 
Dalam hal ini key yang kita gunakan adalah "TODO_APPS" dalam variabel STORAGE_KEY.
*/
const STORAGE_KEY = 'TODO_APPS';

/*
fungsi isStorageExist()untuk
memastikan bahwa browser yang dipakai memang mendukung localStorage, 
*/
function isStorageExist() /* boolean */ {
  if (typeof (Storage) === undefined) {
    alert('Browser kamu tidak mendukung local storage');
    return false;
  }
  return true;
}

/*
event listener dari SAVED_EVENT
untuk dapat memudahkan dalam mengetahui bahwa pada 
setiap perubahan data bisa secara sukses memperbarui data pada storage,
menggunakan console log dalam menampilkan secara sederhana
*/
document.addEventListener(SAVED_EVENT, function () {
  console.log(localStorage.getItem(STORAGE_KEY));

  //untuk menampilkan dialog atau toast (pesan mengambang) untuk ditampilkan pada website
  alert('Perubahan berhasil dimuat');
  
});


/*
fungsi loadDataFromStorage() untuk
menampilkan data dari localStorage ketika halaman pertama kali dimuat.
*/
function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);
 
  if (data !== null) {
    for (const todo of data) {
      todos.push(todo);
    }
  }
 
  document.dispatchEvent(new Event(RENDER_EVENT));
}
