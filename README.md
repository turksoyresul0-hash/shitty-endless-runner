[index.html.txt](https://github.com/user-attachments/files/32151593/index.html.txt)
<!DOCTYPE html>
<html lang="tr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<title>FPS Game</title>

<script type="importmap">
{
  "imports": {
    "three": "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js"
  }
}
</script>

<style>
* {
    box-sizing: border-box;
}

body {
    margin: 0;
    overflow: hidden;
    background: black;
    font-family: Arial, sans-serif;
}

canvas {
    display: block;
}

#crosshair {
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    color: white;
    font-size: 28px;
    z-index: 10;
    pointer-events: none;
}

#hud {
    position: fixed;
    top: 20px;
    left: 20px;
    color: white;
    font-size: 18px;
    line-height: 1.6;
    text-shadow: 2px 2px 4px black;
    z-index: 20;
}

#message {
    position: fixed;
    bottom: 25px;
    left: 50%;
    transform: translateX(-50%);
    color: white;
    background: rgba(0,0,0,.6);
    padding: 12px 20px;
    border-radius: 10px;
    z-index: 20;
}
</style>
</head>

<body>

<div id="crosshair">+</div>

<div id="hud">
    ❤️ HP: <span id="hp">100</span><br>
    🔫 Mermi: <span id="ammo">30</span> / 120<br>
    💰 Para: <span id="money">0</span>
</div>

<div id="message">
    WASD hareket | Mouse kamera | SPACE zıpla | Sol tık ateş | R reload
</div>

<script type="module">

import * as THREE from "three";


// ==================================================
// SAHNE
// ==================================================

const scene = new THREE.Scene();

scene.background = new THREE.Color(0x87ceeb);

scene.fog = new THREE.Fog(
    0x87ceeb,
    30,
    180
);


// ==================================================
// KAMERA
// ==================================================

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

camera.position.set(0, 2, 5);


// ==================================================
// RENDER
// ==================================================

const renderer = new THREE.WebGLRenderer({
    antialias: true
});

renderer.setSize(
    window.innerWidth,
    window.innerHeight
);

renderer.setPixelRatio(
    Math.min(window.devicePixelRatio, 2)
);

document.body.appendChild(renderer.domElement);


// ==================================================
// IŞIK
// ==================================================

scene.add(
    new THREE.HemisphereLight(
        0xffffff,
        0x444444,
        1.5
    )
);

const sun = new THREE.DirectionalLight(
    0xffffff,
    2
);

sun.position.set(30, 50, 20);

scene.add(sun);


// ==================================================
// ZEMİN
// ==================================================

const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(300, 300),
    new THREE.MeshStandardMaterial({
        color: 0x3d7f3d
    })
);

ground.rotation.x = -Math.PI / 2;

scene.add(ground);


// ==================================================
// KÜP OLUŞTURMA
// ==================================================

function box(
    x,
    y,
    z,
    w,
    h,
    d,
    color
) {

    const object = new THREE.Mesh(
        new THREE.BoxGeometry(w, h, d),
        new THREE.MeshStandardMaterial({
            color: color
        })
    );

    object.position.set(x, y, z);

    scene.add(object);

    return object;
}


// ==================================================
// HARİTA
// ==================================================

box(
    0, 5, -70,
    140, 10, 2,
    0x555555
);

box(
    0, 5, 70,
    140, 10, 2,
    0x555555
);

box(
    -70, 5, 0,
    2, 10, 140,
    0x555555
);

box(
    70, 5, 0,
    2, 10, 140,
    0x555555
);


// ==================================================
// BİNALAR / ENGELLER
// ==================================================

box(
    -15, 3, -20,
    12, 6, 12,
    0x777777
);

box(
    20, 2, -30,
    15, 4, 10,
    0x666666
);

box(
    -30, 2, 15,
    10, 4, 15,
    0x777777
);


// ==================================================
// OYUNCU
// ==================================================

const player = {
    position: new THREE.Vector3(0, 2, 5),

    rotationY: 0,

    rotationX: 0,

    velocityY: 0,

    canJump: true,

    speed: 8,

    hp: 100,

    money: 0
};


