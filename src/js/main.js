import * as THREE from 'three'


let scene, camera, renderer;

window.addEventListener("load", function() {
    init();
    animate();
});

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 500, 0);
    camera.lookAt(0, 0, 0);
    scene.add(camera);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(renderer.domElement);
}


function animate() {
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}