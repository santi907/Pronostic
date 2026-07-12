async function cargarPartidosDisponibles() {
  const loading = document.getElementById('loading');
  const errorDiv = document.getElementById('error');

  if (loading) loading.style.display = 'block';
  if (errorDiv) errorDiv.style.display = 'none';

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  try {
    const res = await fetch('https://sports.bzzoiro.com/football/api/v2/matches/live/', {
      headers: {
        Authorization: 'Token TU_TOKEN_AQUI'
      },
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!res.ok) throw new Error(`Error en API ${res.status}`);
    const data = await res.json();

    const partidos = (data.results || data.data || []).map(item => ({
      local: item.home_team?.name || item.home || 'Equipo Local',
      visitante: item.away_team?.name || item.away || 'Equipo Visitante',
      fecha: item.date || 'HOY',
      prediccion: item.prediction || 'Sin predicción'
    }));

    mostrarPartidos(partidos);
  } catch (err) {
    clearTimeout(timeoutId);
    console.error(err);
    mostrarErrorEnPantalla('No se pudieron cargar los partidos.');
  } finally {
    if (loading) loading.style.display = 'none';
  }
}