// ==================================================
// KLAVYE
// ==================================================

const keys = {};

window.addEventListener(
    "keydown",
    e => {

        keys[e.code] = true;

        if (
            e.code === "Space" &&
            player.canJump
        ) {

            player.velocityY = 9;

            player.canJump = false;
        }

        if (
            e.code === "KeyR"
        ) {

            reload();
        }

    }
);

window.addEventListener(
    "keyup",
    e => {

        keys[e.code] = false;
    }
);


// ==================================================
// MOUSE KONTROLÜ
// ==================================================

let mouseDown = false;

window.addEventListener(
    "mousemove",
    e => {

        // Mouse hareketini kamera yönüne çeviriyoruz.

        player.rotationY -=
            e.movementX * 0.003;

        player.rotationX -=
            e.movementY * 0.003;

        player.rotationX =
            Math.max(
                -1.4,
                Math.min(
                    1.4,
                    player.rotationX
                )
            );

    }
);


// ==================================================
// ATEŞ
// ==================================================

window.addEventListener(
    "mousedown",
    e => {

        if (e.button === 0) {

            mouseDown = true;

            shoot();
        }

    }
);

window.addEventListener(
    "mouseup",
    e => {

        if (e.button === 0) {

            mouseDown = false;
        }

    }
);


// ==================================================
// SİLAH
// ==================================================

let ammo = 30;

let reserveAmmo = 120;


function shoot() {

    if (ammo <= 0) {

        reload();

        return;
    }

    ammo--;

    document.getElementById(
        "ammo"
    ).textContent = ammo;


    const direction =
        new THREE.Vector3(
            0,
            0,
            -1
        );

    direction.applyEuler(
        camera.rotation
    );

    direction.normalize();


    const raycaster =
        new THREE.Raycaster(
            camera.position,
            direction
        );


    const hits =
        raycaster.intersectObjects(
            scene.children,
            true
        );


    for (
        const hit of hits
    ) {

        if (
            hit.object.userData.enemy
        ) {

            damageEnemy(
                hit.object
            );

            break;
        }
    }

}


function reload() {

    if (ammo >= 30)
        return;

    if (reserveAmmo <= 0)
        return;

    const needed =
        30 - ammo;

    const amount =
        Math.min(
            needed,
            reserveAmmo
        );

    ammo += amount;

    reserveAmmo -= amount;

    document.getElementById(
        "ammo"
    ).textContent = ammo;
}


// ==================================================
// DÜŞMANLAR
// ==================================================

const enemies = [];


function createEnemy(
    x,
    z
) {

    const enemy = new THREE.Mesh(
        new THREE.BoxGeometry(
            1.5,
            2.5,
            1.5
        ),

        new THREE.MeshStandardMaterial({
            color: 0xcc2222
        })
    );

    enemy.position.set(
        x,
        1.25,
        z
    );

    enemy.userData.enemy = true;

    enemy.userData.hp = 100;

    scene.add(enemy);

    enemies.push(enemy);
}


createEnemy(10, -20);

createEnemy(-15, -30);

createEnemy(20, -40);

createEnemy(-25, -45);


// ==================================================
// DÜŞMAN HASARI
// ==================================================

function damageEnemy(enemy) {

    enemy.userData.hp -= 34;

    enemy.material.color.set(
        0xffffff
    );

    setTimeout(
        () => {

            if (enemy.parent) {

                enemy.material.color.set(
                    0xcc2222
                );
            }

        },
        100
    );


    if (
        enemy.userData.hp <= 0
    ) {

        scene.remove(enemy);

        const index =
            enemies.indexOf(enemy);

        if (index !== -1) {

            enemies.splice(
                index,
                1
            );
        }


        player.money += 100;

        document.getElementById(
            "money"
        ).textContent =
            player.money;
    }

}


// ==================================================
// DÜŞMAN AI
// ==================================================

