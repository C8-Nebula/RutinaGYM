/* ===== FORJA GYM · lógica (un poco de JavaScript) =====
   Las preguntas extra y las respuestas se guardan en el navegador (localStorage). */

var PREGUNTAS_BASE = [
  { id: "objetivo", texto: "¿Cuál es tu objetivo principal?", opciones: ["Ganar músculo", "Perder grasa", "Ganar fuerza", "Mejorar resistencia"] },
  { id: "nivel", texto: "¿Cuál es tu nivel de experiencia?", opciones: ["Principiante", "Intermedio", "Avanzado"] },
  { id: "dias", texto: "¿Cuántos días a la semana puedes entrenar?", opciones: ["3 días", "4 días", "5 días"] },
  { id: "tiempo", texto: "¿Cuánto tiempo tienes por sesión?", opciones: ["30 minutos", "45 minutos", "60 minutos"] }
];

function leer(clave, porDefecto) {
  try { var v = localStorage.getItem(clave); return v ? JSON.parse(v) : porDefecto; }
  catch (e) { return porDefecto; }
}
function guardar(clave, valor) { localStorage.setItem(clave, JSON.stringify(valor)); }
function todasLasPreguntas() { return PREGUNTAS_BASE.concat(leer("gym.extras", [])); }

/* ---------- Ejercicios y reglas de la rutina ---------- */
var EJERCICIOS = {
  empuje: [
    ["Press de banca", "Baja la barra al pecho controlado y empuja hasta estirar los brazos."],
    ["Press militar con mancuernas", "Sentado, sube las mancuernas sobre la cabeza sin arquear la espalda."],
    ["Fondos en paralelas", "Baja hasta que los codos formen 90° y vuelve a subir."],
    ["Elevaciones laterales", "Sube las mancuernas a los lados hasta la altura de los hombros."],
    ["Extensión de tríceps en polea", "Codos pegados al cuerpo, estira los brazos hacia abajo."]
  ],
  tiron: [
    ["Dominadas o jalón al pecho", "Lleva el pecho hacia la barra juntando los omóplatos."],
    ["Remo con barra", "Espalda recta e inclinada, lleva la barra al ombligo."],
    ["Remo con mancuerna a una mano", "Apoya una rodilla en el banco y sube la mancuerna a la cadera."],
    ["Face pull", "Tira de la cuerda hacia la cara abriendo los codos."],
    ["Curl de bíceps", "Sube las mancuernas sin balancear el cuerpo."]
  ],
  pierna: [
    ["Sentadilla", "Pies al ancho de hombros, baja como si te sentaras y sube empujando el suelo."],
    ["Peso muerto rumano", "Rodillas un poco flexionadas, baja la barra pegada a las piernas."],
    ["Zancadas", "Da un paso largo y baja hasta que la rodilla de atrás casi toque el suelo."],
    ["Prensa de piernas", "Empuja la plataforma sin bloquear las rodillas al final."],
    ["Elevación de talones", "Sube de puntillas lento y baja estirando la pantorrilla."]
  ],
  torso: [
    ["Press de banca", "Baja la barra al pecho controlado y empuja hasta estirar los brazos."],
    ["Remo con barra", "Espalda recta e inclinada, lleva la barra al ombligo."],
    ["Press militar con mancuernas", "Sentado, sube las mancuernas sobre la cabeza sin arquear la espalda."],
    ["Jalón al pecho", "Lleva la barra a la parte alta del pecho sin balancearte."],
    ["Curl + extensión de tríceps", "Alterna una serie de bíceps y una de tríceps."]
  ],
  core: [
    ["Plancha", "Cuerpo recto de cabeza a talones, aprieta el abdomen."],
    ["Elevaciones de piernas colgado", "Sube las rodillas o piernas sin balancearte."],
    ["Press Pallof", "Empuja la polea al frente resistiendo la rotación."],
    ["Elevaciones laterales", "Sube las mancuernas a los lados hasta la altura de los hombros."],
    ["Farmer walk", "Camina con peso pesado en cada mano, espalda recta."]
  ],
  completo: [
    ["Sentadilla goblet", "Sostén una mancuerna al pecho y baja con la espalda recta."],
    ["Flexiones", "Manos al ancho de hombros, baja el pecho al suelo y sube."],
    ["Remo con mancuerna a una mano", "Apoya una rodilla en el banco y sube la mancuerna a la cadera."],
    ["Peso muerto con mancuernas", "Baja las mancuernas pegadas a las piernas, cadera atrás."],
    ["Burpees", "Baja al suelo, haz una flexión, salta arriba. Ritmo constante."]
  ]
};

