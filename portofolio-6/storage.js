const CACHE_KEY = "calculation_history";

//fungsi untuk mengembalikan nilai boolean dari pengecekan fitur storage pada browser
function checkForStorage() {
    return typeof(Storage) !== "undefined"
}

//fungsi menyimpan data riwayat kalkulasi pada local storage
function putHistory(data) {
    if (checkForStorage()) {
        let historyData = null;
        if(localStorage.getItem(CACHE_KEY) === null) {
            historyData = [];
        }
        else {
            historyData = JSON.parse(localStorage.getItem(CACHE_KEY));
        }

        historyData.unshift(data);

        if (historyData.length > 5) {
            historyData.pop();
        }

        localStorage.setItem(CACHE_KEY, JSON.stringify(historyData));
    }
}

//fungsi untuk mendapatkan data dari local storage
function showHistory() {
    if (checkForStorage()) {
       return JSON.parse(localStorage.getItem(CACHE_KEY)) || []; 
    }
    else {
        return [];
    }
}

//fungsi untuk merender data riwayat kalkulasi pada tabel html
function renderHistory() {
    const historyData = showHistory();
    let historyList = document.querySelector("#historyList");


    //selalu hapus konten HTML pada elemen historyList agar tidak menampilkan data ganda
    historyList.innerHTML = "";
    
    for (let history of historyData) {
        let row = document.createElement('tr');
        row.innerHTML = "<td>" + history.firstNumber + "</td>";
        row.innerHTML += "<td>" + history.operator + "</td>";
        row.innerHTML += "<td>" + history.secondNumber + "</td>";
        row.innerHTML += "<td>" + history.result + "</td>";


        historyList.appendChild(row);
    }
}

//panggil renderHistory agar data history muncul ketika website pertama kali dijalankan
renderHistory();

