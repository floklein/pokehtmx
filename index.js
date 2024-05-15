const express = require('express');
const path = require("path");

const app = express();
const port = process.env.PORT || 8080;

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/pokemons', async (req, res) => {
    const pokemons = await (await fetch('https://pokeapi.co/api/v2/pokemon?limit=151')).json();
    const searched = req.query.search?.length ? pokemons.results.filter(pokemon => pokemon.name.includes(req.query.search)) : pokemons.results;
    res.send(searched.map(result => `
        <article hx-get="/pokemons/${result.name}" hx-trigger="revealed" hx-swap="innerHTML">
            <span class="htmx-indicator">Loading...</span>
        </article>
    `).join(''));
});

app.get('/pokemons/:name', async (req, res) => {
    const pokemon = await (await fetch(`https://pokeapi.co/api/v2/pokemon/${req.params.name}`)).json();
    res.send(`
        <h2>${pokemon.name}</h2>
        <img alt="${pokemon.name}" src="${pokemon.sprites.front_default}" />
    `);
});

app.listen(port);
console.log('App is listening on port ' + port);
