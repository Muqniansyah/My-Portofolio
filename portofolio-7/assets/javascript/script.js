const book = [];

// event render
const RENDER_EVENT = 'render book';
//event save
const SAVED_EVENT = 'saved-book';
//key storage
const STORAGE_KEY = 'BOOKSHELF_APPS';

//munculkan dibrowser
document.addEventListener('DOMContentLoaded', function() {
    const submitForm = document.getElementById('inputBook');
    submitForm.addEventListener('submit', function(event){
        event.preventDefault();
        addBook();
    });

    const searchBook = document.getElementById('searchBook');
    searchBook.addEventListener('submit', function(event){
        event.preventDefault();
        searchBooks();
        // cariDataFromTodos();
        console.log('ok');        
    }); 

    if (isStorageExist()) {
        loadDataFromStorage();
    }

    const inputMaxLengthOnLoad = document.getElementById('inputBookTitle').maxLength;
    document.getElementById('sisaKarakter').innerText = inputMaxLengthOnLoad;

   // event on input
    document.getElementById('inputBookTitle').addEventListener('input', function() {
        const jumlahKarakterDiketik = document.getElementById('inputBookTitle').value.length;
        const jumlahKarakterMaksimal = document.getElementById('inputBookTitle').maxLength;

        console.log('jumlahKarakterDiketik : ', jumlahKarakterDiketik);
        console.log('jumlahKarakterMaksimal: ', jumlahKarakterMaksimal);
        const sisaKarakterUpdatae = jumlahKarakterMaksimal - jumlahKarakterDiketik;
        document.getElementById('sisaKarakter').innerText = sisaKarakterUpdatae.toString();

        if (sisaKarakterUpdatae === 0 ) {
            document.getElementById('sisaKaratkter').innerText = 'Batas maksimal tercapai!';
        }
        else if (sisaKarakterUpdatae <= 5 ) {
            document.getElementById('notifikasiSisaKarakter').style.color = 'red' ;
        }
        else {
            document.getElementById('notifikasiSisaKarakter').style.color = 'black';
        }
    });
    
    //event on focus
    document.getElementById('inputBookTitle').addEventListener('focus', function () {
        console.log('inputBookTitle: focus');
          //visible untuk memunculkan notif sisa karakter
        document.getElementById('notifikasiSisaKarakter').style.visibility = 'visible';
    });

    //event on blur
    document.getElementById('inputBookTitle').addEventListener('blur', function() {
        console.log('inputBookTitle: blur');
        document.getElementById('notifikasiSisaKarakter').style.visibility = 'hidden';
  });
    
});

//buat book
function addBook() {
    const inputBookTitle = document.getElementById('inputBookTitle').value;
    const inputBookAuthor = document.getElementById('inputBookAuthor').value;
    const inputBookYear = document.getElementById('inputBookYear').value;
    const inputBookIsComplete = document.getElementById('inputBookIsComplete').checked;

    const generatedID = generateId();
    const bookObject = generateBookObject(generatedID, inputBookTitle, inputBookAuthor, inputBookYear, inputBookIsComplete);
    book.push(bookObject);

    if (inputBookIsComplete == false) {
        incompleteBookshelfList.append(book);
    }
    else {
        completeBookshelfList.append(book);
    }
    document.dispatchEvent(new Event(RENDER_EVENT));

    alert('Perubahan berhasil dimuat');
    saveData();
}

//fungsi generateId()
function generateId() {
    return +new Date();
}

//fungsi generateBookObject()
function generateBookObject(id, title, author, year, isCompleted) {
    return {
        id,
        title,
        author,
        year,
        isCompleted
    }
}

//event render
document.addEventListener(RENDER_EVENT, function(){
    const incompleteBookshelfList =  document.getElementById('incompleteBookshelfList');
    incompleteBookshelfList.innerHTML = '';

    const completeBookshelfList = document.getElementById('completeBookshelfList');
    completeBookshelfList.innerHTML = '';

    for (const bookItem of book) {
        const bookElement = makeBook(bookItem);
        if (!bookItem.isCompleted) {
            incompleteBookshelfList.append(bookElement);
        }
        else {
            completeBookshelfList.append(bookElement); 
        }        
    }
});

