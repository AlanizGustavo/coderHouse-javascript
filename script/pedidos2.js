const grid = document.querySelector('.grid');
const producto = document.querySelector('#nombre');

let btnCarritos;


let filtroNombre;
let carrito = [];

class Producto {
    constructor(id, imagen, texto, precio){
        this.id = id;
        this.imagen = imagen;
        this.texto = texto;
        this.precio = precio;  
    }
    
    render(params) {
                
    }
}


let cargaInicial = async () => {
    const requestInicial = await fetch(`../productos.json`);

    const productos = await requestInicial.json();


    productos.forEach( element => {
        agregarCards(element);
    }),
    funcionalidadBtn(productos);
}
    
    
let agregarCards = function(element){
        
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
        <img src="${element.imagen}" alt="${element.nombre}">
        <p class="texto textoAparece">${element.texto}</p>
        <div class="descripcion">
            <p class="texto">${element.nombre}</p>
            <p class="texto">$${element.precio}</p>
            <button id="${element.id}" class="agregarCarrito" type="button">Agregar al carrito</button>
        </div>
        `;
    grid.appendChild(card);
}


//Funcion para filtrar los productos
const filtrar = async () => {
    filtroNombre = nombre.value.toLowerCase(); //este es un valor tomado de un input

    const requestInicial = await fetch(`../productos.json`);

    const productos = await requestInicial.json();

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
                funcionalidadBtn(productosFiltrados);
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
const funcionalidadBtn = (productos) => {
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
let inputRadio;
let radioSi;

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
        cargaEventoInput();
    }
    else{
        
        sinProductos();
    }
})

const cargaEventoInput = () => {
    radioBtns = document.querySelectorAll("input[name='domicilio']")
    inputDomicilio = document.querySelector('.inputDomicilio');
    radioBtns.forEach( radio => {
        radio.addEventListener('change', () => {
            let seleccionado = document.querySelector("input[name='domicilio']:checked")
            let valor=seleccionado.value;
            if(valor==="Si"){
                inputDomicilio.classList.toggle('show')
            }
            else{
                inputDomicilio.classList.toggle('show')
            }
        })
    })
}

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
                cargaEventoInput();
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
        <form>
            <input type="text" placeholder="Nombre y Apellido" name="nombreApellido" id="nombreApellido" class="inputNombre" required="required">
            <div class="inputRadio">
                <label for="domicilio">¿Es a domicilio?</label>
                <label for="domicilioSi">Si
                    <input type="radio" placeholder="Si" name="domicilio" id="domicilioSi" class="radioSi" value="Si" required="required">
                </label>
                <label for="domicilioNo">No
                    <input type="radio" placeholder="No" name="domicilio" id="domicilioNo" class="radioNo" value="No" required="required">
                </label>    
            </div>
            <input type="text" placeholder="Domicilio" name="inputDomicilio" id="inputDomicilio" class="inputDomicilio" required="required">
            <label for="fecha">Fecha de Entrega:</label>
            <input type="date" placeholder="Fecha de Entrega" name="fecha" id="fecha" class="fecha" min="${hoy}" required="required">
            <button type="submit">enviar</button>
        </form>
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