var datos;
var idCuestion;
var cuestion;
var numSoluciones;
var sectionCuestion;

function mostrarCuestion() {
    datos = JSON.parse(localStorage.getItem("datos"));
    idCuestion = localStorage.getItem("editarCuestion");
    cuestion = datos.cuestiones[idCuestion - 1];
    numSoluciones = cuestion.soluciones.length;

    sectionCuestion = document.querySelector("#cuestion");

    var containerEnunciado = document.createElement("div");
    containerEnunciado.className = "container bg-light border p-4 mt-5";
    containerEnunciado.innerHTML =
        "<div class='form-group'>" +
        "<label for='enunciado'><h4 class='text-primary'>Enunciado</h4></label>" +
        "<input type='text' id='enunciado' class='form-control' placeholder='Introducir la pregunta'>" +
        "</div>" +
        "<div class='row'>" +
        "<div class='custom-control custom-checkbox ml-3'>" +
        "<input type='checkbox' class='custom-control-input' id='disponible'>" +
        "<label for='disponible' class='custom-control-label'>Disponible para los aprendices</label>" +
        "</div>" +
        "</div>" +
        "<div class='row mt-3 ml-1'>" +
        "<button class='btn btn-primary' onclick='nuevaSolucion()'><i class='fa fa-comment mr-2'></i>Nueva Solución</button>" +
        "</div>";
    sectionCuestion.appendChild(containerEnunciado);

    if (cuestion !== undefined) {
        rellenarCampos(containerEnunciado);
    }
}

function nuevaSolucion() {
    var containerSolucion;
    var titulo;
    var claseTitulo;
    var claseContainerSolucion;
    var divEliminarSolucion;

    claseContainerSolucion = "container bg-light border p-4 mt-2";
    titulo = "Solución " + (numSoluciones + 1);
    claseTitulo = "text-primary";
    containerSolucion = crearContainerSolucion("", claseContainerSolucion, titulo, claseTitulo, numSoluciones);
    numSoluciones++;
    sectionCuestion.appendChild(containerSolucion);
    
    divEliminarSolucion = document.createElement("div");
    divEliminarSolucion.innerHTML =
        '<div class="row mt-3 ml-1">' +
        '<button class="btn btn-danger"><i class="fas fa-trash-alt mr-2"></i>Eliminar Solución</button>' +
        '</div>';
    containerSolucion.appendChild(divEliminarSolucion);
    containerSolucion.scrollIntoView();

}

function rellenarCampos(containerEnunciado) {
    containerEnunciado.querySelector("#enunciado").value = cuestion.enunciado;
    if (cuestion.disponible) {
        containerEnunciado.querySelector("#disponible").checked = true;
    }
    if (cuestion.hasOwnProperty("soluciones")) {
        var soluciones = cuestion.soluciones;

        for (var i = 0; i < soluciones.length; i++) {
            rellenarSolucion(soluciones[i], i);
        }
    }
}

function rellenarSolucion(solucion, i) {
    var containerSolucion;
    var titulo;
    var claseTitulo;
    var claseContainerSolucion;

    if (solucion.propuestaPorAlumno) {
        claseContainerSolucion = "container bg-light border border-info p-4 mt-2";
        titulo = "¡¡¡Propuesta de Solución!!!";
        claseTitulo = "text-light bg-info";
        containerSolucion = crearContainerSolucion(solucion.respuesta, claseContainerSolucion, titulo, claseTitulo, i);
        sectionCuestion.appendChild(containerSolucion);

        var divOpcionesSolucion = document.createElement("div");
        divOpcionesSolucion.innerHTML =
            '<div class="row mt-3 ml-1">' +
            '<button class="btn btn-success"><i class="fas fa-check-circle mr-2"></i>Corregir Solución</button>' +
            '<button class="btn btn-danger ml-3"><i class="fas fa-trash-alt mr-2"></i>Eliminar Solución</button>' +
            '</div>';
        containerSolucion.appendChild(divOpcionesSolucion);
    } else {
        claseContainerSolucion = "container bg-light border p-4 mt-2";
        titulo = "Solución " + (i + 1);
        claseTitulo = "text-primary";
        containerSolucion = crearContainerSolucion(solucion.respuesta, claseContainerSolucion, titulo, claseTitulo, i);
        sectionCuestion.appendChild(containerSolucion);

        if (solucion.correcta) {
            containerSolucion.querySelector("#correcta" + (i + 1)).checked = true;

            var divEliminarSolucion = document.createElement("div");
            divEliminarSolucion.innerHTML =
                '<div class="row mt-3 ml-1">' +
                '<button class="btn btn-danger"><i class="fas fa-trash-alt mr-2"></i>Eliminar Solución</button>' +
                '</div>';
            containerSolucion.appendChild(divEliminarSolucion);

        } else {
            containerSolucion.querySelector("#incorrecta" + (i + 1)).checked = true;

            for (var j = 0; j < solucion.razonamientos.length; j++) {

                rellenarRazonamiento(containerSolucion, solucion.razonamientos[j], i, j);
            }

            containerSolucion.appendChild(document.createElement("hr"));

            var divOpcionesSolucion = document.createElement("div");
            divOpcionesSolucion.innerHTML =
                '<div class="row mt-3 ml-1">' +
                '<button class="btn btn-info"><i class="far fa-comment-alt mr-2"></i>Añadir Razonamiento</button>' +
                '<button class="btn btn-danger ml-3"><i class="fas fa-trash-alt mr-2"></i>Eliminar Solución</button>' +
                '</div>';
            containerSolucion.appendChild(divOpcionesSolucion);

        }
    }
}

