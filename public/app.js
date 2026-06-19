/* ============================================================
   ESTANCIA SAN FRANCISCO — App de pedido anticipado
   Vanilla JS · sin frameworks · sin backend
   ============================================================ */

// ============================================================
// CONFIG — editable por sucursal
// ============================================================
const CONFIG = {
  // === SUCURSAL ===
  sucursalNombre: 'Sucursal El Cano',
  sucursalDireccion: 'Av. El Cano 3202',
  whatsappLocal: '5491130205991',  // sin + ni espacios
  // === TIEMPO DE PREPARACIÓN (minutos) ===
  // El local elige cuál mostrar según cómo esté la cocina
  tiempoPreparacionMin: 15,
};

// ============================================================
// CATÁLOGO — productos reales Estancia San Francisco
// Todo ordenado alfabéticamente
// ============================================================
const CATALOGO = {
  pan: [
    { id: 'pa1', nombre: 'Baguette' },
    { id: 'pa2', nombre: 'Ciabatta' },
    { id: 'pa3', nombre: 'Focaccia de romero y cebolla' },
  ],
  embutido: [
    { id: 'em01', nombre: 'Bondiola' },
    { id: 'em02', nombre: 'Cantimpalo' },
    { id: 'em03', nombre: 'Jamón cocido' },
    { id: 'em04', nombre: 'Jamón crudo' },
    { id: 'em05', nombre: 'Jamón natural' },
    { id: 'em06', nombre: 'Leberwurst' },
    { id: 'em07', nombre: 'Lomito ahumado' },
    { id: 'em08', nombre: 'Lomito horneado' },
    { id: 'em09', nombre: 'Lomito ibérico' },
    { id: 'em10', nombre: 'Longaniza' },
    { id: 'em11', nombre: 'Matambre de carne' },
    { id: 'em12', nombre: 'Matambre de pollo' },
    { id: 'em13', nombre: 'Mortadela' },
    { id: 'em14', nombre: 'Mortadela con pistacho' },
    { id: 'em15', nombre: 'Panceta' },
    { id: 'em16', nombre: 'Pastrón ahumado' },
    { id: 'em17', nombre: 'Pavita' },
    { id: 'em18', nombre: 'Pechuga de pollo' },
    { id: 'em19', nombre: 'Peperoni' },
    { id: 'em20', nombre: 'Porcheta' },
    { id: 'em21', nombre: 'Salame a las finas hierbas' },
    { id: 'em22', nombre: 'Salame tradicional' },
    { id: 'em23', nombre: 'Salchichón' },
    { id: 'em24', nombre: 'Spianatta' },
  ],
  queso: [
    { id: 'qu01', nombre: 'Barra ahumada' },
    { id: 'qu02', nombre: 'Barra con ají' },
    { id: 'qu03', nombre: 'Barra con orégano' },
    { id: 'qu04', nombre: 'Barra light' },
    { id: 'qu05', nombre: 'Barra tradicional' },
    { id: 'qu06', nombre: 'Boconccino' },
    { id: 'qu07', nombre: 'Brie' },
    { id: 'qu08', nombre: 'Burrata' },
    { id: 'qu09', nombre: 'Cheddar' },
    { id: 'qu10', nombre: 'Cremoso' },
    { id: 'qu11', nombre: 'Fiambrín' },
    { id: 'qu12', nombre: 'Mozzarella' },
    { id: 'qu13', nombre: 'Provoleta' },
    { id: 'qu14', nombre: 'Queso al pesto' },
    { id: 'qu15', nombre: 'Queso de cabra' },
    { id: 'qu16', nombre: 'Reggianito' },
    { id: 'qu17', nombre: 'Roquefort' },
  ],
  encurtido: [
    { id: 'en01', nombre: 'Aceitunas con morrón' },
    { id: 'en02', nombre: 'Aceitunas con provolone' },
    { id: 'en03', nombre: 'Aceitunas negras' },
    { id: 'en04', nombre: 'Aceitunas verdes' },
    { id: 'en05', nombre: 'Ají en vinagre' },
    { id: 'en06', nombre: 'Antipasto' },
    { id: 'en07', nombre: 'Berenjenas' },
    { id: 'en08', nombre: 'Cebollitas en vinagre' },
    { id: 'en09', nombre: 'Corazón de alcaucil' },
    { id: 'en10', nombre: 'Morrones' },
    { id: 'en11', nombre: 'Pepinos agridulces' },
    { id: 'en12', nombre: 'Pepinos en vinagre' },
    { id: 'en13', nombre: 'Pickles' },
    { id: 'en14', nombre: 'Tomates secos' },
  ],
  aderezo: [
    { id: 'ad01', nombre: 'Ketchup' },
    { id: 'ad02', nombre: 'Ketchup al curry' },
    { id: 'ad03', nombre: 'Manteca' },
    { id: 'ad04', nombre: 'Mayonesa' },
    { id: 'ad05', nombre: 'Mostaza' },
    { id: 'ad06', nombre: 'Oliva' },
    { id: 'ad07', nombre: 'Queso crema' },
    { id: 'ad08', nombre: 'Salsa barbacoa' },
  ],
  acompanamiento: [
    { id: 'ac01', nombre: 'Gauchitas A la pimienta', descripcion: '134 g' },
    { id: 'ac02', nombre: 'Gauchitas Aceite de oliva', descripcion: '134 g' },
    { id: 'ac03', nombre: 'Gauchitas Sal marina', descripcion: '134 g' },
    { id: 'ac04', nombre: 'Krachitos Acanaladas', descripcion: '134 g' },
    { id: 'ac05', nombre: 'Krachitos Cheddar', descripcion: '134 g' },
    { id: 'ac06', nombre: 'Krachitos Jamón serrano', descripcion: '134 g' },
    { id: 'ac07', nombre: 'Krachitos Tradicional', descripcion: '134 g' },
    { id: 'ac08', nombre: 'Pehuamar Acanaladas', descripcion: '134 g' },
    { id: 'ac09', nombre: 'Pehuamar Cheddar', descripcion: '134 g' },
    { id: 'ac10', nombre: 'Pehuamar Jamón serrano', descripcion: '134 g' },
    { id: 'ac11', nombre: 'Pehuamar Tradicional', descripcion: '134 g' },
  ],
  bebida: [
    { id: 'be01', nombre: 'Agua sin gas 600 ml' },
    { id: 'be02', nombre: 'Agua sin gas 1.5 L' },
    { id: 'be03', nombre: 'Aquarius Manzana' },
    { id: 'be04', nombre: 'Aquarius Pera' },
    { id: 'be05', nombre: 'Aquarius Pomelo' },
    { id: 'be07', nombre: 'Chocolatada 250 ml' },
    { id: 'be08', nombre: 'Chocolatada 1 L' },
    { id: 'be09', nombre: 'Coca lata mini' },
    { id: 'be10', nombre: 'Coca lata mini Zero' },
    { id: 'be11', nombre: 'Coca 600 ml' },
    { id: 'be12', nombre: 'Coca 600 ml Zero' },
    { id: 'be13', nombre: 'Coca 1.75 L' },
    { id: 'be14', nombre: 'Coca 1.75 L Zero' },
    { id: 'be15', nombre: 'Jugo Citric 250 ml' },
    { id: 'be16', nombre: 'Jugo Citric 500 ml' },
    { id: 'be17', nombre: 'Jugo Citric 1 L' },
    { id: 'be18', nombre: 'Monster' },
    { id: 'be19', nombre: 'Sprite 600 ml' },
    { id: 'be20', nombre: 'Sprite lata mini' },
  ],
};

