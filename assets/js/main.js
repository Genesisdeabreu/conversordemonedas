const formulario = document.getElementById('formulario-conversor');
const montoInput = document.getElementById('monto');
const monedaSelect = document.getElementById('moneda');
const resultadoDiv = document.getElementById('resultado');
const graficoCanvas = document.getElementById('grafico-historial');

// API
async function obtenerDatosAPI() {
  try {
    const respuesta = await fetch('https://mindicador.cl/api');
    if (!respuesta.ok) {
      throw new Error('Error al obtener datos de la API');
    }
    return await respuesta.json();
  } catch (error) {
    mostrarError(`Hubo un problema al conectarse con la API: ${error.message}`);
    return null;
  }
}


function calcularCambio(monto, tipoCambio) {
  return (monto / tipoCambio).toFixed(2);
}


async function manejarFormulario(evento) {
  evento.preventDefault();

  const monto = parseFloat(montoInput.value);
  const monedaSeleccionada = monedaSelect.value;

  if (isNaN(monto) || monto <= 0) {
    mostrarError('Por favor, ingrese un monto válido en CLP.');
    return;
  }

  if (!monedaSeleccionada) {
    mostrarError('Por favor, seleccione una moneda para convertir.');
    return;
  }

  const datosAPI = await obtenerDatosAPI();
  if (!datosAPI) return;

  const tipoCambio = datosAPI[monedaSeleccionada]?.valor;
  if (!tipoCambio) {
    mostrarError('No se pudo obtener el tipo de cambio para la moneda seleccionada.');
    return;
  }

  const resultado = calcularCambio(monto, tipoCambio);
  mostrarResultado(resultado, monedaSeleccionada);
  generarGrafico(datosAPI[monedaSeleccionada].serie);
}


function mostrarResultado(resultado, moneda) {
  resultadoDiv.textContent = `Resultado: ${resultado} ${moneda.toUpperCase()}`;
}


function mostrarError(mensaje) {
  resultadoDiv.textContent = mensaje;
  resultadoDiv.style.color = 'red';
}


const ctx = document.getElementById('myChart');

new Chart(ctx, {
  type: 'line',
  data: {
    labels: ['Dólar', 'Euro'],
    datasets: [{
      label: '# Data',
      data: [12, 25],
      borderWidth: 1
    }]
  },
  options: {
    scales: {
      y: {
        beginAtZero: true
      }
    }
  }
});



formulario.addEventListener('submit', manejarFormulario);
