let carritoDecompras = document.getElementById("carritoDecompras");//Tomamos el carrito de compras por id
let label = document.getElementById("label"); // Tomamos la etiqueta del carrito

/* Consultamos por data en el storage */

let canasta = JSON.parse(localStorage.getItem("data")) || [];

/* Calculamos la suma de todos los elementos seleccionados */

let calculo = () => {
  //Seleccionamos el carrito
  let carritoIcono = document.getElementById("productosAcomprar");
  //Usamos map para obtener un arreglo de los valores de los items de los elementos [2,3,5,6]
  // ar.reduce hace que [x,y...] => x + y + n... = [n]
  carritoIcono.innerHTML = canasta.map((x) => x.item).reduce((x, y) => x + y, 0);
};
//Realizará un calculo rapido para desplegar los datos al cargar la pagina de forma correcta
calculo();

/*
   Generamos carrito a traves de una funcion guardada, obj: titulo, precio, img(url-path), botones, precioTotal
   cuando la canasta este vacia, debemos mostrar un mensaje
 */

let itemsCarrito = () => {
  if (canasta.length !== 0) {
    //En caso de que no haya algún objeto en la canasta
    return (carritoDecompras.innerHTML = canasta
      .map((x) => {
        //Destructuramos el objeto presente y solo tomamos lo que necesitamso de la base de datos
        let { id, item } = x;
        //[1] Con la siguiente linea de codigo hacemos match de coincidencias de elementos de los id en la base de datos y el id guardado en la canasta, en caso de no hacer match, devolvemos un arreglo vacio
        let busqueda = catalogoElementos.find((x) => x.id === id) || [];
        let { img, price, name } = busqueda;
        return `
      <div class="carritoItem">
        <img width="100" src=${img} alt="" />

        <div class="detalles">
        
          <div class="titulo-precio-x">
            <h4 class="titulo-precio">
              <p>${name}</p>
              <p class="carrito-item-precio">$ ${price}</p>
            </h4>
            <i onclick="removerItem(${id})" class="bi bi-x-lg"></i>
          </div>

          <div class="botones-carrito">
            <div class="botones">
              <i onclick="decremento(${id})" class="bi bi-dash-lg"></i>
              <div id=${id} class="cantidad">${item}</div>
              <i onclick="incremento(${id})" class="bi bi-plus-lg"></i>
            </div>
          </div>

          <h3>$ ${item * price}</h3>
        
        </div>
      </div>
      `;
      })
      .join(""));
  } else {
    carritoDecompras.innerHTML = "";
    label.innerHTML = `
    <h2>El carro está vacio!</h2>
    <a href="../index.html">
      <button class="indexBtn">Llevame al inicio</button>
    </a>
    `;
  }
};

itemsCarrito();

let incremento = (id) => {
    let elementoSeleccinado = id;
    // [6] Creamos una funcion para buscar en la canasta el objeto clickeado 
    let busqueda = canasta.find((x) => x.id === elementoSeleccinado.id);
  
    if (busqueda === undefined) {
      //Si no existe, hazle un push
      canasta.push({
        id: elementoSeleccinado.id,
        item: 1,
      });
    } else {
      // Si existe, solamente incrementa su cantidad
      busqueda.item += 1;
    }
  
    itemsCarrito();
    actualizar(elementoSeleccinado.id); //-> ***
    //[10] Guardamos en el storage en valores key:par "data" => "{obj incrementado actualizado}"
    localStorage.setItem("data", JSON.stringify(canasta));
  };
  
  /* Creamos la funcion decremento para reducir el numero seleccionado - 1*/
  
  let decremento = (id) => {
    let elementoSeleccinado = id;
    let busqueda = canasta.find((x) => x.id === elementoSeleccinado.id);
    // Si el elemento que buscamos es indefinido, no realizes nada (debbuggueo)
    if (busqueda === undefined) return;
    //Si el item es 0 deten el decremento obligatoriamente
    else if (busqueda.item === 0) return;
    else {
      busqueda.item -= 1;
    }
  
    actualizar(elementoSeleccinado.id); // -> ***
    // Creamos un nuevo arreglo que filtre solo los elementos que no tienen un 0
    canasta = canasta.filter((x) => x.item !== 0);
    itemsCarrito(); //Renderizamos los datos una vez que el conteo sea 0(quita un item del carro una vez su contador sea 0)
    // Guardamos en el storage en valores key:par "data" => "{obj decrementado actualizado}"
    localStorage.setItem("data", JSON.stringify(canasta));
  };
  
  // -> *** La funcon actualizar es ejecutada CUANDO se hace click en los botones, actualizando los digitos
  let actualizar = (id) => {
    //Buscamos el objeto en la canasta
    let busqueda = canasta.find((x) => x.id === id);
    //Reemplazamos el innerHTML content del elemento por el item incrementado
    document.getElementById(id).innerHTML = busqueda.item;
    calculo(); // -> [!] 
  };

/* Remover un elemento del carrito con [x], lo pegamos como un event handler en el icono dentro de precio-titulo-x */

let removerItem = (id) => {
  let elementoSeleccinado = id;
  //Cualquier elemento que se le haga click, sera removido y la canasta sera actualizada
  canasta = canasta.filter((x) => x.id !== elementoSeleccinado.id);
  calculo();
  //Renderizamos el carro
  itemsCarrito();
  sumaTotal();
  // actualizamos el storage
  localStorage.setItem("data", JSON.stringify(canasta));
};

/* Mostrar la suma total de los precios, en caso de estar vacio, no motrar nada*/

let sumaTotal = () => {
    // en caso de tener datos
  if (canasta.length !== 0) {
    let total = canasta
      .map((x) => {
        let { id, item } = x;
        //Seleccionamos los ids comparados del carrito y de la base de datos y los multiplicamos entre si
        let datosFiltrados = catalogoElementos.find((x) => x.id === id);
        return datosFiltrados.price * item;
      })
      .reduce((x, y) => x + y, 0); // concatenamos y usamos 0 como valor inicial

    return (label.innerHTML = `
    <h2>Suma Total : $ ${total}</h2>
    <button class="checkout">Checkout</button>
    <button onclick="limpiarCarrito()" class="remueveTodo">Limpiar carrio</button>
    `);
  } else return;
};

sumaTotal();

/* Limpiar el carrito y remover todo del local storage */

let limpiarCarrito = () => {
  //Vaciamos el elemento
  canasta = [];
  // renderizamos el resultado
  itemsCarrito();
  // Reiniciamos el calculo de la app
  calculo();
  localStorage.setItem("data", JSON.stringify(basket));
};