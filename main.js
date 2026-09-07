import * as THREE from "three";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";


  const chapters = [
  {
    label: "",
    title: 'Para <span>M\u00f3nica S\u00e1nchez</span>',
    lead: "Tal vez no llegu\u00e9 con flores en las manos... pero quise regalarte algo diferente.",
    body: "Cre\u00e9 este peque\u00f1o universo pensando en una sonrisa tuya. Cada estrella, cada coraz\u00f3n y cada detalle representan un momento bonito que quer\u00eda compartir contigo.",
    button: "Espicha mi coraz\u00f3n \u2661"
  },
  {
    label: "",
    title: "As\u00ed empiezan <span>las cosas bonitas</span>",
    lead: "Quiz\u00e1s estas rosas no puedan tocarse, pero nacieron de un detalle sincero.",
    body: "Hay personas que llegan sin hacer mucho ruido y, de alguna manera, hacen que un d\u00eda normal se sienta diferente. Por eso quise que estas flores no se quedaran quietas: que giraran, flotaran y llevaran consigo un peque\u00f1o deseo de verte sonre\u00edr.",
    button: "Sigue el remolino \u2192"
  },
  {
    label: "",
    title: "Poco a poco <span>toma forma</span>",
    lead: "Las cosas especiales tambi\u00e9n se construyen poco a poco.",
    body: "Como este coraz\u00f3n, que empez\u00f3 siendo peque\u00f1as part\u00edculas separadas y termin\u00f3 encontrando su lugar. A veces los detalles m\u00e1s sencillos son los que guardan las mejores intenciones.",
    button: "Deja que se forme \u2192"
  },
  {
    label: "",
    title: "Y aqu\u00ed est\u00e1s <span>t\u00fa</span>",
    lead: "No quiero ocupar un lugar que todav\u00eda no me corresponde.",
    body: "Pero s\u00ed puedo decir algo sincero: me gusta verte sonre\u00edr, y me gusta tener una raz\u00f3n para regalarte un momento bonito. A veces un detalle no necesita promesas; solo necesita nacer de pensar bonito en alguien.",
    button: "Mira lo que sigue \u2192"
  },
  {
    label: "",
    title: "M\u00f3nica <span>S\u00e1nchez</span>",
    lead: "Hay nombres que simplemente tienen algo especial.",
    body: "Por eso aqu\u00ed tu nombre no est\u00e1 escrito con tinta. Est\u00e1 formado con luz, peque\u00f1os detalles y la intenci\u00f3n de regalarte una sonrisa.",
    button: "Abre la p\u00e1gina \u2192"
  },
  {
    label: "",
    title: "Un peque\u00f1o <span>libro de luz</span>",
    lead: "",
    body: "",
    button: "Mira el cielo \u2192"
  },
  {
    label: "",
    title: "Si esta noche <span>miras el cielo</span>",
    lead: "Quiz\u00e1s alguna estrella tambi\u00e9n tenga una historia que contar.",
    body: "Hay personas que llegan sin hacer demasiado ruido, pero dejan una sensaci\u00f3n bonita. Esta escena solo quiere regalarte un instante de calma entre estrellas, luna y sue\u00f1os.",
    button: "Una \u00faltima cosa \u2192"
  },
  {
    label: "",
    title: "Gracias por <span>llegar hasta aqu\u00ed</span>",
    lead: "Si al verlo apareci\u00f3 aunque sea una peque\u00f1a sonrisa, entonces todo esto vali\u00f3 la pena.",
    body: "No buscaba hacer algo perfecto. Solo quer\u00eda crear un momento diferente y recordarte que alguien pens\u00f3 en ti lo suficiente como para construirte un peque\u00f1o universo donde todo se mueve un poquito para ti.",
    signature: "Atentamente, alguien a quien le gusta verte sonre\u00edr.",
    button: "Volver al principio \u21ba"
  }
];

const dom = {
  app: document.getElementById("app"),
  card: document.getElementById("storyCard"),
  label: document.getElementById("sceneLabel"),
  title: document.getElementById("sceneTitle"),
  lead: document.getElementById("sceneLead"),
  body: document.getElementById("sceneBody"),
  signature: document.getElementById("signature"),
  prev: document.getElementById("prevBtn"),
  next: document.getElementById("nextBtn"),
  progress: document.getElementById("progress"),
  music: document.getElementById("musica"),
  audioToggle: document.getElementById("audioToggle"),
  book: document.getElementById("book"),
  observer: document.getElementById("observer")
};

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const mobile = window.innerWidth < 760;
const quality = reducedMotion ? 0.42 : (mobile ? 0.58 : 1);

let currentScene = 1;
let started = false;
let lastNavAt = 0;
let touchStartY = 0;
let elapsed = 0;

for (let i = 1; i <= chapters.length; i += 1) {
  const dot = document.createElement("button");
  dot.className = "progress-dot";
  dot.type = "button";
  dot.setAttribute("aria-label", `Ir a la escena ${i}`);
  dot.addEventListener("click", () => {
    if (!started) startMusic();
    setScene(i);
  });
  dom.progress.appendChild(dot);
}

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x050006);
scene.fog = new THREE.FogExp2(0x080009, 0.018);

