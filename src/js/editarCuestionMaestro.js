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
        } else {
            numRazonamientos[i] = 0;
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
    var containerSolucion = crearContainerSolucion(solucion.propuestaPorAlumno, solucion.respuesta, i);
    sectionCuestion.appendChild(containerSolucion);

    if (solucion.propuestaPorAlumno) {
        var divOpcionesSolucion = document.createElement("div");
        divOpcionesSolucion.id = "opciones" + i;
        divOpcionesSolucion.innerHTML =
            '<div class="row mt-3 ml-1">' +
            '<button class="btn btn-success" onclick="corregirSolucion(' + i + ')"><i class="fas fa-check-circle mr-2"></i>Corregir Solución</button>' +
            '<button class="btn btn-danger ml-3" onclick="eliminarSolucion(' + i + ')"><i class="fas fa-trash-alt mr-2"></i>Eliminar Solución</button>' +
            '</div>';
        containerSolucion.appendChild(document.createElement("hr"));
        containerSolucion.appendChild(divOpcionesSolucion);

    } else {
        if (solucion.correcta) {
            containerSolucion.querySelector("#correcta" + i).checked = true;

            containerSolucion.appendChild(document.createElement("hr"));
            var divEliminarSolucion = crearDivEliminarSolucion(i);
            containerSolucion.appendChild(divEliminarSolucion);

        } else {
            containerSolucion.querySelector("#incorrecta" + i).checked = true;

            for (var j = 1; j <= solucion.razonamientos.length; j++) {

                rellenarRazonamiento(containerSolucion, solucion.razonamientos[j - 1], i, j);
            }

            containerSolucion.appendChild(document.createElement("hr"));
            var divOpcionesSolucion = crearDivOpcionesSolucion(i);
            containerSolucion.appendChild(divOpcionesSolucion);
        }
    }
}

function crearContainerSolucion(propuestaPorAlumno, respuesta, i) {
    var containerSolucion;
    var claseContainerSolucion;
    var titulo;
    var claseTitulo;

    if (propuestaPorAlumno) {
        claseContainerSolucion = "container bg-light border border-info p-4 mt-2 propuestaPorAlumno";
        titulo = "¡¡¡Propuesta de Solución!!!";
        claseTitulo = "text-light bg-info";
    } else {
        claseContainerSolucion = "container bg-light border p-4 mt-2";
        titulo = "Solución " + i;
        claseTitulo = "text-primary";
    }
    containerSolucion = document.createElement("div");
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
        '<input type="radio" id="correcta' + i + '" name="tipoSolucion' + i + '" class="custom-control-input" onclick="marcarSolucionCorrecta(' + i + ')">' +
        '<label for="correcta' + i + '" class="custom-control-label">Solución Correcta</label>' +
        '</div>' +
        '<div class="custom-control custom-radio ml-3">' +
        '<input type="radio" id="incorrecta' + i + '" name="tipoSolucion' + i + '" class="custom-control-input" onclick="marcarSolucionIncorrecta(' + i + ')">' +
        '<label for="incorrecta' + i + '" class="custom-control-label">Solución Incorrecta</label>' +
        '</div>' +
        '</div>';
    return containerSolucion;
}

function rellenarRazonamiento(containerSolucion, razonamiento, i, j) {
    var divRazonamiento = crearDivRazonamiento(razonamiento.propuestoPorAlumno, razonamiento.texto, i, j);

    if (razonamiento.propuestoPorAlumno) {
        var divOpcionesRazonamiento = document.createElement("div");
        divOpcionesRazonamiento.className = "row mt-3 ml-2";
        divOpcionesRazonamiento.innerHTML =
            '<button class="btn btn-success" onclick="corregirRazonamiento(' + i + ', ' + j + ')"><i class="fas fa-check-circle mr-2"></i>Corregir Razonamiento</button>' +
            '<button class="btn btn-warning ml-3" onclick="eliminarRazonamiento(' + i + ', ' + j + ')"><i class="fas fa-trash-alt mr-2"></i>Eliminar Razonamiento</button>';
        divRazonamiento.appendChild(divOpcionesRazonamiento);

    } else {
        if (razonamiento.justificado) {
            divRazonamiento.querySelector("#justificado" + j + "Solucion" + i).checked = true;

        } else {
            divRazonamiento.querySelector("#injustificado" + j + "Solucion" + i).checked = true;

            var divError = crearDivError(i, j, razonamiento.error);
            divRazonamiento.appendChild(divError);
        }
        var divEliminarRazonamiento = crearDivEliminarRazonamiento(i, j);
        divRazonamiento.appendChild(divEliminarRazonamiento);

    }
    containerSolucion.appendChild(document.createElement("hr"));
    containerSolucion.appendChild(divRazonamiento);
}

