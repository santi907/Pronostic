async function cargarPartidosDisponibles() {
  const loading = document.getElementById('loading');
  const errorDiv = document.getElementById('error');
  const contenedor = document.getElementById('contenedor-partidos');

  if (loading) loading.style.display = 'block';
  if (errorDiv) errorDiv.style.display = 'none';

  try {
    const res = await fetch('./datos/partidos.json', { cache: 'no-store' });
    if (!res.ok) throw new Error('No se pudo leer partidos.json');
    const datos = await res.json();
    mostrarPartidos(Array.isArray(datos) ? datos : []);
  } catch (error) {
    console.error(error);
    mostrarErrorEnPantalla('Predicciones en actualización. Intenta más tarde.');
  } finally {
    if (loading) loading.style.display = 'none';
  }
}

function mostrarPartidos(partidos) {
  const contenedor = document.getElementById('contenedor-partidos');
  const loading = document.getElementById('loading');
  const errorDiv = document.getElementById('error');

  if (loading) loading.style.display = 'none';
  if (errorDiv) errorDiv.style.display = 'none';
  if (!contenedor) return;

  contenedor.innerHTML = '';

  partidos.forEach(partido => {
    const local = partido.local ?? 'Equipo Local';
    const visitante = partido.visitante ?? 'Equipo Visitante';
    const fecha = partido.fecha ?? 'HOY';
    const prediccion = partido.prediccion ?? 'Sin predicción';

    contenedor.innerHTML += `
      <div class="card">
        <div class="partido-header">
          <span class="equipo-local">${local}</span>
          <span class="vs">vs</span>
          <span class="equipo-visitante">${visitante}</span>
        </div>
        <p class="fecha">Fecha: <strong>${fecha}</strong></p>
        <div class="prediccion">
          <p><strong>Predicción:</strong> ${prediccion}</p>
        </div>
      </div>
    `;
  });
}

function mostrarErrorEnPantalla(mensaje) {
  const loading = document.getElementById('loading');
  const errorDiv = document.getElementById('error');

  if (loading) loading.style.display = 'none';
  if (errorDiv) {
    errorDiv.textContent = mensaje;
    errorDiv.style.display = 'block';
  }
}

document.addEventListener('DOMContentLoaded', cargarPartidosDisponibles);
