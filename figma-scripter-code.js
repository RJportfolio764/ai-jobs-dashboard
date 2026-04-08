// ── LOAD FONTS ──────────────────────────────────────────────
await figma.loadFontAsync({ family: "Inter", style: "Bold" })
await figma.loadFontAsync({ family: "Inter", style: "Semi Bold" })
await figma.loadFontAsync({ family: "Inter", style: "Light" })
await figma.loadFontAsync({ family: "Inter", style: "Regular" })

// ── HELPERS ─────────────────────────────────────────────────
function hexRGB(hex) {
  const h = hex.replace("#", "")
  return {
    r: parseInt(h.substring(0, 2), 16) / 255,
    g: parseInt(h.substring(2, 4), 16) / 255,
    b: parseInt(h.substring(4, 6), 16) / 255,
  }
}

// Colors
const BG = hexRGB("0D0F1A")
const CARD = hexRGB("161929")
const ACCENT = hexRGB("7B61FF")
const CYAN = hexRGB("00C6FF")
const TEAL = hexRGB("00FFB2")
const TEXT_PRIMARY = hexRGB("F0F2FF")
const TEXT_MUTED = hexRGB("8A8FAD")
const BORDER_COLOR = hexRGB("7B61FF")

// ── PARENT FRAME ────────────────────────────────────────────
const frame = figma.createFrame()
frame.name = "Dashboard Background"
frame.resize(1280, 720)
frame.fills = [{ type: "SOLID", color: BG }]
frame.clipsContent = true

// ── HELPER: create card ─────────────────────────────────────
function makeCard(name, x, y, w, h) {
  const card = figma.createFrame()
  card.name = name
  card.resize(w, h)
  card.x = x
  card.y = y
  card.cornerRadius = 14
  card.fills = [{ type: "SOLID", color: CARD }]
  card.strokes = [{ type: "SOLID", color: BORDER_COLOR, opacity: 0.15 }]
  card.strokeWeight = 1
  card.strokeAlign = "INSIDE"
  card.effects = [
    {
      type: "DROP_SHADOW",
      color: { ...ACCENT, a: 0.1 },
      offset: { x: 0, y: 4 },
      radius: 24,
      spread: 0,
      visible: true,
      blendMode: "NORMAL",
    },
  ]
  frame.appendChild(card)
  return card
}

// ── HELPER: create text ─────────────────────────────────────
function makeText(parent, content, x, y, size, style, color) {
  const t = figma.createText()
  t.fontName = { family: "Inter", style: style }
  t.characters = content
  t.fontSize = size
  t.fills = [{ type: "SOLID", color: color }]
  t.textAutoResize = "WIDTH_AND_HEIGHT"
  t.x = x
  t.y = y
  parent.appendChild(t)
  return t
}

// ── HELPER: divider ─────────────────────────────────────────
function makeDivider(parent, x, y, w) {
  const line = figma.createRectangle()
  line.name = "Divider"
  line.resize(w, 1)
  line.x = x
  line.y = y
  line.fills = [{ type: "SOLID", color: BORDER_COLOR, opacity: 0.18 }]
  parent.appendChild(line)
}

// ── HELPER: gradient fill ───────────────────────────────────
function gradientFill(c1, c2, angle) {
  const rad = (angle * Math.PI) / 180
  const cos = Math.cos(rad)
  const sin = Math.sin(rad)
  return {
    type: "GRADIENT_LINEAR",
    gradientStops: [
      { position: 0, color: { ...c1, a: 1 } },
      { position: 1, color: { ...c2, a: 1 } },
    ],
    gradientTransform: [
      [cos, -sin, 0.5 - 0.5 * cos + 0.5 * sin],
      [sin, cos, 0.5 - 0.5 * sin - 0.5 * cos],
    ],
  }
}

// ── TITLE BAR ───────────────────────────────────────────────
const titleBar = figma.createFrame()
titleBar.name = "Title Bar"
titleBar.resize(1200, 52)
titleBar.x = 40
titleBar.y = 24
titleBar.fills = []
frame.appendChild(titleBar)

makeText(titleBar, "Where Does AI Pay the Most — And Who's Hiring?", 0, 10, 24, "Bold", TEXT_PRIMARY)