function updateEnemies(delta) {

    for (
        const enemy of enemies
    ) {

        const direction =
            new THREE.Vector3();

        direction.subVectors(
            player.position,
            enemy.position
        );

        direction.y = 0;

        const distance =
            direction.length();


        if (distance > 2.5) {

            direction.normalize();

            enemy.position.add(
                direction.multiplyScalar(
                    delta * 2
                )
            );
        }


        // Oyuncuya temas ederse hasar

        if (
            distance < 2.5
        ) {

            player.hp -=
                delta * 10;

            player.hp =
                Math.max(
                    0,
                    player.hp
                );

            document.getElementById(
                "hp"
            ).textContent =
                Math.floor(
                    player.hp
                );

        }

    }

}


// ==================================================
// OYUNCU HAREKETİ
// ==================================================

function updatePlayer(delta) {

    const direction =
        new THREE.Vector3();


    if (keys["KeyW"])
        direction.z -= 1;

    if (keys["KeyS"])
        direction.z += 1;

    if (keys["KeyA"])
        direction.x -= 1;

    if (keys["KeyD"])
        direction.x += 1;


    if (
        direction.length() > 0
    ) {

        direction.normalize();


        // Oyuncunun baktığı yöne göre hareket

        direction.applyAxisAngle(
            new THREE.Vector3(0, 1, 0),
            player.rotationY
        );


        player.position.x +=
            direction.x *
            player.speed *
            delta;

        player.position.z +=
            direction.z *
            player.speed *
            delta;
    }


    // Yerçekimi

    player.velocityY -=
        25 * delta;

    player.position.y +=
        player.velocityY *
        delta;


    if (
        player.position.y <= 2
    ) {

        player.position.y = 2;

        player.velocityY = 0;

        player.canJump = true;
    }


    // Harita sınırı

    player.position.x =
        THREE.MathUtils.clamp(
            player.position.x,
            -65,
            65
        );

    player.position.z =
        THREE.MathUtils.clamp(
            player.position.z,
            -65,
            65
        );
}


// ==================================================
// KAMERA
// ==================================================

function updateCamera() {

    camera.position.copy(
        player.position
    );


    camera.rotation.order =
        "YXZ";


    camera.rotation.y =
        player.rotationY;


    camera.rotation.x =
        player.rotationX;
}


// ==================================================
// OYUN DÖNGÜSÜ
// ==================================================

const clock =
    new THREE.Clock();


function animate() {

    requestAnimationFrame(
        animate
    );


    const delta =
        Math.min(
            clock.getDelta(),
            0.05
        );


    updatePlayer(delta);

    updateCamera();

    updateEnemies(delta);


    renderer.render(
        scene,
        camera
    );
}


animate();


// ==================================================
// EKRAN BOYUTU
// ==================================================

window.addEventListener(
    "resize",
    () => {

        camera.aspect =
            window.innerWidth /
            window.innerHeight;

        camera.updateProjectionMatrix();

        renderer.setSize(
            window.innerWidth,
            window.innerHeight
        );
    }
);

</script>

</body>
</html>
// ==================================================
// FPS SİLAHI
// ==================================================

const weapon = new THREE.Group();

camera.add(weapon);


// Gövde
const weaponBody = new THREE.Mesh(
    new THREE.BoxGeometry(0.45, 0.35, 1.4),
    new THREE.MeshStandardMaterial({
        color: 0x222222,
        metalness: 0.7,
        roughness: 0.3
    })
);

weapon.add(weaponBody);


// Namlu
const barrel = new THREE.Mesh(
    new THREE.CylinderGeometry(
        0.055,
        0.055,
        0.8,
        16
    ),
    new THREE.MeshStandardMaterial({
        color: 0x111111,
        metalness: 0.9
    })
);

barrel.rotation.x = Math.PI / 2;

barrel.position.z = -0.95;

weapon.add(barrel);


// Kabza
const grip = new THREE.Mesh(
    new THREE.BoxGeometry(
        0.25,
        0.6,
        0.3
    ),
    new THREE.MeshStandardMaterial({
        color: 0x111111
    })
);

grip.rotation.x = -0.25;

grip.position.set(
    0,
    -0.35,
    0.25
);

weapon.add(grip);


// Silahın ekran konumu
weapon.position.set(
    0.65,
    -0.55,
    -1.1
);

weapon.rotation.set(
    -0.05,
    -0.05,
    0
);