// Topes por categoría
const TOPES = {
  pan: 1,
  embutido: 3,
  queso: 2,
  encurtido: 4,
  aderezo: 3,
  acompanamiento: 1,
  bebida: 1,
};

const MINIMOS = {
  pan: 1,
  embutido: 1,
  queso: 0,
  encurtido: 0,
  aderezo: 0,
  acompanamiento: 0,
  bebida: 0,
};

// Definición de pasos del wizard
const PASOS = [
  { categoria: 'pan', titulo: 'El pan', sub: 'Elegí uno. La base de todo.' },
  { categoria: 'embutido', titulo: 'Fiambres', sub: 'Hasta tres. Combiná con cabeza.' },
  { categoria: 'queso', titulo: 'Quesos', sub: 'Hasta dos. Opcional.' },
  { categoria: 'encurtido', titulo: 'Encurtidos', sub: 'Hasta cuatro. Opcional.' },
  { categoria: 'aderezo', titulo: 'Aderezos', sub: 'Hasta tres. El último toque.' },
  { categoria: 'acompanamiento', titulo: 'Acompañamiento', sub: 'Una bolsa de papas o snacks. Opcional.' },
  { categoria: 'bebida', titulo: 'Bebida', sub: 'Una opcional. También podés terminar acá.' },
];

const TOTAL_PASOS = PASOS.length + 1; // + paso final (resumen+datos)

// ============================================================
// ESTADO GLOBAL
// ============================================================
const estado = {
  paso: 0,
  seleccion: {
    pan: new Set(),
    embutido: new Set(),
    queso: new Set(),
    encurtido: new Set(),
    aderezo: new Set(),
    acompanamiento: new Set(),
    bebida: new Set(),
  },
  nombre: '',
  telefono: '',
  horaRetiro: '',
  notas: '',
  pedidoActual: null,
};

// ============================================================
// HELPERS
// ============================================================
function $(sel) { return document.querySelector(sel); }
function $$(sel) { return document.querySelectorAll(sel); }

function escapar(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[c]);
}

function generarToken() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let t = '';
  for (let i = 0; i < 8; i++) t += chars[Math.floor(Math.random() * chars.length)];
  return t;
}

function formatearTelefono(tel) {
  return tel.replace(/\D/g, '');
}

function ingredientePorId(id) {
  for (const cat of Object.keys(CATALOGO)) {
    const f = CATALOGO[cat].find((i) => i.id === id);
    if (f) return f;
  }
  return null;
}

// ============================================================
// NAVEGACIÓN ENTRE VISTAS
// ============================================================
function mostrarVista(nombre) {
  // El botón "menu" abre la vista "wizard"
  const vistaTarget = nombre === 'menu' ? 'wizard' : nombre;
  $$('.vista').forEach((v) => v.hidden = v.dataset.vista !== vistaTarget);
  window.scrollTo({ top: 0, behavior: 'smooth' });

  if (nombre === 'menu') iniciarWizard();
  if (nombre === 'historial') renderHistorial();
  if (nombre === 'landing') renderLandingFavoritos();
}

// Listeners para todos los data-ir-a
document.addEventListener('click', (ev) => {
  const t = ev.target.closest('[data-ir-a]');
  if (t) mostrarVista(t.dataset['irA']);
});

// ============================================================
// FECHA INICIAL EN LANDING
// ============================================================
function pintarFecha() {
  const hoy = new Date();
  const fmt = hoy.toLocaleDateString('es-AR', {
    weekday: 'long', day: '2-digit', month: 'long', year: 'numeric'
  });
  const el = $('#fecha-hoy');
  if (el) el.textContent = fmt;

  // Sucursal en landing
  const sucEl = $('#sucursal-nombre');
  if (sucEl) sucEl.textContent = `${CONFIG.sucursalNombre} · ${CONFIG.sucursalDireccion}`;

  const footEl = $('#footer-sucursal');
  if (footEl) footEl.textContent = `Estancia San Francisco · ${CONFIG.sucursalNombre.replace(/^Sucursal\s+/i, '')}`;
}

// ============================================================
// HORA DE RETIRO — simple: ahora + tiempo de preparación
// ============================================================
function calcularHoraRetiro() {
  return new Date(Date.now() + CONFIG.tiempoPreparacionMin * 60_000);
}

// ============================================================
// WIZARD
// ============================================================
function iniciarWizard() {
  estado.paso = 0;
  estado.seleccion = {
    pan: new Set(),
    embutido: new Set(),
    queso: new Set(),
    encurtido: new Set(),
    aderezo: new Set(),
    acompanamiento: new Set(),
    bebida: new Set(),
  };
  // Prioridad: cliente registrado (Etapa 2) > preferencias viejas (Etapa 1) > vacío
  const cliente = leerCliente();
  estado.nombre = cliente?.nombre || leerPref('cliente_nombre') || '';
  estado.telefono = cliente?.telefono || leerPref('cliente_telefono') || '';
  estado.horaRetiro = '';
  estado.notas = '';
  renderPaso();
}

function renderPaso() {
  renderProgreso();
  $('#error-box').hidden = true;

  const esPasoIng = estado.paso < PASOS.length;
  const esCierre = estado.paso === PASOS.length;

  if (esPasoIng) renderPasoIngredientes();
  else if (esCierre) renderCierre();

  renderNav(esCierre);
}

function renderProgreso() {
  const cont = $('#progreso');
  cont.innerHTML = '';
  for (let i = 0; i < TOTAL_PASOS; i++) {
    const seg = document.createElement('div');
    seg.className = 'progreso-seg' + (i <= estado.paso ? ' activo' : '');
    cont.appendChild(seg);
  }
}

function renderPasoIngredientes() {
  const paso = PASOS[estado.paso];
  const ings = CATALOGO[paso.categoria];
  const sel = estado.seleccion[paso.categoria];
  const tope = TOPES[paso.categoria];
  const minimo = MINIMOS[paso.categoria];

  const pillsHTML = ings.map((ing, i) => {
    const seleccionado = sel.has(ing.id);
    const disabled = !seleccionado && sel.size >= tope;
    return `
      <button type="button"
              class="ingrediente-pill ${seleccionado ? 'selected' : ''} ${disabled ? 'disabled' : ''}"
              data-toggle="${escapar(ing.id)}"
              ${disabled ? 'disabled' : ''}>
        <span class="ing-num">${String(i + 1).padStart(2, '0')}</span>
        <span class="ing-nombre">${escapar(ing.nombre)}</span>
        ${seleccionado ? '<span class="ing-check">✓</span>' : ''}
      </button>
    `;
  }).join('');

  $('#paso-contenido').innerHTML = `
    <div class="paso-header">
      <div class="paso-header-meta">
        <span class="kicker">PASO ${String(estado.paso + 1).padStart(2, '0')}</span>
        <span class="paso-contador">${sel.size}/${tope}${minimo > 0 ? ' · mín. ' + minimo : ''}</span>
      </div>
      <h2 class="paso-titulo">${escapar(paso.titulo)}</h2>
      <p class="paso-sub">${escapar(paso.sub)}</p>
    </div>

    <div class="ingredientes-grid">
      ${pillsHTML}
    </div>
  `;

  // Listeners para toggles
  $$('#paso-contenido [data-toggle]').forEach((btn) => {
    btn.addEventListener('click', () => toggleIngrediente(paso.categoria, btn.dataset.toggle));
  });
}

function toggleIngrediente(cat, id) {
  const sel = estado.seleccion[cat];
  const tope = TOPES[cat];

  if (sel.has(id)) {
    sel.delete(id);
  } else {
    if (tope === 1) sel.clear(); // radio behavior para pan
    if (sel.size < tope) sel.add(id);
  }
  renderPaso();
}

