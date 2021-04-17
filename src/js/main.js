import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { io } from 'socket.io-client';
import { threeElement, rotateTarget } from './settings';
import { calcMagOffset } from './spherefit';


let acc = new THREE.Vector3();
let gyro = new THREE.Vector3();
let mag = new THREE.Vector3();
let magDatas = [];
let magOffset = new THREE.Vector3();
let magScale = 1.0;
const deltaT = 0.01;
const maxLen = 200;

let three = new threeElement();
let target = new rotateTarget();


const socket = io();

socket.on('connect', function() {
    console.log('Connected to server');
});

socket.on('StoC', function(data) {
    let datas = data.split(',');

    acc = new THREE.Vector3(parseFloat(datas[0]), parseFloat(datas[1]), parseFloat(datas[2]));
    gyro = new THREE.Vector3(parseFloat(datas[3]), parseFloat(datas[4]), parseFloat(datas[5]));
    mag = new THREE.Vector3(parseFloat(datas[6]), parseFloat(datas[7]), parseFloat(datas[8]));

    magDatas.push(new THREE.Vector3(mag.x, mag.y, mag.z));
    if (magDatas.length > maxLen) magDatas.splice(0, 1);
});



window.addEventListener('load', function() {
    init();
    animate();
});


function init() {

    three.mySet();

    target.mySet(deltaT);

    three.scene.add(three.camera, three.light, target.cube, target.arrow);
}


function animate() {

    if (three.controls) three.controls.update();

    target.rotateCube(gyro);
    target.rotateArrow(mag, magOffset);

    three.renderer.render(three.scene, three.camera);
    requestAnimationFrame(animate);
}


document.getElementById('calc-mag-offset').addEventListener('click', function() {
    const res = calcMagOffset(magDatas);
    magOffset = res[0];
    magScale = res[1];
    console.log(magOffset, magScale);
});