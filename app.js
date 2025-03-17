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
    
    // Hacer el nombre clickeable
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
  if (amigoSeleccionado) {
    alert('Ya hay un participante seleccionado.');
    return;
  }
  
  if (confirm(`¿Eres ${nombre}? Esto iniciará el sorteo para ti.`)) {
    amigoSeleccionado = nombre;
    amigos = amigos.filter(amigo => amigo !== nombre);
    
    const mensaje = document.createElement('div');
    mensaje.className = 'participante-seleccionado';
    mensaje.innerHTML = `<p>Participante seleccionado: ${nombre}</p>`;
    document.querySelector('.input-section').insertBefore(mensaje, document.getElementById('listaAmigos'));
    
    const botonSortear = document.querySelector('.button-draw');
    botonSortear.disabled = false;
    botonSortear.textContent = 'Sortear mi amigo secreto';
    
    actualizarListaAmigos();
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

  if (parejasSorteadas.size === amigos.length) {
    alert('¡El sorteo ha terminado! Todos tienen su amigo secreto.');
    const botonSortear = document.querySelector('.button-draw');
    botonSortear.disabled = true;
  } else {
    agregarBotonSiguiente();
  }
}

function agregarBotonSiguiente() {
  const containerBotones = document.querySelector('.button-container');
  const botonSiguiente = document.createElement('button');
  botonSiguiente.className = 'button-draw';
  botonSiguiente.textContent = 'Siguiente participante';
  botonSiguiente.onclick = prepararSiguienteSorteo;
  containerBotones.appendChild(botonSiguiente);
}

function prepararSiguienteSorteo() {
  amigoSeleccionado = null;
  const resultadoElement = document.getElementById('resultado');
  resultadoElement.innerHTML = '';
  
  const mensajeAnterior = document.querySelector('.participante-seleccionado');
  if (mensajeAnterior) {
    mensajeAnterior.remove();
  }
  
  const botonSiguiente = document.querySelectorAll('.button-draw')[1];
  if (botonSiguiente) {
    botonSiguiente.remove();
  }
  
  const botonSortear = document.querySelector('.button-draw');
  botonSortear.disabled = true;
  botonSortear.textContent = 'Sortear amigo';
  
  actualizarListaAmigos();
}

function reiniciarSorteo() {
  amigos = [...amigos];
  parejasSorteadas.clear();
  amigoSeleccionado = null;
  
  const resultadoElement = document.getElementById('resultado');
  resultadoElement.innerHTML = '';
  
  const botonSortear = document.querySelector('.button-draw');
  botonSortear.disabled = false;
  botonSortear.style.opacity = '1';
  
  actualizarListaAmigos();
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