function renderCierre() {
  const lineas = [
    { etq: 'Pan', cat: 'pan' },
    { etq: 'Fiambres', cat: 'embutido' },
    { etq: 'Quesos', cat: 'queso' },
    { etq: 'Encurtidos', cat: 'encurtido' },
    { etq: 'Aderezos', cat: 'aderezo' },
    { etq: 'Acompañam.', cat: 'acompanamiento' },
    { etq: 'Bebida', cat: 'bebida' },
  ].map(({ etq, cat }) => {
    const ids = Array.from(estado.seleccion[cat]);
    const nombres = ids.map((id) => ingredientePorId(id)?.nombre).filter(Boolean);
    return `
      <div class="resumen-linea">
        <span class="resumen-etq">${etq}</span>
        <span class="resumen-val">${
          nombres.length > 0 ? escapar(nombres.join(' · ')) : '<em class="resumen-vacio">—</em>'
        }</span>
      </div>
    `;
  }).join('');

  // Sugerencia de hora mínima: ahora + tiempoPreparacionMin
  const ahora = new Date();
  const minimo = new Date(ahora.getTime() + CONFIG.tiempoPreparacionMin * 60_000);
  const minHHMM = `${String(minimo.getHours()).padStart(2,'0')}:${String(minimo.getMinutes()).padStart(2,'0')}`;

  const clienteActual = leerCliente();
  const esClienteRegistrado = !!clienteActual?.nombre;

  const bloqueDatos = esClienteRegistrado
    ? `
      <div class="datos-cliente-conf">
        <div class="datos-cliente-encabezado">
          <span class="datos-cliente-check">✓</span>
          <span class="kicker">Te conocemos</span>
        </div>
        <div class="datos-cliente-fila">
          <span class="datos-cliente-etq">Retira</span>
          <span class="datos-cliente-val">${escapar(clienteActual.nombre)}</span>
        </div>
        <div class="datos-cliente-fila">
          <span class="datos-cliente-etq">WhatsApp</span>
          <span class="datos-cliente-val">+${escapar(clienteActual.telefono)}</span>
        </div>
      </div>
      <input type="hidden" id="campo-nombre" value="${escapar(estado.nombre)}">
      <input type="hidden" id="campo-telefono" value="${escapar(estado.telefono)}">
    `
    : `
      <label class="campo">
        <span class="campo-label">Tu nombre</span>
        <input type="text" class="campo-input" id="campo-nombre"
               value="${escapar(estado.nombre)}" placeholder="Cómo te llamamos">
      </label>

      <label class="campo">
        <span class="campo-label">Teléfono (WhatsApp)</span>
        <input type="tel" class="campo-input" id="campo-telefono"
               value="${escapar(estado.telefono)}" placeholder="+54 9 11 ...">
      </label>
    `;

  $('#paso-contenido').innerHTML = `
    <div class="paso-header">
      <span class="kicker">Tu pedido</span>
      <h2 class="paso-titulo">Confirmá y retirá</h2>
    </div>

    <div class="resumen-card">${lineas}</div>

    <label class="campo">
      <span class="campo-label">¿A qué hora retirás?</span>
      <input type="time" class="campo-input campo-hora" id="campo-hora"
             value="${escapar(estado.horaRetiro)}" min="${minHHMM}" step="300">
      <span class="campo-hint" id="hint-hora">Necesitamos al menos ${CONFIG.tiempoPreparacionMin} minutos para prepararlo. Antes de las ${minHHMM} no podemos.</span>
    </label>

    ${bloqueDatos}

    <label class="campo">
      <span class="campo-label">Notas (opcional)</span>
      <textarea class="campo-textarea" id="campo-notas" rows="2"
                placeholder="Sin sal, tostado, etc.">${escapar(estado.notas)}</textarea>
    </label>

    <div class="aviso-cobro">
      <div class="aviso-cobro-titulo">↓ Cómo pagás</div>
      <p class="aviso-cobro-txt">
        El precio se calcula <strong>por peso</strong> al retirar. Efectivo, débito, crédito o transferencia.
      </p>
    </div>
  `;

  $('#campo-hora').addEventListener('input', (e) => {
    estado.horaRetiro = e.target.value;
    actualizarHintHora();
    renderNav(true);
  });

  // Solo enganchamos listeners si los campos son editables (cliente no registrado)
  if (!esClienteRegistrado) {
    $('#campo-nombre').addEventListener('input', (e) => {
      estado.nombre = e.target.value;
      renderNav(true);
    });
    $('#campo-telefono').addEventListener('input', (e) => {
      estado.telefono = e.target.value;
      renderNav(true);
    });
  }

  $('#campo-notas').addEventListener('input', (e) => {
    estado.notas = e.target.value;
  });
}

function actualizarHintHora() {
  const hint = document.getElementById('hint-hora');
  const input = document.getElementById('campo-hora');
  if (!hint || !input) return;

  const v = estado.horaRetiro;
  const ahora = new Date();
  const minimo = new Date(ahora.getTime() + CONFIG.tiempoPreparacionMin * 60_000);
  const minHHMM = `${String(minimo.getHours()).padStart(2,'0')}:${String(minimo.getMinutes()).padStart(2,'0')}`;

  if (!v || !/^\d{2}:\d{2}$/.test(v)) {
    hint.textContent = `Necesitamos al menos ${CONFIG.tiempoPreparacionMin} minutos para prepararlo. Antes de las ${minHHMM} no podemos.`;
    hint.classList.remove('campo-hint-error');
    input.classList.remove('campo-input-error');
    return;
  }

  if (!horaRetiroValida(v)) {
    hint.textContent = `Esa hora ya pasó o no nos da tiempo a prepararlo. Elegí una hora a partir de las ${minHHMM}.`;
    hint.classList.add('campo-hint-error');
    input.classList.add('campo-input-error');
  } else {
    hint.textContent = `Pasalo a buscar a las ${v} hs. Recordá que tarda ${CONFIG.tiempoPreparacionMin} minutos en estar listo.`;
    hint.classList.remove('campo-hint-error');
    input.classList.remove('campo-input-error');
  }
}

function puedeAvanzar() {
  const esPasoIng = estado.paso < PASOS.length;
  const esCierre = estado.paso === PASOS.length;

  if (esPasoIng) {
    const cat = PASOS[estado.paso].categoria;
    return estado.seleccion[cat].size >= MINIMOS[cat];
  }
  if (esCierre) {
    const horaOk = /^\d{2}:\d{2}$/.test(estado.horaRetiro) && horaRetiroValida(estado.horaRetiro);
    return horaOk &&
           estado.nombre.trim().length >= 2 &&
           /^\+?[\d\s-]{8,}$/.test(estado.telefono.trim());
  }
  return false;
}

// La hora elegida debe ser al menos ahora + tiempo de preparación
function horaRetiroValida(hhmm) {
  const [h, m] = hhmm.split(':').map(Number);
  const elegida = new Date();
  elegida.setHours(h, m, 0, 0);
  const minimo = new Date(Date.now() + CONFIG.tiempoPreparacionMin * 60_000);
  return elegida >= minimo;
}

// Convierte HH:MM a ISO datetime de hoy
function horaRetiroAISO(hhmm) {
  const [h, m] = hhmm.split(':').map(Number);
  const d = new Date();
  d.setHours(h, m, 0, 0);
  return d.toISOString();
}