function crearContainerSolucion(respuesta, claseContainerSolucion, titulo, claseTitulo, i) {
    var containerSolucion = document.createElement("div");
    containerSolucion.id = "solucion" + (i + 1);
    containerSolucion.className = claseContainerSolucion;
    containerSolucion.innerHTML =
        '<div class="form-group">' +
        '<label for="textSolucion' + (i + 1) + '"><h4 class="' + claseTitulo + '">' + titulo + '</h4></label>' +
        '<textarea id="textSolucion' + (i + 1) + '" rows="3" class="form-control" placeholder="Introducir la respuesta">' +
        respuesta +
        '</textarea>' +
        '</div>' +
        '<div class="row">' +
        '<div class="custom-control custom-radio ml-3">' +
        '<input type="radio" id="correcta' + (i + 1) + '" name="tipoSolucion' + (i + 1) + '" class="custom-control-input">' +
        '<label for="correcta' + (i + 1) + '" class="custom-control-label">Solución Correcta</label>' +
        '</div>' +
        '<div class="custom-control custom-radio ml-3">' +
        '<input type="radio" id="incorrecta' + (i + 1) + '" name="tipoSolucion' + (i + 1) + '" class="custom-control-input">' +
        '<label for="incorrecta' + (i + 1) + '" class="custom-control-label">Solución Incorrecta</label>' +
        '</div>' +
        '</div>';
    return containerSolucion;
}

function rellenarRazonamiento(containerSolucion, razonamiento, i, j) {
    var divRazonamiento;
    var claseDivRazonamiento;
    var titulo;
    var claseTitulo;

    if (razonamiento.propuestoPorAlumno) {
        claseDivRazonamiento = "border border-info";
        titulo = "¡¡¡Propuesta de Razonamiento!!!";
        claseTitulo = "text-light bg-info";
        divRazonamiento = crearDivRazonamiento(razonamiento, claseDivRazonamiento, titulo, claseTitulo, i, j);

        var divOpcionesRazonamiento = document.createElement("div");
        divOpcionesRazonamiento.className = "row mt-3 ml-2";
        divOpcionesRazonamiento.innerHTML =
            '<button class="btn btn-success"><i class="fas fa-check-circle mr-2"></i>Corregir Razonamiento</button>' +
            '<button class="btn btn-warning ml-3"><i class="fas fa-trash-alt mr-2"></i>Eliminar Razonamiento</button>';
        divRazonamiento.appendChild(divOpcionesRazonamiento);

    } else {
        claseDivRazonamiento = "";
        titulo = "Razonamiento " + (j + 1);
        claseTitulo = "text-info";
        divRazonamiento = crearDivRazonamiento(razonamiento, claseDivRazonamiento, titulo, claseTitulo, i, j);

        if (razonamiento.justificado) {
            divRazonamiento.querySelector("#justificado" + (j + 1) + "Solucion" + (i + 1)).checked = true;

        } else {
            divRazonamiento.querySelector("#injustificado" + (j + 1) + "Solucion" + (i + 1)).checked = true;

            var divError = document.createElement("div");
            divError.innerHTML =
                '<div class="form-group mt-3 ml-2">' +
                '<label for="error' + (j + 1) + 'Solucion' + (i + 1) + '"><h6 class="text-danger">Error</h6></label>' +
                '<textarea id="error' + (j + 1) + 'Solucion' + (i + 1) + '" rows="3" class="form-control">' +
                razonamiento.error +
                '</textarea>' +
                '</div>';
            divRazonamiento.appendChild(divError);
        }

        var divEliminarRazonamiento = document.createElement("div");
        divEliminarRazonamiento.innerHTML =
            '<div class="row mt-3 ml-2">' +
            '<button class="btn btn-warning"><i class="fas fa-trash-alt mr-2"></i>Eliminar Razonamiento</button>' +
            '</div>';
        divRazonamiento.appendChild(divEliminarRazonamiento);

    }
    containerSolucion.appendChild(document.createElement("hr"));
    containerSolucion.appendChild(divRazonamiento);
}

function crearDivRazonamiento(razonamiento, claseDivRazonamiento, titulo, claseTitulo, i, j) {

    var divRazonamiento = document.createElement("div");
    divRazonamiento.className = claseDivRazonamiento;
    divRazonamiento.innerHTML =
        '<div class="form-group mt-3 ml-2">' +
        '<label for="razonamiento' + (j + 1) + 'solucion' + (i + 1) + '"><h5 class="' + claseTitulo + '">' + titulo + '</h5></label>' +
        '<textarea id="razonamiento' + (j + 1) + 'solucion' + (i + 1) + '" rows="3" class="form-control" placeholder="Introducir el razonamiento a la respuesta">' +
        razonamiento.texto +
        '</textarea>' +
        '</div>' +
        '<div class="row">' +
        '<div class="custom-control custom-radio ml-4">' +
        '<input type="radio" id="justificado' + (j + 1) + 'Solucion' + (i + 1) + '" name="tipoRazonamiento' + (j + 1) + 'Solucion' + (i + 1) + '" class="custom-control-input">' +
        '<label for="justificado' + (j + 1) + 'Solucion' + (i + 1) + '" class="custom-control-label">Razonamiento Justificado</label>' +
        '</div>' +
        '<div class="custom-control custom-radio ml-3">' +
        '<input type="radio" id="injustificado' + (j + 1) + 'Solucion' + (i + 1) + '" name="tipoRazonamiento' + (j + 1) + 'Solucion' + (i + 1) + '" class="custom-control-input">' +
        '<label for="injustificado' + (j + 1) + 'Solucion' + (i + 1) + '" class="custom-control-label">Razonamiento Injustificado</label>' +
        '</div>' +
        '</div>' +
        '</div>';

    return divRazonamiento;

}
