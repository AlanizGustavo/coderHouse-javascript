const grid = document.querySelector('.grid');
const producto = document.querySelector('#nombre');

let btnCarritos;


let filtroNombre;
let carrito = [];

const productos = [
    {
        id: 1,
        nombre: 'Drip cake en tonos celestes',
        imagen: '../assets/img/drip_cake_celestes.JPG',
        texto: 'Drip cake en tonos celestes. Rellenos de ganache de frutos rojos y dulce de leche',
        precio: 5000
    },
    {
        id: 2,
        nombre: 'Drip cake en tonos grises',
        imagen: '../assets/img/drip_cake_negro.JPG',
        texto: 'Drip Cake rellena de ganache de maracuya y dulce de leche',
        precio: 4500
    },
    {
        id: 3,
        nombre: 'Torta de casamiento',
        imagen: '../assets/img/torta_casamiento.JPG',
        texto: 'Torta de casamiento para 80 personas. Torta superior de dos rellenos y biscochuelo de limon. Torta inferior de 3 rellenos con biscochuelo de chocolate',
        precio: 9000
    },
    {
        id: 4,
        nombre: 'Torta decorada con petalos de rosa',
        imagen: '../assets/img/drip_cake_petalos.JPG',
        texto: 'Torta de vainilla con rellenos de crema con frutos rojos y ganache de chocolate',
        precio: 5000
    },
    {
        id: 5,
        nombre: 'Desayuno Completo',
        imagen: '../assets/img/desayuno.JPG',
        texto: 'Desayuno completo con cheesecake de maracuya, carrot cake, tarta de frutillas, mini budines, conitos de dulce de leche, macarons, marquise, alfajores de maicena y de almendra',
        precio: 4500
    },
    {
        id: 6,
        nombre: 'Torta decorada con flores',
        imagen: '../assets/img/cake_flowers.JPG',
        texto: 'Drip cake decorada con flores de estacion. Bizcochuelo de vainilla y rellenos de dulce de leche y crema con frutillas',
        precio: 6000
    },
    {
        id: 7,
        nombre: 'Torta brownie, con dulce de leche y merengue',
        imagen: '../assets/img/brownie_cake.JPG',
        texto: 'Bomba de la casa!!! Torta brwnie con dulce de leche, crema y merengue',
        precio: 3800
    },
    {
        id: 8,
        nombre: 'Frambuesas bañadas en chocolate blanco y negro',
        imagen: '../assets/img/frambuesas_chocolate.JPG',
        texto: 'Frambuesas bañadas en chocolate blanco y luego en chocolate negro',
        precio: 630
    },
    {
        id: 9,
        nombre: 'Torta con forma de letra',
        imagen: '../assets/img/letter_cake.JPG',
        texto: 'Letter cake. Puede ser de la letra que gustes. Masa sable con dulce de leche y toppings',
        precio: 4000
    },
    {
        id: 10,
        nombre: 'Cheseecake de frutos rojos',
        imagen: '../assets/img/cheesecake.JPG',
        texto: 'Cheesecake de frutos rojos. Puede ser de maracuya o chocolate blanco y nutella',
        precio: 4500
    },
    {
        id: 11,
        nombre: 'Torta con colores de Boca Juniors',
        imagen: '../assets/img/torta_boca.JPG',
        texto: 'Torta de chocolate, rellena con ganache de frutos rojos y ganache de maracuya',
        precio: 7000
    }
]

