const imagesArea = document.querySelector('.images');
const gallery = document.querySelector('.gallery');
const galleryHeader = document.querySelector('.gallery-header');
const searchBtn = document.getElementById('search-btn');
const sliderBtn = document.getElementById('create-slider');
const sliderContainer = document.getElementById('sliders');
// selected image 
let sliders = [];


// If this key doesn't work
// Find the name in the url and go to their website
// to create your own api key
const KEY = '15674931-a9d714b6e9d654524df198e00&q';

// show images 
const showImages = (images) => {
    imagesArea.style.display = 'block';
    gallery.innerHTML = '';
    // show gallery title
    galleryHeader.style.display = 'flex';
    images.forEach(image => {
        let div = document.createElement('div');
        div.className = 'col-lg-3 col-md-4 col-xs-6 img-item mb-2';
        div.innerHTML = ` <img class="img-fluid img-thumbnail" onclick=selectItem(event,"${image.webformatURL}") src="${image.webformatURL}" alt="${image.tags}">`;
        gallery.appendChild(div);
        spinnerLoading(false);
    });
}

const getImages = (query) => {
    spinnerLoading(true);
    fetch(`https://pixabay.com/api/?key=${KEY}=${query}&image_type=photo&pretty=true`)
        .then(response => response.json())
        .then(data => showImages(data.hits)) // 1st bug fixed 
        .catch(err => console.log(err))
}

let slideIndex = 0;
const selectItem = (event, img) => {
    let element = event.target;
    element.classList.toggle('added');

    let item = sliders.indexOf(img);
    if (item === -1) {
        sliders.push(img);
    } else {
        sliders.splice(item, 1); // 5th bug fix: Select 0r Deselect item
    }
}

var timer
const createSlider = () => {
    // check slider image length
    if (sliders.length < 2) {
        alert('Select at least more than one pictures')
        return;
    }
    // create slider previous next area
    sliderContainer.innerHTML = '';
    const prevNext = document.createElement('div');
    prevNext.className = "prev-next d-flex w-100 justify-content-between align-items-center";
    prevNext.innerHTML = ` 
  <span class="prev" onclick="changeItem(-1)"><i class="fas fa-chevron-left"></i></span>
  <span class="next" onclick="changeItem(1)"><i class="fas fa-chevron-right"></i></span>
  `;

    sliderContainer.appendChild(prevNext)
    document.querySelector('.main').style.display = 'block';

    // hide image aria
    imagesArea.style.display = 'none';
    const duration = document.getElementById('duration').value || 1000; // 2nd bug fixed , id spelling was not match with HTML file.
    if (duration < 0) { // 3rd bug fix : negative timer set issue
        alert('Negative value cannot Be acceptable,Please enter positive value...!')
        return;
    }
    sliders.forEach(slide => {
        let item = document.createElement('div')
        item.className = "slider-item";
        item.innerHTML = `<img class="w-100"
    src="${slide}"
    alt="">`;
        sliderContainer.appendChild(item)
    })
    changeSlide(0)
    timer = setInterval(function() {
        slideIndex++;
        changeSlide(slideIndex);
    }, duration);
}

// change slider index 
const changeItem = index => {
    changeSlide(slideIndex += index);
}

// change slide item
const changeSlide = (index) => {

    const items = document.querySelectorAll('.slider-item');
    if (index < 0) {
        slideIndex = items.length - 1
        index = slideIndex;
    };

    if (index >= items.length) {
        index = 0;
        slideIndex = 0;
    }

    items.forEach(item => {
        item.style.display = "none"
    })

    items[index].style.display = "block"
}

searchBtn.addEventListener('click', function() {
    document.querySelector('.main').style.display = 'none';
    clearInterval(timer);
    searchOperation();
    sliders.length = 0;
    search.value = '';
})

sliderBtn.addEventListener('click', function() {
    createSlider()
})

// Press Keyboard Enter button for search quickly:
var input = document.getElementById("search");
input.addEventListener("keyup", function(event) {
    if (event.key === 'Enter') {
        document.getElementById("search-btn").click();
    }
});

// 4th Bug fix
// Press Enter button for create slider:
var input = document.getElementById("duration");
input.addEventListener("keyup", function(event) {
    if (event.key === 'Enter') {
        document.getElementById("create-slider").click();
    }
});

// Bonus Items:
// 1. Spinner 
const spinnerLoading = (visible) => {
    const spinner = document.getElementById('spinner-loading')
    if (visible) {
        spinner.classList.remove('d-none');
    } else {
        spinner.classList.add('d-none');
    }
}

// 2. Auto Empty Search Operation Bug fixing...
const searchOperation = () => {
    const autoSearch = document.getElementById('search').value;
    if (autoSearch.length != 0) {
        getImages(autoSearch);
    }
}