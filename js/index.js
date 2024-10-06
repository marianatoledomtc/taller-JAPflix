document.addEventListener("DOMContentLoaded", () => {
    const url = "https://japceibal.github.io/japflix_api/movies-data.json";
    let moviesData = [];

    // Carga de datos de las películas
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            moviesData = data; // Almacena los datos
            console.log(moviesData); // Verifica los datos

            // Configura el botón de búsqueda
            document.getElementById('btnBuscar').addEventListener('click', () => {
                const query = document.getElementById('inputBuscar').value.toLowerCase(); // ID corregido
                console.log(query); // Verifica el valor de búsqueda

                const filteredMovies = moviesData.filter(movie => {
                    const titleMatch = movie.title && typeof movie.title === 'string' && movie.title.toLowerCase().includes(query);
                    const genreMatch = Array.isArray(movie.genres) && movie.genres.some(genre => typeof genre === 'string' && genre.toLowerCase().includes(query));
                    const taglineMatch = movie.tagline && typeof movie.tagline === 'string' && movie.tagline.toLowerCase().includes(query);
                    const overviewMatch = movie.overview && typeof movie.overview === 'string' && movie.overview.toLowerCase().includes(query);
                    
                    return titleMatch || genreMatch || taglineMatch || overviewMatch;
                });

                console.log(filteredMovies); // Verifica las películas filtradas
                showMovies(filteredMovies);
            });
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
});

function showMovies(movies) {
    const container = document.getElementById('lista');
    container.innerHTML = ''; // Limpia el contenedor antes de añadir nuevos elementos

    if (movies.length === 0) {
        container.innerHTML = '<p>No se encontraron películas.</p>';
    } else {
        movies.forEach(movie => {
            const movieElement = document.createElement('li');
            movieElement.classList.add('movie-container');

            // Asegúrate de que movie.vote_average esté en el rango correcto
            const starsCount = Math.round(movie.vote_average); // Calcular estrellas (0 a 10)
            const totalStars = 10; // Total de estrellas

            // Crear el HTML de las estrellas
            const starsHTML = Array.from({ length: totalStars }, (_, index) => {
                return `<i class="fa fa-star ${index < starsCount ? 'filled' : 'empty'}"></i>`;
            }).join('');

            movieElement.innerHTML = `
                <div>
                    <h3>${movie.title}</h3>
                    <p>${movie.tagline}</p>
                </div>
                <div class="vote star-rating">
                    ${starsHTML} (${movie.vote_average})
                </div>
            `;

            // Agrega un evento de clic a la película
            movieElement.addEventListener('click', () => {
                showMovieDetails(movie);
            });

            container.appendChild(movieElement);
        });
        container.style.display = 'block'; // Muestra el contenedor
    }
}

function showMovieDetails(movie) {
    // Verifica si ya existe un contenedor de detalles y lo elimina
    let existingDetailsContainer = document.querySelector('.movie-details');
    if (existingDetailsContainer) {
        existingDetailsContainer.remove(); // Elimina el contenedor existente
    }

    // Crea un nuevo contenedor para mostrar los detalles de la película
    const detailsContainer = document.createElement('div');
    detailsContainer.classList.add('movie-details');

    // Crea el botón para cerrar el contenedor
    const closeButton = document.createElement('button');
    closeButton.textContent = '✖';
    closeButton.classList.add('close-button');

    // Estilo del botón de cerrar
    closeButton.style.position = 'absolute';
    closeButton.style.top = '10px';
    closeButton.style.right = '10px';
    closeButton.style.background = 'transparent';
    closeButton.style.border = 'none';
    closeButton.style.fontSize = '20px';
    closeButton.style.cursor = 'pointer';
    closeButton.title = 'Cerrar detalles';

    // Crea el botón para el dropdown
    const dropdownButton = document.createElement('button');
    dropdownButton.textContent = 'Información adicional';
    dropdownButton.classList.add('dropdown-button');

    // Crea el contenedor para la información adicional
    const additionalInfo = document.createElement('div');
    additionalInfo.classList.add('additional-info');
    additionalInfo.style.display = 'none'; // Inicialmente oculto

    // Aquí ajustamos cómo se muestran los géneros
    const genreNames = movie.genres.map(genre => genre.name).join(', '); // Accede a la propiedad 'name'
    
    additionalInfo.innerHTML = `
        <p><strong>Año de lanzamiento:</strong> ${new Date(movie.release_date).getFullYear()}</p>
        <p><strong>Duración:</strong> ${movie.runtime} minutos</p>
        <p><strong>Presupuesto:</strong> $${movie.budget.toLocaleString()}</p>
        <p><strong>Ganancias:</strong> $${movie.revenue.toLocaleString()}</p>
    `;

    // Añade el evento para mostrar/ocultar la información adicional
    dropdownButton.addEventListener('click', () => {
        const isVisible = additionalInfo.style.display === 'block';
        additionalInfo.style.display = isVisible ? 'none' : 'block';
        dropdownButton.textContent = isVisible ? 'Información adicional' : 'Ocultar información';
    });

    // Añade el evento para cerrar el contenedor de detalles
    closeButton.addEventListener('click', () => {
        detailsContainer.remove(); // Elimina el contenedor al cerrar
    });

    detailsContainer.innerHTML = `
        <h2>${movie.title}</h2>
        <p>${movie.overview}</p>
        <p><strong>Géneros:</strong> ${genreNames}</p> <!-- Muestra los géneros -->
    `;

    // Añade el botón de cerrar y el botón de dropdown al contenedor de detalles
    detailsContainer.appendChild(closeButton);
    detailsContainer.appendChild(dropdownButton);
    detailsContainer.appendChild(additionalInfo);

    // Limpia el contenedor y añade los detalles
    const mainContainer = document.querySelector('main');
    mainContainer.prepend(detailsContainer); // Inserta el contenedor en la parte superior

    // Estiliza el contenedor de detalles
    detailsContainer.style.position = 'relative'; // Asegúrate de que el contenedor tenga posición relativa
    detailsContainer.style.backgroundColor = '#fff';
    detailsContainer.style.padding = '20px';
    detailsContainer.style.borderRadius = '8px';
    detailsContainer.style.marginBottom = '20px';
    detailsContainer.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)'; // Sombra
}
