import * as THREE from 'three'
import { io } from 'socket.io-client';
import calcMagOffset from './spherefit'


let accX = 0,
    accY = 0,
    accZ = 0;
let gyroX = 0,
    gyroY = 0,
    gyroZ = 0;
let magX = 0,
    magY = 0,
    magZ = 0;
let magDatas = [];
const deltaT = 0.01;
const maxLen = 200;

const socket = io('http://localhost:3000');

socket.on('connect', function() {
    console.log('Connected to server');
});

socket.on('StoC', function(data) {
    let datas = data.split(',');

    accX = parseFloat(datas[0]);
    accY = parseFloat(datas[1]);
    accZ = parseFloat(datas[2]);
    gyroX = parseFloat(datas[3]);
    gyroY = parseFloat(datas[4]);
    gyroZ = parseFloat(datas[5]);
    magX = parseFloat(datas[6]);
    magY = parseFloat(datas[7]);
    magZ = parseFloat(datas[8]);

    magDatas.push(new THREE.Vector3(magX, magY, magZ));
    if (magDatas.length > maxLen) {
        magDatas.splice(0, 1);
    }
});


window.addEventListener('load', function() {
    init();
    animate();
});


let scene;
let camera
let renderer;
let cube;

function init() {

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 10000);
    camera.position.set(0, 500, 0);
    camera.lookAt(0, 0, 0);
    scene.add(camera);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(renderer.domElement);

    const geometry = new THREE.BoxGeometry(100, 100, 100);
    const material = new THREE.MeshNormalMaterial();

    cube = new THREE.Mesh(geometry, material);
    cube.position.set(0, 0, 0);
    scene.add(cube);
}


function animate() {

    let rotationAxis = new THREE.Vector3(0, 0, 1);

    rotationAxis.x = gyroX * deltaT / 360 * 2 * Math.PI;
    rotationAxis.y = gyroY * deltaT / 360 * 2 * Math.PI;
    rotationAxis.z = gyroZ * deltaT / 360 * 2 * Math.PI;

    const omega = rotationAxis.length();

    rotationAxis.normalize();

    const dq = new THREE.Quaternion().setFromAxisAngle(rotationAxis, omega);
    cube.quaternion.multiply(dq);


    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}