let amigos = [];
let amigosSorteados = [];
let amigoSeleccionado = null;
let parejasSorteadas = new Map();


function agregarAmigo() {
  const inputAmigo = document.getElementById('amigo');
  const nombreAmigo = inputAmigo.value.trim();
 
  if (nombreAmigo === '') {
    alert('Por favor, inserte un nombre.');
    return;
  }
  
  if (/\d/.test(nombreAmigo)) {
    alert('El nombre no debe contener números.');
    inputAmigo.value = '';
    return;
  }
  
  if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(nombreAmigo)) {
    alert('El nombre solo debe contener letras.');
    inputAmigo.value = '';
    return;
  }
  
  if (amigos.includes(nombreAmigo)) {
    alert('Este nombre ya está en la lista.');
    inputAmigo.value = '';
    return;
  }
  
  amigos.push(nombreAmigo);
  inputAmigo.value = '';
  actualizarListaAmigos();
}

function actualizarListaAmigos() {
  const lista = document.getElementById('listaAmigos');
  lista.innerHTML = '';
  
  for(let i = 0; i < amigos.length; i++) {
    const li = document.createElement('li');
    
    const contenedor = document.createElement('div');
    contenedor.className = 'amigo-item';
    
    const nombreSpan = document.createElement('span');
    nombreSpan.textContent = amigos[i];
    
    nombreSpan.style.cursor = 'pointer';
    nombreSpan.onclick = function() {
      seleccionarParticipante(amigos[i]);
    };
    
    const botonEliminar = document.createElement('button');
    botonEliminar.textContent = '×';
    botonEliminar.className = 'button-delete';
    botonEliminar.onclick = function() {
      amigos.splice(i, 1);
      actualizarListaAmigos();
    };
    
    contenedor.appendChild(nombreSpan);
    contenedor.appendChild(botonEliminar);
    li.appendChild(contenedor);
    lista.appendChild(li);
  }
}


function seleccionarParticipante(nombre) {
  if (parejasSorteadas.has(nombre)) {
    alert('Este participante ya realizó su sorteo.');
    return;
  }
  
  if (confirm(`¿Eres ${nombre}? Esto iniciará el sorteo para ti.`)) {
    amigoSeleccionado = nombre;
    
    const mensaje = document.createElement('div');
    mensaje.className = 'participante-seleccionado';
    mensaje.innerHTML = `<p>Participante seleccionado: ${nombre}</p>`;
    
    const mensajeAnterior = document.querySelector('.participante-seleccionado');
    if (mensajeAnterior) {
    mensajeAnterior.remove();
    }
    
    document.querySelector('.input-section').insertBefore(mensaje, document.getElementById('listaAmigos'));
    
    const botonSortear = document.querySelector('.button-draw');
    botonSortear.disabled = false;
    botonSortear.textContent = 'Sortear mi amigo secreto';
  }
}

function sortearAmigo() {
  if (!amigoSeleccionado) {
    alert('Por favor, selecciona primero quién eres de la lista.');
    return;
  }

  const amigosDisponibles = amigos.filter(amigo => 
    amigo !== amigoSeleccionado && !parejasSorteadas.has(amigo) && parejasSorteadas.get(amigoSeleccionado) !== amigo // No puede ser alguien que ya le tocó
  );

  if (amigosDisponibles.length === 0) {
    const ultimoAmigo = amigoSeleccionado;
    const primerAmigo = amigos.find(amigo => !Array.from(parejasSorteadas.values()).includes(amigo));
    
    if (primerAmigo) {
      parejasSorteadas.set(ultimoAmigo, primerAmigo);
      mostrarAnimacionYResultado(primerAmigo);
    } else {
      alert('Error en el sorteo. Por favor, reinicia el proceso.');
    }
    return;
  }

  const indiceAleatorio = Math.floor(Math.random() * amigosDisponibles.length);
  const amigoSorteado = amigosDisponibles[indiceAleatorio];
  
  parejasSorteadas.set(amigoSeleccionado, amigoSorteado);
  
  mostrarAnimacionYResultado(amigoSorteado);
}