function crearDivRazonamiento(propuestoPorAlumno, textoRazonamiento, i, j) {
    var divRazonamiento;
    var claseDivRazonamiento;
    var titulo;
    var claseTitulo;

    if (propuestoPorAlumno) {
        claseDivRazonamiento = "border border-info propuestoPorAlumno";
        titulo = "¡¡¡Propuesta de Razonamiento!!!";
        claseTitulo = "text-light bg-info";

    } else {
        claseDivRazonamiento = "";
        titulo = "Razonamiento " + j;
        claseTitulo = "text-info";
    }

    divRazonamiento = document.createElement("div");
    divRazonamiento.id = "razonamiento" + j + "Solucion" + i;
    divRazonamiento.className = claseDivRazonamiento;
    divRazonamiento.innerHTML =
        '<div class="form-group mt-3 ml-2">' +
        '<label id="labelTextRazonamiento' + j + 'solucion' + i + '" for="textRazonamiento' + j + 'solucion' + i + '"><h5 class="' + claseTitulo + '">' + titulo + '</h5></label>' +
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
        '<input type="radio" id="injustificado' + j + 'Solucion' + i + '" name="tipoRazonamiento' + j + 'Solucion' + i + '" class="custom-control-input" onclick="marcarRazonamientoInjustificado(' + i + ', ' + j + ')">' +
        '<label for="injustificado' + j + 'Solucion' + i + '" class="custom-control-label">Razonamiento Injustificado</label>' +
        '</div>' +
        '</div>' +
        '</div>';

    return divRazonamiento;
}

function crearDivEliminarSolucion(i) {
    var divEliminarSolucion = document.createElement("div");
    divEliminarSolucion.id = "opciones" + i;
    divEliminarSolucion.innerHTML =
        '<div class="row mt-3 ml-1">' +
        '<button class="btn btn-danger" onclick="eliminarSolucion(' + i + ')"><i class="fas fa-trash-alt mr-2"></i>Eliminar Solución</button>' +
        '</div>';
    return divEliminarSolucion;
}

