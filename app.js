console.log("App.js working");

//! selectors

const form = document.querySelector("form");
const input = document.querySelector("form input.form-control");

//! Variables
let apiKey = "3357576dce858cc99a7aeba5998d81e1";
let url; // api isteği için kullanılacak
let units = "metric"; // fahrenheit için 'imperial' yazılması
let lang = "en"; // Almanca için 'de' yazılmalı

//! Event listeners
form.addEventListener("submit", (e) => {
  e.preventDefault();
  console.log(input.value);
  const city=input.value
  getWeatherData()

  url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${units}&lang=${lang}&appid=${apiKey}`;
});

//functions
const getWeatherData=async()=>{
try{
const response=await fetch(url);
console.log(response);

}catch(error){}

}