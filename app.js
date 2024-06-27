console.log("App.js working");

//! selectors

const form = document.querySelector("form");
const input = document.querySelector("form input.form-control");
const cardContainer=document.getElementById("card-container")
const alertMessage=document.getElementById("alert")


//! Variables
let apiKey = "3357576dce858cc99a7aeba5998d81e1";
let url; // api isteği için kullanılacak
let units = "metric"; // fahrenheit için 'imperial' yazılması
let lang = "en"; // Almanca için 'de'
let cities=[]

//! Event listeners
form.addEventListener("submit", (e) => {
  e.preventDefault();
  console.log(input.value);
  if (input.value){

    const city=input.value
    url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${units}&lang=${lang}&appid=${apiKey}`;


  getWeatherData()
  
  }
  form.reset();
  
});

//functions
const getWeatherData=async()=>{
try{
const response= await fetch(url);
const data =await response.json()
console.log(response);
//data destructure
const{main,name,weather,sys}=data
const iconUrl=`https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${weather[0].icon}.svg`;




// if(cities.indexOf(name===-1)){

if(!cities.includes(name)){
cities.unshift(name)
const card=document.createElement("div")
card.classList.add("col")
card.setAttribute("id",`${name}`)
card.innerHTML= ` 
<div class="card mb-4 rounded-3 shadow-sm">
        <ul class="list-unstyled mt-2 mb-4">
            <li class="text-end me-2"><i class="bi bi-x-circle"></i></li>
            <h4 class="my-0 fw-normal">${name} <span ><sup><img src="https://flagsapi.com/${
    sys.country
  }/shiny/24.png" class="rounded-circle" alt=${
    sys.country
  }/> </sup></span></h4>
            <h1 class="card-title pricing-card-title"><i class="bi bi-thermometer-half"></i> ${Math.round(
              main.temp
            )}<sup>°C</sup></h1>
            <h6 class="card-title pricing-card-title">Min : ${Math.round(
              main.temp_min
            )}<sup>°C</sup> - Max : ${Math.round(
    main.temp_max
  )}<sup>°C</sup>  </h6>
            <h6 class="card-title pricing-card-title"><img src="./assets/wi-barometer.svg" height="30px"/>${
              main.pressure
            } <img src="./assets/wi-humidity.svg" height="30px"/>${
    main.humidity
  } </h6>
            <li><img src="${iconUrl}"/></li>
            <li>${weather[0].description.toUpperCase()}</li>
        </ul>
</div>
`;


cardContainer.prepend(card)
}else{
alertMessage.textContent=`You already know the weather for ${name},Please searc for another city🫠`;
alertMessage.classList.replace("d-none","d-block");

}


}catch(error){}

}