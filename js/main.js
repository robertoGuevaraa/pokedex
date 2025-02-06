const listaPokemon = document.querySelector("#listaPokemon");
const botonesHeader = document.querySelectorAll(".btn-header");
const prevButton = document.querySelector("#prev");
const nextButton = document.querySelector("#next");


let currentPage = 1;
const limit = 21;
let currentFilter = "ver-todos";
const totalPokemons = 1025;

// Función para cargar Pokémon por página y aplicar filtro
async function cargarPagina(pagina, filtro) {
    listaPokemon.innerHTML = "";

    const offset = (pagina - 1) * limit;
    if (filtro === "ver-todos") {
        for (let i = offset + 1; i <= Math.min(offset + limit, totalPokemons); i++) {
            fetch(`https://pokeapi.co/api/v2/pokemon/${i}`)
                .then(response => response.json())
                .then(data => mostrarPokemon(data));
        }
    } else {
        await cargarPokemonPorTipo(filtro, pagina);
    }

    actualizarBotones(pagina);
}

// Función para mostrar Pokémon
function mostrarPokemon(poke) {
    let tipos = poke.types.map(type => `<p class="${type.type.name} tipo">${type.type.name}</p>`).join('');
    let pokeId = poke.id.toString().padStart(3, "0");

    const alturaEnMetros = (poke.height * 0.1).toFixed(2);
    const pesoEnKg = (poke.weight * 0.1).toFixed(2);

    const div = document.createElement("div");
    div.classList.add("pokemon");
    div.innerHTML = `
        <p class="pokemon-id-back">#${pokeId}</p>
        <div class="pokemon-imagen">
            <img src="${poke.sprites.other["official-artwork"].front_default}" alt="${poke.name}">
        </div>
        <div class="pokemon-info">
            <div class="nombre-contenedor">
                <p class="pokemon-id">#${pokeId}</p>
                <h2 class="pokemon-nombre">${poke.name}</h2>
            </div>
            <div class="pokemon-tipos">
                ${tipos}
            </div>
            <div class="pokemon-stats">
                <p class="stat">${alturaEnMetros}m</p>
                <p class="stat">${pesoEnKg}kg</p>
            </div>
        </div>
    `;
    listaPokemon.append(div);
}

// Función para cargar Pokémon por tipo desde la API
async function cargarPokemonPorTipo(tipo, pagina) {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/type/${tipo}`);
        const data = await response.json();

        const pokemonList = data.pokemon.map(p => p.pokemon);
        const offset = (pagina - 1) * limit;
        const paginatedList = pokemonList.slice(offset, offset + limit);

        for (const pokemon of paginatedList) {
            const pokeData = await fetch(pokemon.url).then(res => res.json());
            mostrarPokemon(pokeData);
        }
    } catch (error) {
        console.error("Error al cargar Pokémon por tipo:", error);
    }
}

botonesHeader.forEach(boton => boton.addEventListener("click", (event) => {
    currentFilter = event.currentTarget.id;
    currentPage = 1;
    cargarPagina(currentPage, currentFilter);
}));

function actualizarBotones(pagina) {
    const maxPage = Math.ceil(totalPokemons / limit);
    prevButton.disabled = pagina === 1;
    nextButton.disabled = pagina === maxPage;
}

// Eventos de paginación
prevButton.addEventListener("click", () => {
    if (currentPage > 1) {
        currentPage--;
        cargarPagina(currentPage, currentFilter);
    }
});

nextButton.addEventListener("click", () => {
    const maxPage = Math.ceil(totalPokemons / limit);
    if (currentPage < maxPage) {
        currentPage++;
        cargarPagina(currentPage, currentFilter);
    }
});

// Carga inicial
cargarPagina(currentPage, currentFilter);


//funcionalidad de búsqueda
const searchInput = document.querySelector("#searchInput");
const searchButton = document.querySelector("#searchButton");

searchButton.addEventListener("click", () => {
    const searchTerm = searchInput.value.toLowerCase();
    if (searchTerm) {
        buscarPokemon(searchTerm);
        prevButton.style.display = "none";
        nextButton.style.display = "none";
    }
});

async function buscarPokemon(nombre) {
    listaPokemon.innerHTML = "";
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${nombre}`);
        if (!response.ok) {
            throw new Error("Pokémon no encontrado");
        }
        const data = await response.json();
        mostrarPokemon(data);
    } catch (error) {
        console.error("Error al buscar Pokémon:", error);
        listaPokemon.innerHTML = `<p>Pokémon no encontrado</p>`;
    }
}

searchInput.addEventListener("input", () => {
    if (!searchInput.value) {
        cargarPagina(currentPage, currentFilter);
        prevButton.style.display = "inline-block";
        nextButton.style.display = "inline-block";
    }
});

