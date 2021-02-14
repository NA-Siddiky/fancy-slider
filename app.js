const imagesArea = document.querySelector('.images');
const gallery = document.querySelector('.gallery');
const galleryHeader = document.querySelector('.gallery-header');
const searchBtn = document.getElementById('search-btn');
const sliderBtn = document.getElementById('create-slider');
const sliderContainer = document.getElementById('sliders');
// selected image 
let sliders = [];

// using your own api key
const KEY = '20273251-9ac2d89fbb364de6c357707d8';

// show images //
const showImages = (images) => {
  imagesArea.style.display = 'block';
  if (images.length == 0) {
    galleryHeader.style.display = 'none';
    gallery.innerHTML = `<h3 class="head-title text-center">Wrong Input!</h3>`;
  } else {
    gallery.innerHTML = '';
    // show gallery title //
    galleryHeader.style.display = 'flex';
    images.forEach(image => {
      let div = document.createElement('div');
      div.className = 'col-lg-3 col-md-4 col-xs-6 img-item mb-2';
      div.innerHTML = ` <img class="img-fluid img-thumbnail" onclick=selectItem(event,"${image.webformatURL}") src="${image.webformatURL}" alt="${image.tags}">`;
      gallery.appendChild(div)
    })
  }
  toggleSpinner();
}

//call API and get Images //
const getImages = (query) => {
  galleryHeader.style.display = 'none';
  gallery.innerHTML = `<h3 class="head-title text-center">Please Wait</h3>`;
  fetch(`https://pixabay.com/api/?key=${KEY}&q=${query}&image_type=photo&pretty=true`)
    .then(response => response.json())
    .then(data => showImages(data.hits))
    .catch(err => console.log(err))
}

// function for selecting images for slideshow  //
let slideIndex = 0;
const selectItem = (event, img) => {
  let element = event.target;
  element.classList.add('added');
  // console.log("added");

  let item = sliders.indexOf(img);
  if (item === -1) {
    sliders.push(img);
  } else {
    element.classList.remove('added');

    // using filter for selecting images to play the slideshow //
    const image = sliders.filter(images => images != img)
    sliders = image;

    // console.log(image);
    // console.log(sliders);
    // console.log("remove");
    // alert('Hey, Already added !')
  }
}

// function for creating slideshow  //
var timer
const createSlider = () => {
  // check slider image length
  if (sliders.length < 2) {
    alert('Select at least 2 image.')
    return;
  }
  // crate slider previous next area
  sliderContainer.innerHTML = '';
  const prevNext = document.createElement('div');
  prevNext.className = "prev-next d-flex w-100 justify-content-between align-items-center";
  prevNext.innerHTML = ` 
  <span class="prev" onclick="changeItem(-1)"><i class="fas fa-chevron-left"></i></span>
  <span class="next" onclick="changeItem(1)"><i class="fas fa-chevron-right"></i></span>
  `;

  sliderContainer.appendChild(prevNext)
  document.querySelector('.main').style.display = 'block';
  const duration = document.getElementById('duration').value || 1500;
  // console.log(duration)

  if (duration < 0) {
    alert("Duration value can't be a negative number. Please try again.")
  }
  else {
    imagesArea.style.display = 'none';
    sliders.forEach(slide => {
      let item = document.createElement('div')
      item.className = "slider-item";
      item.innerHTML = `<img class="w-100"
      src="${slide}"
      alt="">`;
      sliderContainer.appendChild(item)
    })
    changeSlide(0)
    timer = setInterval(function () {
      slideIndex++;
      changeSlide(slideIndex);
    }, duration);
  }
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

// function for Enter Keypress//
const searchButton = document.getElementById("search-btn");
searchItem = document.getElementById("search")
  .addEventListener("keypress", function (event) {
    if (event.key == 'Enter') {
      searchBtn.click();
    }
  });

// function for search button //
searchBtn.addEventListener('click', function () {
  if (search.value) {
    toggleSpinner();
    document.querySelector('.main').style.display = 'none';
    clearInterval(timer);
    const search = document.getElementById('search');
    getImages(search.value)
    sliders.length = 0;
  }
  else {
    alert("Please type something and try again.");
    galleryHeader.style.display = 'none';
    gallery.innerHTML = `<h3 class="head-title text-center">Invalid Searching. Please type something and try again.</h3>`;
  }
})

sliderBtn.addEventListener('click', function () {
  createSlider();
})

const toggleSpinner = (show) => {
  const spinner = document.getElementById("loading-spinner");
  spinner.classList.toggle('d-none');
}