function renderNav(esUltimoPaso) {
  const btnAtras = $('#btn-atras');
  const btnAdelante = $('#btn-adelante');

  btnAtras.hidden = estado.paso === 0;
  btnAtras.onclick = () => { if (estado.paso > 0) { estado.paso--; renderPaso(); } };

  if (esUltimoPaso) {
    btnAdelante.textContent = 'Confirmar pedido →';
    btnAdelante.onclick = confirmarPedido;
  } else {
    btnAdelante.textContent = 'Siguiente →';
    btnAdelante.onclick = () => {
      if (puedeAvanzar()) {
        estado.paso++;
        renderPaso();
      }
    };
  }
  btnAdelante.disabled = !puedeAvanzar();
}

// ============================================================
// CONFIRMACIÓN DEL PEDIDO
// ============================================================
async function confirmarPedido() {
  if (!puedeAvanzar()) return;

  // Guardar preferencias para próxima vez
  guardarPref('cliente_nombre', estado.nombre.trim());
  guardarPref('cliente_telefono', estado.telefono.trim());

  const cliente = leerCliente();
  const itemsLimpios = {
    pan: Array.from(estado.seleccion.pan).map(ingredientePorId).filter(Boolean),
    embutido: Array.from(estado.seleccion.embutido).map(ingredientePorId).filter(Boolean),
    queso: Array.from(estado.seleccion.queso).map(ingredientePorId).filter(Boolean),
    encurtido: Array.from(estado.seleccion.encurtido).map(ingredientePorId).filter(Boolean),
    aderezo: Array.from(estado.seleccion.aderezo).map(ingredientePorId).filter(Boolean),
    acompanamiento: Array.from(estado.seleccion.acompanamiento).map(ingredientePorId).filter(Boolean),
    bebida: Array.from(estado.seleccion.bebida).map(ingredientePorId).filter(Boolean),
  };

  let numero = null;
  let token = null;
  let creadoEn = new Date().toISOString();

  // Intentar guardar en backend si hay cliente registrado
  if (USAR_BACKEND && cliente?.id && !cliente.id.startsWith('cli_')) {
    const $btn = $('#btn-adelante');
    if ($btn) { $btn.disabled = true; $btn.textContent = 'Confirmando...'; }

    const res = await apiPost('/api/pedidos', {
      cliente_id: cliente.id,
      items: itemsLimpios,
      notas: estado.notas.trim() || null,
      hora_retiro_txt: estado.horaRetiro,
    });

    if (!res.ok || !res.data.ok) {
      // Mostrar error específico (límite de activos, etc)
      const $err = $('#error-box');
      if ($err) {
        $err.textContent = res.data?.error || 'No pudimos confirmar tu pedido. Probá de nuevo.';
        $err.hidden = false;
      }
      if ($btn) { $btn.disabled = false; $btn.textContent = 'Confirmar pedido →'; }
      return;
    }

    numero = res.data.pedido.numero;
    token = res.data.pedido.token;
    creadoEn = res.data.pedido.created_at || creadoEn;
  }

  // Si no hubo backend o el cliente es local, fallback local
  if (!numero) {
    const historial = cargarHistorial();
    const numerosHoy = historial.filter((p) => {
      return new Date(p.creadoEn).toDateString() === new Date().toDateString();
    });
    const baseDia = 47 + Math.floor(Math.random() * 8);
    numero = baseDia + numerosHoy.length + 1;
    token = generarToken();
  }

  const pedido = {
    token,
    numero,
    creadoEn,
    retiroISO: horaRetiroAISO(estado.horaRetiro),
    horaRetiroTxt: estado.horaRetiro,
    cliente: {
      nombre: estado.nombre.trim(),
      telefono: formatearTelefono(estado.telefono.trim()),
    },
    items: itemsLimpios,
    notas: estado.notas.trim() || null,
    estado: 'pendiente',
  };

  guardarPedido(pedido);
  estado.pedidoActual = pedido;
  mostrarVista('ticket');
  renderTicket(pedido);
}

// ============================================================
// TICKET
// ============================================================
function renderTicket(pedido) {
  const retiroISO = pedido.retiroISO || pedido.slotISO; // compatibilidad
  const horaRetiro = new Date(retiroISO).toLocaleTimeString('es-AR', {
    hour: '2-digit', minute: '2-digit',
  });
  const fechaRetiro = new Date(retiroISO).toLocaleDateString('es-AR', {
    weekday: 'long', day: '2-digit', month: 'long',
  });
  const fechaPedido = new Date(pedido.creadoEn).toLocaleDateString('es-AR');

  const lineas = [
    { etq: 'Pan', items: pedido.items.pan },
    { etq: 'Fiambres', items: pedido.items.embutido },
    { etq: 'Quesos', items: pedido.items.queso },
    { etq: 'Encurtidos', items: pedido.items.encurtido || pedido.items.vegetal || [] },
    { etq: 'Aderezos', items: pedido.items.aderezo || pedido.items.condimento || [] },
    { etq: 'Acompañam.', items: pedido.items.acompanamiento || [] },
    { etq: 'Bebida', items: pedido.items.bebida || [] },
  ].filter((l) => l.items.length > 0).map((l) => `
    <div class="ticket-ing-linea">
      <span class="ticket-ing-etq">${l.etq}</span>
      <span class="ticket-divider-dots"></span>
      <span class="ticket-ing-val">${escapar(l.items.map((i) => i.nombre).join(', '))}</span>
    </div>
  `).join('');

  const notaHTML = pedido.notas ? `
    <div class="ticket-nota">
      <div class="ticket-nota-etq">Nota</div>
      <div class="ticket-nota-val">${escapar(pedido.notas)}</div>
    </div>
  ` : '';

  $('#ticket').innerHTML = `
    <div class="ticket-sello">Recibido</div>

    <div class="ticket-marca-header">
      <span class="ticket-marca-est">Estancia</span>
      <span class="ticket-marca-san">San Francisco</span>
      <span class="ticket-marca-sucursal">${escapar(CONFIG.sucursalNombre)} · ${escapar(CONFIG.sucursalDireccion)}</span>
    </div>

    <div class="ticket-seccion">
      <div class="ticket-encabezado-meta">
        <span>Pedido del día</span>
        <span>${escapar(fechaPedido)}</span>
      </div>
      <div class="ticket-numero">#${String(pedido.numero).padStart(3, '0')}</div>
    </div>

    <div class="ticket-seccion">
      <div class="ticket-grid-datos">
        <div>
          <div class="ticket-dato-etq">Retira</div>
          <div class="ticket-dato-val">${escapar(pedido.cliente.nombre)}</div>
          <div class="ticket-dato-sub">+${escapar(pedido.cliente.telefono)}</div>
        </div>
        <div class="ticket-align-right">
          <div class="ticket-dato-etq">Retira a las</div>
          <div class="ticket-dato-val">${horaRetiro} hs</div>
          <div class="ticket-dato-sub ticket-fecha-cap">${escapar(fechaRetiro)}</div>
        </div>
      </div>
    </div>

    <div class="ticket-seccion">
      ${lineas}
      ${notaHTML}
    </div>

    <div class="ticket-seccion ticket-cobro">
      <div class="ticket-cobro-titulo">↓ Cobramos por peso al retirar</div>
      <div class="ticket-cobro-sub">Efectivo · Débito · Crédito · Transferencia.</div>
    </div>

    <div class="ticket-seccion">
      <div class="ticket-qr-row">
        <div class="ticket-qr" id="ticket-qr"></div>
        <div class="ticket-qr-info">
          <div class="ticket-qr-etq">Mostrá este código</div>
          <div class="ticket-qr-txt">Al llegar al local, mostrá este QR para retirar tu pedido.</div>
          <div class="ticket-qr-token">${escapar(pedido.token)}</div>
        </div>
      </div>
    </div>

    <div class="ticket-dentado"></div>
  `;

  // Generar QR (si la librería cargó)
  const qrCont = $('#ticket-qr');
  qrCont.innerHTML = '';
  if (typeof QRCode !== 'undefined') {
    try {
      new QRCode(qrCont, {
        text: `ESF-${pedido.token}`,
        width: 96,
        height: 96,
        colorDark: '#171411',
        colorLight: '#F8F4E9',
        correctLevel: QRCode.CorrectLevel.H,
      });
    } catch (err) {
      qrCont.innerHTML = `<div style="font-family:monospace;font-size:.7rem;padding:.5rem;border:1px solid #ccc;text-align:center">ESF-${escapar(pedido.token)}</div>`;
    }
  } else {
    qrCont.innerHTML = `<div style="font-family:monospace;font-size:.7rem;padding:.5rem;border:1px solid #ccc;text-align:center">ESF-${escapar(pedido.token)}</div>`;
  }

  // Botón enviar por WhatsApp
  $('#btn-enviar-wa').onclick = () => enviarPorWhatsApp(pedido);

  // Botón favorito en ticket
  actualizarBotonFavTicket(pedido);
  $('#btn-fav-ticket').onclick = () => {
    if (pedidoEsFavorito(pedido)) return;
    mostrarModalFavorito(pedido);
  };

  // Botón repetir en ticket
  $('#btn-repetir-ticket').onclick = () => repetirPedido(pedido);
}

