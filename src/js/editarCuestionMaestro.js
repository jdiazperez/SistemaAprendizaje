var datos;
var idCuestion;
var cuestion;
var numSoluciones;
var numRazonamientos = [];
var sectionCuestion;

function mostrarCuestion() {
    datos = JSON.parse(localStorage.getItem("datos"));
    idCuestion = localStorage.getItem("editarCuestion");
    cuestion = datos.cuestiones[idCuestion - 1];
    numSoluciones = cuestion.soluciones.length;

    for (var i = 0; i < numSoluciones; i++) {
        if (cuestion.soluciones[i].hasOwnProperty("razonamientos")) {
            numRazonamientos[i] = cuestion.soluciones[i].razonamientos.length;
        }
    }

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

function rellenarCampos(containerEnunciado) {
    containerEnunciado.querySelector("#enunciado").value = cuestion.enunciado;
    if (cuestion.disponible) {
        containerEnunciado.querySelector("#disponible").checked = true;
    }
    if (cuestion.hasOwnProperty("soluciones")) {
        var soluciones = cuestion.soluciones;

        for (var i = 1; i <= soluciones.length; i++) {
            rellenarSolucion(soluciones[i - 1], i);
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
            '<button class="btn btn-success" onclick="corregirSolucion(' + i + ')"><i class="fas fa-check-circle mr-2"></i>Corregir Solución</button>' +
            '<button class="btn btn-danger ml-3" onclick="eliminar(solucion' + i + ')"><i class="fas fa-trash-alt mr-2"></i>Eliminar Solución</button>' +
            '</div>';
        containerSolucion.appendChild(divOpcionesSolucion);
    } else {
        claseContainerSolucion = "container bg-light border p-4 mt-2";
        titulo = "Solución " + i;
        claseTitulo = "text-primary";
        containerSolucion = crearContainerSolucion(solucion.respuesta, claseContainerSolucion, titulo, claseTitulo, i);
        sectionCuestion.appendChild(containerSolucion);

        if (solucion.correcta) {
            containerSolucion.querySelector("#correcta" + i).checked = true;

            var divEliminarSolucion = document.createElement("div");
            divEliminarSolucion.innerHTML =
                '<div class="row mt-3 ml-1">' +
                '<button class="btn btn-danger" onclick="eliminar(solucion' + i + ')"><i class="fas fa-trash-alt mr-2"></i>Eliminar Solución</button>' +
                '</div>';
            containerSolucion.appendChild(divEliminarSolucion);

        } else {
            containerSolucion.querySelector("#incorrecta" + i).checked = true;

            for (var j = 1; j <= solucion.razonamientos.length; j++) {

                rellenarRazonamiento(containerSolucion, solucion.razonamientos[j - 1], i, j);
            }

            containerSolucion.appendChild(document.createElement("hr"));

            var divOpcionesSolucion = crearDivOpcionesSolucion(i, j);
            containerSolucion.appendChild(divOpcionesSolucion);

        }
    }
}

function crearContainerSolucion(respuesta, claseContainerSolucion, titulo, claseTitulo, i) {
    var containerSolucion = document.createElement("div");
    containerSolucion.id = "solucion" + i;
    containerSolucion.className = claseContainerSolucion;
    containerSolucion.innerHTML =
        '<div class="form-group">' +
        '<label for="textSolucion' + i + '"><h4 class="' + claseTitulo + '">' + titulo + '</h4></label>' +
        '<textarea id="textSolucion' + i + '" rows="3" class="form-control" placeholder="Introducir la respuesta">' +
        respuesta +
        '</textarea>' +
        '</div>' +
        '<div class="row">' +
        '<div class="custom-control custom-radio ml-3">' +
        '<input type="radio" id="correcta' + i + '" name="tipoSolucion' + i + '" class="custom-control-input">' +
        '<label for="correcta' + i + '" class="custom-control-label">Solución Correcta</label>' +
        '</div>' +
        '<div class="custom-control custom-radio ml-3">' +
        '<input type="radio" id="incorrecta' + i + '" name="tipoSolucion' + i + '" class="custom-control-input">' +
        '<label for="incorrecta' + i + '" class="custom-control-label">Solución Incorrecta</label>' +
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
        divRazonamiento = crearDivRazonamiento(razonamiento.texto, claseDivRazonamiento, titulo, claseTitulo, i, j);

        var divOpcionesRazonamiento = document.createElement("div");
        divOpcionesRazonamiento.className = "row mt-3 ml-2";
        divOpcionesRazonamiento.innerHTML =
            '<button class="btn btn-success" onclick="corregirRazonamiento(' + i + ', ' + j + ')"><i class="fas fa-check-circle mr-2"></i>Corregir Razonamiento</button>' +
            '<button class="btn btn-warning ml-3"><i class="fas fa-trash-alt mr-2"></i>Eliminar Razonamiento</button>';
        divRazonamiento.appendChild(divOpcionesRazonamiento);

    } else {
        claseDivRazonamiento = "";
        titulo = "Razonamiento " + j;
        claseTitulo = "text-info";
        divRazonamiento = crearDivRazonamiento(razonamiento.texto, claseDivRazonamiento, titulo, claseTitulo, i, j);

        if (razonamiento.justificado) {
            divRazonamiento.querySelector("#justificado" + j + "Solucion" + i).checked = true;

        } else {
            divRazonamiento.querySelector("#injustificado" + j + "Solucion" + i).checked = true;

            var divError = crearDivError(i, j, razonamiento.error);
            divRazonamiento.appendChild(divError);
        }
        var divEliminarRazonamiento = crearDivEliminarRazonamiento();
        divRazonamiento.appendChild(divEliminarRazonamiento);

    }
    containerSolucion.appendChild(document.createElement("hr"));
    containerSolucion.appendChild(divRazonamiento);
}

function crearDivRazonamiento(textoRazonamiento, claseDivRazonamiento, titulo, claseTitulo, i, j) {

    var divRazonamiento = document.createElement("div");
    divRazonamiento.id = "razonamiento" + j + "Solucion" + i;
    divRazonamiento.className = claseDivRazonamiento;
    divRazonamiento.innerHTML =
        '<div class="form-group mt-3 ml-2">' +
        '<label for="textRazonamiento' + j + 'solucion' + i + '"><h5 class="' + claseTitulo + '">' + titulo + '</h5></label>' +
        '<textarea id="textRazonamiento' + j + 'solucion' + i + '" rows="3" class="form-control" placeholder="Introducir el razonamiento a la respuesta">' +
        textoRazonamiento +
        '</textarea>' +
        '</div>' +
        '<div class="row">' +
        '<div class="custom-control custom-radio ml-4">' +
        '<input type="radio" id="justificado' + j + 'Solucion' + i + '" name="tipoRazonamiento' + j + 'Solucion' + i + '" class="custom-control-input">' +
        '<label for="justificado' + j + 'Solucion' + i + '" class="custom-control-label">Razonamiento Justificado</label>' +
        '</div>' +
        '<div class="custom-control custom-radio ml-3">' +
        '<input type="radio" id="injustificado' + j + 'Solucion' + i + '" name="tipoRazonamiento' + j + 'Solucion' + i + '" class="custom-control-input">' +
        '<label for="injustificado' + j + 'Solucion' + i + '" class="custom-control-label">Razonamiento Injustificado</label>' +
        '</div>' +
        '</div>' +
        '</div>';

    return divRazonamiento;

}

function crearDivOpcionesSolucion(i, j) {
    var divOpcionesSolucion = document.createElement("div");
    divOpcionesSolucion.id = "opciones" + i;
    divOpcionesSolucion.innerHTML =
        '<div class="row mt-3 ml-1">' +
        '<button class="btn btn-info" onclick="añadirRazonamiento(' + i + ')"><i class="far fa-comment-alt mr-2"></i>Añadir Razonamiento</button>' +
        '<button class="btn btn-danger ml-3" onclick="eliminar(solucion' + i + ')"><i class="fas fa-trash-alt mr-2"></i>Eliminar Solución</button>' +
        '</div>';
    return divOpcionesSolucion;
}

function crearDivError(i, j, textoError) {
    var divError = document.createElement("div");
    divError.innerHTML =
        '<div class="form-group mt-3 ml-2">' +
        '<label for="error' + j + 'Solucion' + i + '"><h6 class="text-danger">Error</h6></label>' +
        '<textarea id="error' + j + 'Solucion' + i + '" rows="3" class="form-control" placeholder="Introducir el error del razonamiento">' +
        textoError +
        '</textarea>' +
        '</div>';
    return divError
}

function crearDivEliminarRazonamiento() {
    var divEliminarRazonamiento = document.createElement("div");
    divEliminarRazonamiento.innerHTML =
        '<div class="row mt-3 ml-2">' +
        '<button class="btn btn-warning"><i class="fas fa-trash-alt mr-2"></i>Eliminar Razonamiento</button>' +
        '</div>';
    return divEliminarRazonamiento;
}

function nuevaSolucion() {
    var containerSolucion;
    var titulo;
    var claseTitulo;
    var claseContainerSolucion;
    var divEliminarSolucion;

    numSoluciones++;

    claseContainerSolucion = "container bg-light border p-4 mt-2";
    titulo = "Solución " + numSoluciones;
    claseTitulo = "text-primary";
    containerSolucion = crearContainerSolucion("", claseContainerSolucion, titulo, claseTitulo, numSoluciones);
    sectionCuestion.appendChild(containerSolucion);

    divEliminarSolucion = document.createElement("div");
    divEliminarSolucion.innerHTML =
        '<div class="row mt-3 ml-1">' +
        '<button class="btn btn-danger" onclick="eliminar(solucion' + numSoluciones + ')"><i class="fas fa-trash-alt mr-2"></i>Eliminar Solución</button>' +
        '</div>';
    containerSolucion.appendChild(divEliminarSolucion);
    containerSolucion.scrollIntoView();

}

function eliminar(elem) {
    elem.parentNode.removeChild(elem);
}

function corregirSolucion(i) {
    var solucion = cuestion.soluciones[i - 1];
    var containerSolucion = document.querySelector("#solucion" + i);

    solucion.propuestaPorAlumno = false;

    if (document.querySelector("#correcta" + i).checked == true) {
        solucion.correcta = true;
    } else {
        solucion.correcta = false;
        solucion.razonamientos = [];
    }
    eliminar(containerSolucion);
    rellenarSolucion(solucion, i);
    document.querySelector("#solucion" + i).scrollIntoView();

}

function añadirRazonamiento(i) {
    numRazonamientos[i - 1]++;

    var claseDivRazonamiento = "";
    var titulo = "Razonamiento " + numRazonamientos[i - 1];
    var claseTitulo = "text-info";
    var divRazonamiento = crearDivRazonamiento("", claseDivRazonamiento, titulo, claseTitulo, i, numRazonamientos[i - 1]);

    var divEliminarRazonamiento = crearDivEliminarRazonamiento();
    divRazonamiento.appendChild(divEliminarRazonamiento);

    var containerSolucion = document.querySelector("#solucion" + i);
    var divOpcionesSolucion = document.querySelector("#opciones" + i);

    containerSolucion.insertBefore(divRazonamiento, divOpcionesSolucion);
    containerSolucion.insertBefore(document.createElement("hr"), divOpcionesSolucion);

}

function corregirRazonamiento(i, j) {
    var razonamiento = cuestion.soluciones[i - 1].razonamientos[j - 1];
    var containerSolucion = document.querySelector("#solucion" + i);
    var anteriorDivRazonamiento = document.querySelector("#razonamiento" + j + "Solucion" + i);

    var claseDivRazonamiento = "";
    var titulo = "Razonamiento " + j;
    var claseTitulo = "text-info";
    var nuevoDivRazonamiento = crearDivRazonamiento(razonamiento.texto, claseDivRazonamiento, titulo, claseTitulo, i, j);

    if (document.querySelector("#justificado" + j + "Solucion" + i).checked == true) {
        razonamiento.justificado = true;
    } else {
        razonamiento.justificado = false;
        var divError = crearDivError(i, j, "");
        nuevoDivRazonamiento.appendChild(divError);
    }

    var divEliminarRazonamiento = crearDivEliminarRazonamiento();
    nuevoDivRazonamiento.appendChild(divEliminarRazonamiento);

    containerSolucion.insertBefore(nuevoDivRazonamiento, anteriorDivRazonamiento);
    eliminar(anteriorDivRazonamiento);

    if (razonamiento.justificado) {
        document.querySelector("#justificado" + j + "Solucion" + i).checked = true;
    } else {
        document.querySelector("#injustificado" + j + "Solucion" + i).checked = true;
    }
}
