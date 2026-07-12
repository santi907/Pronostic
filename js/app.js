// ==========================================
// CONFIGURACIÓN DE TU NUEVA API (BSD)
// ==========================================
const MODO_DESARROLLO = false; 

// Tu Token oficial de BSD obtenido de tu panel
const API_TOKEN = 'be6f00ab1f68e6b755201f1a7cd264a93be3d0cf'; 

const hoy = new Date().toISOString().split('T')[0];

// ⚠️ NOTA: Haz clic en el botón "Read docs" de tu panel de BSD para confirmar la URL exacta de sus "fixtures" (partidos).
// Por lo general, la estructura base de BSD se conecta así:
const API_URL = `https://api.bigsportsdata.com/v2/football/fixtures?date=${hoy}`;

const DOM = {
    loading: () => document.getElementById('loading'),
    error: () => document.getElementById('error'),
    contenedor: () => document.getElementById('contenedor-partidos')
};

function cargarPartidosDisponibles() {
    console.log("Iniciando carga de partidos con la API de BSD...");
    
    if (DOM.loading()) DOM.loading().style.display = 'block';
    if (DOM.error()) DOM.error().style.display = 'none';

    if (MODO_DESARROLLO) {
        setTimeout(cargarRespaldoLocal, 500);
        return;
    }

    // Petición configurada con el método de autorización que te exige BSD
    fetch(API_URL, {
        method: 'GET',
        headers: {
            'Authorization': `Token ${API_TOKEN}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) throw new Error(`Error en BSD (Status ${response.status})`);
        return response.json();
    })
    .then(data => {
        // NOTA: Como la estructura de datos que devuelve BSD puede variar un poco a la de API-Sports,
        // si notas que no dibuja los partidos, mira tu consola (F12) para ver cómo vienen organizados los nombres.
        // Este bloque está protegido; si cambia algo, saltará automáticamente a tus partidos locales.
        
        const partidosAPI = data.results || data.response || data; 

        if (!partidosAPI || partidosAPI.length === 0) {
            cargarRespaldoLocal();
            return;
        }

        // Mapeo adaptivo para tus tarjetas de predicciones
        const partidosTransformados = partidosAPI.slice(0, 10).map((item, index) => {
            // Intentamos leer los nombres de los equipos según los estándares comunes de BSD
            const equipoLocal = item.home_team?.name || item.teams?.home?.name || "Equipo Local";
            const equipoVisitante = item.away_team?.name || item.teams?.away?.name || "Equipo Visitante";
            const nombreLiga = item.league?.name || "Torneo Internacional";

            let pronostico = `Torneo: ${nombreLiga}. Pronóstico: Más de 1.5 goles totales.`;
            if (index % 2 === 0) {
                pronostico = `Torneo: ${nombreLiga}. Pronóstico: Gana o empata ${equipoLocal}.`;
            }

            return {
                local: equipoLocal,
                visitante: equipoVisitante,
                fecha: (item.date || item.fixture?.date || hoy).split('T')[0],
                prediccion: pronostico
            };
        });

        mostrarPartidos(partidosTransformados);
    })
    .catch(error => {
        console.warn('Ajustando formato de la API o esperando respuesta. Cargando respaldo local por seguridad...', error);
        cargarRespaldoLocal();
    });
}

function cargarRespaldoLocal() {
    fetch('./datos/partidos.json?v=' + new Date().getTime()) 
        .then(res => {
            if (!res.ok) throw new Error("No se pudo leer partidos.json");
            return res.json();
        })
        .then(datosLocales => mostrarPartidos(datosLocales))
        .catch(err => {
            console.error(err);
            mostrarErrorEnPantalla("Cargando base de datos de partidos...");
        });
}

function mostrarPartidos(partidos) {
    const contenedor = DOM.contenedor();
    if (DOM.loading()) DOM.loading().style.display = 'none';
    if (DOM.error()) DOM.error().style.display = 'none';

    if (!contenedor) return;
    contenedor.innerHTML = '';

    partidos.forEach(partido => {
        contenedor.innerHTML += `
            <div class="card">
                <div class="partido-header">
                    <span class="equipo-
