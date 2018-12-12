//-----skapa element-------------
let body = document.querySelector("body");
let h1 = document.querySelector("h1");
let img = document.createElement("img");
let h2 = document.querySelector("h2");
let p = document.createElement("p");
let div = document.createElement("div");
let select = document.createElement("select");
let bRefresh = document.createElement("button");
let back = document.createElement("button");
const baseUrl = window.location.href.split('?')[0]; //-- hämta sidans start url

body.appendChild(img);
body.appendChild(p);
body.appendChild(div);
div.appendChild(select);
body.appendChild(back);
body.appendChild(bRefresh);

back.textContent = "Back";
back.addEventListener('click', goBack);
bRefresh.textContent = "Refresh!";
setPageCont();

//-------------check page--------------
function setPageCont() {
  let subBreed = getSubBreed();
  let breed = getBreed();

  if (subBreed && breed) {
    loadSubBreedPage(breed, subBreed);
  } else if (breed) {
    loadBreedPage(breed);
  } else {
    loadStartPage();
  }
}

//----------------------ladda start sidan---
function loadStartPage(){
  p.textContent = "Breeds";
  bRefresh.addEventListener('click', fetchRandomImg);
  fetchAllDogs();
  fetchRandomImg();
}

//-----------------------ladda breed sidan---
function loadBreedPage(breed){
  h2.textContent = uppCase(breed);
  p.textContent = "Sub Breeds";
  bRefresh.addEventListener('click', fetchBreedsRandomImg);
  fetchBreedsRandomImg();

  fetchBreedImgs(breed);
  fetchSubBreeds(breed);
}

//---------------------ladda sub-breed sidan---
function loadSubBreedPage(breed, subBreed){
  h2.textContent = uppCase(breed) + " - " + uppCase(subBreed);
  select.style.display = "none";
  bRefresh.addEventListener('click', fetchSubBreedsRandomImg);

  fetchSubBreedImgs(breed, subBreed);
  fetchSubBreedsRandomImg();
}

//-----------------------hämta parametrar----------------
//------------------fetch url-parm.---------
function getUrlPar(){
  return new URLSearchParams(window.location.search);
}
//------------------get breed par.----------
function getBreed(){
  const parameters = getUrlPar();
  return parameters.get("breed");
}
//------------------get subBreed par.--------
function getSubBreed(){
  const parameters = getUrlPar();
  return parameters.get("subBreed");
}
//------------------------------------------------------
//---------------request allBreeds-----------
function fetchAllDogs() {
  let req = new XMLHttpRequest();
  req.addEventListener('load', renderDogs);
  req.open('GET', 'https://dog.ceo/api/breeds/list/all')
  req.send();
}

//---------------request subBreed-----------
function fetchSubBreeds(breed) {
  let req = new XMLHttpRequest();
  req.addEventListener('load', renderSub);
  req.open('GET', 'https://dog.ceo/api/breed/' + breed + '/list')
  req.send();
}

//----------------request subBreed-random/aleatorio img------
function fetchSubBreedsRandomImg() {
  let breed = getBreed();
  let subBreed = getSubBreed();
  let req = new XMLHttpRequest();
  req.addEventListener('load', renderRandomImg);
  req.open('GET', 'https://dog.ceo/api/breed/' + breed + '/' + subBreed + '/images/random')
  req.send();
}

//-----------------request Breed-random/aleatorio img-------
function fetchBreedsRandomImg(){
  let breed = getBreed();
  let req = new XMLHttpRequest();
  req.addEventListener('load', renderRandomImg);
  req.open('GET', 'https://dog.ceo/api/breed/' + breed + '/images/random')
  req.send();
}

//----------------request Breed-img-----
function fetchBreedImgs(breed) {
  let req = new XMLHttpRequest();
  req.addEventListener('load', renderImgs);
  req.open('GET', 'https://dog.ceo/api/breed/' + breed + '/images')
  req.send();
}

//----------------request subBreed-img-----
function fetchSubBreedImgs(breed, subBreed) {
  let req = new XMLHttpRequest();
  req.addEventListener('load', renderImgs);
  req.open('GET', 'https://dog.ceo/api/breed/' + breed + '/' + subBreed + '/images')
  req.send();
}

//------------request--all-img---------------
function fetchRandomImg() {
  let req = new XMLHttpRequest();
  req.addEventListener('load', renderRandomImg);
  req.open('GET', 'https://dog.ceo/api/breeds/image/random')
  req.send();
}
//----------------------------rendera----------------------------
//------------rendera img----------
function renderRandomImg() { //----hämta en bild
  const imgUrl = JSON.parse(this.responseText).message;
  img.setAttribute('src', imgUrl);
}

//-----------rendera bredd-img----------------------
function renderImgs() {
  let data = JSON.parse(this.responseText).message; //--nyckel message
  let newDiv = document.createElement("div");
  newDiv.setAttribute("id", "breeds");
  for (let key of data) {
    let newImg = document.createElement("img");
    newImg.setAttribute('src', key);
    newDiv.appendChild(newImg);
  }
  body.appendChild(newDiv);
}

//--------------rendera allbreed--------------------
function renderDogs() { //--sida index
  let data = JSON.parse(this.responseText).message; //--nyckel message
  for (let key in data) {
    let option = document.createElement("option");
    option.textContent = uppCase(key);

    select.appendChild(option);
  }
  select.addEventListener('change', setBreed);
}

//---------------set breed to URL-----------------
function setBreed() { //---select listener
  let breed = select.value;//--hämtar vald hund från listan
  let parameters = new URLSearchParams(window.location.search);
  parameters.set("breed", lowCase(breed)); //--skapar en url-par.
  window.location =  baseUrl + "?" + parameters.toString();//-- gå till sidan
  //window.location.hash = lowCase(breed);
}

//-----------rendera allSubBreeds-------------------
function renderSub() {
  let data = JSON.parse(this.responseText).message; //--nyckel message
  if(data.length <= 0){
    select.style.display = "none";
    p.textContent = "This breed has no sub breed!";
    return;
  }
  for (let key of data) {
    let option = document.createElement("option");
    option.textContent = uppCase(key);

    select.appendChild(option);
  }
  select.addEventListener('change', setSubBreed);
}

//------set subbBreed to url--------------------
function setSubBreed() {
  let subBreed = select.value;
  let parameters = new URLSearchParams(window.location.search);
  parameters.set("subBreed", lowCase(subBreed));
  window.location = baseUrl + "?" + parameters.toString();
}

//------------fun.stor-små bökstav--------------
function uppCase(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function lowCase(str) {
  return str.charAt(0).toLowerCase() + str.slice(1);
}

//---------fun. back-------------------
function goBack() {
    window.history.back();
}
