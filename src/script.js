// Number

// const canvas = document.getElementById("number");
// const ctx = canvas.getContext("2d");
// const x = 32;
// const y = 32;
// const radius = 30;
// const startAngle = 0;
// const endAngle = Math.PI * 2;
const boxElement = document.querySelector('.box');
const box2Element = document.querySelector('.box2');

// 在 init 函数中创建 Audio 对象
const annotation1 = document.querySelector(".annotation1");
const annotation2 = document.querySelector(".annotation2");

// const audio = new Audio('path/to/your/sound.mp3');
// ctx.fillStyle = "rgb(0, 0, 0)";
// ctx.beginPath();
// ctx.arc(x, y, radius, startAngle, endAngle);
// ctx.fill();

// ctx.strokeStyle = "rgb(255, 255, 255)";
// ctx.lineWidth = 3;
// ctx.beginPath();
// ctx.arc(x, y, radius, startAngle, endAngle);
// ctx.stroke();

// ctx.fillStyle = "rgb(255, 255, 255)";
// ctx.font = "32px sans-serif";
// ctx.textAlign = "center";
// ctx.textBaseline = "middle";
// ctx.fillText("222", x, y);

// three.js

let camera;
let controls;
let scene;
let renderer;
let sprite1;
let sprite2;
let mesh;
let spriteBehindObject;
let spriteBehindObject2;



init();
animate();

function init() {
    
    // Camera

    camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 2, 20000);
    camera.position.x = 750;
    camera.position.y = 500;
    camera.position.z = 1250;

    // Scene

    scene = new THREE.Scene();

    // Lights

    const lights = [];
    lights[0] = new THREE.PointLight(0xffffff, 1, 0);
    lights[1] = new THREE.PointLight(0xffffff, 1, 0);
    lights[2] = new THREE.PointLight(0xffffff, 1, 0);

    lights[0].position.set(0, 2000, 0);
    lights[1].position.set(1000, 2000, 1000);
    lights[2].position.set(-1000, -2000, -1000);

    scene.add(lights[0]);
    scene.add(lights[1]);
    scene.add(lights[2]);

    // Mesh

    const cubeGeometry = new THREE.BoxGeometry(500, 500, 500);

    mesh = new THREE.Mesh(
        cubeGeometry,
        new THREE.MeshPhongMaterial({
            color: 0x156589,
            emissive: 0x072534,
            side: THREE.DoubleSide,
            shading: THREE.FlatShading
        })
    );

    const line = new THREE.LineSegments(
        new THREE.WireframeGeometry(cubeGeometry),
        new THREE.LineBasicMaterial({
            color: 0xffffff,
            linewidth: 1,
            opacity: 0.25,
            transparent: true
        })
    );

    scene.add(mesh);
    scene.add(line);

    // Sprite

    // const numberTexture = new THREE.CanvasTexture(
    //     document.querySelector("#number")
    // );

    //精靈sprite 1
    const spriteMaterial1 = new THREE.SpriteMaterial({
        // map: numberTexture,
        alphaTest: 0.5,
        transparent: true,
        depthTest: false,
        depthWrite: false
    });
    sprite1 = new THREE.Sprite(spriteMaterial1);
    sprite1.position.set(250, 250, 250);
    sprite1.scale.set(60, 60, 1);
    scene.add(sprite1);
  
  
    const spriteMaterial2 = new THREE.SpriteMaterial({
        // map: numberTexture,
        alphaTest: 0.5,
        transparent: true,
        depthTest: false,
        depthWrite: false
    });
    sprite2 = new THREE.Sprite(spriteMaterial2);
    sprite2.position.set(-200, -100, 250);
    sprite2.scale.set(60, 60, 1);
    scene.add(sprite2);

    // Renderer

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x333333, 1);
    document.body.appendChild(renderer.domElement);

    // Controls

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableZoom = false;

    window.addEventListener("resize", onWindowResize, false);

    window.addEventListener("resize", onWindowResize, false);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}


// 计算相机到网格和精灵的距离 (sprite是類似定位點的概念)
function updateAnnotationOpacity() {
    const meshDistance = camera.position.distanceTo(mesh.position);
    const spriteDistance = camera.position.distanceTo(sprite1.position);
    spriteBehindObject = spriteDistance > meshDistance;
    sprite1.material.opacity = spriteBehindObject ? 0.25 : 1;
    sprite1.material.opacity = 0;
  
    const meshDistance2 = camera.position.distanceTo(mesh.position);
    const spriteDistance2 = camera.position.distanceTo(sprite2.position);
    spriteBehindObject2 = spriteDistance2 > meshDistance2;
    sprite2.material.opacity = spriteBehindObject2 ? 0.25 : 1;
    sprite2.material.opacity = 0; // sprite2透明度
}

function updateScreenPosition() {
    const vector_1 = new THREE.Vector3(200, 200, -100);
    const vector_2 = new THREE.Vector3(-200, -100, 250);
  
    const canvas = renderer.domElement;
    vector_1.project(camera);
    vector_1.x = Math.round((0.5 + vector_1.x / 2) * (canvas.width / window.devicePixelRatio));
    vector_1.y = Math.round((0.5 - vector_1.y / 2) * (canvas.height / window.devicePixelRatio));
    // html中定義的標記和vector綁定位置
    annotation1.style.top = `${vector_1.y}px`;
    annotation1.style.left = `${vector_1.x}px`;
    annotation1.style.opacity = spriteBehindObject ? 0.08 : 1;
  
    vector_2.project(camera);
    vector_2.x = Math.round((0.5 + vector_2.x / 2) * (canvas.width / window.devicePixelRatio));
    vector_2.y = Math.round((0.5 - vector_2.y / 2) * (canvas.height / window.devicePixelRatio));
    // html中定義的標記和vector綁定位置
    annotation2.style.top = `${vector_2.y}px`;
    annotation2.style.left = `${vector_2.x}px`;
    annotation2.style.opacity = spriteBehindObject2 ? 0.08 : 1;
}



// 在 .c1 元素的點擊事件處理中，更新相機位置
boxElement.addEventListener('click', () => {
  console.log('click');
    const newCameraPosition = new THREE.Vector3(750, 500, 1250);  // 新的相機位置
    moveCameraToPosition(newCameraPosition);  // 移動相機到新位置
});

box2Element.addEventListener('click', () => {
  console.log('click');
    const newCameraPosition = new THREE.Vector3(-550, -250, 1250);  // 新的相機位置
    moveCameraToPosition(newCameraPosition);  // 移動相機到新位置
});

// 移動相機到指定位置的函式
function moveCameraToPosition(position) {
    const enableTransition = true;  // 是否要動畫過渡
    
    // 使用Tween.js來平滑過渡相機位置
    new TWEEN.Tween(camera.position)
        .to({ x: position.x, y: position.y, z: position.z }, 1000) // 1000毫秒的過渡時間
        .easing(TWEEN.Easing.Quadratic.Out) // 過渡的緩動函式
        .onUpdate(() => {
            controls.update(); // 更新攝影機控制器
        })
        .start();
}


function animate() {
    requestAnimationFrame(animate);
    TWEEN.update();  // 更新 Tween.js 动画
    controls.update();
    render();
}

function render() {
    renderer.render(scene, camera);
    updateAnnotationOpacity();
    updateScreenPosition();
}