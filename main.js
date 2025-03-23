// main.js

function loadListing() {
    console.log('Loading Pokémon listing...');
    sendRequest('GET', 'https://pokedextr.beuwi.app/pokemon')
        .then(data => {
            console.log('Pokémon data received:', data);
            displayListing(data);
        })
        .catch(error => console.error('Error loading pokemon:', error));
}

function displayListing(pokemonList) {
    const listing = document.getElementById('listing');
    if (!listing) {
        console.error('Element #listing not found');
        return;
    }
    listing.innerHTML = '';
    
    pokemonList.forEach(pokemon => {
        const a = document.createElement('a');
        a.href = `#${pokemon.name}`; // Matches template's intent
        a.id = pokemon.name;
        a.onclick = () => getPokemon(pokemon.pid);
        a.className = 'collection-item';
        a.textContent = pokemon.name;
        listing.appendChild(a);
    });
}

function getPokemon(pokemon_id) {
    console.log(`Getting Pokémon ${pokemon_id}`);
    sendRequest('GET', `https://pokedextr.beuwi.app/pokemon/${pokemon_id}`)
        .then(data => {
            console.log('Pokémon details:', data);
            displayPokemon(data);
        })
        .catch(error => console.error('Error getting pokemon:', error));
}

function displayPokemon(pokemon) {
    const result = document.getElementById('result');
    if (!result) {
        console.error('Element #result not found');
        return;
    }
    result.innerHTML = '';
    
    const div = document.createElement('div');
    div.className = 'card'; // Simplified per template, styling handled in CSS
    div.style.marginTop = '20px'; // Explicitly added per spec
    
    const cardImage = document.createElement('div');
    cardImage.className = 'card-image';
    const img = document.createElement('img');
    img.className = 'teal';
    img.src = pokemon.image;
    img.alt = `${pokemon.name} Image`;
    cardImage.appendChild(img);
    
    const cardContent = document.createElement('div');
    cardContent.className = 'card-content';
    
    const title = document.createElement('span');
    title.className = 'card-title';
    const pTitle = document.createElement('p');
    pTitle.textContent = `${pokemon.name} #${pokemon.pid}`;
    title.appendChild(pTitle);
    
    const pType = document.createElement('p');
    pType.textContent = `Type1: ${pokemon.type1}`;
    
    const pWeight = document.createElement('p');
    pWeight.textContent = `Weight: ${pokemon.weight}`;
    
    const pHeight = document.createElement('p');
    pHeight.textContent = `Height: ${pokemon.height}`;
    
    const catchBtn = document.createElement('a');
    catchBtn.onclick = () => catchPokemon(pokemon.pid);
    catchBtn.id = 'catchBtn';
    catchBtn.style.position = 'absolute';
    catchBtn.style.right = '15px';
    catchBtn.style.bottom = '80px';
    catchBtn.className = 'btn-floating btn-large waves-effect waves-light red';
    const icon = document.createElement('span');
    icon.className = 'iconify';
    icon.style.fontSize = '40px';
    icon.style.marginTop = '8px';
    icon.setAttribute('data-icon', 'mdi-pokeball');
    icon.setAttribute('data-inline', 'false');
    catchBtn.appendChild(icon);
    
    cardContent.appendChild(title);
    cardContent.appendChild(pType);
    cardContent.appendChild(pWeight);
    cardContent.appendChild(pHeight);
    cardContent.appendChild(catchBtn);
    
    div.appendChild(cardImage);
    div.appendChild(cardContent);
    result.appendChild(div);
}

function catchPokemon(pid) {
    const studentId = document.getElementById('user_id').value;
    if (!studentId) {
        console.error('Student ID is required');
        M.toast({html: 'Please enter your Student ID'});
        return;
    }
    const name = prompt('Enter a name for this Pokémon:');
    if (name) {
        console.log(`Catching Pokémon ${pid} for student ${studentId}`);
        sendRequest('POST', `https://pokedextr.beuwi.app/mypokemon/${studentId}`, {
            pokemon_id: pid,
            name: name
        })
        .then(() => {
            console.log('Pokémon caught successfully');
            getMyPokemon();
        })
        .catch(error => console.error('Error catching pokemon:', error));
    }
}

function getMyPokemon() {
    const studentId = document.getElementById('user_id').value;
    if (!studentId) {
        console.error('Student ID is required');
        M.toast({html: 'Please enter your Student ID'});
        return;
    }
    console.log(`Getting Pokémon for student ${studentId}`);
    sendRequest('GET', `https://pokedextr.beuwi.app/mypokemon/${studentId}`)
        .then(data => {
            console.log('My Pokémon data:', data);
            displayMyPokemon(data);
        })
        .catch(error => console.error('Error getting my pokemon:', error));
}

function displayMyPokemon(mypokemon) {
    const myPokeListing = document.getElementById('myPokeListing');
    if (!myPokeListing) {
        console.error('Element #myPokeListing not found');
        return;
    }
    myPokeListing.innerHTML = '';
    
    mypokemon.forEach(pokemon => {
        const tr = document.createElement('tr');
        
        const tdName = document.createElement('td');
        tdName.textContent = pokemon.name;
        
        const tdSpecies = document.createElement('td');
        tdSpecies.textContent = pokemon.species;
        
        const tdRelease = document.createElement('td');
        const releaseBtn = document.createElement('button');
        releaseBtn.className = 'waves-effect waves-light btn';
        releaseBtn.id = 'loadBtn';
        releaseBtn.onclick = () => releasePokemon(pokemon.user_pokemon_id);
        releaseBtn.textContent = 'Release';
        tdRelease.appendChild(releaseBtn);
        
        tr.appendChild(tdName);
        tr.appendChild(tdSpecies);
        tr.appendChild(tdRelease);
        myPokeListing.appendChild(tr);
    });
}

function releasePokemon(user_pokemon_id) {
    const studentId = document.getElementById('user_id').value;
    if (!studentId) {
        console.error('Student ID is required');
        M.toast({html: 'Please enter your Student ID'});
        return;
    }
    console.log(`Releasing Pokémon ${user_pokemon_id} for student ${studentId}`);
    sendRequest('DELETE', `https://pokedextr.beuwi.app/mypokemon/${studentId}/${user_pokemon_id}`)
        .then(() => {
            console.log('Pokémon released successfully');
            getMyPokemon();
        })
        .catch(error => console.error('Error releasing pokemon:', error));
}

document.addEventListener('DOMContentLoaded', function() {
    M.AutoInit();
    loadListing();
});
