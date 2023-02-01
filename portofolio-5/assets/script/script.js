const nameUsernya = prompt("Siapa nama kamu?");
const kabarUsernya = prompt("Apakah kabar kamu baik?");

const user = {
    nama: nameUsernya,
	kabar: kabarUsernya
};

if (user.kabar === "Baik"){
	alert("Senang bertemu kamu, " + user.nama + "" + "!");
}
else if (user.kabar === "Buruk"){
	alert("Haii " + user.nama + "" + ", semoga lekas sembuh ya" + "!");
}
else {
	alert("Semoga sehat selalu, " + user.nama + "" + "!");
}

// slider otomatis untuk kontendua
let start = 0;
otomatis();

function otomatis(){
	const sliders = document.querySelectorAll(".slider");

	for (let i = 0; i < sliders.length; i++) {
		sliders[i].style.display = "none";
	}

	if (start >= sliders.length) {
		start = 0;
	}

	sliders[start].style.display = "block";
	console.log("gambar ke" + start);
	start++;

	setTimeout(otomatis, 2000);
}


// munculkan elemen saat scroll tertentu untuk kontenempat
	// tangkap event scroll
window.addEventListener("scroll", muncul);

	//fungsi untuk memberikan efek elemen muncul ketika scroll
function muncul() {
	//menangkap setiap tag dengan class elemen
	let elements = document.querySelectorAll(".elemen");
	//perulangan untuk setiap tag dengan class elemen 
	for ( let i = 0; i < elements.length; i++) {
		//mengambil ukuran tinggi layar
		let tinggiLayar = window.innerHeight;
		//menagkap ukuran elemen dan posisinya relatif terhadap viewport
		let jarakAtasElemen = elements[i].getBoundingClientRect().top;
		//menentukkan ukuran scroll untuk memunculkan elemen
		let ukuranScroll = 350;
		/*jika jarak atas elemen kurang dari tinggi layar dikurangi
		ukuran scroll maka tambahkan class muncul disetiap tag dengan class elemen*/
		if (jarakAtasElemen < tinggiLayar - ukuranScroll) {
			elements[i].classList.add("muncul");
		}
		//jika tidak maka hapus class muncul
		else {
			elements[i].classList.remove("muncul");
		}
	}
}

