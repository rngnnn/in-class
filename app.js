console.log("App.js working");

//! selectors

const form = document.querySelector("form");
const input = document.querySelector("form input.form-control");
const cardContainer = document.getElementById("card-container");
const alertMessage = document.getElementById("alert");
const locate = document.getElementById("locate");
const locationDiv = document.getElementById("userLocation");
const langButton = document.querySelector(".language");

//! Variables
let apiKey = "4ed283ae2ece6cf1fe2fe7e75b2ea7a5";
let url; // api isteği için kullanılacak
let units = "metric"; // fahrenheit için 'imperial' yazılması
let lang = "en"; // Almanca için 'de' yazılmalı
let cities = [];
let userLocation = false;

//! Event listeners
form.addEventListener("submit", (e) => {
  e.preventDefault();
  console.log(e.target);
  if (input.value) {
    const city = input.value;
    url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${units}&lang=${lang}&appid=${apiKey}`;
    getWeatherData();
  }
  form.reset(); // formu sıfırlar
});

locate.addEventListener("click", () => {
  //* broswserdan kullanıcının locasyonunu almak için kullanılan method
  navigator.geolocation.getCurrentPosition(({ coords }) => {
    console.log(coords);
    const { latitude, longitude } = coords;
    url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=${units}&lang=${lang}&appid=${apiKey}`;
    userLocation = true;
    getWeatherData();
  });
});

langButton.addEventListener("click", (e) => {
  //   console.log(e.target.textContent);
  if (e.target.textContent === "DE") {
    input.setAttribute("placeholder", "Suche nach einer Stadt");
    lang = "de";
  } else if (e.target.textContent === "EN") {
    input.setAttribute("placeholder", "Search for a city");
    lang = "en";
  }
});

//! Functions
const getWeatherData = async () => {
  try {
    // const response = await fetch(url); //* fetch ile
    // const data = await response.json();

    // const response = await axios(url); //* axios ile
    const { data } = await axios(url); //* axios ile
    console.log(data);
    //? data destructure
    const { main, name, weather, sys } = data;
    // const iconUrl = `https://openweathermap.org/img/wn/${weather[0].icon}@2x.png` //^ openweathermap.org
    const iconUrl = `https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${weather[0].icon}.svg`; //^ alternatif

    // if (cities.indexOf(name) === -1) {
    if (!cities.includes(name)) {
      cities.unshift(name);
      const card = document.createElement("div");
      card.classList.add("col");
      card.setAttribute("id", `${name}`);
      card.innerHTML = ` 
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
      if (userLocation) {
        locationDiv.append(card);
        userLocation = false;
      } else {
        cardContainer.prepend(card);
      }

      //! remove cities
      const deleteButton = document.querySelectorAll(".bi-x-circle");
      console.log(deleteButton);
      deleteButton.forEach((button) => {
        button.onclick = () => {
          console.log(button.closest(".col").id);
          cities.splice(cities.indexOf(button.closest(".col").id), 1); //! diziden eleman silme
          //   cities = cities.filter((city) => city !== button.closest(".col").id);
          button.closest(".col").remove(); //! DOM'dan siler
        };
      });
    } else {
      if (lang == "de") {
        alertMessage.textContent = `Sie kennen das Wetter für die ${name} bereits. Bitte suchen Sie nach einer anderen Stadt 😉`;
      } else {
        alertMessage.textContent = `You already know the weather for ${name}, Please search for another city 😉`;
      }
      alertMessage.classList.replace("d-none", "d-block");
      setTimeout(() => {
        alertMessage.classList.replace("d-block", "d-none");
      }, 3000);
    }
  } catch (error) {
    if (lang == "de") {
      alertMessage.textContent = `Stadt nicht gefunden`;
    } else {
      alertMessage.textContent = `City Not Found!`;
    }

    alertMessage.classList.replace("d-none", "d-block");

    setTimeout(() => {
      alertMessage.classList.replace("d-block", "d-none");
    }, 3000);
  }
};
