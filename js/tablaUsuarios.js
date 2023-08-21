let url = 'https://jsonplaceholder.typicode.com/users/'; //Url api gratuita
fetch(url) // Fetchear url: https://jsonplaceholder.typicode.com/users/
    .then(response => response.json()) // Traducir a json la respuesta
    .then(data => mostrarData(data)) // Desplegar en body la respuesta
    .catch(error => console.log(error)) //Pasarla a la consola

const mostrarData = (data) => { // La respuesta como parametro
    console.log(data)
    let info = ""
    for (var i = 0; i < data.length; i++) { //itermaos obj[i].proiedad y desglosamos
        info += `<tr><td>${data[i].id}</td><td>${data[i].name}</td><td>${data[i].website}</td></tr>`
    }

    document.getElementById('data').innerHTML = info //Almacenamos la informacion
}