// ============================================================
// Control Maquinaria — Ingeurbe
// SPA en JavaScript vanilla (sin dependencias) que replica el
// prototipo interactivo de control de maquinaria y equipos.
// ============================================================

(function () {
  'use strict';

  // ---------------------------------------------------------
  // Datos de demostración
  // ---------------------------------------------------------
  const EQUIPOS = [
    { id: 'CAT-320-A', badge: 'RE', modelo: 'CAT 320', nombre: 'Retroexcavadora', tipo: 'pesada', tipoLabel: 'Maq. Pesada', ubicacion: 'Obra Chapinero', proyecto: 'Chapinero Norte', operario: 'Carlos Mendoza', status: 'operativo', horas: 847, horasMax: 1000, ingreso: '15 ene 2025', modalidad: 'Comprada', serial: 'SN-CAT-847263', isAlquiler: false, devolucion: null, proveedor: null },
    { id: 'VOL-FCD-123', badge: 'VO', modelo: 'Ford F-750', nombre: 'Volqueta', tipo: 'vehiculo', tipoLabel: 'Vehículo', ubicacion: 'En taller', proyecto: '—', operario: 'Sin asignar', status: 'averiado', horas: 1230, horasMax: 1500, ingreso: '3 feb 2025', modalidad: 'Alquilada', serial: 'SN-FCD-123456', isAlquiler: true, devolucion: '20 ago 2026', proveedor: 'Rentamaq S.A.' },
    { id: 'COMP-WH36', badge: 'CO', modelo: 'Wacker WH36', nombre: 'Compactadora', tipo: 'pesada', tipoLabel: 'Maq. Pesada', ubicacion: 'Taller Central', proyecto: 'En servicio', operario: 'Sin asignar', status: 'en-arreglo', horas: 320, horasMax: 500, ingreso: '10 mar 2025', modalidad: 'Alquilada', serial: 'SN-WH-654321', isAlquiler: true, devolucion: '15 sep 2026', proveedor: 'Hidromaq' },
    { id: 'LEI-TS16', badge: 'ET', modelo: 'Leica TS16', nombre: 'Estación Total', tipo: 'topografia', tipoLabel: 'Topografía', ubicacion: 'Obra Usaquén', proyecto: 'Usaquén II', operario: 'María González', status: 'recien-arreglado', horas: 45, horasMax: 200, ingreso: '1 abr 2025', modalidad: 'Comprada', serial: 'SN-LEI-TS1647', isAlquiler: false, devolucion: null, proveedor: null },
    { id: 'BOS-GBH18', badge: 'MR', modelo: 'Bosch GBH 18V', nombre: 'Martillo Rotativo', tipo: 'herramienta', tipoLabel: 'Herramienta', ubicacion: 'Obra Chapinero', proyecto: 'Chapinero Norte', operario: 'Juan Pérez', status: 'operativo', horas: 112, horasMax: 300, ingreso: '20 mar 2025', modalidad: 'Comprada', serial: 'SN-BOS-GBH0421', isAlquiler: false, devolucion: null, proveedor: null },
    { id: 'AND-AC300', badge: 'AM', modelo: 'Acrow 300', nombre: 'Andamio Modular', tipo: 'andamio', tipoLabel: 'Andamio', ubicacion: 'Obra Suba', proyecto: 'Suba Residencial', operario: 'Luis Ramírez', status: 'operativo', horas: null, horasMax: null, ingreso: '5 ene 2025', modalidad: 'Alquilada', serial: 'SN-ACR-AC3001', isAlquiler: true, devolucion: '30 ago 2026', proveedor: 'AndamiCo' },
  ];

  const STATUS = {
    'operativo':         { label: 'Operativo',         color: '#28a745', bg: '#e8f8ed' },
    'averiado':          { label: 'Averiado',          color: '#dc3545', bg: '#fce8ea' },
    'en-arreglo':        { label: 'En Arreglo',        color: '#f38117', bg: '#fff3e0' },
    'recien-arreglado':  { label: 'Recién Arreglado',  color: '#6aa0ac', bg: '#e3f4f7' },
  };

  const TYPE_COLOR = { pesada: '#758b29', vehiculo: '#163544', topografia: '#6aa0ac', herramienta: '#dba444', andamio: '#81398d' };

  const HISTORIAL = [
    { tipo: 'Ingreso a obra',             fecha: '15 ene 2025', hora: '7:30 a.m.', desc: 'Ingresó a Obra Chapinero Norte',              color: '#28a745' },
    { tipo: 'Mantenimiento preventivo',   fecha: '10 dic 2024', hora: '2:00 p.m.', desc: 'Servicio a las 800 horas · Taller Ingeurbe',   color: '#f38117' },
    { tipo: 'Salida a bodega',            fecha: '5 nov 2024',  hora: '8:00 a.m.', desc: 'Retiro temporal para revisión técnica',        color: '#163544' },
    { tipo: 'Ingreso inicial',            fecha: '28 oct 2024', hora: '6:45 a.m.', desc: 'Alta en el sistema · Compra directa',          color: '#6aa0ac' },
  ];

  const DASH_ALERTS = [
    { titulo: 'Retroexcavadora CAT 320',   sub: 'Mantenimiento al 85% · Obra Chapinero', tipo: 'Mantenimiento', color: '#dc3545', bg: '#fce8ea' },
    { titulo: 'Andamio Acrow 300',          sub: 'Devolución en 19 días · AndamiCo',       tipo: 'Alquiler',      color: '#f38117', bg: '#fff3e0' },
    { titulo: 'Compactadora Wacker WH36',   sub: 'En arreglo desde hace 5 días',           tipo: 'En Arreglo',    color: '#6aa0ac', bg: '#e3f4f7' },
  ];

  const RECENT_ACTIVITY = [
    { equipo: 'Retroexcavadora CAT 320',  accion: 'Ingresó a obra',        hora: 'hoy 7:30',   estado: 'operativo',          estadoLabel: 'Operativo' },
    { equipo: 'Volqueta Ford F-750',      accion: 'Reportada averiada',    hora: 'ayer 3:15',  estado: 'averiado',           estadoLabel: 'Averiado' },
    { equipo: 'Compactadora WH36',        accion: 'Entró a taller',        hora: 'hace 5 d',   estado: 'en-arreglo',         estadoLabel: 'En Arreglo' },
    { equipo: 'Estación Total Leica',     accion: 'Regresó de servicio',   hora: 'hace 7 d',   estado: 'recien-arreglado',   estadoLabel: 'Recién Arr.' },
  ];

  const ALERTAS_MANT = [
    { id: 'CAT-320-A', nombre: 'Retroexcavadora CAT 320', modelo: 'CAT 320', ubicacion: 'Obra Chapinero', label: 'Crítico — 85%', color: '#dc3545', horasDesc: '847 / 1,000 hrs · Quedan 153 hrs', width: '85%' },
  ];
  const ALERTAS_ALQ = [
    { id: 'VOL-FCD-123', nombre: 'Volqueta Ford F-750',  proveedor: 'Rentamaq S.A.', diasLabel: '9 días',  vence: '20 ago 2026', responsable: 'C. Mendoza' },
    { id: 'AND-AC300',   nombre: 'Andamio Acrow 300',     proveedor: 'AndamiCo',      diasLabel: '19 días', vence: '30 ago 2026', responsable: 'L. Ramírez' },
  ];
  const ALERTAS_ARREGLO = [
    { id: 'COMP-WH36', nombre: 'Compactadora Wacker WH36', modelo: 'Wacker WH36', desde: '6 ago 2026' },
  ];

  const OBRA_STATS = [
    { nombre: 'Obra Chapinero Norte',   horas: 959, equipos: 2, pct: 38, width: '38%', color: '#a2c617' },
    { nombre: 'Obra Usaquén II',        horas: 45,  equipos: 1, pct: 2,  width: '4%',  color: '#6aa0ac' },
    { nombre: 'Obra Suba Residencial',  horas: 0,   equipos: 1, pct: 0,  width: '1%',  color: '#dba444' },
  ];
  const TOP_EQUIPOS = [
    { rank: '1', nombre: 'Volqueta Ford F-750',      operario: 'Sin asignar',    horas: '1,230' },
    { rank: '2', nombre: 'Retroexcavadora CAT 320',  operario: 'Carlos Mendoza', horas: '847' },
    { rank: '3', nombre: 'Martillo Rotativo Bosch',  operario: 'Juan Pérez',     horas: '112' },
  ];

  const FILTER_CHIPS = [
    { id: 'todos', label: () => `Todos (${EQUIPOS.length})` },
    { id: 'operativo', label: () => 'Operativo' },
    { id: 'en-arreglo', label: () => 'En Arreglo' },
    { id: 'averiado', label: () => 'Averiado' },
    { id: 'recien-arreglado', label: () => 'Recién Arr.' },
  ];

  // ---------------------------------------------------------
  // Estado de la aplicación
  // ---------------------------------------------------------
  const state = {
    screen: 'inicio',
    prevScreen: 'inicio',
    selectedEquipoId: null,
    filterStatus: 'todos',
    searchQuery: '',
    formStatus: 'operativo',
  };

  function setState(patch) {
    const active = document.activeElement;
    const focusId = active && active.id;
    const selStart = active && typeof active.selectionStart === 'number' ? active.selectionStart : null;
    const selEnd = active && typeof active.selectionEnd === 'number' ? active.selectionEnd : null;

    Object.assign(state, patch);
    render();

    if (focusId) {
      const el = document.getElementById(focusId);
      if (el) {
        el.focus();
        if (selStart !== null && el.setSelectionRange) {
          try { el.setSelectionRange(selStart, selEnd); } catch (e) { /* no-op */ }
        }
      }
    }
  }

  // ---------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------
  function esc(str) {
    return String(str == null ? '' : str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function icon(inner, { size = 20, color = 'currentColor', strokeWidth = 2, fill = 'none' } = {}) {
    return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="${fill}" stroke="${color}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round">${inner}</svg>`;
  }

  const ICONS = {
    search: '<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>',
    plus: '<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>',
    pin: '<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>',
    chevronRight: '<polyline points="9 18 15 12 9 6"/>',
    chevronDown: '<polyline points="6 9 12 15 18 9"/>',
    back: '<line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>',
    share: '<path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>',
    wrench: '<path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/>',
    info: '<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>',
    check: '<polyline points="20 6 9 17 4 12"/>',
    person: '<path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>',
    clock: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
    close: '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>',
    home: '<path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',
    list: '<line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>',
    bell: '<path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/>',
    bars: '<line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>',
    modEquipos: '<path d="M4 6h16M4 10h16M4 14h16M4 18h16"/>',
    modQR: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M14 14h3v3h-3zM17 17h3v3"/>',
    truck: '<rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>',
  };

  function badgeStyle(status, small) {
    const s = STATUS[status];
    return `background:${s.bg};color:${s.color};font-weight:700;font-size:${small ? '9px' : '10px'};font-family:Roboto,Arial,sans-serif;letter-spacing:.08em;text-transform:uppercase;padding:${small ? '3px 8px' : '4px 10px'};border-radius:20px;white-space:nowrap`;
  }
  const GRAY_BADGE = 'background:#f0f0f2;color:#7a7882;font-weight:700;font-size:10px;font-family:Roboto,Arial,sans-serif;letter-spacing:.08em;text-transform:uppercase;padding:4px 10px;border-radius:20px';

  function findEquipo(id) {
    return EQUIPOS.find((e) => e.id === id) || null;
  }

  // ---------------------------------------------------------
  // Pantalla: Inicio / Dashboard
  // ---------------------------------------------------------
  function screenInicio() {
    const operativos = EQUIPOS.filter((e) => e.status === 'operativo').length;
    const averiados = EQUIPOS.filter((e) => e.status === 'averiado').length;
    const enArreglo = EQUIPOS.filter((e) => e.status === 'en-arreglo').length;
    const alquilados = EQUIPOS.filter((e) => e.isAlquiler).length;

    const kpis = [
      { val: EQUIPOS.length, label: 'Total', color: '#fff', action: 'kpi-total' },
      { val: operativos, label: 'Operativos', color: '#a2c617', action: 'kpi-operativos' },
      { val: averiados + enArreglo, label: 'No dispon.', color: '#dc3545', action: 'kpi-no-disponibles' },
      { val: alquilados, label: 'Alquilados', color: '#dba444', action: 'kpi-alquilados' },
    ];

    const modulos = [
      { nombre: 'Equipos', desc: 'Lista y fichas', path: ICONS.modEquipos, color: '#a2c617', action: 'mod-equipos' },
      { nombre: 'Alertas', desc: 'Mant. y alquileres', path: ICONS.bell, color: '#dc3545', action: 'mod-alertas', badge: '3', badgeBg: '#dc3545', badgeColor: '#fff' },
      { nombre: 'Registrar', desc: 'Ingreso y salida', path: ICONS.plus, color: '#a2c617', action: 'mod-registrar' },
      { nombre: 'Reportes', desc: 'Costos y uso', path: ICONS.bars, color: '#163544', action: 'mod-reportes' },
      { nombre: 'Escanear QR', desc: 'Vista rápida', path: ICONS.modQR, color: '#81398d', action: 'mod-qr' },
      { nombre: 'Alquileres', desc: `${alquilados} activos`, path: ICONS.truck, color: '#dba444', action: 'mod-alquileres', badge: `${alquilados}`, badgeBg: '#fff3e0', badgeColor: '#dba444' },
    ];

    return `
    <div class="screen-view">
      <div style="background:#163544;padding:18px 20px 20px;flex-shrink:0">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:4px">
          <div>
            <div style="font:300 12px Roboto,sans-serif;color:rgba(255,255,255,.55)">Lunes 11 de agosto, 2026</div>
            <div style="font:700 20px/1.2 Roboto,sans-serif;color:#fff;margin-top:4px">Buen día, Carlos</div>
          </div>
          <div style="width:40px;height:40px;background:#a2c617;border-radius:14px;display:flex;align-items:center;justify-content:center">
            <span style="font:700 16px Roboto,sans-serif;color:#fff">C</span>
          </div>
        </div>
      </div>

      <div style="background:#163544;padding:0 16px 18px;flex-shrink:0">
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:8px">
          ${kpis.map((k) => `
            <div style="background:rgba(255,255,255,.08);border-radius:14px;padding:11px 8px;text-align:center;cursor:pointer" data-action="${k.action}">
              <div style="font-weight:700;font-size:22px;line-height:1;font-family:Roboto,Arial,sans-serif;color:${k.color}">${k.val}</div>
              <div style="font:400 9px/1.3 Roboto,sans-serif;color:rgba(255,255,255,.5);margin-top:3px">${k.label}</div>
            </div>`).join('')}
        </div>
      </div>

      <div style="flex:1;overflow-y:auto;padding:14px 0">
        <div style="padding:0 16px;margin-bottom:14px">
          <div style="font:700 13px Roboto,sans-serif;color:#1a1a1f;margin-bottom:10px">Alertas activas</div>
          ${DASH_ALERTS.map((a) => `
            <div style="background:#fff;border-radius:14px;padding:12px 14px;margin-bottom:8px;display:flex;align-items:flex-start;gap:10px;cursor:pointer;box-shadow:0 1px 6px rgba(22,53,68,.06)" data-action="dash-alert">
              <div style="width:8px;height:8px;border-radius:50%;background:${a.color};flex-shrink:0;margin-top:3px"></div>
              <div style="flex:1;min-width:0">
                <div style="font:700 13px Roboto,sans-serif;color:#1a1a1f;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(a.titulo)}</div>
                <div style="font:400 11px Roboto,sans-serif;color:#9d9ba3;margin-top:2px">${esc(a.sub)}</div>
              </div>
              <span style="background:${a.bg};color:${a.color};font-weight:700;font-size:10px;font-family:Roboto,Arial,sans-serif;letter-spacing:.06em;text-transform:uppercase;padding:3px 8px;border-radius:20px;white-space:nowrap">${esc(a.tipo)}</span>
            </div>`).join('')}
        </div>

        <div style="padding:0 16px;margin-bottom:14px">
          <div style="font:700 13px Roboto,sans-serif;color:#1a1a1f;margin-bottom:10px">Módulos</div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
            ${modulos.map((m) => `
              <div style="background:#fff;border-radius:16px;padding:14px;box-shadow:0 1px 6px rgba(22,53,68,.06);cursor:pointer;border:1.5px solid transparent" data-action="${m.action}">
                <div style="width:36px;height:36px;background:${m.color}18;border-radius:10px;display:flex;align-items:center;justify-content:center">
                  ${icon(m.path, { size: 20, color: m.color })}
                </div>
                <div style="font:700 13px/1.3 Roboto,sans-serif;color:#1a1a1f;margin-top:10px">${esc(m.nombre)}</div>
                <div style="font:400 11px/1.3 Roboto,sans-serif;color:#9d9ba3;margin-top:3px">${esc(m.desc)}</div>
                ${m.badge ? `<div style="margin-top:8px;display:inline-block;background:${m.badgeBg};color:${m.badgeColor};font-weight:700;font-size:10px;font-family:Roboto,Arial,sans-serif;padding:2px 8px;border-radius:20px">${esc(m.badge)}</div>` : ''}
              </div>`).join('')}
          </div>
        </div>

        <div style="padding:0 16px">
          <div style="font:700 13px Roboto,sans-serif;color:#1a1a1f;margin-bottom:10px">Actividad reciente</div>
          <div style="background:#fff;border-radius:16px;overflow:hidden">
            ${RECENT_ACTIVITY.map((act) => `
              <div style="display:flex;align-items:center;gap:12px;padding:12px 14px;border-bottom:1px solid #f0f0f2">
                <div style="width:8px;height:8px;border-radius:50%;background:${STATUS[act.estado].color};flex-shrink:0"></div>
                <div style="flex:1;min-width:0">
                  <div style="font:700 12px Roboto,sans-serif;color:#1a1a1f;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(act.equipo)}</div>
                  <div style="font:400 11px Roboto,sans-serif;color:#9d9ba3">${esc(act.accion)} · ${esc(act.hora)}</div>
                </div>
                <span style="${badgeStyle(act.estado, true)}">${esc(act.estadoLabel)}</span>
              </div>`).join('')}
          </div>
        </div>
        <div style="height:12px"></div>
      </div>
    </div>`;
  }

  // ---------------------------------------------------------
  // Pantalla: Lista de equipos
  // ---------------------------------------------------------
  function screenList() {
    const q = state.searchQuery.toLowerCase();
    const filtered = EQUIPOS
      .filter((e) => state.filterStatus === 'todos' || e.status === state.filterStatus)
      .filter((e) => !q || e.nombre.toLowerCase().includes(q) || e.modelo.toLowerCase().includes(q) || e.ubicacion.toLowerCase().includes(q));

    return `
    <div class="screen-view">
      <div style="background:#a2c617;padding:14px 20px 16px;flex-shrink:0">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">
          <div>
            <div style="font:700 19px/1 Roboto,sans-serif;color:#fff">Equipos</div>
            <div style="font:400 12px Roboto,sans-serif;color:rgba(255,255,255,.75);margin-top:3px">${filtered.length} de ${EQUIPOS.length} equipos</div>
          </div>
          <div style="display:flex;gap:10px">
            <div style="width:36px;height:36px;background:rgba(255,255,255,.2);border-radius:10px;display:flex;align-items:center;justify-content:center;cursor:pointer;color:#fff" data-action="go-to-form">
              ${icon(ICONS.plus, { size: 20, color: '#fff', strokeWidth: 2.5 })}
            </div>
          </div>
        </div>
        <div style="background:#fff;border-radius:12px;display:flex;align-items:center;gap:8px;padding:10px 14px">
          ${icon(ICONS.search, { size: 16, color: '#aaa' })}
          <input id="search-input" placeholder="Buscar equipo, modelo, obra..." style="flex:1;border:none;font:400 13px Roboto,sans-serif;color:#1a1a1f;background:transparent" value="${esc(state.searchQuery)}">
        </div>
      </div>

      <div style="background:#fff;border-bottom:1px solid #e6e6ea;padding:10px 16px;overflow-x:auto;flex-shrink:0">
        <div style="display:flex;gap:8px;min-width:max-content">
          ${FILTER_CHIPS.map((c) => {
            const active = state.filterStatus === c.id;
            const s = active
              ? 'background:#a2c617;color:#fff;border:none;font-weight:700;font-size:12px;font-family:Roboto,Arial,sans-serif;padding:7px 14px;border-radius:20px;cursor:pointer;white-space:nowrap;flex-shrink:0'
              : 'background:#f0f0f2;color:#55525a;border:none;font-weight:500;font-size:12px;font-family:Roboto,Arial,sans-serif;padding:7px 14px;border-radius:20px;cursor:pointer;white-space:nowrap;flex-shrink:0';
            return `<button style="${s}" data-action="filter-chip" data-filter="${c.id}">${esc(c.label())}</button>`;
          }).join('')}
        </div>
      </div>

      <div style="flex:1;overflow-y:auto;background:#f5f5f7;padding:8px 0">
        ${filtered.map((eq) => `
          <div style="background:#fff;margin:0 0 1px;display:flex;align-items:center;padding:14px 16px;gap:12px;cursor:pointer" data-action="select-equipo" data-id="${eq.id}">
            <div style="width:48px;height:48px;border-radius:14px;background:${TYPE_COLOR[eq.tipo]};display:flex;align-items:center;justify-content:center;flex-shrink:0">
              <span style="font:700 13px/1 Roboto,sans-serif;color:#fff">${esc(eq.badge)}</span>
            </div>
            <div style="flex:1;min-width:0">
              <div style="font:700 10px Roboto,sans-serif;color:#a2c617;letter-spacing:.1em;text-transform:uppercase;margin-bottom:2px">${esc(eq.modelo)}</div>
              <div style="font:700 14px/1.2 Roboto,sans-serif;color:#1a1a1f;margin-bottom:4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(eq.nombre)}</div>
              <div style="font:400 12px Roboto,sans-serif;color:#9d9ba3;display:flex;align-items:center;gap:4px">
                ${icon(ICONS.pin, { size: 11, color: 'currentColor' })}
                ${esc(eq.ubicacion)} · ${esc(eq.operario)}
              </div>
            </div>
            <div style="display:flex;flex-direction:column;align-items:flex-end;gap:8px;flex-shrink:0">
              <span style="${badgeStyle(eq.status, true)}">${esc(STATUS[eq.status].label)}</span>
              ${icon(ICONS.chevronRight, { size: 14, color: '#ccc' })}
            </div>
          </div>`).join('') || `<div style="padding:40px 20px;text-align:center;color:#9d9ba3;font:400 13px Roboto,sans-serif">No se encontraron equipos.</div>`}
        <div style="height:12px"></div>
      </div>
    </div>`;
  }

  // ---------------------------------------------------------
  // Pantalla: Detalle de equipo
  // ---------------------------------------------------------
  function screenDetail() {
    const raw = findEquipo(state.selectedEquipoId);

    if (!raw) {
      return `
      <div class="screen-view">
        <div style="background:#fff;border-bottom:1px solid #e6e6ea;padding:12px 20px;display:flex;align-items:center;justify-content:space-between;flex-shrink:0">
          <button style="background:none;border:none;cursor:pointer;display:flex;align-items:center;gap:5px;color:#55525a" data-action="go-back">
            ${icon(ICONS.back, { size: 20, color: 'currentColor' })}
            <span style="font:500 14px Roboto,sans-serif">Volver</span>
          </button>
          <span style="font:700 14px Roboto,sans-serif;color:#1a1a1f">Ficha del Equipo</span>
          <div style="width:26px"></div>
        </div>
        <div style="flex:1;display:flex;align-items:center;justify-content:center;color:#9d9ba3;font:400 13px Roboto,sans-serif">Selecciona un equipo desde la lista.</div>
      </div>`;
    }

    const horasPct = raw.horasMax ? Math.min(Math.round((raw.horas / raw.horasMax) * 100), 100) : 0;
    const barColor = horasPct > 80 ? '#dc3545' : horasPct > 60 ? '#f38117' : '#a2c617';
    const horasLabel = raw.horas != null ? `${raw.horas.toLocaleString('en-US')} / ${raw.horasMax.toLocaleString('en-US')} hrs` : 'Sin control de horas';
    const horasPctLabel = raw.horasMax ? `${horasPct}% · Quedan ${(raw.horasMax - raw.horas).toLocaleString('en-US')} hrs` : '—';
    const maintAlertLabel = !raw.horasMax ? '—' : horasPct > 80 ? 'Crítico' : horasPct > 60 ? 'Próximo' : 'Al día';
    const maintAlertStyle = !raw.horasMax ? GRAY_BADGE
      : horasPct > 80 ? 'background:#fce8ea;color:#dc3545;font-weight:700;font-size:10px;font-family:Roboto,Arial,sans-serif;letter-spacing:.08em;text-transform:uppercase;padding:3px 8px;border-radius:20px'
      : horasPct > 60 ? 'background:#fff3e0;color:#f38117;font-weight:700;font-size:10px;font-family:Roboto,Arial,sans-serif;letter-spacing:.08em;text-transform:uppercase;padding:3px 8px;border-radius:20px'
      : 'background:#e8f8ed;color:#28a745;font-weight:700;font-size:10px;font-family:Roboto,Arial,sans-serif;letter-spacing:.08em;text-transform:uppercase;padding:3px 8px;border-radius:20px';

    return `
    <div class="screen-view">
      <div style="background:#fff;border-bottom:1px solid #e6e6ea;padding:12px 20px;display:flex;align-items:center;justify-content:space-between;flex-shrink:0">
        <button style="background:none;border:none;cursor:pointer;display:flex;align-items:center;gap:5px;color:#55525a" data-action="go-back">
          ${icon(ICONS.back, { size: 20, color: 'currentColor' })}
          <span style="font:500 14px Roboto,sans-serif">Volver</span>
        </button>
        <span style="font:700 14px Roboto,sans-serif;color:#1a1a1f">Ficha del Equipo</span>
        <button style="background:none;border:none;cursor:pointer;color:#a2c617;padding:4px">
          ${icon(ICONS.share, { size: 18, color: 'currentColor' })}
        </button>
      </div>

      <div style="flex:1;overflow-y:auto;padding-bottom:8px">
        <div style="background:#fff;padding:20px 20px 16px;margin-bottom:8px">
          <div style="font:700 10px Roboto,sans-serif;color:#a2c617;letter-spacing:.14em;text-transform:uppercase;margin-bottom:4px">${esc(raw.modelo)}</div>
          <div style="font:700 22px/1.2 Roboto,sans-serif;color:#1a1a1f;margin-bottom:12px">${esc(raw.nombre)}</div>
          <div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:12px">
            <span style="${badgeStyle(raw.status, false)}">${esc(STATUS[raw.status].label)}</span>
            <span style="${GRAY_BADGE}">${esc(raw.modalidad)}</span>
            <span style="${GRAY_BADGE}">${esc(raw.tipoLabel)}</span>
          </div>
          <div style="font:400 12px Roboto,sans-serif;color:#9d9ba3">${esc(raw.serial)} · Ingresó: ${esc(raw.ingreso)}</div>
        </div>

        <div style="background:#fff;padding:16px 20px;margin-bottom:8px">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px">
            ${icon(ICONS.pin, { size: 16, color: '#a2c617' })}
            <span style="font:700 14px Roboto,sans-serif;color:#1a1a1f">Ubicación y operario</span>
          </div>
          <div style="padding-left:24px;display:grid;grid-template-columns:1fr 1fr;gap:8px">
            <div>
              <div style="font:300 11px Roboto,sans-serif;color:#9d9ba3;margin-bottom:2px">Ubicación</div>
              <div style="font:700 14px Roboto,sans-serif;color:#1a1a1f">${esc(raw.ubicacion)}</div>
              <div style="font:400 12px Roboto,sans-serif;color:#7a7882">${esc(raw.proyecto)}</div>
            </div>
            <div>
              <div style="font:300 11px Roboto,sans-serif;color:#9d9ba3;margin-bottom:2px">Operario</div>
              <div style="font:700 14px Roboto,sans-serif;color:#1a1a1f">${esc(raw.operario)}</div>
            </div>
          </div>
        </div>

        <div style="background:#fff;padding:16px 20px;margin-bottom:8px">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">
            <div style="display:flex;align-items:center;gap:8px">
              ${icon(ICONS.wrench, { size: 16, color: '#a2c617' })}
              <span style="font:700 14px Roboto,sans-serif;color:#1a1a1f">Mantenimiento</span>
            </div>
            <span style="${maintAlertStyle}">${esc(maintAlertLabel)}</span>
          </div>
          <div style="padding-left:24px">
            <div style="font:700 20px/1 Roboto,sans-serif;color:#1a1a1f;margin-bottom:10px">${esc(horasLabel)}</div>
            <div style="height:8px;background:#f0f0f2;border-radius:4px;overflow:hidden;margin-bottom:6px">
              <div style="height:100%;background:${barColor};border-radius:4px;width:${horasPct}%"></div>
            </div>
            <div style="font:400 11px Roboto,sans-serif;color:#9d9ba3">${esc(horasPctLabel)}</div>
          </div>
        </div>

        ${raw.isAlquiler ? `
        <div style="background:#fff3e0;border-left:3px solid #f38117;padding:14px 16px;margin:0 0 8px;display:flex;gap:10px;align-items:flex-start">
          ${icon(ICONS.info, { size: 16, color: '#f38117' })}
          <div>
            <div style="font:700 12px Roboto,sans-serif;color:#f38117">Equipo en alquiler</div>
            <div style="font:400 12px Roboto,sans-serif;color:#7a7882;margin-top:3px">Devolución: ${esc(raw.devolucion)} · Proveedor: ${esc(raw.proveedor)}</div>
          </div>
        </div>` : ''}

        <div style="background:#fff;padding:16px 20px">
          <div style="font:700 14px Roboto,sans-serif;color:#1a1a1f;margin-bottom:14px">Historial</div>
          ${HISTORIAL.map((h, i) => `
            <div style="display:flex;gap:12px;margin-bottom:14px">
              <div style="display:flex;flex-direction:column;align-items:center;width:10px;flex-shrink:0;padding-top:3px">
                <div style="width:10px;height:10px;border-radius:50%;background:${h.color};flex-shrink:0"></div>
                ${i < HISTORIAL.length - 1 ? '<div style="width:1px;flex:1;background:#e6e6ea;margin-top:4px;min-height:22px"></div>' : ''}
              </div>
              <div style="flex:1">
                <div style="font:700 13px Roboto,sans-serif;color:#1a1a1f">${esc(h.tipo)}</div>
                <div style="font:400 11px Roboto,sans-serif;color:#9d9ba3;margin-top:1px">${esc(h.fecha)} · ${esc(h.hora)}</div>
                <div style="font:400 13px/1.4 Roboto,sans-serif;color:#55525a;margin-top:3px">${esc(h.desc)}</div>
              </div>
            </div>`).join('')}
        </div>
      </div>

      <div style="padding:12px 20px 14px;background:#fff;border-top:1px solid #e6e6ea;flex-shrink:0">
        <button style="width:100%;background:#a2c617;color:#fff;border:none;border-radius:12px;padding:15px;font:700 15px Roboto,sans-serif;cursor:pointer;box-shadow:0 4px 16px rgba(162,198,23,.32)" data-action="go-to-form">Registrar Movimiento</button>
      </div>
    </div>`;
  }

  // ---------------------------------------------------------
  // Pantalla: Formulario de movimiento
  // ---------------------------------------------------------
  function screenForm() {
    const statusOptions = ['operativo', 'averiado', 'en-arreglo', 'recien-arreglado'];

    return `
    <div class="screen-view">
      <div style="background:#fff;border-bottom:1px solid #e6e6ea;padding:12px 20px;display:flex;align-items:center;justify-content:space-between;flex-shrink:0">
        <button style="background:none;border:none;cursor:pointer;display:flex;align-items:center;gap:5px;color:#55525a" data-action="go-back">
          ${icon(ICONS.back, { size: 20, color: 'currentColor' })}
          <span style="font:500 14px Roboto,sans-serif">Cancelar</span>
        </button>
        <span style="font:700 14px Roboto,sans-serif;color:#1a1a1f">Registrar Movimiento</span>
        <div style="width:66px"></div>
      </div>

      <div style="flex:1;overflow-y:auto;padding:14px 16px;display:flex;flex-direction:column;gap:10px">
        <div style="background:#fff;border-radius:16px;padding:16px">
          <div style="font:700 10px Roboto,sans-serif;color:#9d9ba3;letter-spacing:.14em;text-transform:uppercase;margin-bottom:10px">Tipo de movimiento</div>
          <div style="display:grid;grid-template-columns:1fr 1fr;background:#f0f0f2;border-radius:10px;padding:3px;gap:3px">
            <div style="background:#a2c617;color:#fff;text-align:center;padding:10px;border-radius:8px;font:700 14px Roboto,sans-serif;cursor:pointer">Ingreso</div>
            <div style="color:#7a7882;text-align:center;padding:10px;border-radius:8px;font:500 14px Roboto,sans-serif;cursor:pointer">Salida</div>
          </div>
        </div>

        <div style="background:#fff;border-radius:16px;padding:16px">
          <div style="font:700 10px Roboto,sans-serif;color:#9d9ba3;letter-spacing:.14em;text-transform:uppercase;margin-bottom:10px">Equipo</div>
          <div style="border:1.5px solid #e6e6ea;border-radius:10px;padding:12px 14px;display:flex;align-items:center;justify-content:space-between;cursor:pointer">
            <span style="font:400 14px Roboto,sans-serif;color:#9d9ba3">Seleccionar equipo...</span>
            ${icon(ICONS.chevronDown, { size: 16, color: '#aaa' })}
          </div>
        </div>

        <div style="background:#fff;border-radius:16px;padding:16px">
          <div style="font:700 10px Roboto,sans-serif;color:#9d9ba3;letter-spacing:.14em;text-transform:uppercase;margin-bottom:10px">Obra / Destino</div>
          <div style="border:1.5px solid #a2c617;border-radius:10px;padding:12px 14px;display:flex;align-items:center;justify-content:space-between">
            <span style="font:500 14px Roboto,sans-serif;color:#1a1a1f">Obra Chapinero Norte</span>
            ${icon(ICONS.chevronDown, { size: 16, color: '#aaa' })}
          </div>
        </div>

        <div style="background:#fff;border-radius:16px;padding:16px">
          <div style="font:700 10px Roboto,sans-serif;color:#9d9ba3;letter-spacing:.14em;text-transform:uppercase;margin-bottom:10px">Operario asignado</div>
          <div style="border:1.5px solid #e6e6ea;border-radius:10px;padding:11px 14px;display:flex;align-items:center;gap:10px">
            ${icon(ICONS.person, { size: 16, color: '#aaa' })}
            <input placeholder="Buscar por nombre o ID..." style="flex:1;border:none;font:400 14px Roboto,sans-serif;color:#1a1a1f;background:transparent">
          </div>
        </div>

        <div style="background:#fff;border-radius:16px;padding:16px">
          <div style="font:700 10px Roboto,sans-serif;color:#9d9ba3;letter-spacing:.14em;text-transform:uppercase;margin-bottom:10px">Horas de uso</div>
          <div style="border:1.5px solid #e6e6ea;border-radius:10px;padding:11px 14px;display:flex;align-items:center;gap:10px">
            ${icon(ICONS.clock, { size: 16, color: '#aaa' })}
            <input placeholder="ej. 8.5 horas" style="flex:1;border:none;font:400 14px Roboto,sans-serif;color:#1a1a1f;background:transparent" type="number">
          </div>
        </div>

        <div style="background:#fff;border-radius:16px;padding:16px">
          <div style="font:700 10px Roboto,sans-serif;color:#9d9ba3;letter-spacing:.14em;text-transform:uppercase;margin-bottom:10px">Estado del equipo</div>
          <div style="display:flex;flex-direction:column;gap:8px">
            ${statusOptions.map((k) => {
              const s = STATUS[k];
              const selected = state.formStatus === k;
              const rowStyle = `display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:10px;cursor:pointer;background:${selected ? s.bg : 'transparent'};border:1.5px solid ${selected ? s.color + '40' : 'transparent'}`;
              const labelStyle = `font-weight:${selected ? '700' : '400'};font-size:14px;font-family:Roboto,Arial,sans-serif;color:${selected ? s.color : '#55525a'}`;
              return `
                <div style="${rowStyle}" data-action="form-select-status" data-status="${k}">
                  <div style="width:10px;height:10px;border-radius:50%;background:${s.color};flex-shrink:0"></div>
                  <span style="${labelStyle}">${esc(s.label)}</span>
                  ${selected ? `<span style="margin-left:auto">${icon(ICONS.check, { size: 16, color: '#a2c617', strokeWidth: 2.5 })}</span>` : ''}
                </div>`;
            }).join('')}
          </div>
        </div>

        <div style="background:#fff;border-radius:16px;padding:16px">
          <div style="font:700 10px Roboto,sans-serif;color:#9d9ba3;letter-spacing:.14em;text-transform:uppercase;margin-bottom:10px">Observaciones</div>
          <textarea placeholder="Agrega una nota o novedad (opcional)..." style="width:100%;border:1.5px solid #e6e6ea;border-radius:10px;padding:12px 14px;font:400 14px Roboto,sans-serif;color:#1a1a1f;resize:none;height:76px;background:transparent"></textarea>
        </div>
      </div>

      <div style="padding:12px 20px 14px;background:#fff;border-top:1px solid #e6e6ea;flex-shrink:0">
        <button style="width:100%;background:#a2c617;color:#fff;border:none;border-radius:12px;padding:15px;font:700 15px Roboto,sans-serif;cursor:pointer;box-shadow:0 4px 16px rgba(162,198,23,.3)" data-action="submit-form">Registrar Movimiento</button>
      </div>
    </div>`;
  }

  // ---------------------------------------------------------
  // Pantalla: Escanear QR
  // ---------------------------------------------------------
  function screenQR() {
    return `
    <div class="screen-view" style="background:#16181c">
      <div style="padding:14px 20px;display:flex;align-items:center;justify-content:space-between;flex-shrink:0">
        <button style="background:none;border:none;cursor:pointer;color:#fff;padding:4px" data-action="qr-close">
          ${icon(ICONS.close, { size: 22, color: 'currentColor' })}
        </button>
        <span style="font:700 15px Roboto,sans-serif;color:#fff">Escanear Equipo</span>
        <div style="width:30px"></div>
      </div>

      <div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:24px;padding:0 40px">
        <div style="width:224px;height:224px;position:relative">
          <svg width="224" height="224" viewBox="0 0 224 224" fill="none" style="position:absolute;top:0;left:0;z-index:2">
            <path d="M12 44 L12 12 L44 12" stroke="#a2c617" stroke-width="3.5" stroke-linecap="round"/>
            <path d="M180 12 L212 12 L212 44" stroke="#a2c617" stroke-width="3.5" stroke-linecap="round"/>
            <path d="M12 180 L12 212 L44 212" stroke="#a2c617" stroke-width="3.5" stroke-linecap="round"/>
            <path d="M180 212 L212 212 L212 180" stroke="#a2c617" stroke-width="3.5" stroke-linecap="round"/>
          </svg>
          <div style="position:absolute;inset:18px;background:rgba(0,0,0,.5);border-radius:6px;overflow:hidden;z-index:1">
            <div style="position:absolute;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent 5%,#a2c617 50%,transparent 95%);animation:scanLine 2.2s ease-in-out infinite"></div>
          </div>
        </div>
        <div style="text-align:center">
          <div style="font:700 16px Roboto,sans-serif;color:#fff;margin-bottom:8px">Apunta al código QR del equipo</div>
          <div style="font:400 13px/1.5 Roboto,sans-serif;color:rgba(255,255,255,.45)">La etiqueta está adherida físicamente al equipo</div>
        </div>
        <button style="background:rgba(162,198,23,.1);border:1.5px solid rgba(162,198,23,.45);color:#a2c617;border-radius:14px;padding:13px 28px;font:700 14px Roboto,sans-serif;cursor:pointer" data-action="qr-scan">
          Simular escaneo QR &rarr;
        </button>
      </div>
      <div style="padding:0 20px 20px;text-align:center">
        <div style="font:400 11px Roboto,sans-serif;color:rgba(255,255,255,.25)">Solo el administrador puede confirmar cambios de estado</div>
      </div>
    </div>`;
  }

  // ---------------------------------------------------------
  // Pantalla: Alertas
  // ---------------------------------------------------------
  function screenAlertas() {
    const total = ALERTAS_MANT.length + ALERTAS_ALQ.length + ALERTAS_ARREGLO.length;

    return `
    <div class="screen-view">
      <div style="background:#fff;padding:16px 20px 14px;border-bottom:1px solid #e6e6ea;flex-shrink:0">
        <div style="font:700 20px/1 Roboto,sans-serif;color:#1a1a1f">Alertas</div>
        <div style="font:400 12px Roboto,sans-serif;color:#9d9ba3;margin-top:4px">${total} alertas activas</div>
      </div>

      <div style="flex:1;overflow-y:auto;padding:12px 0">
        <div style="padding:0 16px;margin-bottom:4px">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">
            <div style="width:8px;height:8px;background:#dc3545;border-radius:50%"></div>
            <span style="font:700 12px Roboto,sans-serif;color:#dc3545;letter-spacing:.08em;text-transform:uppercase">Mantenimiento crítico</span>
          </div>
          ${ALERTAS_MANT.map((al) => `
            <div style="background:#fff;border-radius:14px;padding:14px;margin-bottom:8px;border-left:3px solid ${al.color};box-shadow:0 1px 6px rgba(22,53,68,.06)" data-action="alert-detail" data-id="${al.id}">
              <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:8px">
                <div style="flex:1">
                  <div style="font:700 14px Roboto,sans-serif;color:#1a1a1f">${esc(al.nombre)}</div>
                  <div style="font:400 12px Roboto,sans-serif;color:#9d9ba3;margin-top:2px">${esc(al.modelo)} · ${esc(al.ubicacion)}</div>
                </div>
                <span style="${badgeStyle('averiado', true)}">${esc(al.label)}</span>
              </div>
              <div style="margin-top:10px">
                <div style="height:6px;background:#f0f0f2;border-radius:3px;overflow:hidden">
                  <div style="height:100%;background:#dc3545;border-radius:3px;width:${al.width}"></div>
                </div>
                <div style="font:400 11px Roboto,sans-serif;color:#9d9ba3;margin-top:5px">${esc(al.horasDesc)}</div>
              </div>
            </div>`).join('')}
        </div>

        <div style="padding:0 16px;margin-bottom:4px">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;margin-top:8px">
            <div style="width:8px;height:8px;background:#f38117;border-radius:50%"></div>
            <span style="font:700 12px Roboto,sans-serif;color:#f38117;letter-spacing:.08em;text-transform:uppercase">Alquileres por vencer</span>
          </div>
          ${ALERTAS_ALQ.map((al) => `
            <div style="background:#fff;border-radius:14px;padding:14px;margin-bottom:8px;border-left:3px solid #f38117;box-shadow:0 1px 6px rgba(22,53,68,.06)" data-action="alert-detail" data-id="${al.id}">
              <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:8px">
                <div style="flex:1">
                  <div style="font:700 14px Roboto,sans-serif;color:#1a1a1f">${esc(al.nombre)}</div>
                  <div style="font:400 12px Roboto,sans-serif;color:#9d9ba3;margin-top:2px">Proveedor: ${esc(al.proveedor)}</div>
                </div>
                <span style="background:#fff3e0;color:#f38117;font-weight:700;font-size:10px;font-family:Roboto,Arial,sans-serif;letter-spacing:.08em;text-transform:uppercase;padding:3px 8px;border-radius:20px;white-space:nowrap">${esc(al.diasLabel)}</span>
              </div>
              <div style="font:400 12px Roboto,sans-serif;color:#55525a;margin-top:8px">Vence: ${esc(al.vence)} · Resp: ${esc(al.responsable)}</div>
            </div>`).join('')}
        </div>

        <div style="padding:0 16px;margin-bottom:4px">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;margin-top:8px">
            <div style="width:8px;height:8px;background:#6aa0ac;border-radius:50%"></div>
            <span style="font:700 12px Roboto,sans-serif;color:#6aa0ac;letter-spacing:.08em;text-transform:uppercase">Equipos en arreglo</span>
          </div>
          ${ALERTAS_ARREGLO.map((al) => `
            <div style="background:#fff;border-radius:14px;padding:14px;margin-bottom:8px;border-left:3px solid #6aa0ac;box-shadow:0 1px 6px rgba(22,53,68,.06)" data-action="alert-detail" data-id="${al.id}">
              <div style="display:flex;align-items:center;justify-content:space-between;gap:8px">
                <div>
                  <div style="font:700 14px Roboto,sans-serif;color:#1a1a1f">${esc(al.nombre)}</div>
                  <div style="font:400 12px Roboto,sans-serif;color:#9d9ba3;margin-top:2px">${esc(al.modelo)} · Desde: ${esc(al.desde)}</div>
                </div>
                ${icon(ICONS.chevronRight, { size: 14, color: '#ccc' })}
              </div>
            </div>`).join('')}
        </div>
        <div style="height:12px"></div>
      </div>
    </div>`;
  }

  // ---------------------------------------------------------
  // Pantalla: Reportes
  // ---------------------------------------------------------
  function screenReportes() {
    return `
    <div class="screen-view">
      <div style="background:#fff;padding:16px 20px 14px;border-bottom:1px solid #e6e6ea;flex-shrink:0">
        <div style="font:700 20px/1 Roboto,sans-serif;color:#1a1a1f">Reportes</div>
        <div style="font:400 12px Roboto,sans-serif;color:#9d9ba3;margin-top:4px">Agosto 2026</div>
      </div>

      <div style="flex:1;overflow-y:auto;padding:12px 16px;display:flex;flex-direction:column;gap:12px">

        <div style="background:#163544;border-radius:18px;padding:18px">
          <div style="font:700 11px Roboto,sans-serif;color:rgba(255,255,255,.5);letter-spacing:.14em;text-transform:uppercase;margin-bottom:14px">Costos del mes</div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
            <div>
              <div style="font:300 11px Roboto,sans-serif;color:rgba(255,255,255,.5)">Alquileres</div>
              <div style="font:700 18px/1.2 Roboto,sans-serif;color:#a2c617;margin-top:3px">$14.2M</div>
            </div>
            <div>
              <div style="font:300 11px Roboto,sans-serif;color:rgba(255,255,255,.5)">Mantenimiento</div>
              <div style="font:700 18px/1.2 Roboto,sans-serif;color:#dba444;margin-top:3px">$3.8M</div>
            </div>
            <div>
              <div style="font:300 11px Roboto,sans-serif;color:rgba(255,255,255,.5)">Horas totales</div>
              <div style="font:700 18px/1.2 Roboto,sans-serif;color:#fff;margin-top:3px">2,554 h</div>
            </div>
            <div>
              <div style="font:300 11px Roboto,sans-serif;color:rgba(255,255,255,.5)">Equipos activos</div>
              <div style="font:700 18px/1.2 Roboto,sans-serif;color:#fff;margin-top:3px">4 / 6</div>
            </div>
          </div>
        </div>

        <div style="background:#fff;border-radius:18px;padding:16px">
          <div style="font:700 13px Roboto,sans-serif;color:#1a1a1f;margin-bottom:14px">Uso por obra</div>
          ${OBRA_STATS.map((ob) => `
            <div style="margin-bottom:14px">
              <div style="display:flex;justify-content:space-between;margin-bottom:5px">
                <span style="font:500 13px Roboto,sans-serif;color:#1a1a1f">${esc(ob.nombre)}</span>
                <span style="font:700 13px Roboto,sans-serif;color:#a2c617">${ob.horas} h</span>
              </div>
              <div style="height:8px;background:#f0f0f2;border-radius:4px;overflow:hidden">
                <div style="height:100%;background:${ob.color};border-radius:4px;width:${ob.width}"></div>
              </div>
              <div style="font:400 11px Roboto,sans-serif;color:#9d9ba3;margin-top:4px">${ob.equipos} equipos · ${ob.pct}% del total</div>
            </div>`).join('')}
        </div>

        <div style="background:#fff;border-radius:18px;padding:16px">
          <div style="font:700 13px Roboto,sans-serif;color:#1a1a1f;margin-bottom:14px">Estado del parque</div>
          <div style="display:flex;align-items:center;gap:16px">
            <div style="position:relative;width:80px;height:80px;flex-shrink:0">
              <svg width="80" height="80" viewBox="0 0 80 80">
                <circle cx="40" cy="40" r="30" fill="none" stroke="#f0f0f2" stroke-width="10"/>
                <circle cx="40" cy="40" r="30" fill="none" stroke="#a2c617" stroke-width="10" stroke-dasharray="113 75" stroke-dashoffset="23" stroke-linecap="round"/>
                <circle cx="40" cy="40" r="30" fill="none" stroke="#dc3545" stroke-width="10" stroke-dasharray="38 150" stroke-dashoffset="-113" stroke-linecap="round"/>
                <circle cx="40" cy="40" r="30" fill="none" stroke="#f38117" stroke-width="10" stroke-dasharray="19 169" stroke-dashoffset="-151" stroke-linecap="round"/>
              </svg>
              <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font:700 16px Roboto,sans-serif;color:#1a1a1f">6</div>
            </div>
            <div style="flex:1;display:flex;flex-direction:column;gap:8px">
              <div style="display:flex;align-items:center;justify-content:space-between">
                <div style="display:flex;align-items:center;gap:6px"><div style="width:8px;height:8px;background:#a2c617;border-radius:2px"></div><span style="font:400 12px Roboto,sans-serif;color:#55525a">Operativo</span></div>
                <span style="font:700 13px Roboto,sans-serif;color:#1a1a1f">3</span>
              </div>
              <div style="display:flex;align-items:center;justify-content:space-between">
                <div style="display:flex;align-items:center;gap:6px"><div style="width:8px;height:8px;background:#dc3545;border-radius:2px"></div><span style="font:400 12px Roboto,sans-serif;color:#55525a">Averiado</span></div>
                <span style="font:700 13px Roboto,sans-serif;color:#1a1a1f">1</span>
              </div>
              <div style="display:flex;align-items:center;justify-content:space-between">
                <div style="display:flex;align-items:center;gap:6px"><div style="width:8px;height:8px;background:#f38117;border-radius:2px"></div><span style="font:400 12px Roboto,sans-serif;color:#55525a">En arreglo</span></div>
                <span style="font:700 13px Roboto,sans-serif;color:#1a1a1f">1</span>
              </div>
              <div style="display:flex;align-items:center;justify-content:space-between">
                <div style="display:flex;align-items:center;gap:6px"><div style="width:8px;height:8px;background:#6aa0ac;border-radius:2px"></div><span style="font:400 12px Roboto,sans-serif;color:#55525a">Recién arreglado</span></div>
                <span style="font:700 13px Roboto,sans-serif;color:#1a1a1f">1</span>
              </div>
            </div>
          </div>
        </div>

        <div style="background:#fff;border-radius:18px;padding:16px">
          <div style="font:700 13px Roboto,sans-serif;color:#1a1a1f;margin-bottom:14px">Top equipos por horas de uso</div>
          ${TOP_EQUIPOS.map((te) => `
            <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px">
              <div style="width:28px;height:28px;background:#f0f0f2;border-radius:8px;display:flex;align-items:center;justify-content:center;font:700 12px Roboto,sans-serif;color:#55525a;flex-shrink:0">${te.rank}</div>
              <div style="flex:1;min-width:0">
                <div style="font:700 13px Roboto,sans-serif;color:#1a1a1f;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(te.nombre)}</div>
                <div style="font:400 11px Roboto,sans-serif;color:#9d9ba3">${esc(te.operario)}</div>
              </div>
              <div style="font:700 13px Roboto,sans-serif;color:#a2c617;flex-shrink:0">${te.horas} h</div>
            </div>`).join('')}
        </div>

        <div style="height:4px"></div>
      </div>
    </div>`;
  }

  // ---------------------------------------------------------
  // Barra de navegación inferior
  // ---------------------------------------------------------
  function renderTabBar() {
    if (state.screen === 'qr') return '';
    const activeTab = (state.screen === 'detail' || state.screen === 'form') ? state.prevScreen : state.screen;
    const isFormScreen = state.screen === 'form';
    const alertCount = ALERTAS_MANT.length + ALERTAS_ALQ.length + ALERTAS_ARREGLO.length;

    const tab = (key, action, iconPath, label) => {
      const active = activeTab === key;
      return `
        <button class="tab-item${active ? ' tab-item--active' : ''}" data-action="${action}">
          ${icon(iconPath, { size: 22, color: active ? '#a2c617' : '#9d9ba3' })}
          <span>${label}</span>
        </button>`;
    };

    return `
      ${tab('inicio', 'tab-inicio', ICONS.home, 'Inicio')}
      ${tab('list', 'tab-list', ICONS.list, 'Equipos')}
      <button class="tab-fab${isFormScreen ? ' tab-fab--active' : ''}" data-action="tab-form">
        ${icon(ICONS.plus, { size: 22, color: '#fff', strokeWidth: 2.5 })}
      </button>
      <button class="tab-item" data-action="tab-alertas" style="position:relative">
        ${icon(ICONS.bell, { size: 22, color: state.screen === 'alertas' ? '#a2c617' : '#9d9ba3' })}
        ${alertCount ? `<div class="tab-badge">${alertCount}</div>` : ''}
        <span style="${state.screen === 'alertas' ? 'font-weight:700;color:#a2c617' : ''}">Alertas</span>
      </button>
      ${tab('reportes', 'tab-reportes', ICONS.bars, 'Reportes')}
    `;
  }

  // ---------------------------------------------------------
  // Render principal
  // ---------------------------------------------------------
  const SCREENS = {
    inicio: screenInicio,
    list: screenList,
    detail: screenDetail,
    form: screenForm,
    qr: screenQR,
    alertas: screenAlertas,
    reportes: screenReportes,
  };

  function render() {
    const root = document.getElementById('screen-root');
    const tabbar = document.getElementById('tab-bar');
    const fn = SCREENS[state.screen] || screenInicio;
    root.innerHTML = fn();
    tabbar.innerHTML = renderTabBar();
    tabbar.style.display = state.screen === 'qr' ? 'none' : 'grid';
  }

  // ---------------------------------------------------------
  // Acciones (equivalente a los closures onClick del prototipo)
  // ---------------------------------------------------------
  const ACTIONS = {
    'kpi-total': () => setState({ screen: 'list', filterStatus: 'todos' }),
    'kpi-operativos': () => setState({ screen: 'list', filterStatus: 'operativo' }),
    'kpi-no-disponibles': () => setState({ screen: 'alertas' }),
    'kpi-alquilados': () => setState({ screen: 'list', filterStatus: 'todos' }),
    'dash-alert': () => setState({ screen: 'alertas' }),
    'mod-equipos': () => setState({ screen: 'list' }),
    'mod-alertas': () => setState({ screen: 'alertas' }),
    'mod-registrar': () => setState({ screen: 'form' }),
    'mod-reportes': () => setState({ screen: 'reportes' }),
    'mod-qr': () => setState({ screen: 'qr' }),
    'mod-alquileres': () => setState({ screen: 'list', filterStatus: 'todos' }),
    'go-to-form': () => setState({ screen: 'form', prevScreen: state.screen }),
    'go-back': () => setState({ screen: state.prevScreen }),
    'submit-form': () => setState({ screen: state.prevScreen }),
    'qr-close': () => setState({ screen: 'inicio' }),
    'qr-scan': () => setState({ screen: 'detail', selectedEquipoId: 'CAT-320-A', prevScreen: 'list' }),
    'tab-inicio': () => setState({ screen: 'inicio' }),
    'tab-list': () => setState({ screen: 'list', filterStatus: 'todos', searchQuery: '', prevScreen: 'list' }),
    'tab-form': () => setState({ screen: 'form', prevScreen: state.screen }),
    'tab-alertas': () => setState({ screen: 'alertas' }),
    'tab-reportes': () => setState({ screen: 'reportes' }),
  };

  function handleClick(e) {
    const el = e.target.closest('[data-action]');
    if (!el) return;
    const action = el.dataset.action;

    if (action === 'filter-chip') {
      setState({ filterStatus: el.dataset.filter });
      return;
    }
    if (action === 'select-equipo') {
      setState({ screen: 'detail', selectedEquipoId: el.dataset.id, prevScreen: 'list' });
      return;
    }
    if (action === 'alert-detail') {
      setState({ screen: 'detail', selectedEquipoId: el.dataset.id });
      return;
    }
    if (action === 'form-select-status') {
      setState({ formStatus: el.dataset.status });
      return;
    }
    const handler = ACTIONS[action];
    if (handler) handler();
  }

  function handleInput(e) {
    if (e.target && e.target.id === 'search-input') {
      setState({ searchQuery: e.target.value });
    }
  }

  document.addEventListener('click', handleClick);
  document.addEventListener('input', handleInput);

  render();
})();
