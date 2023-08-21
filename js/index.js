/* Todo comentario sin numero funciona leerlo de corrido
  [n] todo comentario enumerado funciona siguiendolos sincronicamente
 */
let shop = document.getElementById("shop"); // Accedemos al main

/* [5] Creamos una canasta para guardar los elementos
Todo elemento clickeado sera guardado en una canasta por su id único
Extraeremos la data especifica del local storage con getItem (si es que tenemos)
En caso que el local storage este vacio, vaciamos la canasta tambien <evita romper la aplicacion> */
let canasta = JSON.parse(localStorage.getItem("data")) || [];

/* Generamos catalogo a traves de una funcion guardada, obj: id, nombre, img(url-path), precio */

let generarCatalogo = () => {
  return (shop.innerHTML = catalogoElementos
    .map((x) => { // [1] Iteramos obj individualmente y extraemos prpiedades[ - {a} - , -{b}- , {c} ... ]
      let { id, name, desc, img, price } = x;
      /*[11] Generamos una funcion que busque el id de un elemento existente y lo despliegue en pantalla */
      let storageSearch = canasta.find((y) => y.id === id) || [];
      return ` <!-- [3] Asignamos un id unico a cada elemento iterado, tambien al contador para incrementar su numero  -->
    <section id="producto-id-${id}" class="item">
      <img width="220" src=${img} alt="">
      <span class="detalles">
        <h3>${name}</h3>
        <p>${desc}</p>
        <div class="descripcion">
          <h2>$ ${price} </h2>
          <div class="botones">
            <i onclick="decremento(${id})" class="bi bi-dash-lg"></i>
            <div id=${id} class="cantidad">${ /* [11.a]Si nada existe, devuelve un 0 o el elemento en cuestion */ 
              storageSearch.item === undefined ? 0 : storageSearch.item
      }</div>
            <i onclick="incremento(${id})" class="bi bi-plus-lg"></i>
          </div>
        </div>
      </section>
  </div>
    `;
    })
    .join("") // [2] Desglosamos los elementos correctamente ('quitamos la coma en el HTML') 
    );
};
/*Invocamos catalogo*/
generarCatalogo();

/* [4] Creamos las funciones incremento, decremento y actualizar, despues las colocamos como event handlers (<i onclick="decremento(${id})"..)
 Es la forma correcta de asignar a cual elemento individual se le esta haciendo click
 Luego pasamos id como parametro de ambas funciones */

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

  console.log(canasta);
  actualizar(elementoSeleccinado.id); //-> ***
  //[10] Guardamos en el storage en valores key:par "data" => "{obj incrementado actualizado}"
  localStorage.setItem("data", JSON.stringify(canasta));
  /*Desplegamos mensaje*/ 
  Swal.fire({
    title: 'Agregado!',
    icon:'success',
    text: 'Tu producto fue agregado al carrito',
    timer: 2000,
    width: 600,
    padding: '3em',
    color: 'antiquewhite',
    background: 'darkred', })
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
  //[13] Creamos un nuevo arreglo que filtre solo los elementos que no tienen un 0
  canasta = canasta.filter((x) => x.item !== 0);
  console.log(canasta);
  //[10] Guardamos en el storage en valores key:par "data" => "{obj decrementado actualizado}"
  localStorage.setItem("data", JSON.stringify(canasta));
  //Agregamos mensaje
  Swal.fire({
    title: 'Removido!',
    icon:'error',
    text: 'Se ve que no te ha gustado este producto!',
    timer: 2000,
    width: 600,
    padding: '3em',
    color: 'antiquewhite',
    background: 'darkred', })
};

// [7] -> *** La funcon actualizar es ejecutada CUANDO se hace click en los botones, actualizando los digitos
let actualizar = (id) => {
  //Buscamos el objeto en la canasta
  let busqueda = canasta.find((x) => x.id === id);
  //Reemplazamos el innerHTML content del elemento por el item incrementado
  document.getElementById(id).innerHTML = busqueda.item;
  calculo(); // -> [!] 
};

/* [8] La funcion calculo selecciona todos los items seleccionados en el carrito y los suma para desplegar el total de items seleccionados
  Queremos hacerla funcionar SOLO cuando la funcion actualizar es activada -> [!] */
let calculo = () => {
  //Seleccionamos el carrito
  let carritoIcono = document.getElementById("productosAcomprar");
  //[9] Usamos map para obtener un arreglo de los valores de los items de los elementos [2,3,5,6]
  // ar.reduce hace que [x,y...] => x + y + n... = [n]
  carritoIcono.innerHTML = canasta.map((x) => x.item).reduce((x, y) => x + y, 0);
};
//[12] Realizará un calculo rapido para desplegar los datos al cargar la pagina de forma correcta
calculo();