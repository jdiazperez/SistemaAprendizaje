var datos;
var idCuestion;
var cuestion;
var sectionCuestion;

function mostrarCuestion() {
    datos = JSON.parse(localStorage.getItem("datos"));
    idCuestion = localStorage.getItem("editarCuestion");
    cuestion = datos.cuestiones[idCuestion - 1];

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
        "<button class='btn btn-primary'><i class='fa fa-comment mr-2'></i>Nueva Solución</button>" +
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

        for (var i = 0; i < soluciones.length; i++) {
            if (soluciones[i].propuestaPorAlumno) {
                rellenarSolucion(true, soluciones[i], i);
            } else {
                rellenarSolucion(false, soluciones[i], i);
            }
        }
    }
}

function rellenarSolucion(propuestaPorAlumno, solucion, i) {
    var containerSolucion;
    var titulo;
    var claseTitulo;
    var claseContainerSolucion;

    if (propuestaPorAlumno) {
        claseContainerSolucion = "container bg-light border border-info p-4 mt-2";
        titulo = "¡¡¡Propuesta de Solución!!!";
        claseTitulo = "text-light bg-info";
        containerSolucion = crearContainerSolucion(solucion, claseContainerSolucion, claseTitulo, titulo, i);
        sectionCuestion.appendChild(containerSolucion);
    } else {
        claseContainerSolucion = "container bg-light border p-4 mt-2";
        titulo = "Solución" + (i + 1);
        claseTitulo = "text-primary";
        containerSolucion = crearContainerSolucion(solucion, claseContainerSolucion, claseTitulo, titulo, i);
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

                crearDivRazonamiento(containerSolucion, i, j, solucion.razonamientos[j]);

                if (solucion.razonamientos[j].justificado) {
                    document.querySelector("#justificado" + (j + 1) + "Solucion" + (i + 1)).checked = true;

                } else {
                    document.querySelector("#injustificado" + (j + 1) + "Solucion" + (i + 1)).checked = true;

                    var divError = document.createElement("div");
                    divError.innerHTML =
                        '<div class="form-group mt-3 ml-2">' +
                        '<label for="error' + (j + 1) + 'Solucion' + (i + 1) + '"><h6 class="text-danger">Error</h6></label>' +
                        '<textarea id="error' + (j + 1) + 'Solucion' + (i + 1) + '" rows="3" class="form-control">' +
                        solucion.razonamientos[j].error +
                        '</textarea>' +
                        '</div>';
                    containerSolucion.appendChild(divError);
                }

                var divEliminarRazonamiento = document.createElement("div");
                divEliminarRazonamiento.innerHTML =
                    '<div class="row mt-3 ml-2">' +
                    '<button class="btn btn-warning"><i class="fas fa-trash-alt mr-2"></i>Eliminar Razonamiento</button>' +
                    '</div>';
                containerSolucion.appendChild(divEliminarRazonamiento);
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

function crearContainerSolucion(solucion, claseContainerSolucion, claseTitulo, titulo, i) {
    var containerSolucion = document.createElement("div");
    containerSolucion.className = claseContainerSolucion;
    containerSolucion.innerHTML =
        '<div class="form-group">' +
        '<label id="labelSolucion' + (i + 1) + '" for="solucion' + (i + 1) + '"><h4 class="' + claseTitulo + '">' + titulo + '</h4></label>' +
        '<textarea id="solucion' + (i + 1) + '" rows="3" class="form-control">' +
        solucion.respuesta +
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

function crearDivRazonamiento(containerSolucion, i, j, razonamiento) {
    containerSolucion.appendChild(document.createElement("hr"));

    var divRazonamiento = document.createElement("div");
    divRazonamiento.className = "form-group mt-3 ml-2";
    divRazonamiento.innerHTML =
        '<label for="razonamiento' + (j + 1) + 'solucion' + (i + 1) + '"><h5 class="text-info">Razonamiento ' + (j + 1) + '</h5></label>' +
        '<textarea id="razonamiento' + (j + 1) + 'solucion' + (i + 1) + '" rows="3" class="form-control">' +
        razonamiento.texto +
        '</textarea>';
    containerSolucion.appendChild(divRazonamiento);


    var divJustificado = document.createElement("div");
    divJustificado.className = "row";
    divJustificado.innerHTML =
        '<div class="custom-control custom-radio ml-4">' +
        '<input type="radio" id="justificado' + (j + 1) + 'Solucion' + (i + 1) + '" name="tipoRazonamiento' + (j + 1) + 'Solucion' + (i + 1) + '" class="custom-control-input">' +
        '<label for="justificado' + (j + 1) + 'Solucion' + (i + 1) + '" class="custom-control-label">Razonamiento Justificado</label>' +
        '</div>' +
        '<div class="custom-control custom-radio ml-3">' +
        '<input type="radio" id="injustificado' + (j + 1) + 'Solucion' + (i + 1) + '" name="tipoRazonamiento' + (j + 1) + 'Solucion' + (i + 1) + '" class="custom-control-input">' +
        '<label for="injustificado' + (j + 1) + 'Solucion' + (i + 1) + '" class="custom-control-label">Razonamiento Injustificado</label>' +
        '</div>';
    containerSolucion.appendChild(divJustificado);

}