function enviarPorWhatsApp(pedido) {
  const retiroISO = pedido.retiroISO || pedido.slotISO;
  const horaRetiro = new Date(retiroISO).toLocaleTimeString('es-AR', {
    hour: '2-digit', minute: '2-digit',
  });
  const listaIng = (cat, etq) => {
    const items = pedido.items[cat];
    if (items.length === 0) return '';
    return `*${etq}:* ${items.map((i) => i.nombre).join(', ')}\n`;
  };

  const lineas = [
    `🥪 *ESTANCIA SAN FRANCISCO*`,
    `_${CONFIG.sucursalNombre}_`,
    '',
    `*PEDIDO #${String(pedido.numero).padStart(3, '0')}*`,
    `⏱ Retira a las *${horaRetiro} hs*`,
    '',
    `👤 ${pedido.cliente.nombre}`,
    `📱 +${pedido.cliente.telefono}`,
    '',
    listaIng('pan', 'PAN'),
    listaIng('embutido', 'FIAMBRES'),
    listaIng('queso', 'QUESOS'),
    listaIng('encurtido', 'ENCURTIDOS'),
    listaIng('aderezo', 'ADEREZOS'),
    listaIng('acompanamiento', 'ACOMPAÑAM.'),
    listaIng('bebida', 'BEBIDA'),
    pedido.notas ? `📝 *Nota:* ${pedido.notas}\n` : '',
    '💰 Cobrar por peso al retirar',
    `🎫 Código: ESF-${pedido.token}`,
  ].filter(Boolean).join('\n');

  const url = `https://wa.me/${CONFIG.whatsappLocal}?text=${encodeURIComponent(lineas)}`;
  window.open(url, '_blank');
}

// ============================================================
// PERSISTENCIA (localStorage)
// ============================================================
const STORAGE_PREF = 'sf_pref_';
const STORAGE_HIST = 'sf_pedidos';
const STORAGE_FAV = 'sf_favoritos';

function leerPref(k) {
  try { return localStorage.getItem(STORAGE_PREF + k); } catch { return null; }
}
function guardarPref(k, v) {
  try { localStorage.setItem(STORAGE_PREF + k, v); } catch {}
}

function cargarHistorial() {
  try {
    const raw = localStorage.getItem(STORAGE_HIST);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function guardarPedido(pedido) {
  const lista = cargarHistorial();
  lista.unshift(pedido);
  // Limitar a 50 pedidos
  const recortada = lista.slice(0, 50);
  try { localStorage.setItem(STORAGE_HIST, JSON.stringify(recortada)); } catch {}
}

// ============================================================
// FAVORITOS (localStorage)
// ============================================================
function cargarFavoritos() {
  try {
    const raw = localStorage.getItem(STORAGE_FAV);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function guardarFavoritos(lista) {
  try { localStorage.setItem(STORAGE_FAV, JSON.stringify(lista)); } catch {}
}

function agregarFavorito(fav) {
  const lista = cargarFavoritos();
  lista.unshift(fav);
  guardarFavoritos(lista.slice(0, 30));
}

function eliminarFavorito(id) {
  const lista = cargarFavoritos().filter((f) => f.id !== id);
  guardarFavoritos(lista);
}

function pedidoEsFavorito(pedido) {
  const favs = cargarFavoritos();
  return favs.some((f) => itemsIguales(f.items, pedido.items));
}

function itemsIguales(a, b) {
  const cats = ['pan', 'embutido', 'queso', 'encurtido', 'aderezo', 'acompanamiento', 'bebida'];
  return cats.every((cat) => {
    const idsA = (a[cat] || []).map((i) => i.id).sort().join(',');
    const idsB = (b[cat] || []).map((i) => i.id).sort().join(',');
    return idsA === idsB;
  });
}

function resumenIngredientes(items) {
  const cats = [
    { etq: 'Pan', cat: 'pan' },
    { etq: 'Fiambres', cat: 'embutido' },
    { etq: 'Quesos', cat: 'queso' },
  ];
  return cats
    .filter(({ cat }) => (items[cat] || []).length > 0)
    .map(({ etq, cat }) => `${etq}: ${items[cat].map((i) => i.nombre).join(', ')}`)
    .join(' · ') || 'Sándwich';
}

// ============================================================
// HISTORIAL
// ============================================================
function renderHistorial() {
  const lista = cargarHistorial();
  const cont = $('#lista-historial');

  // Render favoritos section
  renderFavoritosHistorial();

  if (lista.length === 0) {
    cont.innerHTML = `
      <div class="historial-vacio">
        Todavía no hiciste ningún pedido.<br><br>
        <button class="btn-stamp" data-ir-a="menu">Armar uno ahora →</button>
      </div>
    `;
    return;
  }

  // Agrupar por fecha
  const grupos = {};
  lista.forEach((p) => {
    const d = new Date(p.creadoEn);
    const clave = d.toLocaleDateString('es-AR', { weekday: 'long', day: '2-digit', month: 'long' });
    if (!grupos[clave]) grupos[clave] = [];
    grupos[clave].push(p);
  });

  const categoriasDetalle = [
    { etq: 'Pan', cat: 'pan' },
    { etq: 'Fiambres', cat: 'embutido' },
    { etq: 'Quesos', cat: 'queso' },
    { etq: 'Encurtidos', cat: 'encurtido' },
    { etq: 'Aderezos', cat: 'aderezo' },
    { etq: 'Acompañam.', cat: 'acompanamiento' },
    { etq: 'Bebida', cat: 'bebida' },
  ];

  let html = '';
  for (const [fechaGrupo, pedidos] of Object.entries(grupos)) {
    html += `<div class="historial-fecha-grupo">${escapar(fechaGrupo)}</div>`;
    html += pedidos.map((p) => {
      const hora = new Date(p.retiroISO || p.slotISO || p.creadoEn).toLocaleTimeString('es-AR', {
        hour: '2-digit', minute: '2-digit',
      });
      const ingsHTML = categoriasDetalle
        .filter(({ cat }) => {
          const items = p.items[cat] || p.items.vegetal || [];
          return cat === 'encurtido'
            ? (p.items.encurtido || p.items.vegetal || []).length > 0
            : (p.items[cat] || []).length > 0;
        })
        .map(({ etq, cat }) => {
          const items = cat === 'encurtido'
            ? (p.items.encurtido || p.items.vegetal || [])
            : (p.items[cat] || []);
          return `
            <div class="historial-ing-cat">
              <span class="historial-ing-etq">${etq}</span>
              <span class="historial-ing-val">${escapar(items.map((i) => i.nombre).join(' · '))}</span>
            </div>
          `;
        }).join('');
      return `
        <div class="historial-item" data-token="${escapar(p.token)}">
          <div class="historial-item-header">
            <div>
              <div class="historial-num">#${String(p.numero).padStart(3, '0')}</div>
              <div class="historial-fecha">Retira ${hora} hs</div>
            </div>
            <div class="historial-fecha">${escapar(p.cliente?.nombre || '')}</div>
          </div>
          <div class="historial-item-ings">
            ${ingsHTML}
          </div>
          <div class="historial-item-footer">
            <button class="btn-repetir" data-repetir="${escapar(p.token)}" type="button">Repetir pedido →</button>
            <button class="btn-ver-ticket" data-ver="${escapar(p.token)}" type="button">Ver ticket</button>
          </div>
        </div>
      `;
    }).join('');
  }

  cont.innerHTML = html;

  // Listeners: ver ticket
  cont.querySelectorAll('[data-ver]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const p = lista.find((x) => x.token === btn.dataset.ver);
      if (p) {
        estado.pedidoActual = p;
        mostrarVista('ticket');
        renderTicket(p);
      }
    });
  });

  // Listeners: repetir pedido
  cont.querySelectorAll('[data-repetir]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const p = lista.find((x) => x.token === btn.dataset.repetir);
      if (p) repetirPedido(p);
    });
  });
}

