const container = document.querySelector('.container');
const jumbo = document.querySelector('.jumbo');
const thumbs = document.querySelectorAll('.thumb');

container.addEventListener('click', function(e){
    // cek apakah yang di klik adalah thumb
    if (e.target.className == 'thumb') {
        jumbo.src = e.target.src;
        
        // animation
        jumbo.classList.add('fade');
            // setting class fade
        setTimeout(function() {
            jumbo.classList.remove('fade');
        }, 500);

        

        // setiap diklik salah satu thumbnailnya maka akan looping kesemua thumbnailnya 
        thumbs.forEach(function(thumb) {
                    // logika atau cara  pertama
            // if (thumb.classList.contains('active')) {
            //     thumb.classList.remove('active');
            // }

                    // logika atau cara kedua 
            thumb.className = 'thumb';
        });

        // menambahkan class active
        e.target.classList.add('active');
    }
});

