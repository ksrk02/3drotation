import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';


class threeElement {

    constructor() {

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 10000);
        this.light = new THREE.AmbientLight(0xFFFFFF, 1.0);
        this.renderer = new THREE.WebGLRenderer();
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    }

    mySet() {

        this.scene = new THREE.Scene();

        this.camera.position.set(0, -500, 0);
        this.camera.lookAt(0, 0, 0);

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);

        document.addEventListener('tochemove', function(e) { e.preventDefault(); }, { passive: false });
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.target.set(0, 0, 0);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.5;
        this.controls.enableZoom = false;
    }
}


class rotateTarget {

    constructor() {

        this.cube = new THREE.Mesh();
        this.arrow = new THREE.ArrowHelper();
        this.delatT = 0.01;
    }

    mySet(deltaT) {

        const geometry = new THREE.BoxGeometry(100, 100, 100);
        const material = new THREE.MeshNormalMaterial();
        this.cube = new THREE.Mesh(geometry, material);
        this.cube.position.set(0, 0, 0);

        const dir = new THREE.Vector3(1, 0, 0).normalize();
        const origin = new THREE.Vector3(0, 0, 0);
        const length = 200;
        const hex = 0xffff00;
        this.arrow = new THREE.ArrowHelper(dir, origin, length, hex);

        this.deltaT = deltaT;
    }

    rotateCube(gyro) {

        const rotationAxis = gyro.multiplyScalar(this.deltaT / 360 * 2 * Math.PI);
        const rotationAngle = rotationAxis.length();
        rotationAxis.normalize();

        const dq = new THREE.Quaternion().setFromAxisAngle(rotationAxis, rotationAngle);
        this.cube.quaternion.multiply(dq);
    }

    rotateArrow(mag, magOffset) {

        mag.add(magOffset.negate()).normalize();
        console.log(mag);

        this.arrow.setDirection(mag);
    }
}

export { threeElement, rotateTarget };