//buat dinamis book
function makeBook(bookObject) {
    const textJudul = document.createElement('h3');
    textJudul.innerText = bookObject.title;

    const textPenulis = document.createElement('p');
    textPenulis.innerText = bookObject.author;

    const textTahun = document.createElement('p');
    textTahun.innerText = bookObject.year;

    const undoObject = document.createElement('button');
    const trashObject = document.createElement('button');
    const checkObject = document.createElement('button');
    const trashObject2 = document.createElement('button');

    const textContainer = document.createElement('article');
    textContainer.classList.add('book_item');
    textContainer.append(textJudul, textPenulis, textTahun, undoObject, trashObject, checkObject, trashObject2);

    const container = document.createElement('div');
    container.classList.add('book_list');
    container.append(textContainer);
    container.setAttribute('id', 'todo-$(bookObject.id');

    if (bookObject.isCompleted) {
        undoObject.classList.add('undo-button');
        undoObject.addEventListener('click', function() {
            undoTaskFromCompleted(bookObject.id);
        });

        trashObject.classList.add('trash-button');
        trashObject.addEventListener('click', function() {
            removeTaskFromCompleted(bookObject.id);
        });
    }
    else {
        checkObject.classList.add('check-button');
        checkObject.addEventListener('click', function() {
            addTaskToCompleted(bookObject.id);
        });

        trashObject2.classList.add('trash-button2');
        trashObject2.addEventListener('click', function() {
            removeTaskFromCompleted(bookObject.id);
        });
    }

    return container;
}

//fungsi check dari addTaskToCompleted
function addTaskToCompleted(bookId) {
    const bookTarget = findBook(bookId);

    if (bookTarget == null) return;

    bookTarget.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));

    alert('Perubahan berhasil dimuat');
    saveData();
}

//fungsi undo dari undoTaskFromCompleted
function undoTaskFromCompleted(bookId) {
    const bookTarget = findBook(bookId);

    if(bookTarget == null) return;

    bookTarget.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT));

    alert('Perubahan berhasil dimuat');
    saveData();
}

//fungsi trash dari removeTaskFromCompleted
function removeTaskFromCompleted(bookId) {
    const bookTarget = findBookIndex(bookId);

    if (window.confirm('Apakah anda yakin ingin menghapus buku?')) {
        window.alert('Perintah baru saja diijalankan!')
        if (bookTarget === -1) return;
        book.splice(bookTarget, 1);
    }
    else {
        window.alert('Perintah dibatalkan!')
    }

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

//find Book
function findBook(bookId) {
    for (const bookItem of book) {
        if (bookItem.id === bookId) {
            return bookItem;
        }
    }

    return null;
}

//findBookIndex
function findBookIndex(bookId) {
    for(const index in book) {
        if (book[index].id === bookId) {
            return index;
        }
    }

    return -1;
}

//savedata
function saveData() {
    if (isStorageExist()) {
      const parsed = JSON.stringify(book);
      localStorage.setItem(STORAGE_KEY, parsed);
      document.dispatchEvent(new Event(SAVED_EVENT));
    }
  }

//pengecekan storage
function isStorageExist() {
  if (typeof (Storage) === undefined) {
    alert('Browser kamu tidak mendukung local storage');
    return false;
  }
  return true;
}

//event save
document.addEventListener(SAVED_EVENT, function() {
    console.log(localStorage.getItem(STORAGE_KEY));

});

//fungsi load data dari storage
function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);
   
    if (data !== null) {
      for (const books of data) {
        book.push(books);
      }
    }
   
    document.dispatchEvent(new Event(RENDER_EVENT));
}

  //fungsi searchbook
function searchBooks() {
    const searchBook = document.getElementById('searchBookTitle').value.toLowerCase();    
    const bookList = document.querySelectorAll('.book_item > h3');
        for (buku of bookList) {
            if (buku.innerText.toLowerCase().includes(searchBook)) {
                buku.parentElement.style.display = "block";
            } 
            else {
                 buku.parentElement.style.display = "none";
            }
        }
        if (searchBook.length === 0) {
            alert('Buku tidak ditemukan!');
            return location.reload();
        }  
}