let cargaInicial = () => {

    productos.forEach( element => {
        agregarCards(element);
    }),
    funcionalidadBtn();
}
    
    
let agregarCards = function(element){
        
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
        <img src="${element.imagen}" alt="${element.nombre}">
        <p class="texto textoAparece">${element.texto}</p>
        <div class="descripcion">
            <p class="texto">${element.nombre}</p>
            <button id="${element.id}" class="agregarCarrito" type="button">Agregar al carrito</button>
        </div>
        `;
    grid.appendChild(card);
}


//Funcion para filtrar los productos
const filtrar = () => {
    filtroNombre = nombre.value.toLowerCase(); //este es un valor tomado de un input

    const productosFiltrados = productos.filter(producto => {
        return producto.nombre.toLowerCase().includes(filtroNombre);
    })

    if(filtroNombre === ""){
        grid.innerHTML="";
        cargaInicial();
    }
    else{
        grid.innerHTML="";

        
        if(productosFiltrados.length > 0){
            productosFiltrados.forEach(element => {
                agregarCards(element);
                funcionalidadBtn();
            })
        }
        else{
            const noEncontrado = {
                imagen:"../assets/img/brownie_cake.JPG",
                nombre: "NO ENCONTRADO",
                texto: "No se encontro coicidencia"
            };
            grid.innerHTML="";
            agregarCards(noEncontrado);
            grid.innerHTML="";
            agregarCards(noEncontrado);
        }
    }
    
}  


/*
*Funcion que capta todos los botones "Agregar carrito" y les asigna una accion al hacer click
*
*/
const funcionalidadBtn = () => {
    btnCarritos = document.querySelectorAll('.agregarCarrito');

    for (const boton of btnCarritos) {
        boton.addEventListener('click', () => {
            carrito.push(productos.find( elemento => {
                return elemento.id == boton.id;
            }))
            sessionStorage.setItem('carrito', JSON.stringify(carrito));
        })
    }

}




nombre.addEventListener("keydown", filtrar);

cargaInicial();




// LOGICA DEL MODAL

const popup = document.querySelector('#modal');
const modalAbrir = document.querySelector('.miCarrito')
const modalCerrar = document.querySelector('#cerrarModal')
const listaAgregados = document.querySelector('.productosAgregados');
const formulario = document.querySelector('.formulario');
const comprar = document.querySelector('#comprar')

const hoy = new Date;


let botonesEliminarAll;

const sinProductos = () => {
    listaAgregados.innerHTML = `<p class="texto">NO HA AGREGADO ELEMENTOS AL CARRITO</p>`
}

modalAbrir.addEventListener('click', () => {
    let compras = JSON.parse(sessionStorage.getItem('carrito'));
    if(compras && carrito.length===0){
        carrito = compras
    }
    
    popup.showModal();
    if(compras && compras.length>0){
        
        compras.forEach( producto => {
            agregarItemCompras(producto);
        })
        botonesEliminarAll = document.querySelectorAll('.eliminar');
        agregarEventoEliminar();
        cargarFormulario();
    }
    else{
        
        sinProductos();
    }
})

modalCerrar.addEventListener('click', () => {
    popup.close();
    listaAgregados.innerHTML = '';
})



const agregarItemCompras = function(element){
        
    const fila = document.createElement("div");
    fila.classList.add("fila");
    fila.innerHTML = `
        <p class="texto">${element.nombre}</p>
        <p class="precio">$${element.precio}</p>
        <button id=${element.id} class="eliminar" type="button">Eliminar</button>
        `;
    listaAgregados.appendChild(fila);
}

const agregarEventoEliminar = () => {
    for (const boton of botonesEliminarAll) {
        boton.addEventListener('click', () => {
            
            const buscado = carrito.find( producto => {
                return producto.id == boton.id
            })

            const index = carrito.indexOf(buscado);

            carrito.splice(index,1);
            
            sessionStorage.clear()
            
            listaAgregados.innerHTML = '';
            
            if(carrito.length>0){
                sessionStorage.setItem('carrito', JSON.stringify(carrito))
                carrito.forEach( producto => {
                    agregarItemCompras(producto);
                })
                botonesEliminarAll = document.querySelectorAll('.eliminar');
                agregarEventoEliminar();
                cargarFormulario();
            }
            else{
                sinProductos();
            }


        })
    }
}

const cargarFormulario = () => {
    const formulario = document.createElement("div");
    formulario.classList.add("formulario");
    formulario.innerHTML = `
        <p class="texto">EL TOTAL ES DE: $${calcularTotal()}</p>
        <input type="text" placeholder="Nombre y Apellido" name="nombreApellido" id="nombreApellido" class="inputNombre">
        <div>
            <label for="domicilio">¿Es a domicilio?</label>
            <label for="domicilioSi">Si</label>
            <input type="radio" placeholder="Si" name="domicilio" id="domicilioSi" class="radioSi" value="Si">
            <label for="domicilioNo">No</label>
            <input type="radio" placeholder="No" name="domicilio" id="domicilioNo" class="radioNo" value="No">
        </div>
        <input type="text" placeholder="Domicilio" name="domicilio" id="domicilio" class="inputDomicilio">
        <label for="fecha">Fecha de Entrega:</label>
        <input type="date" placeholder="Fecha de Entrega" name="fecha" id="fecha" class="fecha" min="${hoy}">
        `;
    listaAgregados.appendChild(formulario);
}

comprar.addEventListener('click', () => {
    const comprado = document.createElement("div");
    comprado.classList.add("comprado");
    comprado.innerHTML = `
        <p class="texto">Ha realizado su compra de manera exitosa</p>
        `;
    listaAgregados.appendChild(comprado);
})


const calcularTotal = () => {
    let acum = 0;
    let actual;
    for (const producto of carrito) {
        acum += producto.precio
    }
    return acum
}