const accentBar = figma.createRectangle()
accentBar.name = "Accent Underline"
accentBar.resize(1200, 2)
accentBar.x = 0
accentBar.y = 50
accentBar.fills = [gradientFill(CYAN, ACCENT, 90)]
titleBar.appendChild(accentBar)

// ── KPI CARDS ───────────────────────────────────────────────
const kpis = [
  { name: "KPI 1 — Avg AI Salary", x: 40, y: 96, icon: "💰", label: "Avg AI Salary", value: "—", badge: "USD" },
  { name: "KPI 2 — Avg AI Salary Premium", x: 460, y: 96, icon: "📈", label: "Avg AI Salary Premium", value: "—", badge: "%" },
  { name: "KPI 3 — Avg Demand Growth YoY", x: 880, y: 96, icon: "🚀", label: "Avg Demand Growth YoY", value: "—", badge: "%" },
]

for (const kpi of kpis) {
  const card = makeCard(kpi.name, kpi.x, kpi.y, 360, 110)
  makeText(card, kpi.icon, 18, 16, 22, "Regular", TEXT_PRIMARY)
  makeText(card, kpi.label, 54, 20, 12, "Light", TEXT_MUTED)
  makeDivider(card, 16, 52, 328)
  makeText(card, kpi.value, 18, 62, 32, "Bold", TEXT_PRIMARY)
  makeText(card, kpi.badge, 320, 80, 11, "Light", ACCENT)
}

// ── CHART CARD BUILDER ──────────────────────────────────────
function makeChartCard(name, x, y, w, h, title, subtitle) {
  const card = makeCard(name, x, y, w, h)
  makeText(card, title, 18, 16, 14, "Semi Bold", TEXT_PRIMARY)
  if (subtitle) {
    makeText(card, subtitle, 18, 36, 11, "Light", TEXT_MUTED)
  }
  makeDivider(card, 16, 54, w - 32)
  return card
}

// ── CHART 1: Avg Salary by Job Category (Horizontal Bar) ────
const chart1 = makeChartCard(
  "Chart 1 — Avg Salary by Job Category",
  40, 232, 580, 320,
  "Avg Salary by Job Category",
  "Sorted by highest avg annual salary · USD"
)

const chartArea1 = figma.createFrame()
chartArea1.name = "Chart Area"
chartArea1.resize(540, 230)
chartArea1.x = 20
chartArea1.y = 68
chartArea1.fills = []
chartArea1.clipsContent = true
chart1.appendChild(chartArea1)

// Gridlines
for (let i = 0; i <= 4; i++) {
  const gx = Math.round((i / 4) * 540)
  const gl = figma.createRectangle()
  gl.name = "GridLine " + i
  gl.resize(1, 230)
  gl.x = gx
  gl.y = 0
  gl.fills = [{ type: "SOLID", color: { r: 1, g: 1, b: 1 }, opacity: 0.06 }]
  chartArea1.appendChild(gl)
}

// Bars
const categories = [
  { label: "AI/ML Engineer", w: 480 },
  { label: "Data Scientist", w: 420 },
  { label: "AI Research", w: 390 },
  { label: "AI Product Manager", w: 340 },
  { label: "AI Analyst", w: 290 },
]

let barY = 10
for (const cat of categories) {
  const bar = figma.createRectangle()
  bar.name = "Bar — " + cat.label
  bar.resize(cat.w, 26)
  bar.x = 0
  bar.y = barY
  bar.cornerRadius = 8
  bar.fills = [gradientFill(CYAN, ACCENT, 0)]
  if (cat.w === 480) {
    bar.effects = [
      {
        type: "DROP_SHADOW",
        color: { ...ACCENT, a: 0.35 },
        offset: { x: 0, y: 0 },
        radius: 12,
        spread: 0,
        visible: true,
        blendMode: "NORMAL",
      },
    ]
  }
  chartArea1.appendChild(bar)
  makeText(chartArea1, cat.label, cat.w + 8, barY + 7, 11, "Light", TEXT_MUTED)
  barY += 40
}

