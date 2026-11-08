const escapeHTML = value => String(value).replace(/[&<>"']/g, character => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character]));

// Small MathML helpers keep the equations local, selectable and accessible.
function notation(value) {
  if (value.includes('<m')) return value;
  const tokens = value.match(/(?:TIC|PRO|[A-Za-z])(?:_[A-Za-z0-9]+)?\*?|\d+(?:\.\d+)?|[^\s]/g) || [];
  return '<mrow>' + tokens.map(token => {
    if (/^[A-Za-z]/.test(token)) {
      const [base, subscript] = token.replace('*', '').split('_');
      let node = `<mi${base.length > 1 ? ' mathvariant="normal"' : ''}>${base}</mi>`;
      if (subscript) node = `<msub>${node}<mtext>${subscript}</mtext></msub>`;
      if (token.endsWith('*')) node = `<msup>${node}<mo>*</mo></msup>`;
      return node;
    }
    return /^\d/.test(token) ? `<mn>${token}</mn>` : `<mo>${escapeHTML(token)}</mo>`;
  }).join('') + '</mrow>';
}
const row = (...values) => '<mrow>' + values.map(notation).join('') + '</mrow>';
const fraction = (top, bottom) => `<mfrac>${notation(top)}${notation(bottom)}</mfrac>`;
const root = value => `<msqrt>${notation(value)}</msqrt>`;
const square = value => `<msup>${notation(value)}<mn>2</mn></msup>`;
const textMath = value => `<mtext>${escapeHTML(value)}</mtext>`;
const equation = content => `<math xmlns="http://www.w3.org/1998/Math/MathML" display="block">${content}</math>`;

const topics = [
  {
    id: 'sin-deficit', number: '4.2.1', title: 'Lotes económicos sin déficit',
    symbols: [
      ['Q, Q*', 'Lote y lote óptimo [unidades/pedido].'],
      ['d', 'Demanda [unidades/periodo].'],
      ['D', 'Demanda anual [unidades/año].'],
      ['K', 'Costo por ordenar [$/pedido].'],
      ['c', 'Costo unitario de compra [$/unidad].'],
      ['h', 'Costo de almacenamiento [$/(unidad·periodo)].'],
      ['I', 'Tasa de almacenamiento del periodo [decimal].'],
      ['t*', 'Tiempo óptimo entre pedidos [periodos].'],
      ['N', 'Número de pedidos por año.'],
      ['L', 'Tiempo de entrega [periodos].'],
      ['Lₑ', 'Tiempo de entrega efectivo [periodos].'],
      ['n', 'Número de ciclos completos en L.'],
      ['PRO', 'Punto de reorden [unidades].'],
      ['T, T*', 'Costo total y mínimo [$/periodo].'],
      ['⌊x⌋', 'Mayor entero menor o igual que x.'],
      ['*', 'Valor óptimo.']
    ],
    cards: [
      {title:'Cantidad óptima a ordenar', math:row('Q* =',root(fraction('2dK','h'))), plain:'Q* = √(2dK/h)', featured:true},
      {title:'Tiempo óptimo entre pedidos', math:row('t* =',fraction('Q*','d'),'=',root(fraction('2K','dh'))), plain:'t* = Q*/d = √(2K/(dh))', mobileWide:true},
      {title:'Número de pedidos por año', math:row('N =',fraction('D','Q*')), plain:'N = D/Q*'},
      {title:'Inventario promedio', math:fraction('Q','2'), plain:'Inventario promedio = Q/2'},
      {title:'Costo unitario de almacenamiento', math:row('h = Ic'), plain:'h = I·c'},
      {title:'Punto de reorden (L < t*)', math:row('PRO = dL'), plain:'PRO = dL, si L < t*'},
      {title:'Ciclos completos de espera', math:row('n = ⌊',fraction('L','t*'),'⌋'), plain:'n = ⌊L/t*⌋'},
      {title:'Tiempo de entrega efectivo', math:row('L_e = L − nt*'), plain:'Le = L − n·t*'},
      {title:'Punto de reorden (L ≥ t*)', math:row('PRO = dL_e'), plain:'PRO = d·Le, si L ≥ t*'},
      {title:'Costo de compra por periodo', math:notation('dc'), plain:'Costo de compra por periodo = d·c'},
      {title:'Costo de ordenar por periodo', math:fraction('dK','Q'), plain:'Costo de ordenar por periodo = dK/Q'},
      {title:'Costo de almacenar por periodo', math:fraction('hQ','2'), plain:'Costo de almacenar por periodo = hQ/2'},
      {title:'Costo total por periodo', math:row('T(Q) =',fraction('dK','Q'),'+ dc +',fraction('hQ','2')), plain:'T(Q) = dK/Q + dc + hQ/2', wide:true},
      {title:'Costo total mínimo', math:row('T* = dc +',root('2dKh')), plain:'T* = dc + √(2dKh)', mobileWide:true}
    ]
  },
  {
    id:'descuentos', number:'4.2', title:'EOQ con descuentos por cantidad',
    symbols:[
      ['j','Tramo de precio.'], ['c₀','Precio de lista [$/unidad].'],
      ['aⱼ','Descuento del tramo j [decimal].'], ['cⱼ','Precio de todas las unidades en el tramo j [$/unidad].'],
      ['I','Tasa de almacenamiento del periodo [decimal].'], ['hⱼ','Almacenamiento del tramo j [$/(unidad·periodo)].'],
      ['d','Demanda [unidades/periodo].'], ['K','Costo por ordenar [$/pedido].'],
      ['Q*ⱼ','Lote teórico óptimo del tramo j [unidades].'], ['Qⱼ','Lote factible evaluado en el tramo j [unidades].'],
      ['Tⱼ','Costo total del tramo j [$/periodo].'], ['*','Valor óptimo.']
    ],
    cards:[
      {title:'Lote teórico óptimo por tramo', math:row('Q_j* =',root(fraction('2dK','h_j'))), plain:'Q*j = √(2dK/hj)', featured:true},
      {title:'Precio unitario con descuento', math:row('c_j = c_0(1 − a_j)'), plain:'cj = c0(1 − aj)', mobileWide:true},
      {title:'Almacenamiento por tramo', math:row('h_j = Ic_j'), plain:'hj = I·cj'},
      {title:'Costo total por tramo', math:row('T_j(Q_j) = dc_j +',fraction('dK','Q_j'),'+',fraction('h_j Q_j','2')), plain:'Tj(Qj) = d·cj + dK/Qj + hj·Qj/2', wide:true}
    ]
  },
  {
    id:'con-deficit', number:'4.2.2', title:'Lotes económicos con déficit',
    symbols:[
      ['Q, Q*','Lote y lote óptimo [unidades/pedido].'], ['d','Demanda [unidades/periodo].'],
      ['K','Costo por ordenar [$/pedido].'], ['c','Costo unitario de compra [$/unidad].'],
      ['h','Costo de almacenamiento [$/(unidad·periodo)].'], ['p','Costo por faltantes [$/(unidad·periodo)].'],
      ['S, S*','Inventario máximo y óptimo disponible [unidades].'], ['Q − S','Faltante máximo [unidades].'],
      ['t*','Tiempo óptimo entre pedidos [periodos].'], ['t₁','Tiempo con existencias [periodos].'],
      ['t₂','Tiempo con faltantes [periodos].'], ['T, T*','Costo total y mínimo [$/periodo].'],
      ['*','Valor óptimo.']
    ],
    cards:[
      {title:'Cantidad óptima con déficit', math:row('Q* =',root(row(fraction('2dK','h'),'·',fraction('h + p','p')))), plain:'Q* = √[(2dK/h)·(h + p)/p]', featured:true},
      {title:'Inventario máximo óptimo', math:row('S* = Q*',fraction('p','h + p')), plain:'S* = Q*·p/(h + p)'},
      {title:'Faltante máximo óptimo', math:row('Q* − S* = Q*',fraction('h','h + p')), plain:'Q* − S* = Q*·h/(h + p)', mobileWide:true, small:true},
      {title:'Tiempo óptimo entre pedidos', math:row('t* =',fraction('Q*','d'),'= t_1 + t_2'), plain:'t* = Q*/d = t1 + t2', mobileWide:true},
      {title:'Tiempo con existencias', math:row('t_1 =',fraction('S*','d')), plain:'t1 = S*/d'},
      {title:'Tiempo con faltantes', math:row('t_2 =',fraction('Q* − S*','d')), plain:'t2 = (Q* − S*)/d'},
      {title:'Fracción del ciclo con existencias', math:row(fraction('t_1','t*'),'=',fraction('S*','Q*'),'=',fraction('p','h + p')), plain:'t1/t* = S*/Q* = p/(h + p)', mobileWide:true},
      {title:'Fracción del ciclo con faltantes', math:row(fraction('t_2','t*'),'=',fraction('h','h + p')), plain:'t2/t* = h/(h + p)'},
      {title:'Porcentaje del ciclo con existencias', math:row(fraction('p','h + p'),'× 100%'), plain:'Porcentaje con existencias = [p/(h + p)] × 100%'},
      {title:'Inventario promedio del ciclo', math:fraction(square('S'),'2Q'), plain:'Inventario promedio = S²/(2Q)'},
      {title:'Faltante promedio del ciclo', math:fraction(square('(Q − S)'),'2Q'), plain:'Faltante promedio = (Q − S)²/(2Q)'},
      {title:'Costo total mínimo', math:row('T* = dc +',root(fraction('2dKhp','h + p'))), plain:'T* = dc + √[2dKhp/(h + p)]', mobileWide:true},
      {title:'Costo total por periodo', math:row('T(Q,S) = dc +',fraction('dK','Q'),'+',fraction(row('h',square('S')),'2Q'),'+',fraction(row('p',square('(Q − S)')),'2Q')), plain:'T(Q,S) = dc + dK/Q + hS²/(2Q) + p(Q − S)²/(2Q)', wide:true, small:true}
    ]
  },
  {
    id:'produccion', number:'4.3', title:'Lote económico de producción', condition:'p > r',
    symbols:[
      ['Q, Qₒ','Lote y lote óptimo de producción [unidades].'], ['R','Demanda anual [unidades/año].'],
      ['r','Demanda diaria [unidades/día].'], ['p','Producción diaria a plena capacidad [unidades/día].'],
      ['Cₚ','Costo de preparar una corrida [$/corrida].'], ['Cₕ','Costo anual de almacenamiento [$/(unidad·año)].'],
      ['c','Costo unitario de fabricación [$/unidad].'], ['I','Tasa anual de almacenamiento [decimal].'],
      ['tₚ','Duración de la corrida de producción [días].'], ['N','Número de corridas por año.'],
      ['TIC','Costo total anual con fabricación [$/año].'], ['TICₒ','Costo total anual mínimo con fabricación [$/año].'],
      ['o','Subíndice que indica el valor óptimo.']
    ],
    cards:[
      {title:'Lote óptimo de producción', math:row('Q_o =',root(fraction('2RC_p',row('C_h (1 −',fraction('r','p'),')')))), plain:'Qo = √[2R·Cp / (Ch·(1 − r/p))]', featured:true},
      {title:'Duración de la corrida', math:row('t_p =',fraction('Q_o','p')), plain:'tp = Qo/p'},
      {title:'Número de corridas por año', math:row('N =',fraction('R','Q_o')), plain:'N = R/Qo'},
      {title:'Demanda diaria', math:row('r =',fraction('R',textMath('Días de operación al año'))), plain:'r = R / días de operación al año', mobileWide:true, small:true},
      {title:'Producción diaria', math:row('p =',fraction(textMath('Capacidad anual de producción'),textMath('Días de operación al año'))), plain:'p = Capacidad anual de producción / días de operación al año', wide:true, small:true},
      {title:'Duración del ciclo', math:fraction('Q_o','r'), plain:'Duración del ciclo = Qo/r'},
      {title:'Tiempo sin producir', math:row(fraction('Q_o','r'),'− t_p'), plain:'Tiempo sin producir = Qo/r − tp'},
      {title:'Almacenamiento unitario anual', math:row('C_h = Ic'), plain:'Ch = I·c'},
      {title:'Inventario máximo', math:row('(p − r)t_p = Q_o (1 −',fraction('r','p'),')'), plain:'Inventario máximo = (p − r)·tp = Qo·(1 − r/p)', wide:true},
      {title:'Inventario promedio', math:row(fraction('Q_o','2'),'(1 −',fraction('r','p'),')'), plain:'Inventario promedio = (Qo/2)·(1 − r/p)'},
      {title:'Costo anual de preparar y almacenar', math:row(fraction('RC_p','Q'),'+',fraction('C_h Q','2'),'(1 −',fraction('r','p'),')'), plain:'Costo anual de preparar y almacenar = R·Cp/Q + (Ch·Q/2)·(1 − r/p)', wide:true},
      {title:'Costo anual de fabricación', math:notation('Rc'), plain:'Costo anual de fabricación = R·c'},
      {title:'Costo total anual con fabricación', math:row('TIC(Q) = Rc +',fraction('RC_p','Q'),'+',fraction('C_h Q','2'),'(1 −',fraction('r','p'),')'), plain:'TIC(Q) = R·c + R·Cp/Q + (Ch·Q/2)·(1 − r/p)', wide:true, small:true},
      {title:'Costo total anual mínimo', math:row('TIC_o = Rc +',root(row('2RC_p C_h (1 −',fraction('r','p'),')'))), plain:'TICo = R·c + √[2R·Cp·Ch·(1 − r/p)]', wide:true, small:true}
    ]
  }
];

function renderCard(card) {
  const classes = ['formula-card', card.featured && 'featured', card.wide && 'wide', card.mobileWide && 'mobile-wide'].filter(Boolean).join(' ');
  return `<article class="${classes}" data-search="${escapeHTML(card.title + ' ' + card.plain)}">
    <button class="copy" type="button" data-copy="${escapeHTML(card.plain)}" aria-label="Copiar fórmula de ${escapeHTML(card.title)}" title="Copiar fórmula">⧉</button>
    <h3 class="card-label">${card.title}</h3>
    <div class="formula ${card.small ? 'small-math' : ''}">${equation(card.math)}</div>
  </article>`;
}

document.getElementById('topics').innerHTML = topics.map(topic => `
  <section class="topic" id="${topic.id}">
    <div class="topic-header">
      <span class="section-number">${topic.number}</span>
      <h2>${topic.title}</h2>
      ${topic.condition ? `<span class="model-condition">${equation(notation(topic.condition))}</span>` : ''}
    </div>
    <div class="formula-grid">${topic.cards.map(renderCard).join('')}</div>
    <section class="symbol-panel" aria-labelledby="symbols-${topic.id}">
      <h3 id="symbols-${topic.id}">Nomenclatura</h3>
      <dl class="symbol-grid">
        ${topic.symbols.map(([symbol, meaning]) => `<div><dt>${symbol}</dt><dd>${meaning}</dd></div>`).join('')}
      </dl>
    </section>
  </section>`).join('');

let toastTimer;
function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2500);
}
document.addEventListener('click', async event => {
  const copyButton = event.target.closest('[data-copy]');
  if (!copyButton) return;
  try {
    await navigator.clipboard.writeText(copyButton.dataset.copy);
    showToast('Fórmula copiada');
  } catch {
    showToast('Selecciona la fórmula para copiarla');
  }
});