// ============================================================
// REPETIR PEDIDO — carga selección y va al cierre
// ============================================================
function repetirPedido(pedido) {
  // Cargar items en selección
  estado.seleccion = {
    pan: new Set((pedido.items.pan || []).map((i) => i.id)),
    embutido: new Set((pedido.items.embutido || []).map((i) => i.id)),
    queso: new Set((pedido.items.queso || []).map((i) => i.id)),
    encurtido: new Set((pedido.items.encurtido || pedido.items.vegetal || []).map((i) => i.id)),
    aderezo: new Set((pedido.items.aderezo || pedido.items.condimento || []).map((i) => i.id)),
    acompanamiento: new Set((pedido.items.acompanamiento || []).map((i) => i.id)),
    bebida: new Set((pedido.items.bebida || []).map((i) => i.id)),
  };
  estado.nombre = leerPref('cliente_nombre') || '';
  estado.telefono = leerPref('cliente_telefono') || '';
  estado.horaRetiro = '';
  estado.notas = '';
  estado.paso = PASOS.length; // Ir directo al cierre

  const vistaTarget = 'wizard';
  $$('.vista').forEach((v) => v.hidden = v.dataset.vista !== vistaTarget);
  window.scrollTo({ top: 0, behavior: 'smooth' });
  renderPaso();
}

function repetirDesdeFavorito(fav) {
  // Crear un pedido simulado con los items del favorito para reutilizar repetirPedido
  repetirPedido({ items: fav.items });
}

