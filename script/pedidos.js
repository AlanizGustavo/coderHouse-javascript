let opcion;
let seguir;
let pedidos = [];

let seguirComprando = () => {
    seguir = confirm("Deseas seguir agregando pedidos?")
}

class Pedidos {
    constructor(pedido, fecha, aDomicilio, direccion) {
        this.pedido = pedido;
        this.fecha = fecha;
        this.aDomicilio = aDomicilio;
        this.direccion = direccion;
    }
}

let realizarPedido = () => {
    do {
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
        seguirComprando();
    } while (seguir);
} 

realizarPedido();

console.log(pedidos)