const camera = new THREE.PerspectiveCamera(
  mobile ? 64 : 56,
  window.innerWidth / window.innerHeight,
  0.1,
  160
);
camera.position.set(0, 0, 9.5);

const renderer = new THREE.WebGLRenderer({ antialias: !mobile, alpha: false, powerPreference: "high-performance" });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, mobile ? 1.35 : 1.75));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.16;
dom.app.appendChild(renderer.domElement);

const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
const bloom = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  mobile ? 0.62 : 0.9,
  0.72,
  0.12
);
composer.addPass(bloom);

const ambient = new THREE.AmbientLight(0xffd5e5, 0.45);
scene.add(ambient);
const moonLight = new THREE.DirectionalLight(0xffd7e6, 2.2);
moonLight.position.set(-4, 6, 7);
scene.add(moonLight);

const pointer = new THREE.Vector2(0, 0);
const pointerTarget = new THREE.Vector2(0, 0);

const layers = {};

function registerLayer(name, object, materials, initialOpacity = 0) {
  const records = materials.map((material) => ({ material, base: material.opacity ?? 1 }));
  layers[name] = {
    object,
    records,
    opacity: initialOpacity,
    target: initialOpacity
  };
  object.visible = initialOpacity > 0.005;
  for (const record of records) {
    record.material.transparent = true;
    record.material.opacity = record.base * initialOpacity;
  }
  return object;
}

function targetLayer(name, opacity) {
  if (layers[name]) layers[name].target = opacity;
}

function updateLayers(dt) {
  const speed = reducedMotion ? 8 : 3.2;
  const mix = 1 - Math.exp(-speed * dt);
  for (const layer of Object.values(layers)) {
    layer.opacity = THREE.MathUtils.lerp(layer.opacity, layer.target, mix);
    layer.object.visible = layer.opacity > 0.008;
    for (const record of layer.records) {
      record.material.opacity = record.base * layer.opacity;
    }
  }
}

