import ExcelJS from 'exceljs';
import { supabaseAdmin } from '../../_lib/supabase.js';
import { autenticarAdmin } from '../../_lib/admin-auth.js';
import { jsonResponse } from '../../_lib/helpers.js';

export const runtime = 'nodejs';

// Etiquetas humanas por estado
const ESTADO_LABEL = {
  pendiente: 'Pendiente',
  preparando: 'En cocina',
  listo: 'Listo',
  retirado: 'Retirado',
  cancelado: 'Cancelado',
};

function formatFecha(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

function formatHora(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleTimeString('es-AR', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function resumenItems(items) {
  if (!items) return '';
  const partes = [];
  const pan = items.pan?.[0]?.nombre;
  if (pan) partes.push(`Pan: ${pan}`);
  if (items.embutido?.length) partes.push(`Fiambres: ${items.embutido.map(i => i.nombre).join(', ')}`);
  if (items.queso?.length) partes.push(`Quesos: ${items.queso.map(i => i.nombre).join(', ')}`);
  if (items.encurtido?.length) partes.push(`Encurtidos: ${items.encurtido.map(i => i.nombre).join(', ')}`);
  if (items.aderezo?.length) partes.push(`Aderezos: ${items.aderezo.map(i => i.nombre).join(', ')}`);
  if (items.acompanamiento?.length) partes.push(`Acomp.: ${items.acompanamiento.map(i => i.nombre).join(', ')}`);
  if (items.bebida?.length) partes.push(`Bebidas: ${items.bebida.map(i => i.nombre).join(', ')}`);
  return partes.join(' | ');
}

function contarItems(items) {
  if (!items) return 0;
  return (
    (items.pan?.length || 0) +
    (items.embutido?.length || 0) +
    (items.queso?.length || 0) +
    (items.encurtido?.length || 0) +
    (items.aderezo?.length || 0) +
    (items.acompanamiento?.length || 0) +
    (items.bebida?.length || 0)
  );
}

// Cuenta cuántas veces aparece cada producto en todos los pedidos
function contarProductos(pedidos, categoria) {
  const conteo = {};
  for (const p of pedidos) {
    const items = p.items?.[categoria] || [];
    for (const it of items) {
      const nombre = it.nombre;
      if (!nombre) continue;
      conteo[nombre] = (conteo[nombre] || 0) + 1;
    }
  }
  return Object.entries(conteo)
    .sort((a, b) => b[1] - a[1])
    .map(([nombre, cantidad]) => ({ nombre, cantidad }));
}

export async function GET(request) {
  const auth = autenticarAdmin(request);
  if (!auth.ok) return jsonResponse({ ok: false, error: auth.error }, auth.status);

  const url = new URL(request.url);
  const desde = url.searchParams.get('desde'); // YYYY-MM-DD
  const hasta = url.searchParams.get('hasta'); // YYYY-MM-DD

  // Default: hoy
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const desdeDate = desde ? new Date(desde + 'T00:00:00') : hoy;
  const hastaDate = hasta
    ? new Date(hasta + 'T23:59:59.999')
    : (() => { const d = new Date(); d.setHours(23, 59, 59, 999); return d; })();

  // Pedidos del rango
  const { data: pedidos, error } = await supabaseAdmin
    .from('pedidos')
    .select(
      `id, numero_pedido_dia, token, items, notas, hora_retiro_txt,
       estado, cancelado_en, retirado_en, created_at,
       cliente:clientes ( nombre, telefono )`
    )
    .gte('created_at', desdeDate.toISOString())
    .lte('created_at', hastaDate.toISOString())
    .order('created_at', { ascending: true });

  if (error) {
    console.error('[export] Error consultando:', error);
    return jsonResponse({ ok: false, error: 'Error consultando datos' }, 500);
  }

  const lista = pedidos || [];

  // Para el resumen semanal: traer también pedidos de los últimos 7 días contando desde hoy
  const sieteAtras = new Date();
  sieteAtras.setDate(sieteAtras.getDate() - 6);
  sieteAtras.setHours(0, 0, 0, 0);
  const finHoy = new Date();
  finHoy.setHours(23, 59, 59, 999);

  const { data: semanal } = await supabaseAdmin
    .from('pedidos')
    .select('estado, created_at')
    .gte('created_at', sieteAtras.toISOString())
    .lte('created_at', finHoy.toISOString());

  // === CREAR WORKBOOK ===
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Estancia San Francisco';
  workbook.created = new Date();

  // =============================================================
  // HOJA 1 — VENTAS
  // =============================================================
  const wsVentas = workbook.addWorksheet('Ventas', {
    properties: { defaultColWidth: 15 },
  });

  // Estilos reutilizables
  const colorAmarillo = 'FFF2C53D';
  const colorNegro = 'FF0F0F0F';
  const colorCrema = 'FFF5F1E8';

  // Título del reporte
  wsVentas.mergeCells('A1:K1');
  wsVentas.getCell('A1').value = 'ESTANCIA SAN FRANCISCO — Reporte de ventas';
  wsVentas.getCell('A1').font = { bold: true, size: 16, color: { argb: 'FFFFFFFF' } };
  wsVentas.getCell('A1').fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: colorNegro },
  };
  wsVentas.getCell('A1').alignment = { vertical: 'middle', horizontal: 'left' };
  wsVentas.getRow(1).height = 30;

  wsVentas.mergeCells('A2:K2');
  wsVentas.getCell('A2').value = `Sucursal El Cano · Av. El Cano 3202 · Generado: ${new Date().toLocaleString('es-AR')}`;
  wsVentas.getCell('A2').font = { italic: true, size: 9, color: { argb: 'FF5C5C5C' } };
  wsVentas.getRow(2).height = 20;

  wsVentas.addRow([]);

  // === RESUMEN DIARIO ===
  const rangoTexto =
    formatFecha(desdeDate.toISOString()) === formatFecha(hastaDate.toISOString())
      ? `Período: ${formatFecha(desdeDate.toISOString())}`
      : `Período: ${formatFecha(desdeDate.toISOString())} → ${formatFecha(hastaDate.toISOString())}`;

  const filaResumenHeader = wsVentas.addRow([rangoTexto]);
  filaResumenHeader.font = { bold: true, size: 12 };
  filaResumenHeader.getCell(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: colorAmarillo },
  };
  wsVentas.mergeCells(`A${filaResumenHeader.number}:K${filaResumenHeader.number}`);

  // Conteo de estados del período seleccionado
  const conteoEstados = { pendiente: 0, preparando: 0, listo: 0, retirado: 0, cancelado: 0 };
  let totalItemsPeriodo = 0;
  for (const p of lista) {
    if (conteoEstados[p.estado] !== undefined) conteoEstados[p.estado] += 1;
    totalItemsPeriodo += contarItems(p.items);
  }

  wsVentas.addRow(['Total pedidos', lista.length]);
  wsVentas.addRow(['Pendientes', conteoEstados.pendiente]);
  wsVentas.addRow(['En cocina', conteoEstados.preparando]);
  wsVentas.addRow(['Listos', conteoEstados.listo]);
  wsVentas.addRow(['Retirados', conteoEstados.retirado]);
  wsVentas.addRow(['Cancelados', conteoEstados.cancelado]);
  wsVentas.addRow(['Total items vendidos', totalItemsPeriodo]);

  wsVentas.addRow([]);

  // === RESUMEN SEMANAL (últimos 7 días) ===
  const filaSemanaHeader = wsVentas.addRow([`Últimos 7 días (${formatFecha(sieteAtras.toISOString())} → ${formatFecha(finHoy.toISOString())})`]);
  filaSemanaHeader.font = { bold: true, size: 12 };
  filaSemanaHeader.getCell(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: colorAmarillo },
  };
  wsVentas.mergeCells(`A${filaSemanaHeader.number}:K${filaSemanaHeader.number}`);

  const semanalList = semanal || [];
  const conteoSemanal = { pendiente: 0, preparando: 0, listo: 0, retirado: 0, cancelado: 0 };
  for (const p of semanalList) {
    if (conteoSemanal[p.estado] !== undefined) conteoSemanal[p.estado] += 1;
  }

  wsVentas.addRow(['Total pedidos semana', semanalList.length]);
  wsVentas.addRow(['Retirados', conteoSemanal.retirado]);
  wsVentas.addRow(['Cancelados', conteoSemanal.cancelado]);
  wsVentas.addRow(['Promedio diario', (semanalList.length / 7).toFixed(1)]);

  wsVentas.addRow([]);
  wsVentas.addRow([]);

  // === TABLA DE PEDIDOS ===
  const headerPedidos = [
    'N°', 'Fecha', 'Hora pedido', 'Hora retiro', 'Cliente', 'Teléfono',
    'Estado', 'Cant. items', 'Detalle', 'Notas', 'Retirado a las',
  ];
  const filaHeader = wsVentas.addRow(headerPedidos);
  filaHeader.font = { bold: true, color: { argb: 'FFFFFFFF' } };
  filaHeader.eachCell((cell) => {
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: colorNegro },
    };
    cell.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };
  });
  filaHeader.height = 22;

  for (const p of lista) {
    wsVentas.addRow([
      p.numero_pedido_dia,
      formatFecha(p.created_at),
      formatHora(p.created_at),
      p.hora_retiro_txt,
      p.cliente?.nombre || '',
      '+' + (p.cliente?.telefono || ''),
      ESTADO_LABEL[p.estado] || p.estado,
      contarItems(p.items),
      resumenItems(p.items),
      p.notas || '',
      p.retirado_en ? formatHora(p.retirado_en) : '',
    ]);
  }

  // Ancho de columnas
  wsVentas.columns = [
    { width: 6 },   // N°
    { width: 12 },  // Fecha
    { width: 10 },  // Hora pedido
    { width: 10 },  // Hora retiro
    { width: 20 },  // Cliente
    { width: 16 },  // Teléfono
    { width: 12 },  // Estado
    { width: 8 },   // Cant items
    { width: 60 },  // Detalle
    { width: 25 },  // Notas
    { width: 12 },  // Retirado
  ];

  // =============================================================
  // HOJA 2 — LOGÍSTICA
  // =============================================================
  const wsLog = workbook.addWorksheet('Logística', {
    properties: { defaultColWidth: 18 },
  });

  wsLog.mergeCells('A1:D1');
  wsLog.getCell('A1').value = 'LOGÍSTICA — Productos más pedidos';
  wsLog.getCell('A1').font = { bold: true, size: 16, color: { argb: 'FFFFFFFF' } };
  wsLog.getCell('A1').fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: colorNegro },
  };
  wsLog.getRow(1).height = 30;

  wsLog.mergeCells('A2:D2');
  wsLog.getCell('A2').value = `${rangoTexto} · Para preparar stock antes de la producción`;
  wsLog.getCell('A2').font = { italic: true, size: 9, color: { argb: 'FF5C5C5C' } };
  wsLog.getRow(2).height = 20;

  wsLog.addRow([]);

  // Función helper para agregar una sección de top productos
  function agregarSeccion(titulo, datos, columnaStart = 1) {
    const startRow = wsLog.rowCount + 1;
    const headerCell = wsLog.getCell(startRow, columnaStart);
    headerCell.value = titulo;
    wsLog.mergeCells(startRow, columnaStart, startRow, columnaStart + 1);
    headerCell.font = { bold: true, size: 12, color: { argb: colorNegro } };
    headerCell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: colorAmarillo },
    };
    headerCell.alignment = { horizontal: 'left' };

    const headerColRow = wsLog.getRow(startRow + 1);
    headerColRow.getCell(columnaStart).value = 'Producto';
    headerColRow.getCell(columnaStart + 1).value = 'Cantidad';
    headerColRow.getCell(columnaStart).font = { bold: true };
    headerColRow.getCell(columnaStart + 1).font = { bold: true };
    headerColRow.getCell(columnaStart).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: colorCrema },
    };
    headerColRow.getCell(columnaStart + 1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: colorCrema },
    };

    for (const item of datos) {
      const r = wsLog.addRow([]);
      r.getCell(columnaStart).value = item.nombre;
      r.getCell(columnaStart + 1).value = item.cantidad;
    }
    if (datos.length === 0) {
      const r = wsLog.addRow([]);
      r.getCell(columnaStart).value = '(sin datos)';
      r.getCell(columnaStart).font = { italic: true, color: { argb: 'FF5C5C5C' } };
    }
    wsLog.addRow([]);
  }

  agregarSeccion('PANES', contarProductos(lista, 'pan'));
  agregarSeccion('FIAMBRES', contarProductos(lista, 'embutido'));
  agregarSeccion('QUESOS', contarProductos(lista, 'queso'));
  agregarSeccion('ENCURTIDOS', contarProductos(lista, 'encurtido'));
  agregarSeccion('ADEREZOS', contarProductos(lista, 'aderezo'));
  agregarSeccion('ACOMPAÑAMIENTOS', contarProductos(lista, 'acompanamiento'));
  agregarSeccion('BEBIDAS', contarProductos(lista, 'bebida'));

  wsLog.columns = [
    { width: 35 },
    { width: 14 },
  ];

  // === GENERAR Y DEVOLVER ===
  const buffer = await workbook.xlsx.writeBuffer();
  const ahora = new Date();
  const yyyy = ahora.getFullYear();
  const mm = String(ahora.getMonth() + 1).padStart(2, '0');
  const dd = String(ahora.getDate()).padStart(2, '0');
  const hh = String(ahora.getHours()).padStart(2, '0');
  const mi = String(ahora.getMinutes()).padStart(2, '0');
  const filename = `estancia-sf-${yyyy}${mm}${dd}-${hh}${mi}.xlsx`;

  return new Response(buffer, {
    status: 200,
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  });
}
