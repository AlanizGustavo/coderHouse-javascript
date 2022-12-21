let opcion;
let seguir;
let seguirMenu;
let pedidos = [];

// CLASES
class Pedidos {
    constructor(pedido, fecha, aDomicilio, direccion) {
        this.pedido = pedido;
        this.fecha = fecha;
        this.aDomicilio = aDomicilio;
        this.direccion = direccion;
    }
}
class Productos {
    constructor(nombre, ingredientes, puntaje, frio) {
        this.nombre = nombre;
        this.ingredientes = ingredientes;
        this.puntaje = puntaje;
        this.frio = frio;
    }
}

// PRODUCTOS EN CATALOGO

const catalogo = [
    new Productos("Brownie", ["chocolate", "azucar", "harina", "huevos"], 100, false),
    new Productos("Cheesecake", ["queso crema", "crema", "rayadura de limon", "jugo de limon", "almidon"], 90, true),
    new Productos("Frambuesas Bañadas", ["frambuesas", "chocolate blanco", "chocolate negro"],95, true),
    new Productos("Cuadrados de limon", ["huevos", "harina", "azucar", "azucar impalpable", "jugo de limon", "rayadura de limon"],70, true),
    new Productos("Alfajores de Maicena", ["harina", "Maicena", "dulce de leche", "huevos", "azucar"], 85, false),
    new Productos("Macarons", ["harina de almendra", "claras de huevo", "merengue", "ganache"], 100, false),
    new Productos("Torta Brownie", ["chocolate", "azucar", "harina", "huevos", "merengue"], 87, false),
    new Productos("Mini budines", ["harina", "manteca", "azucar", "frutos rojos", "huevos"], 80, false)
]

// Funcion que encuentra el primer producto que coincida dentro del catalogo
const buscarProducto = (pedido) => {
    return catalogo.find( producto => producto.nombre.toLowerCase() === pedido);
}


// Funcion para crear instancias de la clase Pedidos de acuerdo a lo ingresado 
const crearPedido = () => {
    let busqueda = prompt("Que desea llevar?").toLowerCase();
    let pedido = buscarProducto(busqueda);

    if (pedido) {
        let fecha = prompt("Para que fecha lo necesita?");
        let aDomicilio = confirm("Es a domicilio?");

        if (aDomicilio) {
            let direccion = prompt("Ingrese la direccion");
            pedidos.push(new Pedidos(pedido, fecha, aDomicilio, direccion));
        }
        else{
            pedidos.push(new Pedidos(pedido, fecha, aDomicilio, null));
        }
    }
    else{
        alert("No se encuentra el producto buscado en el catalogo")
    }
}

// Ciclo para agregar pedidos a la compra, que se repite hasta que se seleccione que no se desea agregar pedidos
const realizarPedido = () => {
    do {
        crearPedido();
        seguir = confirm("Deseas seguir agregando pedidos?")
    } while (seguir);
} 

// Funcion que recorre el arreglo de pedidos y retorna una concatenacion de productos agregados
const imprimirPedidos = () => {
    let element = pedidos[0].pedido.nombre;
    for (let i = 1; i < pedidos.length; i++) {
        element += `, ${pedidos[i].pedido.nombre}`;    
    }
    return element;
}

// Funcion que devuelve string de todos atributos del catalogo y sus valores
const imprimirCatalogo = (cat) => {
    let info = "";
    cat.forEach( producto => {
        info += `Producto: ${producto.nombre}\nIngredientes: ${producto.ingredientes}\nPuntaje: ${producto.puntaje}\nFrio: ${producto.frio}\n\n`
    });
    return info;
}

// Menu de opciones para ver el catalogo segun el orden requerido
const verCatalogo = () => {
    do {
        opcion = prompt("Como desea ordenar el catalogo?\n1. Orden alfabetico ascendente\n2. Orden alfabetico descendente\n3. Filtrar productos\n4. Mejor puntuados");      
    } while (opcion < 0 || opcion > 4);
    switch (+opcion) {
        case 1:
            alert(imprimirCatalogo(catalogo.sort( (a,b) => a.nombre.localeCompare(b.nombre))));
            break;
        case 2:
            alert(imprimirCatalogo(catalogo.sort( (a,b) => b.nombre.localeCompare(a.nombre))));
            break;
        case 3:
            const filtrar = prompt("Ingrese el nombre del producto por el que desea filtrar").toLowerCase();
            alert(imprimirCatalogo(catalogo.filter(productos => productos.nombre.toLowerCase().includes(filtrar))))
            break;        
        case 4:
            alert(imprimirCatalogo(catalogo.sort( (a,b) => {
                return b.puntaje-a.puntaje;
            })));
            break;
    }
}

// Menu principal
const menu = () => {
    do {
        opcion = prompt("Que accion desea realizar?\n1. Ver catalogo\n2. Realizar pedido");
    } while (opcion < 0 || opcion > 2);
    switch (+opcion) {
        case 1:
            verCatalogo();
            break;
        case 2:
            realizarPedido();
            break;
        default:
            break;
    }
}

const app = () => {
    do {
        menu();
        seguirMenu = confirm("Deseas realizar otra operacion?")
    } while (seguirMenu);
}

// Ejecuta el algoritmo
app();

if (pedidos.length > 0) {
    alert(`Se ha realizado ${pedidos.length} pedidos: ${imprimirPedidos()}`);
}
