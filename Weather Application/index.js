

// const API_KEY = "0dd8a0a08341bf2fea9683c4411a519b";



// // For UI update
// function renderWeatherInfo(data){
//   let newPara = document.createElement('p');
//   newPara.textContent = `${data?.main?.temp.toFixed(2)} °C`
//   document.body.appendChild(newPara);
    
// }

// async function showWeather() {

//   try{
//     let city = "Goa";

//     // API call to OpenWeatherMap
//     let response = await fetch(
//       `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
//     );

//     let data = await response.json();
//     console.log("Weather Data:", data);
//     renderWeatherInfo(data);
//   }

//   catch(err){
//     console.log("error" , err)
//   }
    

//   }



//   // get your current location 

//   function getLocation()
//   {
//     if(navigator.getLocation)
//   {
//     navigator.geolocation.getCurrentPosition(showPosition);
//   }
//   else{
//     console.log("No geoLocation Support")
//   }
// }

//   function showPosition(position)
//   {
//     let lat = position.coords.latitude;
//     let longi = position.coords.longitude;

//     console.log(lat);
//     console.log(longi)
//   }



  // ************************************************************

  const userTab = document.querySelector("[data-useWeather]");
  const searchTab = document.querySelector("[data-searchWeather]");
  const userContainer = document.querySelector(".grant-location-container");
  const searchForm = document.querySelector("[data-searchForm]");
  const loadingScreen = document.querySelector(".loading-screen");
  const userInfoContainer = document.querySelector(".user-info-container");
  const grantAccessContainer = document.querySelector(".grant-location-container");

// initialization 
  let currentTab = userTab;
  const API_KEY = "0dd8a0a08341bf2fea9683c4411a519b";
  currentTab.classList.add("current-tab");
  getfromSeessionStorage();
  


  // Swictch tab actvity 

  function switchTab(clickedTab) {
   if(clickedTab!=currentTab)
   {
    currentTab.classList.remove("current-tab");
    currentTab = clickedTab;
    currentTab.classList.add("current-tab")

    if(!searchForm.classList.contains("active")){
      //kya search form vala container invisible hai , if yes then make it visible
      userInfoContainer.classList.remove("active");
      grantAccessContainer.classList.remove("active");
      searchForm.classList.add("active");
    }
    else{
      //mai pahale search vale tab pr tha , ab your weather tab visibale karna hai
      searchForm.classList.remove("active");
      userInfoContainer.classList.add("active");
      //ab mai your weather tab pr agaya hu , toh weather bhi display karna padega, so let check storage first 
      // for coordinates , if we have saved them there 
      getfromSeessionStorage();
    }
   }
   
  } 

  userTab.addEventListener("click", () => {
    //pass clicked tab as input parameter
    switchTab(userTab);
  });

  searchTab.addEventListener("click",() =>{
    //pass clicked tab as input parameter 
    switchTab(searchTab);
  }
)

//check if cordinates are alredy present in session storage
function getfromSeessionStorage()
{
  const localCoordinates = sessionStorage.getItem("user-coordinates");
  if(!localCoordinates){
    //if not present then ask for permission
    grantAccessContainer.classList.add("active");
  }
  else{
    const coordinates = JSON.parse(localCoordinates);
    // function which call to api and giving the wheather info base on coordinates
    fetchUserWeatherInfo(coordinates); 
  }
     
}

async function fetchUserWeatherInfo(coordinates){
  const {lat , lon} = coordinates;
  // make grant location container invisible
  grantAccessContainer.classList.remove("active");
  //make loading screen visible
  loadingScreen.classList.add("active");

//API CALL

try {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
  )
  const data = await response.json();
  userInfoContainer.classList.add("active");
  renderWeatherInfo(data);

  loadingScreen.classList.remove("active");

}
catch(err){
  console.log("Error", err);
  loadingScreen.classList.remove("active");

}

}

function renderWeatherInfo(weatherInfo){
//firstly , we have to fetch the elements 
const cityName = document.querySelector("[data-cityName]");
const countryIcon = document.querySelector("[data-countryIcon]");

const desc = document.querySelector("[data-weatherDesc]");
const weatherIcon = document.querySelector("[data-weatherIcon]");
const temp = document.querySelector("[data-temp]");
const windspeed = document.querySelector("[data-windSpeed]");
const humidity = document.querySelector("[data-humidity]");
 const cloudiness = document.querySelector("[data-cloudiness]");

 //fetch values from weatherInfo object and it UI elements (we can collect all information from the json file ) 
// input the value of cityName from data
//cityName madhe apan value takat ahe 
cityName.innerText = weatherInfo.name;
// att contry icon madhe apan input denar ahe tr tychya source var ja lagel 
countryIcon.src = `https://flagcdn.com/w320/${weatherInfo.sys.country.toLowerCase()}.png`;
//desc madhe apan input denar ahe weatherInfo object madhle weather[0].description jaun 
desc.innerText = weatherInfo?.weather?.[0]?.description;
weatherIcon.src = `https://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
temp.innerText = `${weatherInfo?.main?.temp}°C`;
windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
humidity.innerText = `${weatherInfo?.main?.humidity}%`; 
cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;

}

// get the location

function geoLocation(){
  if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(showPosition);
  }
  else{
    // Hw show an alert for no geolocation support
    console.log("No geoLocation Support");

  }
 

}

function showPosition(position){
  const userCoordinates = {
    lat: position.coords.latitude,
    lon: position.coords.longitude
  }
  //save coordinates in session storage
  sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
  //fetch the weather info based on coordinates
  fetchUserWeatherInfo(userCoordinates);
  //make loading screen visible
  loadingScreen.classList.add("active");
  //make grant location container invisible
  grantAccessContainer.classList.remove("active");
  
}


//get user location by grant access button
const grantAccessButton = document.querySelector("[data-grantAccessButton]");

grantAccessButton.addEventListener("click", geoLocation);


const searchInput = document.querySelector("[data-searchInput]");



searchForm.addEventListener("submit", (e)=>{ 

e.preventDefault();
let cityName = searchInput.value;

if(cityName==="")
  return;
else
  fetchSearchWeatherInfo(cityName);

});


async function fetchSearchWeatherInfo(city){
  loadingScreen.classList.add("active");
  userInfoContainer.classList.remove("active");
  grantAccessContainer.classList.remove("active");


  try{

    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );



    const data = await response.json();

    userInfoContainer.classList.add("active");
    renderWeatherInfo(data);

    console.log("Deactivating loading screen...");
    loadingScreen.classList.remove("active"); 

   
  }
  catch(err){
    console.log("Error", err);

    loadingScreen.classList.remove("active");
  }
}


