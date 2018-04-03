var usuarios = [
    {
        usuario: "m",
        contrasenia: "m",
        rol: "maestro"
	},
    {
        usuario: "a",
        contrasenia: "a",
        rol: "aprendiz"
	},
    {
        usuario: "b",
        contrasenia: "b",
        rol: "aprendiz"
	},
    {
        usuario: "c",
        contrasenia: "c",
        rol: "aprendiz"
	}
];

localStorage.setItem("usuarios", JSON.stringify(usuarios));

function validar() {
    var usuarioForm = document.querySelector("#usuario").value;
    var contraseniaForm = document.querySelector("#contrasenia").value;
    var encontrado = false;
    var i = 0;
    while (!encontrado) {
        if (usuarios[i].usuario === usuarioForm && usuarios[i].contrasenia === contraseniaForm) {
            encontrado = true;
        } else {
            i++;
        }
    }
    if (encontrado) {
        var form = document.querySelector("form");
        if (usuarios[i].rol === "maestro") {
            form.action = "listarCuestionesMaestro.html";
        } else {
            form.action = "listarCuestionesAprendiz.html";
        }
    }/* else {
        var alertAccesoDenegado = document.createElement("div");
        alertAccesoDenegado.className = "alert alert-danger";
        alertAccesoDenegado.textContent = "Error";        document.querySelector(".container").appendChild(alertAccesoDenegado);
    }*/

    return encontrado;
}