const search = document.getElementById('search');
const normalize = text => text.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
function filterFormulas() {
  const query = normalize(search.value.trim());
  let count = 0;
  for (const topic of topics) {
    const section = document.getElementById(topic.id);
    const topicMatch = query && normalize(`${topic.title} ${topic.number}`).includes(query);
    let visible = 0;
    section.querySelectorAll('.formula-card').forEach(card => {
      const match = !query || topicMatch || normalize(card.dataset.search).includes(query);
      card.hidden = !match;
      if (match) visible++;
    });
    section.hidden = visible === 0;
    count += visible;
  }
  const status = document.getElementById('search-status');
  status.hidden = !query;
  status.textContent = `${count} ${count === 1 ? 'fórmula encontrada' : 'fórmulas encontradas'}`;
  document.getElementById('empty').hidden = count > 0;
  document.querySelector('.intro').hidden = Boolean(query);
}
search.addEventListener('input', filterFormulas);
document.getElementById('clear-search').addEventListener('click', () => { search.value = ''; filterFormulas(); search.focus(); });
document.querySelectorAll('.nav-item').forEach(link => link.addEventListener('click', () => {
  search.value = '';
  filterFormulas();
  document.querySelectorAll('.nav-item').forEach(item => item.classList.toggle('active',item === link));
}));
const observer = new IntersectionObserver(entries => {
  for (const entry of entries) {
    if (entry.isIntersecting) {
      document.querySelectorAll('.nav-item').forEach(link => {
        const active = link.dataset.target === entry.target.id;
        link.classList.toggle('active',active);
        if (active) link.setAttribute('aria-current','location');
        else link.removeAttribute('aria-current');
      });
    }
  }
},{rootMargin:'-15% 0px -68% 0px',threshold:0});
document.querySelectorAll('#inicio,.topic').forEach(section => observer.observe(section));


let searchBeforePrint = '';
window.addEventListener('beforeprint', () => {
  searchBeforePrint = search.value;
  search.value = '';
  filterFormulas();
});
window.addEventListener('afterprint', () => {
  search.value = searchBeforePrint;
  filterFormulas();
});
document.getElementById('print').addEventListener('click', () => window.print());
