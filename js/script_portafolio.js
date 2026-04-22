// --- Intersection Observer for Scroll Revel ---
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
      } else {
      }
    });
  },
  {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  },
);

function initScrollReveal() {
  const reveals = document.querySelectorAll(".reveal");
  reveals.forEach((el) => revealObserver.observe(el));
}

// Variables y funciones de gestión
const contenedor = document.getElementById("lista-proyectos");
const totalProyectosEl = document.getElementById("total-proyectos");
const selectOrdenar = document.getElementById("ordenar");

let mencionActiva = "todos";
let terminoBusqueda = "";
let ordenActivo = "reciente";

function verProyecto(proyectoId) {
  const proyecto = proyectos.find((p) => p.id === proyectoId);
  if (proyecto) {
    localStorage.setItem("proyectoSeleccionado", JSON.stringify(proyecto));
    window.location.href = "proyecto.html";
  } else {
    alert("Proyecto no encontrado.");
  }
}

function formatoFecha(fechaString) {
  const [year, month, day] = fechaString.split("-");
  return `${day}/${month}/${year}`;
}

function actualizarContador(cantidad) {
  totalProyectosEl.textContent = cantidad;
}

function filtrarYOrdenarProyectos() {
  let proyectosFiltrados = proyectos;
  if (mencionActiva !== "todos") {
    proyectosFiltrados = proyectosFiltrados.filter(
      (p) => p.mencion === mencionActiva,
    );
  }
  if (terminoBusqueda) {
    proyectosFiltrados = proyectosFiltrados.filter((p) => {
      const busqueda = terminoBusqueda.toLowerCase();
      return (
        p.titulo.toLowerCase().includes(busqueda) ||
        p.descripcion.toLowerCase().includes(busqueda) ||
        p.etiquetas.some((tag) => tag.toLowerCase().includes(busqueda))
      );
    });
  }
  proyectosFiltrados.sort((a, b) => {
    const fechaA = new Date(a.fecha);
    const fechaB = new Date(b.fecha);
    return ordenActivo === "reciente" ? fechaB - fechaA : fechaA - fechaB;
  });
  renderizarProyectos(proyectosFiltrados);
}

function renderizarProyectos(proyectosFiltrados) {
  contenedor.innerHTML = "";
  actualizarContador(proyectosFiltrados.length);

  if (proyectosFiltrados.length === 0) {
    contenedor.innerHTML =
      '<p style="text-align:center; color: var(--text); padding: 4rem; grid-column: 1/-1;">No se encontraron proyectos con los filtros o la búsqueda seleccionada</p>';
    return;
  }

  proyectosFiltrados.forEach((p, index) => {
    const div = document.createElement("div");
    div.className = "proyecto reveal";
    // Staggered delay for rendering multiple items
    div.style.transitionDelay = `${(index % 3) * 0.1}s`;

    const fechaLegible = formatoFecha(p.fecha);

    const logrosHTML = p.logros 
      ? `<div class="proyecto-detalles-mini"><strong>🏆 Logros:</strong> <ul>${p.logros.slice(0, 3).map(l => `<li>${l}</li>`).join('')}${p.logros.length > 3 ? '<li>...</li>' : ''}</ul></div>` 
      : "";

    div.innerHTML = `
        <div class="proyecto-img-wrapper">
          <img src="${p.imagen}" alt="${p.titulo}" loading="lazy" />
          <h3 class="overlay">${p.titulo}</h3>
        </div>
        <div class="proyecto-info">
          <p class="proyecto-desc">${p.descripcion}</p>
                
          <div class="proyecto-extra-info">
            ${logrosHTML}
            <div class="proyecto-detalles-mini">
              <strong>💻 Software:</strong> ${p.software_usado}
            </div>
            <div class="proyecto-detalles-mini">
              <strong>📈 Impacto:</strong> ${p.impacto}
            </div>
          </div>

          <div class="proyecto-footer">
            <p class="fecha-publicacion">
              🗓️ ${fechaLegible}
            </p>
            ${p.mencion === "programacion" && p.enlace ? `<a class="btn btn-small" href="${p.enlace}" target="_blank" rel="noopener">Ver más</a>` : `<button class="btn btn-small" onclick="verProyecto(${p.id})">Ver más</button>`}
          </div>
        </div>
      `;
    contenedor.appendChild(div);
    // Observe newly created element
    revealObserver.observe(div);
  });
}

// --- Event Listeners ---

document.addEventListener("DOMContentLoaded", () => {
  // Inicializar filtros y proyectos
  filtrarYOrdenarProyectos();

  // Initialize reveal for static sections
  initScrollReveal();

  // FILTROS POR MENCIÓN
  const filtrosBtns = document.querySelectorAll(".filtro-btn");
  filtrosBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filtrosBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      mencionActiva = btn.dataset.mencion;
      filtrarYOrdenarProyectos();
    });
  });

  // BUSCADOR
  const buscador = document.getElementById("buscador");
  buscador.addEventListener("input", (e) => {
    terminoBusqueda = e.target.value.trim().toLowerCase();
    filtrarYOrdenarProyectos();
  });

  // ORDENACIÓN POR FECHA
  selectOrdenar.addEventListener("change", (e) => {
    ordenActivo = e.target.value;
    filtrarYOrdenarProyectos();
  });
});
