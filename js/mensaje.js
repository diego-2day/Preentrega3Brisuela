// Función que muestra el mensaje 
function mostrarMensaje() {
    Swal.fire({
        title: 'Bienvenido al carrito!',
        text: 'Aqui verás los elementos que has almacenado en tu compra',
        timer: 2000,
        width: 600,
        padding: '3em',
        color: 'antiquewhite',
        background: 'darkred', })
}

// Evento que se dispara cuando la página se ha cargado completamente
document.addEventListener('DOMContentLoaded', () => {
    mostrarMensaje();
});