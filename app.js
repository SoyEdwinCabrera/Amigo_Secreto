// El principal objetivo de este desafío es fortalecer tus habilidades 
// en lógica de programación. Aquí deberás desarrollar la lógica para resolver el problema.
let amigos = [];

function agregarAmigo() {
  const inputAmigo = document.getElementById('amigo');
  const nombreAmigo = inputAmigo.value.trim();
  
  if (nombreAmigo === '') {
    alert('Por favor, inserte un nombre. ');
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