// ============================================================
// FAVORITOS — UI
// ============================================================
function mostrarModalFavorito(pedido) {
  const defaultNombre = resumenIngredientes(pedido.items);
  const overlay = document.createElement('div');
  overlay.className = 'modal-fav-overlay';
  overlay.innerHTML = `
    <div class="modal-fav">
      <div class="modal-fav-titulo">Guardar favorito</div>
      <div class="modal-fav-sub">Ponele un nombre para encontrarlo fácil.</div>
      <label class="campo">
        <span class="campo-label">Nombre</span>
        <input type="text" class="campo-input" id="input-fav-nombre"
               value="${escapar(defaultNombre)}" maxlength="60" placeholder="Mi clásico">
      </label>
      <div class="modal-fav-acciones">
        <button class="btn-stamp btn-ghost" id="btn-fav-cancelar" type="button">Cancelar</button>
        <button class="btn-stamp" id="btn-fav-guardar" type="button">Guardar ★</button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  const inputNombre = overlay.querySelector('#input-fav-nombre');
  inputNombre.focus();
  inputNombre.select();

  overlay.querySelector('#btn-fav-cancelar').addEventListener('click', () => overlay.remove());
  overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });

  overlay.querySelector('#btn-fav-guardar').addEventListener('click', () => {
    const nombre = inputNombre.value.trim() || defaultNombre;
    const fav = {
      id: generarToken(),
      nombre,
      items: pedido.items,
      creadoEn: new Date().toISOString(),
    };
    agregarFavorito(fav);
    overlay.remove();
    // Actualizar botón en ticket
    actualizarBotonFavTicket(pedido);
  });
}

function actualizarBotonFavTicket(pedido) {
  const btn = $('#btn-fav-ticket');
  if (!btn) return;
  const esFav = pedidoEsFavorito(pedido);
  btn.innerHTML = esFav
    ? '<span class="fav-star">★</span> Favorito guardado'
    : '<span class="fav-star">☆</span> Guardar favorito';
}

function renderFavoritosHistorial() {
  const cont = $('#favoritos-historial');
  if (!cont) return;
  const favs = cargarFavoritos();

  if (favs.length === 0) {
    cont.innerHTML = '';
    return;
  }

  const categoriasDetalle = [
    { etq: 'Pan', cat: 'pan' },
    { etq: 'Fiambres', cat: 'embutido' },
    { etq: 'Quesos', cat: 'queso' },
    { etq: 'Encurtidos', cat: 'encurtido' },
    { etq: 'Aderezos', cat: 'aderezo' },
  ];

  const favsHTML = favs.map((f) => {
    const ingsResumen = categoriasDetalle
      .filter(({ cat }) => (f.items[cat] || []).length > 0)
      .map(({ etq, cat }) => `${etq}: ${f.items[cat].map((i) => i.nombre).join(', ')}`)
      .join(' · ');
    return `
      <div class="favorito-card" data-fav-id="${escapar(f.id)}">
        <div class="favorito-header">
          <div class="favorito-nombre">${escapar(f.nombre)}</div>
          <button class="btn-unfav" data-unfav="${escapar(f.id)}" type="button" title="Quitar de favoritos">★</button>
        </div>
        <div class="favorito-ings">${escapar(ingsResumen)}</div>
        <div class="favorito-footer">
          <button class="btn-repetir" data-pedir-fav="${escapar(f.id)}" type="button">Pedir →</button>
        </div>
      </div>
    `;
  }).join('');

  cont.innerHTML = `
    <div class="favoritos-seccion">
      <span class="kicker">★ Mis favoritos</span>
      ${favsHTML}
    </div>
  `;

  // Listeners: quitar favorito
  cont.querySelectorAll('[data-unfav]').forEach((btn) => {
    btn.addEventListener('click', () => {
      eliminarFavorito(btn.dataset.unfav);
      renderFavoritosHistorial();
      renderLandingFavoritos();
    });
  });

  // Listeners: pedir desde favorito
  cont.querySelectorAll('[data-pedir-fav]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const fav = favs.find((f) => f.id === btn.dataset.pedirFav);
      if (fav) repetirDesdeFavorito(fav);
    });
  });
}

function renderLandingFavoritos() {
  const cont = $('#landing-favoritos');
  if (!cont) return;
  const favs = cargarFavoritos();

  if (favs.length === 0) {
    cont.innerHTML = '';
    return;
  }

  cont.innerHTML = `
    <button class="link-favoritos-landing" data-ir-a="historial" type="button">
      ★ Tus favoritos (${favs.length}) →
    </button>
  `;
}

// ============================================================
// AUTH — registro + OTP (modo dev: código por consola)
// ============================================================

const AUTH_KEY = 'sf_cliente';
const OTP_KEY = 'sf_otp_pendiente';
const OTP_TTL_MIN = 5;
const OTP_REENVIO_SEG = 60;

function leerCliente() {
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    // Validar estructura mínima
    if (!data.telefono || !data.nombre || !data.verificadoEn) return null;
    return data;
  } catch { return null; }
}

function guardarCliente(cliente) {
  localStorage.setItem(AUTH_KEY, JSON.stringify(cliente));
}

function cerrarSesion() {
  if (!confirm('¿Cerrar sesión? Vas a tener que volver a registrarte.')) return;
  localStorage.removeItem(AUTH_KEY);
  localStorage.removeItem(OTP_KEY);
  mostrarVista('bienvenida');
  resetFormularioBienvenida();
}

function normalizarTelefono(tel) {
  return tel.replace(/\D/g, '');
}

function telefonoValido(tel) {
  const limpio = normalizarTelefono(tel);
  return limpio.length >= 10;
}

// MODO DEMO: código fijo para presentaciones (sin entrar a consola)
// En producción, esta función se reemplaza por generación aleatoria + envío real por WhatsApp
const CODIGO_DEMO_FIJO = '123456';

function generarCodigoOTP() {
  return CODIGO_DEMO_FIJO;
}

// MODO DEV: en vez de mandar por WhatsApp, loguea en consola
function enviarOTPDev(telefono, codigo, nombre) {
  console.log('═══════════════════════════════════════════');
  console.log(`[DEV-ONLY-OTP] Estancia San Francisco`);
  console.log(`Para: ${nombre} (${telefono})`);
  console.log(`Código: ${codigo}`);
  console.log(`Vence en ${OTP_TTL_MIN} minutos`);
  console.log('═══════════════════════════════════════════');
}

// ============================================================
// API CLIENT: llamadas al backend con fallback a localStorage
// ============================================================
const API_BASE = ''; // mismo origen
const USAR_BACKEND = true; // si falla la red, hacemos fallback

async function apiPost(url, data) {
  try {
    const res = await fetch(API_BASE + url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json().catch(() => ({}));
    return { ok: res.ok, status: res.status, data: json };
  } catch (err) {
    console.warn('[API] fetch falló:', err);
    return { ok: false, status: 0, data: { error: 'Sin conexión' } };
  }
}

async function apiGet(url) {
  try {
    const res = await fetch(API_BASE + url);
    const json = await res.json().catch(() => ({}));
    return { ok: res.ok, status: res.status, data: json };
  } catch (err) {
    console.warn('[API] fetch falló:', err);
    return { ok: false, status: 0, data: { error: 'Sin conexión' } };
  }
}

async function solicitarOTP(telefono, nombre) {
  const telLimpio = normalizarTelefono(telefono);
  const nombreLimpio = nombre.trim();

  if (USAR_BACKEND) {
    const res = await apiPost('/api/auth/solicitar-otp', {
      telefono: telLimpio,
      nombre: nombreLimpio,
    });

    if (res.ok && res.data.ok) {
      // Guardamos la metadata localmente para la UI (no el código)
      const otp = {
        telefono: telLimpio,
        nombre: nombreLimpio,
        creadoEn: Date.now(),
        expiraEn: new Date(res.data.expira_en).getTime(),
        intentos: 0,
        backend: true,
      };
      localStorage.setItem(OTP_KEY, JSON.stringify(otp));
      return { ok: true, otp };
    }

    // Si el backend respondió con error de negocio (429, 400), devolverlo
    if (res.status >= 400 && res.status < 500 && res.data?.error) {
      return { ok: false, error: res.data.error };
    }
    // Si fue error de red/5xx, hacer fallback local SOLO si no había backend
    console.warn('[OTP] Backend falló, usando modo local de demo');
  }

  // Fallback: generación local con código fijo de demo
  const codigo = generarCodigoOTP();
  const ahora = Date.now();
  const otp = {
    telefono: telLimpio,
    nombre: nombreLimpio,
    codigo,
    creadoEn: ahora,
    expiraEn: ahora + OTP_TTL_MIN * 60_000,
    intentos: 0,
    backend: false,
  };
  localStorage.setItem(OTP_KEY, JSON.stringify(otp));
  enviarOTPDev(otp.telefono, codigo, otp.nombre);
  return { ok: true, otp };
}

function leerOTPPendiente() {
  try {
    const raw = localStorage.getItem(OTP_KEY);
    if (!raw) return null;
    const otp = JSON.parse(raw);
    if (Date.now() > otp.expiraEn) {
      localStorage.removeItem(OTP_KEY);
      return null;
    }
    return otp;
  } catch { return null; }
}

async function verificarOTP(codigoIngresado) {
  const otp = leerOTPPendiente();
  if (!otp) return { ok: false, error: 'El código venció. Pedí uno nuevo.' };

  // Si fue generado por el backend, validar contra el backend
  if (otp.backend && USAR_BACKEND) {
    const res = await apiPost('/api/auth/verificar-otp', {
      telefono: otp.telefono,
      codigo: codigoIngresado,
      nombre: otp.nombre,
    });

    if (res.ok && res.data.ok) {
      const cliente = {
        id: res.data.cliente.id,
        telefono: res.data.cliente.telefono,
        nombre: res.data.cliente.nombre,
        verificadoEn: new Date().toISOString(),
        token: res.data.cliente.token,
        expiraEn: res.data.cliente.expira_en,
      };
      guardarCliente(cliente);
      localStorage.removeItem(OTP_KEY);
      return { ok: true, cliente };
    }
    return { ok: false, error: res.data?.error || 'Error verificando código' };
  }

  // Fallback: validación local
  if (otp.intentos >= 3) return { ok: false, error: 'Demasiados intentos. Pedí un código nuevo.' };
  otp.intentos += 1;
  localStorage.setItem(OTP_KEY, JSON.stringify(otp));
  if (codigoIngresado !== otp.codigo) {
    const restantes = 3 - otp.intentos;
    return { ok: false, error: `Código incorrecto. Te quedan ${restantes} intento${restantes === 1 ? '' : 's'}.` };
  }
  const cliente = {
    id: 'cli_' + generarToken(),
    telefono: otp.telefono,
    nombre: otp.nombre,
    verificadoEn: new Date().toISOString(),
  };
  guardarCliente(cliente);
  localStorage.removeItem(OTP_KEY);
  return { ok: true, cliente };
}

// ============================================================
// VISTA BIENVENIDA — render dinámico
// ============================================================

let _contadorReenvio = null;
let _contadorVencimiento = null;

function resetFormularioBienvenida() {
  if (_contadorReenvio) { clearInterval(_contadorReenvio); _contadorReenvio = null; }
  if (_contadorVencimiento) { clearInterval(_contadorVencimiento); _contadorVencimiento = null; }
  renderBienvenidaFormulario();
}

function renderBienvenidaFormulario() {
  const cont = $('#bienvenida-contenido');
  if (!cont) return;
  cont.innerHTML = `
    <span class="kicker">Para empezar</span>
    <h2 class="paso-titulo">Registrate</h2>
    <p class="paso-sub">Es solo la primera vez. Te mandamos un código por WhatsApp para confirmar que sos vos.</p>

    <label class="campo">
      <span class="campo-label">Tu nombre</span>
      <input type="text" class="campo-input" id="bienv-nombre" placeholder="Cómo te llamamos">
    </label>

    <label class="campo">
      <span class="campo-label">Tu WhatsApp</span>
      <input type="tel" class="campo-input" id="bienv-telefono" placeholder="11 1234 5678">
      <span class="campo-hint">Solo lo usamos para confirmar el pedido. No mandamos publicidad.</span>
    </label>

    <div class="error-box" id="bienv-error" hidden></div>

    <button class="btn-stamp" id="bienv-enviar" type="button" disabled>
      Recibir código por WhatsApp →
    </button>
  `;

  const $nombre = $('#bienv-nombre');
  const $tel = $('#bienv-telefono');
  const $btn = $('#bienv-enviar');

  const validar = () => {
    $btn.disabled = !($nombre.value.trim().length >= 2 && telefonoValido($tel.value));
  };
  $nombre.addEventListener('input', validar);
  $tel.addEventListener('input', validar);

  $btn.addEventListener('click', async () => {
    const nombre = $nombre.value.trim();
    const telefono = $tel.value.trim();
    if (!telefonoValido(telefono)) return;

    $btn.disabled = true;
    $btn.textContent = 'Enviando código...';
    const res = await solicitarOTP(telefono, nombre);

    if (!res.ok) {
      const $err = $('#bienv-error');
      if ($err) {
        $err.textContent = res.error || 'No pudimos enviar el código. Probá de nuevo.';
        $err.hidden = false;
      }
      $btn.disabled = false;
      $btn.textContent = 'Recibir código por WhatsApp →';
      return;
    }
    renderBienvenidaCodigoInput();
  });
}

function renderBienvenidaCodigoInput() {
  const otp = leerOTPPendiente();
  if (!otp) { renderBienvenidaFormulario(); return; }

  const cont = $('#bienvenida-contenido');
  cont.innerHTML = `
    <span class="kicker">Casi listo</span>
    <h2 class="paso-titulo">Ingresá el código</h2>
    <p class="paso-sub">Te mandamos un código de 6 dígitos a tu WhatsApp <strong>+${escapar(otp.telefono)}</strong>.</p>

    <div class="otp-aviso-dev" id="otp-aviso-dev">
      ⚡ <strong>Modo demo:</strong> el código es <span class="otp-codigo-demo">123456</span>
    </div>

    <label class="campo">
      <span class="campo-label">Código de 6 dígitos</span>
      <input type="text" inputmode="numeric" pattern="[0-9]*" maxlength="6"
             class="campo-input campo-codigo" id="bienv-codigo" placeholder="000000" autocomplete="one-time-code">
      <span class="campo-hint" id="bienv-timer">Vence en <span id="bienv-min">5</span> min <span id="bienv-seg">00</span> s</span>
    </label>

    <div class="error-box" id="bienv-error" hidden></div>

    <button class="btn-stamp" id="bienv-verificar" type="button" disabled>
      Verificar y empezar →
    </button>

    <div class="otp-acciones">
      <button class="link-secundario" id="bienv-reenviar" type="button" disabled>
        Reenviar código <span id="reenvio-timer">(${OTP_REENVIO_SEG}s)</span>
      </button>
      <button class="link-secundario" id="bienv-volver" type="button">
        ← Cambiar datos
      </button>
    </div>
  `;

  const $cod = $('#bienv-codigo');
  const $btn = $('#bienv-verificar');
  const $err = $('#bienv-error');

  $cod.addEventListener('input', () => {
    $cod.value = $cod.value.replace(/\D/g, '');
    $btn.disabled = $cod.value.length !== 6;
    $err.hidden = true;
  });

  $btn.addEventListener('click', async () => {
    $btn.disabled = true;
    $btn.textContent = 'Verificando...';
    const res = await verificarOTP($cod.value);
    if (!res.ok) {
      $err.textContent = res.error;
      $err.hidden = false;
      $btn.disabled = false;
      $btn.textContent = 'Verificar y empezar →';
      // Si se agotaron los intentos, volver al formulario
      const otpActual = leerOTPPendiente();
      if (!otpActual || otpActual.intentos >= 3) {
        setTimeout(() => {
          localStorage.removeItem(OTP_KEY);
          resetFormularioBienvenida();
        }, 2500);
      }
      return;
    }
    // OK: entrar a la app
    mostrarVista('landing');
    actualizarSaludoLanding();
  });

  $('#bienv-volver').addEventListener('click', () => {
    localStorage.removeItem(OTP_KEY);
    resetFormularioBienvenida();
  });

  $('#bienv-reenviar').addEventListener('click', async () => {
    const otpActual = leerOTPPendiente() || otp;
    await solicitarOTP(otpActual.telefono, otpActual.nombre);
    renderBienvenidaCodigoInput();
  });

  iniciarContadores(otp);
  setTimeout(() => $cod.focus(), 100);
}

function iniciarContadores(otp) {
  // Reenvío
  let segReenvio = OTP_REENVIO_SEG;
  if (_contadorReenvio) clearInterval(_contadorReenvio);
  _contadorReenvio = setInterval(() => {
    segReenvio -= 1;
    const $reenv = $('#bienv-reenviar');
    const $timer = $('#reenvio-timer');
    if (!$reenv) { clearInterval(_contadorReenvio); return; }
    if (segReenvio <= 0) {
      $reenv.disabled = false;
      if ($timer) $timer.textContent = '';
      clearInterval(_contadorReenvio);
    } else if ($timer) {
      $timer.textContent = `(${segReenvio}s)`;
    }
  }, 1000);

  // Vencimiento
  if (_contadorVencimiento) clearInterval(_contadorVencimiento);
  _contadorVencimiento = setInterval(() => {
    const otpActual = leerOTPPendiente();
    if (!otpActual) {
      clearInterval(_contadorVencimiento);
      const $err = $('#bienv-error');
      if ($err) { $err.textContent = 'El código venció. Pedí uno nuevo.'; $err.hidden = false; }
      return;
    }
    const restanteMs = otpActual.expiraEn - Date.now();
    const min = Math.floor(restanteMs / 60_000);
    const seg = Math.floor((restanteMs % 60_000) / 1000);
    const $min = $('#bienv-min');
    const $seg = $('#bienv-seg');
    if ($min) $min.textContent = min;
    if ($seg) $seg.textContent = String(seg).padStart(2, '0');
  }, 500);
}

// ============================================================
// SALUDO PERSONALIZADO EN LANDING
// ============================================================
function actualizarSaludoLanding() {
  const cliente = leerCliente();
  const $saludo = $('#saludo-personal');
  const $btnSesion = $('#btn-cerrar-sesion');
  if (cliente && $saludo) {
    $saludo.innerHTML = `Hola, <strong>${escapar(cliente.nombre)}</strong>. ¿Qué vas a pedir hoy?`;
    $saludo.hidden = false;
  } else if ($saludo) {
    $saludo.hidden = true;
  }
  if ($btnSesion) {
    $btnSesion.hidden = !cliente;
    // Enganchar listener una sola vez
    if (!$btnSesion.dataset.listener) {
      $btnSesion.addEventListener('click', cerrarSesion);
      $btnSesion.dataset.listener = '1';
    }
  }
}

// ============================================================
// INIT
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  pintarFecha();

  const cliente = leerCliente();
  if (cliente) {
    // Cliente registrado: mostrar landing con saludo
    mostrarVista('landing');
    actualizarSaludoLanding();
    renderLandingFavoritos();
  } else {
    // Sin sesión: mostrar bienvenida
    mostrarVista('bienvenida');
    // Si quedó un OTP pendiente, reanudar
    if (leerOTPPendiente()) {
      renderBienvenidaCodigoInput();
    } else {
      renderBienvenidaFormulario();
    }
  }
});
