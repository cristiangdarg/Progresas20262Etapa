(function () {
  "use strict";

  const lista = Array.isArray(CERTIFICADOS) ? CERTIFICADOS : [];
  const entrada = document.getElementById("buscar");
  const botonLimpiar = document.getElementById("limpiar");
  const contenedor = document.getElementById("lista");
  const mensajeVacio = document.getElementById("vacio");
  const textoResultados = document.getElementById("resultados");
  const total = document.getElementById("contador-total");

  function normalizar(valor) {
    return String(valor || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  }

  function soloDigitos(valor) {
    return String(valor || "").replace(/\D/g, "");
  }

  function coincide(certificado, busqueda) {
    const nombre = normalizar(certificado.nombre);
    const dni = soloDigitos(certificado.dni);
    return busqueda.split(/\s+/).filter(Boolean).every(function (parte) {
      const texto = normalizar(parte);
      const numeros = soloDigitos(parte);
      return nombre.indexOf(texto) !== -1 || (numeros.length > 0 && dni.indexOf(numeros) !== -1);
    });
  }

  function formatearDni(dni) {
    const numeros = soloDigitos(dni);
    if (numeros.length !== 8) return dni;
    return numeros.replace(/^(\d{2})(\d{3})(\d{3})$/, "$1.$2.$3");
  }

  function iniciales(nombre) {
    return normalizar(nombre)
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map(function (palabra) { return palabra.charAt(0).toUpperCase(); })
      .join("");
  }

  function crearTarjeta(certificado) {
    const articulo = document.createElement("article");
    articulo.className = "tarjeta";

    const alumno = document.createElement("div");
    alumno.className = "tarjeta__alumno";

    const avatar = document.createElement("div");
    avatar.className = "tarjeta__avatar";
    avatar.textContent = iniciales(certificado.nombre);

    const datos = document.createElement("div");
    datos.className = "tarjeta__datos";

    const nombre = document.createElement("p");
    nombre.className = "tarjeta__nombre";
    nombre.textContent = certificado.nombre;

    const dni = document.createElement("p");
    dni.className = "tarjeta__dni";
    dni.textContent = "DNI " + formatearDni(certificado.dni);

    datos.appendChild(nombre);
    datos.appendChild(dni);
    alumno.appendChild(avatar);
    alumno.appendChild(datos);

    const enlace = document.createElement("a");
    enlace.className = "descargar";
    enlace.href = "Certificados/" + encodeURIComponent(certificado.archivo);
    enlace.download = certificado.archivo;
    enlace.setAttribute("aria-label", "Descargar certificado de " + certificado.nombre);

    const icono = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    icono.setAttribute("viewBox", "0 0 24 24");
    icono.setAttribute("fill", "none");
    icono.setAttribute("stroke", "currentColor");
    icono.setAttribute("stroke-width", "2");
    icono.setAttribute("stroke-linecap", "round");
    icono.setAttribute("stroke-linejoin", "round");
    icono.setAttribute("aria-hidden", "true");

    const trayecto = document.createElementNS("http://www.w3.org/2000/svg", "path");
    trayecto.setAttribute("d", "M12 3v12m0 0 4-4m-4 4-4-4M4 17v3h16v-3");
    icono.appendChild(trayecto);

    const etiqueta = document.createElement("span");
    etiqueta.textContent = "Descargar PDF";

    enlace.appendChild(icono);
    enlace.appendChild(etiqueta);
    articulo.appendChild(alumno);
    articulo.appendChild(enlace);
    return articulo;
  }

  function renderizar() {
    const consulta = entrada.value.trim();
    const filtrados = lista
      .filter(function (certificado) { return coincide(certificado, consulta); })
      .sort(function (a, b) { return a.nombre.localeCompare(b.nombre, "es", { sensitivity: "base" }); });

    contenedor.replaceChildren.apply(contenedor, filtrados.map(crearTarjeta));
    mensajeVacio.hidden = filtrados.length !== 0;
    botonLimpiar.hidden = consulta.length === 0;
    textoResultados.textContent = consulta
      ? filtrados.length + (filtrados.length === 1 ? " resultado para" : " resultados para") + " «" + consulta + "»"
      : "Mostrando todos los certificados disponibles.";
  }

  total.textContent = lista.length + (lista.length === 1 ? " certificado" : " certificados");
  entrada.addEventListener("input", renderizar);
  botonLimpiar.addEventListener("click", function () {
    entrada.value = "";
    entrada.focus();
    renderizar();
  });
  renderizar();
})();
