const form = document.querySelector(".top-banner form");
const input = document.querySelector(".top-banner input");
const msg = document.querySelector(".top-banner .msg");
const list = document.querySelector(".ajax-section .cities");

//API key for openweathermap API
//if its doesn't work properly replace it with your own API key
api_key = 'a7e172c334cd2d2b6f7af68d2470f87f'




//eventlistener for form
form.addEventListener('submit', (e) => {
        e.preventDefault()
        let city = input.value

        //To check city is already exist or not
        const listofCities = document.querySelectorAll('.city')
        const arrayCities = Array.from(listofCities)
        if (arrayCities.length > 0) {
            const filteredArray = arrayCities.filter(el => {
                let content = ''
                if (city.includes(',')) {
                    if (city.split(',')[1].length > 2) {
                        city = city.split(',')[0]
                        content = el.querySelector('.city-name span').textContent.toLowerCase()
                    } else {
                        content = el.querySelector('.city-name').dataset.name.toLowerCase()
                    }
                } else {
                    content = el.querySelector('.city-name span').textContent.toLowerCase()
                }
                return content == city.toLowerCase()
            })

            //if the city is already exists its print error message
            //And avoid printing twice in list
            if (filteredArray.length > 0) {
                msg.textContent = `You already know the weather for ${
            filteredArray[0].querySelector(".city-name span").textContent
          } ...otherwise be more specific by providing the country code as well 😉`;
                form.reset();
                input.focus();
                return;
            }
        }


        //using AJAX to avoid reload
        let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${api_key}&units=metric`;
        fetch(url)
            .then(response => {
                return response.json()
            })
            .then(data => {
                const { main, name, sys, weather } = data;
                const icon = `https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${weather[0]["icon"]}.svg`

                let li = document.createElement('li');
                li.classList.add('city')

                //HTML code to insert on div cities
                markup = `<h2 class='city-name' data-name=${name},${sys.country}>
                <span>${name}</span>
                <sup>${sys.country}</sup>
                </h2><div class="city-temp">${Math.round(main.temp)}<sup>°C</sup></div>
                <figure>
                  <img class="city-icon" src="${icon}" alt="${weather[0]["description"]}">
                  <figcaption>${weather[0]["description"]}</figcaption>
                </figure>`;


                li.innerHTML = markup;
                list.appendChild(li);
            })
            //if the city is not exist or misspelled catch print the error message
            .catch(err => {
                msg.textContent = "Please search for a valid city 😩";
            });
        msg.textContent = "";
        form.reset();
        input.focus();

    })
    //created by hari
