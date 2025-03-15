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
  
  amigos.forEach(amigo => {
    const li = document.createElement('li');
    li.textContent = amigo;
    lista.appendChild(li);
  });
}
