let opcion;
let seguir;
let pedidos = [];

// Clase para crear Pedidos
class Pedidos {
    constructor(pedido, fecha, aDomicilio, direccion) {
        this.pedido = pedido;
        this.fecha = fecha;
        this.aDomicilio = aDomicilio;
        this.direccion = direccion;
    }
}


// Funcion para crear instancias de la clase Pedidos de acuerdo a lo ingresado 
let crearPedido = () => {
    let pedido = prompt("Que desea llevar?");
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

// Ciclo para agregar pedidos a la compra, que se repite hasta que se seleccione que no se desea agregar pedidos
let realizarPedido = () => {
    do {
        crearPedido();
        seguir = confirm("Deseas seguir agregando pedidos?")
    } while (seguir);
} 

// Funcion que recorre el arreglo de pedidos y retorna una concatenacion de productos agregados
let imprimirPedidos = () => {
    let element = pedidos[0].pedido;
    for (let i = 1; i < pedidos.length; i++) {
        element += `, ${pedidos[i].pedido}`;    
    }
    return element;
}

// Ejecuta el algoritmo
realizarPedido();

alert('Se ha realizado '+ pedidos.length + ' pedidos: ' + imprimirPedidos());
console.log(pedidos)