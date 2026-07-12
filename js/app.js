// Así se vería la conexión a una API real
const API_URL = 'https://api.football-data.org/v4/matches';
const API_KEY = 'eaaa85924d5646b7afc2aa622e887f5c';

fetch(API_URL, {
    headers: { 'X-Auth-Token': API_KEY }
})
.then(response => response.json())
.then(data => {
    // Aquí mapeamos los partidos automáticos a tus tarjetas de diseño
    console.log(data);
});