function mostrarAnimacionYResultado(amigoSorteado) {
  const resultadoElement = document.getElementById('resultado');
  resultadoElement.innerHTML = `<li class="result-item"><span>Sorteando...</span></li>`;
  
  let contador = 0;
  const intervalId = setInterval(() => {
    const indiceTemp = Math.floor(Math.random() * amigos.length);
    resultadoElement.innerHTML = `
    <li class="result-item sorting">
      <span>${amigos[indiceTemp]}</span>
    </li>`;
    contador++;
      
    if (contador >= 10) {
      clearInterval(intervalId);
      mostrarResultadoFinal(amigoSorteado);
    }
  }, 100);
}

function mostrarResultadoFinal(amigoSorteado) {
  const resultadoElement = document.getElementById('resultado');
  resultadoElement.innerHTML = `
  <li class="result-item final">
    <span>${amigoSeleccionado}, tu amigo secreto es: ${amigoSorteado}</span>
  </li>`;
  
  const botonSortear = document.querySelector('.button-draw');

  if (parejasSorteadas.size === amigos.length) {
    alert('¡El sorteo ha terminado! Todos tienen su amigo secreto.');
    botonSortear.textContent = 'Nuevo Sorteo';
    botonSortear.onclick = reiniciarApp;
  } else {
    botonSortear.textContent = 'Siguiente participante';
    botonSortear.onclick = prepararSiguienteSorteo;
  }
  actualizarListaParejas();
}
  
function prepararSiguienteSorteo() {
  amigoSeleccionado = null;
  const resultadoElement = document.getElementById('resultado');
  resultadoElement.innerHTML = '';
  
  const mensajeAnterior = document.querySelector('.participante-seleccionado');
  if (mensajeAnterior) {
      mensajeAnterior.remove();
  }
  
  const botonSortear = document.querySelector('.button-draw');
  botonSortear.disabled = true;
  botonSortear.textContent = 'Sortear amigo';
  botonSortear.onclick = sortearAmigo; // Restaurar la función original
  
  actualizarListaAmigos();
}

function actualizarListaParejas() {
  const listaParejas = document.getElementById('parejasSorteadas');
  if (!listaParejas) {
    const nuevaLista = document.createElement('ul');
    nuevaLista.id = 'parejasSorteadas';
    nuevaLista.className = 'parejas-list';
    document.querySelector('.input-section').appendChild(nuevaLista);
  }

  const lista = document.getElementById('parejasSorteadas');
  lista.innerHTML = '<h3>Parejas Sorteadas:</h3>';

  parejasSorteadas.forEach((valor, clave) => {
    const li = document.createElement('li');
    li.textContent = `${clave} → ${valor}`;
    lista.appendChild(li);
  });
}


function reiniciarApp() {
  if (confirm('¿Deseas comenzar un nuevo juego? Se borrarán todos los datos actuales.')) {
    amigos = [];
    amigosSorteados = [];
    amigoSeleccionado = null;
    parejasSorteadas.clear();
    
    const listaAmigos = document.getElementById('listaAmigos');
    const resultado = document.getElementById('resultado');
    const parejasSorteadasList = document.getElementById('parejasSorteadas');
    
    listaAmigos.innerHTML = '';
    resultado.innerHTML = '';
    if (parejasSorteadasList) {
        parejasSorteadasList.remove();
    }
    const mensajeSeleccionado = document.querySelector('.participante-seleccionado');
    if (mensajeSeleccionado) {
      mensajeSeleccionado.remove();
    }
    const containerBotones = document.querySelector('.button-container');
    containerBotones.innerHTML = `
    <button class="button-draw" onclick="sortearAmigo()" disabled>
      Sortear amigo
    </button>`;
  }
}