//ngambil menu toggle
const menuToggle = document.querySelector('.menu-toggle input');
//ngambil nav
const nav = document.querySelector('nav ul');
// artinya yg dibawah ini yaitu ketika menu toggle ini diklik maka jalankan fungsi ini,
//ambil nav, lalu ambil classlist lalu ditoggle.
//toogle itu jika tdk ada kelasnya,tambahin. tapi jika ada kelasnya,hilangin.(mirip saklar on/off). class yang mau ditambahin yaitu class slide.
menuToggle.addEventListener('click', function() {
nav.classList.toggle('slide');
});