// ── CHART 2: Monthly Demand Score (Line) ────────────────────
const chart2 = makeChartCard(
  "Chart 2 — Monthly Demand Score",
  660, 232, 580, 320,
  "Monthly Demand Score Trend",
  "Avg demand score · Jan–Dec"
)

const chartArea2 = figma.createFrame()
chartArea2.name = "Chart Area"
chartArea2.resize(540, 220)
chartArea2.x = 20
chartArea2.y = 72
chartArea2.fills = []
chartArea2.clipsContent = false
chart2.appendChild(chartArea2)

// Area fill
const areaFill = figma.createRectangle()
areaFill.name = "Area Fill"
areaFill.resize(540, 140)
areaFill.x = 0
areaFill.y = 60
areaFill.fills = [
  {
    type: "GRADIENT_LINEAR",
    gradientStops: [
      { position: 0, color: { ...ACCENT, a: 0.32 } },
      { position: 1, color: { ...ACCENT, a: 0.0 } },
    ],
    gradientTransform: [
      [0, -1, 1],
      [1, 0, 0],
    ],
  },
]
chartArea2.appendChild(areaFill)

// Line
const lineBar = figma.createRectangle()
lineBar.name = "Line"
lineBar.resize(540, 3)
lineBar.x = 0
lineBar.y = 58
lineBar.cornerRadius = 2
lineBar.fills = [{ type: "SOLID", color: ACCENT }]
lineBar.effects = [
  {
    type: "DROP_SHADOW",
    color: { ...ACCENT, a: 0.5 },
    offset: { x: 0, y: 4 },
    radius: 10,
    spread: 0,
    visible: true,
    blendMode: "NORMAL",
  },
]
chartArea2.appendChild(lineBar)

// Month markers
const months = ["J","F","M","A","M","J","J","A","S","O","N","D"]
const step = 540 / 11

for (let i = 0; i < 12; i++) {
  const mx = Math.round(i * step)
  const dot = figma.createEllipse()
  dot.name = "Marker " + months[i]
  dot.resize(8, 8)
  dot.x = mx - 4
  dot.y = 54
  dot.fills = [{ type: "SOLID", color: { r: 1, g: 1, b: 1 } }]
  dot.strokes = [{ type: "SOLID", color: ACCENT }]
  dot.strokeWeight = 2
  chartArea2.appendChild(dot)
  makeText(chartArea2, months[i], mx - 4, 200, 11, "Light", TEXT_MUTED)
}

// ── CHART 3: AI Salary Premium by Experience (Vertical Bar) ─
const chart3 = makeChartCard(
  "Chart 3 — AI Salary Premium by Experience",
  40, 576, 1200, 116,
  "AI Salary Premium % by Experience Level",
  "Sorted descending"
)

const chartArea3 = figma.createFrame()
chartArea3.name = "Chart Area"
chartArea3.resize(1160, 42)
chartArea3.x = 20
chartArea3.y = 62
chartArea3.fills = []
chartArea3.clipsContent = true
chart3.appendChild(chartArea3)

const levels = [
  { label: "Executive", h: 38 },
  { label: "Senior", h: 32 },
  { label: "Mid-Level", h: 26 },
  { label: "Entry", h: 18 },
]

for (let i = 0; i < levels.length; i++) {
  const lv = levels[i]
  const bx = 60 + i * 280

  const bar = figma.createRectangle()
  bar.name = "Bar — " + lv.label
  bar.resize(200, lv.h)
  bar.x = bx
  bar.y = 42 - lv.h
  bar.cornerRadius = 8
  bar.fills = [gradientFill(CYAN, TEAL, 180)]
  bar.effects = [
    {
      type: "DROP_SHADOW",
      color: { ...CYAN, a: 0.22 },
      offset: { x: 0, y: 4 },
      radius: 8,
      spread: 0,
      visible: true,
      blendMode: "NORMAL",
    },
  ]
  chartArea3.appendChild(bar)
  makeText(chartArea3, lv.label, bx + 70, 44, 11, "Light", TEXT_MUTED)
}

// ── FINISH ──────────────────────────────────────────────────
figma.currentPage.appendChild(frame)
figma.viewport.scrollAndZoomIntoView([frame])
figma.notify("Dashboard Background created — 1280×720")