function crearDivOpcionesSolucion(i) {
    var divOpcionesSolucion = document.createElement("div");
    divOpcionesSolucion.id = "opciones" + i;
    divOpcionesSolucion.innerHTML =
        '<div class="row mt-3 ml-1">' +
        '<button class="btn btn-info" onclick="añadirRazonamiento(' + i + ')"><i class="far fa-comment-alt mr-2"></i>Añadir Razonamiento</button>' +
        '<button class="btn btn-danger ml-3" onclick="eliminarSolucion(' + i + ')"><i class="fas fa-trash-alt mr-2"></i>Eliminar Solución</button>' +
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

function crearDivEliminarRazonamiento(i, j) {
    var divEliminarRazonamiento = document.createElement("div");
    divEliminarRazonamiento.id = "eliminar" + j + "Solucion" + i;
    divEliminarRazonamiento.innerHTML =
        '<div class="row mt-3 ml-2">' +
        '<button class="btn btn-warning" onclick="eliminarRazonamiento(' + i + ', ' + j + ')"><i class="fas fa-trash-alt mr-2"></i>Eliminar Razonamiento</button>' +
        '</div>';
    return divEliminarRazonamiento;
}

function nuevaSolucion() {
    var containerSolucion;
    var titulo;
    var claseTitulo;
    var claseContainerSolucion;
    var divEliminarSolucion;

    numRazonamientos[numSoluciones] = 0;
    numSoluciones++;

    containerSolucion = crearContainerSolucion(false, "", numSoluciones);
    sectionCuestion.appendChild(containerSolucion);

    divEliminarSolucion = crearDivEliminarSolucion(numSoluciones);

    containerSolucion.appendChild(document.createElement("hr"));
    containerSolucion.appendChild(divEliminarSolucion);
    containerSolucion.scrollIntoView();
}

function eliminarSolucion(i) {
    var containerSolucion = document.querySelector("#solucion" + i);
    eliminar(containerSolucion);
    numSoluciones--;
}

function eliminar(elem) {
    elem.parentNode.removeChild(elem);
}

function corregirSolucion(i) {

    var solucion = cuestion.soluciones[i - 1];
    var anteriorContainerSolucion = document.querySelector("#solucion" + i);

    var nuevoContainerSolucion = crearContainerSolucion(false, solucion.respuesta, i);
    var divOpcionesSolucion;

    if (document.querySelector("#correcta" + i).checked == true) {
        solucion.correcta = true;
        divOpcionesSolucion = crearDivEliminarSolucion(i);
    } else {
        solucion.correcta = false;
        divOpcionesSolucion = crearDivOpcionesSolucion(i);
    }

    nuevoContainerSolucion.appendChild(document.createElement("hr"));
    nuevoContainerSolucion.appendChild(divOpcionesSolucion);
    sectionCuestion.insertBefore(nuevoContainerSolucion, anteriorContainerSolucion);
    eliminar(anteriorContainerSolucion);

    if (solucion.correcta) {
        document.querySelector("#correcta" + i).checked = true;
    } else {
        document.querySelector("#incorrecta" + i).checked = true;
        añadirRazonamiento(i);
    }
}

function añadirRazonamiento(i) {
    numRazonamientos[i - 1]++;

    var divRazonamiento = crearDivRazonamiento(false, "", i, numRazonamientos[i - 1]);

    var divEliminarRazonamiento = crearDivEliminarRazonamiento(i, numRazonamientos[i - 1]);
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

    var nuevoDivRazonamiento = crearDivRazonamiento(false, razonamiento.texto, i, j);

    if (document.querySelector("#justificado" + j + "Solucion" + i).checked == true) {
        razonamiento.justificado = true;
    } else {
        razonamiento.justificado = false;
        var divError = crearDivError(i, j, "");
        nuevoDivRazonamiento.appendChild(divError);
    }

    var divEliminarRazonamiento = crearDivEliminarRazonamiento(i, j);
    nuevoDivRazonamiento.appendChild(divEliminarRazonamiento);

    containerSolucion.insertBefore(nuevoDivRazonamiento, anteriorDivRazonamiento);
    eliminar(anteriorDivRazonamiento);

    if (razonamiento.justificado) {
        document.querySelector("#justificado" + j + "Solucion" + i).checked = true;
    } else {
        document.querySelector("#injustificado" + j + "Solucion" + i).checked = true;
    }
}

function eliminarRazonamiento(i, j) {
    var divRazonamiento = document.querySelector("#razonamiento" + j + "Solucion" + i);
    if (divRazonamiento !== null) {
        eliminar(divRazonamiento.nextSibling);
        eliminar(divRazonamiento);
        numRazonamientos[i - 1]--;
    }
}

function marcarSolucionIncorrecta(i) {
    var containerSolucion = document.querySelector("#solucion" + i);
    if (!containerSolucion.classList.contains("propuestaPorAlumno") && numRazonamientos[i - 1] == 0) {
        añadirRazonamiento(i);
        var anterioresOpciones = document.querySelector("#opciones" + i);
        var nuevasOpciones = crearDivOpcionesSolucion(i);
        containerSolucion.insertBefore(nuevasOpciones, anterioresOpciones);
        eliminar(anterioresOpciones);
    }
}

function marcarSolucionCorrecta(i) {
    var containerSolucion = document.querySelector("#solucion" + i);
    var j = 1;
    if (!containerSolucion.classList.contains("propuestaPorAlumno")) {
        while (numRazonamientos[i - 1] != 0) {
            eliminarRazonamiento(i, j);
            j++;
        }
        var anterioresOpciones = document.querySelector("#opciones" + i);
        var nuevasOpciones = crearDivEliminarSolucion(i);
        containerSolucion.insertBefore(nuevasOpciones, anterioresOpciones);
        eliminar(anterioresOpciones);
    }
}

function marcarRazonamientoInjustificado(i, j) {    
    var divRazonamiento = document.querySelector("#razonamiento" + j + "Solucion" + i);    
    var divError;
    var divEliminar = document.querySelector("#eliminar" + j + "Solucion" + i);    
    var textError = document.querySelector("#error" + j + "Solucion" + i);
    
    if (!divRazonamiento.classList.contains("propuestoPorAlumno") && textError === null) {
        divError = crearDivError(i, j, "");
        divRazonamiento.insertBefore(divError, divEliminar);
    }
}