var DIVISION = {
  "3 días": [["Empuje · Pecho, hombro y tríceps", "empuje"], ["Tirón · Espalda y bíceps", "tiron"], ["Piernas y glúteos", "pierna"]],
  "4 días": [["Torso", "torso"], ["Pierna", "pierna"], ["Torso", "torso"], ["Pierna", "pierna"]],
  "5 días": [["Empuje · Pecho, hombro y tríceps", "empuje"], ["Tirón · Espalda y bíceps", "tiron"], ["Piernas y glúteos", "pierna"], ["Hombros y core", "core"], ["Cuerpo completo", "completo"]]
};

var OBJETIVOS = {
  "Ganar músculo": { series: 4, reps: "8–12", descanso: "60–90 segundos entre series", consejo: "Come suficiente proteína y sube el peso poco a poco cada semana." },
  "Perder grasa": { series: 3, reps: "12–15", descanso: "30–45 segundos entre series", cardio: "15 min de cardio al final (bici o caminadora inclinada)", consejo: "Mantén descansos cortos y cuida tu alimentación: ahí está el 70% del resultado." },
  "Ganar fuerza": { series: 5, reps: "3–5", descanso: "2–3 minutos entre series", consejo: "Prioriza la técnica y calienta bien antes de las series pesadas." },
  "Mejorar resistencia": { series: 3, reps: "15–20", descanso: "30 segundos entre series", cardio: "20 min de cardio continuo al final", consejo: "Mantén un ritmo constante y respira de forma controlada." }
};
var AJUSTE_NIVEL = { "Principiante": -1, "Intermedio": 0, "Avanzado": 1 };
var CANTIDAD = { "30 minutos": 3, "45 minutos": 4, "60 minutos": 5 };

function generarRutina(r) {
  var obj = OBJETIVOS[r.objetivo], division = DIVISION[r.dias], cantidad = CANTIDAD[r.tiempo];
  if (!obj || !division || !cantidad || !(r.nivel in AJUSTE_NIVEL)) return null;
  var series = Math.max(2, obj.series + AJUSTE_NIVEL[r.nivel]);
  return {
    titulo: r.objetivo + " · " + r.dias + " · " + r.nivel,
    descanso: obj.descanso,
    consejo: obj.consejo,
    dias: division.map(function (d, i) {
      return {
        dia: "Día " + (i + 1),
        enfoque: d[0],
        cardio: obj.cardio,
        ejercicios: EJERCICIOS[d[1]].slice(0, cantidad).map(function (e) {
          return { nombre: e[0], como: e[1], series: series, reps: obj.reps };
        })
      };
    })
  };
}

/* Evita que el texto escrito por el usuario se interprete como HTML */
function seguro(t) {
  return String(t).replace(/[&<>"']/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
  });
}

