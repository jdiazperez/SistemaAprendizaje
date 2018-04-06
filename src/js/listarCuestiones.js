var datos;

function actualizarUsuarioIdentificado() {
    var navLinkUsuario = document.querySelector("#usuarioIdentificado");
    var usuarioIdentificado = JSON.parse(localStorage.getItem("usuarioIdentificado"));
    navLinkUsuario.textContent = usuarioIdentificado.tipo + ": " + usuarioIdentificado.nombre;
}

function listarCuestiones() {
    datos = JSON.parse(localStorage.getItem("datos"));
    var containerCuestiones = document.querySelector("#containerCuestiones");

    for (var i = 0; i < datos.cuestiones.length; i++) {
        var rowCuestion = document.createElement("div");
        rowCuestion.id = "cuestion" + (i + 1);
        rowCuestion.className = "row bg-light py-2 align-items-center cuestion";
        rowCuestion.innerHTML =
            "<div class='col-sm'>" +
            "<a href='editarCuestionMaestro.html' id='editarCuestion" + (i + 1) + "'" + "class='h6 text-primary ml-2'>" + datos.cuestiones[i].enunciado + "</a>" +
            "</div>" +
            "<div class='col-sm-2'>" +
            "<button id='eliminarCuestion" + (i + 1) + "'" + "class='btn btn-danger btn-sm'>" +
            "<i class='fas fa-trash-alt fa-sm mr-1'></i>Eliminar" +
            "</button>" +
            "</div>";
        containerCuestiones.appendChild(rowCuestion);
    }

}

function agregarListeners() {
    var btnNuevaCuestion = document.querySelector("#nuevaCuestion");
    btnNuevaCuestion.addEventListener("click", nuevaCuestion);

    var rowsCuestiones = document.querySelectorAll(".cuestion");

    for (var i = 0; i < rowsCuestiones.length; i++) {
        var enlaceEditar = rowsCuestiones[i].querySelector("a");
        enlaceEditar.addEventListener("click", editarCuestion);
        var btnEliminar = rowsCuestiones[i].querySelector("button");
        btnEliminar.addEventListener("click", eliminarCuestion);
    }
}

function editarCuestion() {
    localStorage.setItem("editarCuestion", this.id.substring(14));

}

function eliminarCuestion() {
    datos.cuestiones.splice(this.id.substring(16) - 1, 1);
    localStorage.setItem("datos", JSON.stringify(datos));
    location.reload();
}

function nuevaCuestion() {
    localStorage.setItem("editarCuestion", datos.cuestiones.length + 1);
}