function canvasTexture(size, draw) {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  draw(ctx, size);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

const glowTexture = canvasTexture(128, (ctx, s) => {
  const g = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.16, "rgba(255,235,245,0.95)");
  g.addColorStop(0.45, "rgba(255,65,145,0.34)");
  g.addColorStop(1, "rgba(255,0,90,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, s, s);
});

const petalTexture = canvasTexture(128, (ctx, s) => {
  ctx.translate(s / 2, s / 2);
  const g = ctx.createLinearGradient(0, -45, 0, 46);
  g.addColorStop(0, "rgba(255,113,153,0.98)");
  g.addColorStop(0.5, "rgba(219,17,69,0.98)");
  g.addColorStop(1, "rgba(92,0,31,0.95)");
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.moveTo(0, -46);
  ctx.bezierCurveTo(31, -39, 41, -4, 11, 38);
  ctx.bezierCurveTo(5, 48, -5, 48, -11, 38);
  ctx.bezierCurveTo(-41, -4, -31, -39, 0, -46);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "rgba(255,190,205,0.32)";
  ctx.lineWidth = 2;
  ctx.stroke();
});

const heartTexture = canvasTexture(128, (ctx, s) => {
  ctx.translate(s / 2, s / 2 + 5);
  const g = ctx.createRadialGradient(0, -10, 5, 0, 0, 55);
  g.addColorStop(0, "rgba(255,245,249,1)");
  g.addColorStop(0.18, "rgba(255,83,142,0.96)");
  g.addColorStop(0.75, "rgba(207,5,72,0.66)");
  g.addColorStop(1, "rgba(130,0,48,0)");
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.moveTo(0, 38);
  ctx.bezierCurveTo(-55, 4, -42, -39, -12, -39);
  ctx.bezierCurveTo(7, -39, 14, -23, 0, -8);
  ctx.bezierCurveTo(-14, -23, -7, -39, 12, -39);
  ctx.bezierCurveTo(42, -39, 55, 4, 0, 38);
  ctx.fill();
});

const roseTexture = canvasTexture(192, (ctx, s) => {
  ctx.translate(s / 2, s / 2);
  const bg = ctx.createRadialGradient(0, 0, 5, 0, 0, 90);
  bg.addColorStop(0, "rgba(255,210,222,1)");
  bg.addColorStop(0.2, "rgba(255,49,103,0.98)");
  bg.addColorStop(0.7, "rgba(138,0,44,0.95)");
  bg.addColorStop(1, "rgba(70,0,25,0)");
  ctx.fillStyle = bg;
  ctx.beginPath();
  ctx.arc(0, 0, 87, 0, Math.PI * 2);
  ctx.fill();

  for (let ring = 0; ring < 6; ring += 1) {
    const count = 5 + ring * 3;
    const radius = 8 + ring * 11;
    for (let i = 0; i < count; i += 1) {
      const a = (i / count) * Math.PI * 2 + ring * 0.48;
      ctx.save();
      ctx.rotate(a);
      ctx.translate(radius, 0);
      ctx.rotate(Math.PI / 2);
      ctx.fillStyle = ring < 2 ? "rgba(255,133,160,0.74)" : "rgba(156,0,48,0.46)";
      ctx.beginPath();
      ctx.ellipse(0, 0, 7 + ring * 1.4, 15 + ring * 2, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }
});

function createStarField() {
  const count = Math.floor(6200 * quality);
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const c = new THREE.Color();

  for (let i = 0; i < count; i += 1) {
    const r = 18 + Math.pow(Math.random(), 0.45) * 105;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.cos(phi);
    positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);

    const pick = Math.random();
    if (pick < 0.7) c.setRGB(1, 0.93 + Math.random() * 0.07, 0.97 + Math.random() * 0.03);
    else if (pick < 0.88) c.setRGB(1, 0.35 + Math.random() * 0.25, 0.62 + Math.random() * 0.25);
    else c.setRGB(0.55 + Math.random() * 0.25, 0.65 + Math.random() * 0.22, 1);
    colors.set([c.r, c.g, c.b], i * 3);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  const material = new THREE.PointsMaterial({
    size: mobile ? 0.13 : 0.1,
    map: glowTexture,
    vertexColors: true,
    transparent: true,
    opacity: 0.94,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true
  });
  const points = new THREE.Points(geometry, material);
  scene.add(points);
  registerLayer("stars", points, [material], 1);
  return points;
}

function createNebula() {
  const group = new THREE.Group();
  const materials = [];
  const palette = [0xff145e, 0xff4f9a, 0x7d28ff, 0x4d1e8f];
  for (let i = 0; i < 13; i += 1) {
    const material = new THREE.SpriteMaterial({
      map: glowTexture,
      color: palette[i % palette.length],
      transparent: true,
      opacity: 0.05 + Math.random() * 0.045,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });
    const sprite = new THREE.Sprite(material);
    sprite.position.set(
      (Math.random() - 0.5) * 26,
      (Math.random() - 0.5) * 15,
      -9 - Math.random() * 16
    );
    const s = 7 + Math.random() * 13;
    sprite.scale.set(s, s, s);
    sprite.userData.drift = (Math.random() - 0.5) * 0.025;
    group.add(sprite);
    materials.push(material);
  }
  scene.add(group);
  registerLayer("nebula", group, materials, 1);
  return group;
}

function createGalaxy() {
  const count = Math.floor(8500 * quality);
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const c = new THREE.Color();
  const arms = 4;

  for (let i = 0; i < count; i += 1) {
    const radius = Math.pow(Math.random(), 0.68) * 8.8;
    const arm = i % arms;
    const angle = (arm / arms) * Math.PI * 2 + radius * 1.08 + (Math.random() - 0.5) * (0.75 + radius * 0.04);
    const spread = 0.17 + radius * 0.025;
    positions[i * 3] = Math.cos(angle) * radius + (Math.random() - 0.5) * spread;
    positions[i * 3 + 1] = Math.sin(angle) * radius * 0.62 + (Math.random() - 0.5) * spread;
    positions[i * 3 + 2] = (Math.random() - 0.5) * (0.4 + radius * 0.09);

    const mix = Math.random();
    if (radius < 1.2) c.setRGB(1, 0.9, 0.78);
    else if (mix < 0.55) c.setRGB(1, 0.15 + Math.random() * 0.25, 0.46 + Math.random() * 0.2);
    else c.setRGB(0.57 + Math.random() * 0.2, 0.17 + Math.random() * 0.22, 1);
    colors.set([c.r, c.g, c.b], i * 3);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  const material = new THREE.PointsMaterial({
    size: mobile ? 0.09 : 0.075,
    map: glowTexture,
    vertexColors: true,
    transparent: true,
    opacity: 1,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  });
  const points = new THREE.Points(geometry, material);
  points.position.set(2.2, 0.2, -3.4);
  points.rotation.x = 0.12;
  scene.add(points);
  registerLayer("galaxy", points, [material], 1);
  return points;
}

function heartXY(t, scale = 1) {
  const x = 16 * Math.pow(Math.sin(t), 3);
  const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
  return [x * scale, y * scale];
}

function createHeartParticles() {
  const count = Math.floor(5200 * quality);
  const starts = new Float32Array(count * 3);
  const targets = new Float32Array(count * 3);
  const current = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const c = new THREE.Color();

  for (let i = 0; i < count; i += 1) {
    const t = Math.random() * Math.PI * 2;
    const fill = Math.sqrt(Math.random());
    const [hx, hy] = heartXY(t, 0.215 * fill);
    const tx = hx;
    const ty = hy - 0.25;
    const tz = (Math.random() - 0.5) * (0.85 + (1 - fill) * 0.8);
    targets.set([tx, ty, tz], i * 3);

    const r = 4 + Math.random() * 9;
    const a = Math.random() * Math.PI * 2;
    const sy = (Math.random() - 0.5) * 10;
    starts.set([Math.cos(a) * r, sy, (Math.random() - 0.5) * 9], i * 3);
    current.set([starts[i * 3], starts[i * 3 + 1], starts[i * 3 + 2]], i * 3);

    const v = Math.random();
    c.setRGB(1, 0.08 + v * 0.42, 0.32 + v * 0.38);
    colors.set([c.r, c.g, c.b], i * 3);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(current, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  const material = new THREE.PointsMaterial({
    size: mobile ? 0.11 : 0.085,
    map: glowTexture,
    vertexColors: true,
    transparent: true,
    opacity: 1,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  });
  const points = new THREE.Points(geometry, material);
  points.position.set(2.25, -0.1, -0.7);
  points.userData.starts = starts;
  points.userData.targets = targets;
  points.userData.morph = 0;
  points.userData.finished = false;
  scene.add(points);
  registerLayer("heart", points, [material], 0);
  return points;
}

function resetHeartMorph() {
  const positions = heartParticles.geometry.attributes.position.array;
  const starts = heartParticles.userData.starts;
  for (let i = 0; i < positions.length; i += 3) {
    const r = 5 + Math.random() * 9;
    const a = Math.random() * Math.PI * 2;
    starts[i] = Math.cos(a) * r;
    starts[i + 1] = (Math.random() - 0.5) * 11;
    starts[i + 2] = (Math.random() - 0.5) * 9;
    positions[i] = starts[i];
    positions[i + 1] = starts[i + 1];
    positions[i + 2] = starts[i + 2];
  }
  heartParticles.geometry.attributes.position.needsUpdate = true;
  heartParticles.userData.morph = 0;
  heartParticles.userData.finished = false;
  heartParticles.rotation.set(0, 0, 0);
}

function createRoseHeart() {
  const group = new THREE.Group();
  const material = new THREE.SpriteMaterial({
    map: roseTexture,
    color: 0xffffff,
    transparent: true,
    opacity: 1,
    depthWrite: false
  });
  const count = Math.floor(105 * quality);

  for (let i = 0; i < count; i += 1) {
    const sprite = new THREE.Sprite(material);
    const t = Math.random() * Math.PI * 2;
    const fill = Math.sqrt(Math.random()) * 0.98;
    const [x, y] = heartXY(t, 0.21 * fill);
    sprite.position.set(x, y - 0.25, (Math.random() - 0.5) * 0.78);
    const s = 0.38 + Math.random() * 0.38;
    sprite.scale.set(s, s, s);
    sprite.userData.pulse = Math.random() * Math.PI * 2;
    group.add(sprite);
  }

  group.position.set(2.25, -0.1, -0.55);
  scene.add(group);
  registerLayer("roseHeart", group, [material], 0);
  return group;
}

function createVortexRoses() {
  const group = new THREE.Group();
  const material = new THREE.SpriteMaterial({
    map: roseTexture,
    color: 0xffffff,
    transparent: true,
    opacity: 1,
    depthWrite: false,
    blending: THREE.NormalBlending
  });
  const count = Math.floor(86 * quality);

  for (let i = 0; i < count; i += 1) {
    const sprite = new THREE.Sprite(material);
    const u = i / count;
    sprite.userData.radius = 0.6 + u * 7.2;
    sprite.userData.phase = Math.random() * Math.PI * 2 + u * 8;
    sprite.userData.speed = 0.16 + Math.random() * 0.22;
    sprite.userData.depth = (Math.random() - 0.5) * 2.3;
    const s = 0.22 + Math.random() * 0.48;
    sprite.scale.set(s, s, s);
    group.add(sprite);
  }

  group.position.set(2.2, 0.1, -1.5);
  scene.add(group);
  registerLayer("vortexRoses", group, [material], 0);
  return group;
}

function createPetals() {
  const group = new THREE.Group();
  const geometry = new THREE.PlaneGeometry(0.42, 0.62, 1, 1);
  const material = new THREE.MeshBasicMaterial({
    map: petalTexture,
    transparent: true,
    opacity: 1,
    depthWrite: false,
    side: THREE.DoubleSide
  });
  const count = Math.floor(95 * quality);

  for (let i = 0; i < count; i += 1) {
    const petal = new THREE.Mesh(geometry, material);
    petal.userData.baseX = (Math.random() - 0.5) * 18;
    petal.userData.baseY = (Math.random() - 0.5) * 13;
    petal.userData.baseZ = -1 - Math.random() * 9;
    petal.userData.phase = Math.random() * Math.PI * 2;
    petal.userData.speed = 0.18 + Math.random() * 0.48;
    petal.userData.radius = 1.8 + Math.random() * 5.2;
    const s = 0.55 + Math.random() * 1.45;
    petal.scale.setScalar(s);
    petal.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
    group.add(petal);
  }

  scene.add(group);
  registerLayer("petals", group, [material], 0.08);
  return group;
}

function createNameParticles() {
  const canvas = document.createElement("canvas");
  canvas.width = 1800;
  canvas.height = 280;
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "white";
  ctx.font = "900 168px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("M\u00d3NICA S\u00c1NCHEZ", canvas.width / 2, canvas.height / 2 + 6);
  const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
  const targets = [];
  const step = mobile ? 9 : 7;

  for (let y = 0; y < canvas.height; y += step) {
    for (let x = 0; x < canvas.width; x += step) {
      const alpha = pixels[(y * canvas.width + x) * 4 + 3];
      if (alpha > 80 && Math.random() > 0.08) {
        targets.push(
          (x - canvas.width / 2) * 0.00775,
          (canvas.height / 2 - y) * 0.00775,
          (Math.random() - 0.5) * 0.28
        );
      }
    }
  }

  const count = Math.floor(targets.length / 3);
  const starts = new Float32Array(count * 3);
  const targetArray = new Float32Array(targets);
  const current = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const c = new THREE.Color();

  for (let i = 0; i < count; i += 1) {
    starts[i * 3] = (Math.random() - 0.5) * 17;
    starts[i * 3 + 1] = (Math.random() - 0.5) * 9;
    starts[i * 3 + 2] = (Math.random() - 0.5) * 6;
    current.set([starts[i * 3], starts[i * 3 + 1], starts[i * 3 + 2]], i * 3);
    const v = Math.random();
    c.setRGB(1, 0.45 + v * 0.45, 0.68 + v * 0.3);
    colors.set([c.r, c.g, c.b], i * 3);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(current, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  const material = new THREE.PointsMaterial({
    size: mobile ? 0.13 : 0.095,
    map: glowTexture,
    vertexColors: true,
    transparent: true,
    opacity: 1,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  });
  const points = new THREE.Points(geometry, material);
  points.position.set(0.5, 1.55, -0.5);
  points.userData.starts = starts;
  points.userData.targets = targetArray;
  points.userData.morph = 0;
  points.userData.finished = false;
  scene.add(points);
  registerLayer("name", points, [material], 0);
  return points;
}

function resetNameMorph() {
  const positions = nameParticles.geometry.attributes.position.array;
  const starts = nameParticles.userData.starts;
  for (let i = 0; i < positions.length; i += 3) {
    starts[i] = (Math.random() - 0.5) * 18;
    starts[i + 1] = (Math.random() - 0.5) * 10;
    starts[i + 2] = (Math.random() - 0.5) * 7;
    positions[i] = starts[i];
    positions[i + 1] = starts[i + 1];
    positions[i + 2] = starts[i + 2];
  }
  nameParticles.geometry.attributes.position.needsUpdate = true;
  nameParticles.userData.morph = 0;
  nameParticles.userData.finished = false;
}

function createFinalHeart() {
  const count = Math.floor(1900 * quality);
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const c = new THREE.Color();

  for (let i = 0; i < count; i += 1) {
    const t = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.018;
    const [x, y] = heartXY(t, 0.225);
    positions.set([x, y - 0.3, (Math.random() - 0.5) * 0.3], i * 3);
    const v = Math.random();
    c.setRGB(1, 0.25 + v * 0.58, 0.52 + v * 0.42);
    colors.set([c.r, c.g, c.b], i * 3);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  const material = new THREE.PointsMaterial({
    size: mobile ? 0.15 : 0.11,
    map: glowTexture,
    vertexColors: true,
    transparent: true,
    opacity: 1,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  });
  const points = new THREE.Points(geometry, material);
  points.position.set(-2.25, 0.1, -0.3);
  scene.add(points);
  registerLayer("finalHeart", points, [material], 0);
  return points;
}

function createFloatingHearts() {
  const group = new THREE.Group();
  const material = new THREE.SpriteMaterial({
    map: heartTexture,
    color: 0xffffff,
    transparent: true,
    opacity: 1,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  });
  const count = Math.floor(28 * quality);
  for (let i = 0; i < count; i += 1) {
    const sprite = new THREE.Sprite(material);
    sprite.userData.phase = Math.random() * Math.PI * 2;
    sprite.userData.x = (Math.random() - 0.5) * 15;
    sprite.userData.y = (Math.random() - 0.5) * 9;
    sprite.userData.z = -2 - Math.random() * 8;
    sprite.userData.speed = 0.08 + Math.random() * 0.2;
    const s = 0.2 + Math.random() * 0.35;
    sprite.scale.set(s, s, s);
    group.add(sprite);
  }
  scene.add(group);
  registerLayer("floatingHearts", group, [material], 0.28);
  return group;
}

function createMoonTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  const g = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  g.addColorStop(0, "#fff0f5");
  g.addColorStop(0.48, "#e7a8b9");
  g.addColorStop(1, "#8d3f59");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < 260; i += 1) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const r = 2 + Math.random() * 18;
    const shade = 35 + Math.floor(Math.random() * 50);
    ctx.fillStyle = `rgba(${shade}, 12, 31, ${0.025 + Math.random() * 0.08})`;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  return texture;
}

function createMoon() {
  const group = new THREE.Group();
  const moonMaterial = new THREE.MeshStandardMaterial({
    map: createMoonTexture(),
    roughness: 0.98,
    metalness: 0,
    emissive: 0x2b0615,
    emissiveIntensity: 0.24,
    transparent: true,
    opacity: 1
  });
  const sphere = new THREE.Mesh(new THREE.SphereGeometry(2.2, 64, 64), moonMaterial);
  group.add(sphere);

  const glowMaterial = new THREE.SpriteMaterial({
    map: glowTexture,
    color: 0xff6caa,
    transparent: true,
    opacity: 0.28,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  });
  const glow = new THREE.Sprite(glowMaterial);
  glow.scale.set(7.2, 7.2, 1);
  glow.position.z = -0.4;
  group.add(glow);
  group.position.set(-2.3, 1.55, -3.8);
  scene.add(group);
  registerLayer("moon", group, [moonMaterial, glowMaterial], 0);
  return group;
}

function createShootingStars() {
  const group = new THREE.Group();
  const materials = [];
  const count = mobile ? 3 : 5;
  for (let i = 0; i < count; i += 1) {
    const geometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(-2.4 - Math.random() * 2.3, 1.1 + Math.random() * 1.2, 0)
    ]);
    const material = new THREE.LineBasicMaterial({
      color: i % 2 ? 0xffb3d1 : 0xffffff,
      transparent: true,
      opacity: 0.52,
      blending: THREE.AdditiveBlending
    });
    const line = new THREE.Line(geometry, material);
    line.position.set(-12 + Math.random() * 23, 4 + Math.random() * 6, -6 - Math.random() * 7);
    line.userData.speed = 2.6 + Math.random() * 2.8;
    line.userData.offset = Math.random() * 6;
    group.add(line);
    materials.push(material);
  }
  scene.add(group);
  registerLayer("shooting", group, materials, 0.6);
  return group;
}

const starField = createStarField();
const nebula = createNebula();
const galaxy = createGalaxy();
const heartParticles = createHeartParticles();
const roseHeart = createRoseHeart();
const vortexRoses = createVortexRoses();
const petals = createPetals();
const nameParticles = createNameParticles();
const finalHeart = createFinalHeart();
const floatingHearts = createFloatingHearts();
const moon = createMoon();
const shootingStars = createShootingStars();

function setVisualTargets(sceneNumber) {
  const targetSets = {
    1: { galaxy: 1, vortexRoses: 0, heart: 0, roseHeart: 0, petals: 0.08, name: 0, finalHeart: 0, floatingHearts: 0.36, moon: 0, shooting: 0.65 },
    2: { galaxy: 0.7, vortexRoses: 1, heart: 0, roseHeart: 0, petals: 0.22, name: 0, finalHeart: 0, floatingHearts: 0.12, moon: 0, shooting: 0.32 },
    3: { galaxy: 0.18, vortexRoses: 0.08, heart: 1, roseHeart: 0, petals: 0.82, name: 0, finalHeart: 0, floatingHearts: 0.55, moon: 0, shooting: 0.18 },
    4: { galaxy: 0.16, vortexRoses: 0, heart: 0.24, roseHeart: 1, petals: 0.9, name: 0, finalHeart: 0, floatingHearts: 0.34, moon: 0, shooting: 0.22 },
    5: { galaxy: 0.13, vortexRoses: 0, heart: 0, roseHeart: 0.08, petals: 0.7, name: 1, finalHeart: 0, floatingHearts: 0.22, moon: 0, shooting: 0.3 },
    6: { galaxy: 0.12, vortexRoses: 0, heart: 0, roseHeart: 0, petals: 0.74, name: 0.1, finalHeart: 0, floatingHearts: 0.12, moon: 0, shooting: 0.18 },
    7: { galaxy: 0.12, vortexRoses: 0, heart: 0, roseHeart: 0, petals: 0.48, name: 0, finalHeart: 0, floatingHearts: 0.08, moon: 1, shooting: 1 },
    8: { galaxy: 0.18, vortexRoses: 0, heart: 0, roseHeart: 0, petals: 0.55, name: 0, finalHeart: 1, floatingHearts: 0.65, moon: 0.08, shooting: 0.72 }
  };

  const targets = targetSets[sceneNumber];
  for (const [name, value] of Object.entries(targets)) targetLayer(name, value);
}

function updateCardContent(sceneNumber) {
  const data = chapters[sceneNumber - 1];
  dom.label.textContent = data.label;
  dom.title.innerHTML = data.title;
  dom.lead.textContent = data.lead;
  dom.body.textContent = data.body;
  dom.next.textContent = data.button;
  dom.prev.disabled = sceneNumber === 1;

  if (data.signature) {
    dom.signature.hidden = false;
    dom.signature.textContent = data.signature;
  } else {
    dom.signature.hidden = true;
    dom.signature.textContent = "";
  }

  [...dom.progress.children].forEach((dot, index) => {
    dot.classList.toggle("active", index === sceneNumber - 1);
  });
}

function transitionCard(sceneNumber) {
  dom.card.classList.remove("turning-in");
  dom.card.classList.add("turning-out");
  window.setTimeout(() => {
    updateCardContent(sceneNumber);
    dom.card.classList.remove("turning-out");
    void dom.card.offsetWidth;
    dom.card.classList.add("turning-in");
  }, reducedMotion ? 1 : 190);
}

function setScene(sceneNumber, immediate = false) {
  const next = THREE.MathUtils.clamp(sceneNumber, 1, chapters.length);
  const previous = currentScene;
  currentScene = next;
  document.body.dataset.scene = String(next);

  if (immediate) updateCardContent(next);
  else transitionCard(next);

  setVisualTargets(next);

  if (next === 3 && previous !== 3) resetHeartMorph();
  if (next === 5 && previous !== 5) resetNameMorph();

  dom.book.classList.toggle("show", next === 6);
  dom.book.setAttribute("aria-hidden", next === 6 ? "false" : "true");
  if (next === 6) {
    dom.book.classList.remove("show");
    void dom.book.offsetWidth;
    window.setTimeout(() => dom.book.classList.add("show"), reducedMotion ? 1 : 140);
  }

  dom.observer.classList.toggle("show", next === 7);
}

function startMusic() {
  started = true;
  dom.music.volume = 0.48;
  const promise = dom.music.play();
  if (promise) promise.catch(() => {});
  dom.audioToggle.textContent = "\u266b";
  dom.audioToggle.setAttribute("aria-label", "Silenciar la musica");
}

function toggleMusic() {
  if (dom.music.paused) {
    startMusic();
  } else {
    dom.music.pause();
    dom.audioToggle.textContent = "\u266a";
    dom.audioToggle.setAttribute("aria-label", "Activar la musica");
  }
}

function nextScene() {
  const now = performance.now();
  if (now - lastNavAt < 360) return;
  lastNavAt = now;

  if (!started) startMusic();
  if (currentScene === chapters.length) setScene(1);
  else setScene(currentScene + 1);
}

function previousScene() {
  const now = performance.now();
  if (now - lastNavAt < 360) return;
  lastNavAt = now;
  if (currentScene > 1) setScene(currentScene - 1);
}

dom.next.addEventListener("click", nextScene);
dom.prev.addEventListener("click", previousScene);
dom.audioToggle.addEventListener("click", toggleMusic);

window.addEventListener("keydown", (event) => {
  if (["ArrowRight", "ArrowDown", " ", "PageDown"].includes(event.key)) {
    event.preventDefault();
    nextScene();
  }
  if (["ArrowLeft", "ArrowUp", "PageUp"].includes(event.key)) {
    event.preventDefault();
    previousScene();
  }
});

window.addEventListener("wheel", (event) => {
  if (Math.abs(event.deltaY) < 24) return;
  if (event.deltaY > 0) nextScene();
  else previousScene();
}, { passive: true });

window.addEventListener("touchstart", (event) => {
  touchStartY = event.touches[0]?.clientY ?? 0;
}, { passive: true });

window.addEventListener("touchend", (event) => {
  const endY = event.changedTouches[0]?.clientY ?? touchStartY;
  const delta = touchStartY - endY;
  if (Math.abs(delta) < 52) return;
  if (delta > 0) nextScene();
  else previousScene();
}, { passive: true });

window.addEventListener("pointermove", (event) => {
  pointerTarget.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointerTarget.y = -((event.clientY / window.innerHeight) * 2 - 1);
});

function easeOutCubic(x) {
  return 1 - Math.pow(1 - x, 3);
}

function updateHeartMorph(dt) {
  if (heartParticles.userData.finished) return;
  heartParticles.userData.morph = Math.min(1, heartParticles.userData.morph + dt * (reducedMotion ? 4.2 : 0.48));
  const k = easeOutCubic(heartParticles.userData.morph);
  const positions = heartParticles.geometry.attributes.position.array;
  const starts = heartParticles.userData.starts;
  const targets = heartParticles.userData.targets;

  for (let i = 0; i < positions.length; i += 1) {
    positions[i] = starts[i] + (targets[i] - starts[i]) * k;
  }
  heartParticles.geometry.attributes.position.needsUpdate = true;
  if (heartParticles.userData.morph >= 1) heartParticles.userData.finished = true;
}

function updateNameMorph(dt) {
  if (nameParticles.userData.finished) return;
  nameParticles.userData.morph = Math.min(1, nameParticles.userData.morph + dt * (reducedMotion ? 4 : 0.56));
  const k = easeOutCubic(nameParticles.userData.morph);
  const positions = nameParticles.geometry.attributes.position.array;
  const starts = nameParticles.userData.starts;
  const targets = nameParticles.userData.targets;

  for (let i = 0; i < positions.length; i += 1) {
    positions[i] = starts[i] + (targets[i] - starts[i]) * k;
  }
  nameParticles.geometry.attributes.position.needsUpdate = true;
  if (nameParticles.userData.morph >= 1) nameParticles.userData.finished = true;
}

function updateVortex() {
  if (!vortexRoses.visible) return;
  const children = vortexRoses.children;
  for (let i = 0; i < children.length; i += 1) {
    const rose = children[i];
    const d = rose.userData;
    const a = d.phase + elapsed * d.speed + d.radius * 0.2;
    const r = d.radius * (0.92 + Math.sin(elapsed * 0.7 + d.phase) * 0.05);
    rose.position.set(
      Math.cos(a) * r,
      Math.sin(a) * r * 0.61,
      d.depth + Math.sin(a * 1.8) * 0.7
    );
    const pulse = 1 + Math.sin(elapsed * 1.5 + d.phase) * 0.12;
    rose.scale.setScalar((0.28 + (i / children.length) * 0.42) * pulse);
  }
  vortexRoses.rotation.z = Math.sin(elapsed * 0.22) * 0.07;
}

function updatePetals(dt) {
  if (!petals.visible) return;
  for (const petal of petals.children) {
    const d = petal.userData;
    if (currentScene === 3 || currentScene === 4) {
      const a = d.phase + elapsed * d.speed;
      petal.position.x = 2.25 + Math.cos(a) * d.radius;
      petal.position.y = Math.sin(a * 1.07) * (1.2 + d.radius * 0.38);
      petal.position.z = -1.4 + Math.sin(a * 1.7) * 2.2;
    } else {
      const span = 14;
      const yy = ((d.baseY + elapsed * d.speed * 1.8 + span / 2) % span) - span / 2;
      petal.position.x = d.baseX + Math.sin(elapsed * 0.52 + d.phase) * 1.25;
      petal.position.y = yy;
      petal.position.z = d.baseZ + Math.cos(elapsed * 0.38 + d.phase) * 0.9;
    }
    petal.rotation.x += dt * (0.4 + d.speed);
    petal.rotation.y += dt * (0.32 + d.speed * 0.7);
    petal.rotation.z += dt * 0.28;
  }
}

function updateFloatingHearts() {
  if (!floatingHearts.visible) return;
  for (const heart of floatingHearts.children) {
    const d = heart.userData;
    heart.position.x = d.x + Math.sin(elapsed * d.speed * 2 + d.phase) * 0.65;
    heart.position.y = d.y + Math.sin(elapsed * d.speed + d.phase) * 1.1;
    heart.position.z = d.z + Math.cos(elapsed * d.speed + d.phase) * 0.6;
  }
}

function updateShootingStars(dt) {
  if (!shootingStars.visible) return;
  for (const line of shootingStars.children) {
    line.position.x += line.userData.speed * dt;
    line.position.y -= line.userData.speed * 0.34 * dt;
    if (line.position.x > 14 || line.position.y < -7) {
      line.position.x = -14 - Math.random() * 8;
      line.position.y = 4 + Math.random() * 9;
      line.position.z = -6 - Math.random() * 9;
    }
  }
}

function updateCamera(dt) {
  pointer.lerp(pointerTarget, 1 - Math.exp(-2.6 * dt));
  const cameraPoses = {
    1: [0, 0, 9.5],
    2: [0, 0, 9.2],
    3: [0, 0, 8.8],
    4: [0, 0, 8.9],
    5: [0, 0.1, 9.6],
    6: [0, 0.25, 10.2],
    7: [0, 0.15, 10.4],
    8: [0, 0.1, 9.7]
  };
  const [baseX, baseY, baseZ] = cameraPoses[currentScene];
  const parallax = mobile ? 0.16 : 0.42;
  const targetX = baseX + pointer.x * parallax;
  const targetY = baseY + pointer.y * parallax * 0.58;
  const mix = 1 - Math.exp(-2.3 * dt);
  camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, mix);
  camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, mix);
  camera.position.z = THREE.MathUtils.lerp(camera.position.z, baseZ, mix);
  camera.lookAt(0, 0, -1.2);
}

const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  const dt = Math.min(clock.getDelta(), 0.05);
  elapsed += dt;

  updateLayers(dt);
  updateCamera(dt);

  starField.rotation.y += dt * 0.0055;
  starField.rotation.x = Math.sin(elapsed * 0.045) * 0.035;
  layers.stars.records[0].material.opacity = layers.stars.records[0].base * layers.stars.opacity * (0.9 + Math.sin(elapsed * 1.9) * 0.055);

  galaxy.rotation.z -= dt * (currentScene === 2 ? 0.075 : 0.032);
  galaxy.rotation.y = Math.sin(elapsed * 0.18) * 0.13;
  const galaxyPulse = 1 + Math.sin(elapsed * 0.8) * 0.018;
  galaxy.scale.setScalar(galaxyPulse);

  for (const cloud of nebula.children) {
    cloud.position.x += cloud.userData.drift * dt;
  }

  if (currentScene === 3) updateHeartMorph(dt);
  if (heartParticles.visible) {
    const pulse = 1 + Math.sin(elapsed * 3.2) * 0.035;
    heartParticles.scale.setScalar(pulse);
    if (currentScene !== 3) heartParticles.rotation.y += dt * 0.12;
  }

  if (roseHeart.visible) {
    const pulse = 1 + Math.sin(elapsed * 3.1) * 0.035;
    roseHeart.scale.setScalar(pulse);
    roseHeart.rotation.y = Math.sin(elapsed * 0.45) * 0.16;
    roseHeart.rotation.z = Math.sin(elapsed * 0.35) * 0.025;
  }

  if (currentScene === 5) updateNameMorph(dt);
  if (nameParticles.visible) {
    nameParticles.rotation.y = Math.sin(elapsed * 0.45) * 0.05;
    nameParticles.position.y = 1.55 + Math.sin(elapsed * 0.8) * 0.08;
  }

  if (finalHeart.visible) {
    const pulse = 1 + Math.sin(elapsed * 2.8) * 0.055;
    finalHeart.scale.setScalar(pulse);
    finalHeart.rotation.y = Math.sin(elapsed * 0.55) * 0.18;
  }

  if (moon.visible) {
    moon.rotation.y += dt * 0.025;
    moon.position.y = 1.55 + Math.sin(elapsed * 0.22) * 0.08;
  }

  updateVortex();
  updatePetals(dt);
  updateFloatingHearts();
  updateShootingStars(dt);

  composer.render();
}

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, window.innerWidth < 760 ? 1.35 : 1.75));
  renderer.setSize(window.innerWidth, window.innerHeight);
  composer.setSize(window.innerWidth, window.innerHeight);
});

setScene(1, true);
animate();
