const axios = require("axios");
async function getWeather(city) {
  let response = await axios({
    url: `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=0a0943be70923340ff6b4903aa8ab8cd`,
    method: "get",
  })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      console.log(err.message);
    });
  console.log(response);
}
getWeather("ha noi");
module.exports =  getWeather