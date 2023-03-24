import Express from "express";
import https from "https";
import bodyparser from "body-parser";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";

const app = Express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(bodyparser.urlencoded({extended:true}));

app.get("/", function(req, res){
    res.sendFile(path.join(__dirname + "/index.html"));
});


app.post("/", function(req, res){
    let cityName = req.body.city;

    let q = cityName;
    let appid = "692ba63c858d533381ad975befd7703e";
    let units = "metric";
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${q}&appid=${appid}&units=${units}`
    
    https.get(url, function(response){
        console.log(response.statusCode);

        response.on("data", function(data){
            const weatherData = JSON.parse(data);
            let temperature = weatherData.main.temp;
            let descrip = weatherData.weather[0].description;
            let icon = weatherData.weather[0].icon;
            let imageURL = `http://openweathermap.org/img/wn/${icon}@2x.png`;

            console.log(temperature, descrip);
            res.write(`<h1>The temperature in ${q} is ${temperature} degree celcius with ${descrip} condition</h1>`);
            res.write(`<img src=${imageURL} alt="weather" height ="20%" />`);
            res.send();
        });
    });
});

app.listen(3000, function(){
    console.log("Ready");
});