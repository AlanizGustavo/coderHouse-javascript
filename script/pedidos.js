const grid = document.querySelector('.grid');
const producto = document.querySelector('#nombre');

const productos = [];

let btnCarrito;


let filtroNombre;
let carrito = [];

class Producto {
    constructor(id, nombre, imagen, texto, precio){
        this.id = id;
        this.nombre = nombre;
        this.imagen = imagen;
        this.texto = texto;
        this.precio = precio;  
    }
    
    render() {
        const card = document.createElement("div");
        card.classList.add("card");
        card.innerHTML = `
            <img src="${this.imagen}" alt="${this.nombre}">
            <p class="texto textoAparece">${this.texto}</p>
            <div class="descripcion">
                <p class="texto">${this.nombre}</p>
                <p class="texto">$${this.precio}</p>
                <button id="${this.id}" class="agregarCarrito" type="button">Agregar al carrito</button>
            </div>
            `;
        grid.appendChild(card);
    }

    funcionalidadBtn(){
        btnCarrito = document.getElementById(`${this.id}`);
        btnCarrito.addEventListener('click', () => {
            carrito.push(this);
            sessionStorage.setItem('carrito', JSON.stringify(carrito));
            Toastify({
                text: "Producto agregado al carrito",
                duration: 3000,
                newWindow: true,
                close: false,
                gravity: "bottom", 
                position: "center", 
                style: {
                    background: "#f19ccc",
                },
            }).showToast();
        })
    }
    
}

// CARGA INICIAL DE LAS CARDS Y CREACION DE LAS INSTANCIAS DE PRODUCTO
let cargaInicial = async () => {
    if(productos.length===0){
        const requestInicial = await fetch(`../productos.json`);
        const prodJSON = await requestInicial.json();
        prodJSON.forEach( element => {
            productos.push(new Producto(element.id, element.nombre, element.imagen, element.texto, element.precio));
        })   
    }
    
    productos.forEach( producto => {
        producto.render()
        producto.funcionalidadBtn();
    })
}

//FUNCION PARA RENDERIZAR LA CARD EN CASO DE NO HABER COINCIDENCIA CON LO INGRESADO EN EL FILTRO
let agregarCardNoEncontrado = function(element){
        
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
                element.render();
                element.funcionalidadBtn();
            })
        }
        else{
            const noEncontrado = {
                imagen:"../assets/img/brownie_cake.JPG",
                nombre: "NO ENCONTRADO",
                texto: "No se encontro coicidencia"
            };
            grid.innerHTML="";
            agregarCardNoEncontrado(noEncontrado);
        }
    }
    
}  



nombre.addEventListener("keyup", filtrar);

cargaInicial();




// LOGICA DEL MODAL

const popup = document.querySelector('#modal');
const modalAbrir = document.querySelector('.miCarrito')
const modalCerrar = document.querySelector('#cerrarModal')
const listaAgregados = document.querySelector('.productosAgregados');
const formulario = document.querySelector('.formulario');

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

//FUNCION PARA MOSTRAR EL INPUT PARA INGRESAR EL DOMICILIO EN CASO DE QUE EL INPUT RADIO 'Si' ESTE SELECCIONADO
const cargaEventoInput = () => {
    let radioBtns = document.querySelectorAll("input[name='domicilio']")
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


//FUNCION QUE RENDERIZA CADA FILA DE PRODUCTOS DENTRO DEL MODAL 
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

//FUNCION QUE DA FUNCIONALIDAD A LOS BOTONES ELIMINAR DENTRO DEL MODAL DE COMPRA
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

//EXPRESIONES REGULARES PARA REALIZAR VALIDACIONES AL MOMENTO DE LA COMPRA.
const expresiones = {
	nombre: /^[a-zA-ZÀ-ÿ\s]{1,40}$/, // Letras y espacios, pueden llevar acentos.
    fecha: /^\d{4}([\-/.])(0?[1-9]|1[1-2])\1(3[01]|[12][0-9]|0?[1-9])$/,
    domicilio: /^[a-zA-Z0-9]{4,16}$/, // Letras, numeros
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
                    <input type="radio" placeholder="No" name="domicilio" id="domicilioNo" class="radioNo" value="No" required="required" checked>
                </label>    
            </div>
            <input type="text" placeholder="Domicilio" name="inputDomicilio" id="inputDomicilio" class="inputDomicilio" required="required">
            <label for="fecha">Fecha de Entrega:</label>
            <input type="date" placeholder="Fecha de Entrega" name="fecha" id="fecha" class="fecha" min="${hoy}" required="required">
            <div class="centrarBtn">
                <button id="comprar" type="submit">Comprar</button>
            </div>    
        </form>
        `;
    listaAgregados.appendChild(formulario);

    const inputNombre = document.getElementById('nombreApellido');
    const inputFecha = document.getElementById('fecha')
    const comprar = document.querySelector('#comprar')

    comprar.addEventListener('click', (e) => {
        if(expresiones.nombre.test(inputNombre.value) && expresiones.fecha.test(inputFecha.value)){
            let seleccionado = document.querySelector("input[name='domicilio']:checked").value
            if(seleccionado === 'Si'){
                inputDomicilio = document.querySelector('.inputDomicilio');
                if(expresiones.domicilio.test(inputDomicilio.value)){
                    compraExitosa();
                }
                
            }else{
                compraExitosa();
            }
        }
    })
}

const compraExitosa = () => {
    popup.close();
    listaAgregados.innerHTML = '';
    sessionStorage.clear();
    Swal.fire({
        title: 'Ha realizado su compra de manera exitosa',
        text: 'Que disfrutes tu pedido',
        icon: 'success',
        returnFocus: true,
        backdrop: true,
        confirmButtonText: 'OK'
    })
}



const calcularTotal = () => {
    let acum = 0;
    let actual;
    for (const producto of carrito) {
        acum += producto.precio
    }
    return acum
}