/* ---------- Página: preguntas.html ---------- */
function iniciarCuestionario() {
  var form = document.getElementById("cuestionario");
  var lista = document.getElementById("lista-preguntas");
  var aviso = document.getElementById("aviso");

  function pintar() {
    var respuestas = leer("gym.respuestas", {});
    lista.innerHTML = todasLasPreguntas().map(function (p, i) {
      var esBase = i < PREGUNTAS_BASE.length;
      var opciones = p.opciones.map(function (o) {
        var marcada = respuestas[p.id] === o ? " checked" : "";
        return '<label class="opcion"><input type="radio" name="' + p.id + '" value="' + seguro(o) + '"' + marcada + '><span>' + seguro(o) + "</span></label>";
      }).join("");
      var extra = esBase ? '<span class="insignia">Principal</span>'
        : '<button type="button" class="borrar" data-borrar="' + p.id + '">Eliminar</button>';
      return '<fieldset class="pregunta"><div class="titulo"><span><span class="numero">' + String(i + 1).padStart(2, "0") +
        "</span>" + seguro(p.texto) + "</span>" + extra + '</div><div class="opciones">' + opciones + "</div></fieldset>";
    }).join("");
  }

  lista.addEventListener("click", function (e) {
    var id = e.target.getAttribute("data-borrar");
    if (!id) return;
    guardar("gym.extras", leer("gym.extras", []).filter(function (p) { return p.id !== id; }));
    pintar();
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var datos = new FormData(form), respuestas = {};
    datos.forEach(function (v, k) { respuestas[k] = v; });
    var faltan = PREGUNTAS_BASE.filter(function (p) { return !respuestas[p.id]; });
    if (faltan.length) {
      aviso.textContent = "Responde las preguntas principales: " + faltan.map(function (p) { return p.texto; }).join(" ");
      return;
    }
    guardar("gym.respuestas", respuestas);
    window.location.href = "resultados.html";
  });

  // Formulario para agregar preguntas nuevas
  var nueva = document.getElementById("nueva-pregunta");
  var cajaOpciones = document.getElementById("opciones-nuevas");
  var avisoNueva = document.getElementById("aviso-nueva");

  function filaOpcion() {
    var fila = document.createElement("div");
    fila.className = "fila-opcion";
    fila.innerHTML = '<input class="campo" placeholder="Opción" maxlength="60"><button type="button" class="borrar">✕</button>';
    fila.querySelector("button").onclick = function () {
      if (cajaOpciones.children.length > 2) fila.remove();
    };
    cajaOpciones.appendChild(fila);
  }
  function reiniciarNueva() { nueva.reset(); cajaOpciones.innerHTML = ""; filaOpcion(); filaOpcion(); }

  document.getElementById("mas-opcion").onclick = function () {
    if (cajaOpciones.children.length < 6) filaOpcion();
    else avisoNueva.textContent = "Máximo 6 opciones.";
  };

  nueva.addEventListener("submit", function (e) {
    e.preventDefault();
    var texto = document.getElementById("texto-pregunta").value.trim();
    var opciones = Array.prototype.map.call(cajaOpciones.querySelectorAll("input"), function (i) { return i.value.trim(); })
      .filter(function (v) { return v; });
    if (!texto) { avisoNueva.textContent = "Escribe la pregunta."; return; }
    if (opciones.length < 2) { avisoNueva.textContent = "Agrega al menos 2 opciones."; return; }
    var extras = leer("gym.extras", []);
    extras.push({ id: "p" + Date.now(), texto: texto, opciones: opciones });
    guardar("gym.extras", extras);
    avisoNueva.textContent = "";
    reiniciarNueva();
    pintar();
  });

  reiniciarNueva();
  pintar();
}

/* ---------- Página: resultados.html ---------- */
function iniciarResultados() {
  var respuestas = leer("gym.respuestas", {});
  var rutina = generarRutina(respuestas);
  if (!rutina) { document.getElementById("sin-resultados").classList.remove("oculto"); return; }
  document.getElementById("con-resultados").classList.remove("oculto");

  document.getElementById("mis-respuestas").innerHTML = todasLasPreguntas()
    .filter(function (p) { return respuestas[p.id]; })
    .map(function (p) {
      return '<div class="respuesta"><dt>' + seguro(p.texto) + "</dt><dd>" + seguro(respuestas[p.id]) + "</dd></div>";
    }).join("");

  document.getElementById("titulo-rutina").textContent = rutina.titulo;
  document.getElementById("descanso").textContent = rutina.descanso;
  document.getElementById("consejo").textContent = rutina.consejo;

  document.getElementById("dias").innerHTML = rutina.dias.map(function (d) {
    var ejercicios = d.ejercicios.map(function (e, i) {
      return '<li><span class="n">' + (i + 1) + '</span><div><div class="nombre">' + e.nombre + '</div><div class="como">' + e.como +
        '</div></div><div class="sr">' + e.series + ' <span class="verde">×</span> ' + e.reps + "</div></li>";
    }).join("");
    var cardio = d.cardio ? '<div class="cardio">🔥 ' + d.cardio + "</div>" : "";
    return '<article class="dia"><header><h3>' + d.dia + "</h3><span>" + d.enfoque + "</span></header><ol>" + ejercicios + "</ol>" + cardio + "</article>";
  }).join("");
}
