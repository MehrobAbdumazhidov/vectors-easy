let scene, camera, renderer, controls;
let arrowHelpers = [];

init();
animate();

document.getElementById('draw-btn').addEventListener('click', drawVectors);

function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf4f6f8);

  const canvasContainer = document.getElementById('three-canvas');
  const width = canvasContainer.clientWidth;
  const height = canvasContainer.clientHeight;

  camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
  camera.position.set(5, 5, 5);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(width, height);
  canvasContainer.appendChild(renderer.domElement);

  window.addEventListener('resize', () => {
    const newWidth = canvasContainer.clientWidth;
    const newHeight = canvasContainer.clientHeight;
    camera.aspect = newWidth / newHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(newWidth, newHeight);
  });

  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  addGridAndAxes();
  addLights();
}

function addLights() {
  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(5, 10, 7.5);
  scene.add(light);
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);
}

function addGridAndAxes() {
  const axisLength = 7;

  const gridHelper = new THREE.GridHelper(20, 20, 0xaaaaaa, 0xdddddd);
  gridHelper.material.opacity = 0.6;
  gridHelper.material.transparent = true;
  scene.add(gridHelper);

  const colors = {
    x: 0xff0000,
    y: 0x00cc00,
    z: 0x0066ff
  };

  addFullAxis(new THREE.Vector3(1, 0, 0), colors.x, axisLength);
  addFullAxis(new THREE.Vector3(0, 1, 0), colors.y, axisLength);
  addFullAxis(new THREE.Vector3(0, 0, 1), colors.z, axisLength);

  createAxisLabel("X", new THREE.Vector3(axisLength + 0.6, 0, 0), colors.x);
  createAxisLabel("Y", new THREE.Vector3(0, axisLength + 0.6, 0), colors.y);
  createAxisLabel("Z", new THREE.Vector3(0, 0, axisLength + 0.6), colors.z);

  for (let i = -axisLength; i <= axisLength; i++) {
    if (i !== 0) {
        // X
        addLabel(i.toString(), i, 0, 0, colors.x, new THREE.Vector3(0, 0.2, 0));
        addTickMark(new THREE.Vector3(i, 0, 0), new THREE.Vector3(0, 1, 0));

        // Y
        addLabel(i.toString(), 0, i, 0, colors.y, new THREE.Vector3(0.2, 0, 0));
        addTickMark(new THREE.Vector3(0, i, 0), new THREE.Vector3(1, 0, 0));

        // Z
        addLabel(i.toString(), 0, 0, i, colors.z, new THREE.Vector3(0.2, 0, 0));
        addTickMark(new THREE.Vector3(0, 0, i), new THREE.Vector3(1, 0, 0));
    }
  }
}


function createAxisLabel(text, position, color) {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  ctx.font = 'bold 48px Arial';
  ctx.fillStyle = "#" + color.toString(16).padStart(6, '0');
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillText(text, canvas.width / 2, canvas.height / 2);

  const texture = new THREE.CanvasTexture(canvas);
  const material = new THREE.SpriteMaterial({ map: texture, transparent: true });
  const sprite = new THREE.Sprite(material);
  sprite.scale.set(1.8, 0.9, 1);
  sprite.position.copy(position);
  scene.add(sprite);
}

function addLabel(text, x, y, z, color = 0x000000, offset = new THREE.Vector3(0, 0.2, 0)) {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 64;
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = "24px Arial";
  ctx.fillStyle = "#" + color.toString(16).padStart(6, '0');
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, canvas.width / 2, canvas.height / 2);

  const texture = new THREE.CanvasTexture(canvas);
  const material = new THREE.SpriteMaterial({ map: texture, transparent: true });
  const sprite = new THREE.Sprite(material);
  sprite.scale.set(1.2, 0.6, 1);
  sprite.position.set(x + offset.x, y + offset.y, z + offset.z);
  scene.add(sprite);
}

function addTickMark(position, direction) {
  const tickSize = 0.1;
  const tickDir = direction.clone().normalize().multiplyScalar(tickSize);
  const p1 = position.clone().add(tickDir);
  const p2 = position.clone().sub(tickDir);

  const geometry = new THREE.BufferGeometry().setFromPoints([p1, p2]);
  const material = new THREE.LineBasicMaterial({ color: 0x000000 });
  const line = new THREE.Line(geometry, material);
  scene.add(line);
}

function addFullAxis(direction, color, length) {
  // Положительная ось — стрелка
  const arrow = new THREE.ArrowHelper(direction, new THREE.Vector3(0, 0, 0), length, color, 0.4, 0.2);
  scene.add(arrow);

  // Отрицательная ось — линия до конца (в обратную сторону)
  const negEnd = direction.clone().multiplyScalar(-length);
  const material = new THREE.LineBasicMaterial({ color: color });
  const geometry = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(0, 0, 0),
    negEnd
  ]);
  const line = new THREE.Line(geometry, material);
  scene.add(line);
}


function drawVectors() {
  arrowHelpers.forEach(helper => scene.remove(helper));
  arrowHelpers = [];

  const aStart = getVectorFromInput('a-start');
  const aEnd = getVectorFromInput('a-end');
  const bStart = getVectorFromInput('b-start');
  const bEnd = getVectorFromInput('b-end');

  drawArrow(aStart, aEnd, 0x3498db);
  drawArrow(bStart, bEnd, 0xe74c3c);
}

function getVectorFromInput(id) {
  const raw = document.getElementById(id).value.trim();
  const parts = raw.split(',').map(Number);
  return new THREE.Vector3(...parts);
}

function drawArrow(start, end, color) {
  const dir = new THREE.Vector3().subVectors(end, start).normalize();
  const length = start.distanceTo(end);
  const arrowHelper = new THREE.ArrowHelper(dir, start, length, color, 0.2, 0.1);
  scene.add(arrowHelper);
  arrowHelpers.push(arrowHelper);
}

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

function addXTickWithLabel(value, color = 0xff0000) {
  // Горизонтальная позиция
  const x = value;
  const y = 0;
  const z = 0;

  // Чёрточка (вертикальная линия)
  const tickHeight = 0.2;
  const tickMaterial = new THREE.LineBasicMaterial({ color });
  const tickGeometry = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(x, -tickHeight / 2, z),
    new THREE.Vector3(x, tickHeight / 2, z)
  ]);
  const tick = new THREE.Line(tickGeometry, tickMaterial);
  scene.add(tick);

  // Цифра чуть выше
  const labelOffsetY = 0.4;
  addLabel(value.toString(), x, y + labelOffsetY, z, color);

      // Деления и подписи по оси X
  for (let i = -7; i <= 7; i++) {
    if (i !== 0) addXTickWithLabel(i);
  }
}
