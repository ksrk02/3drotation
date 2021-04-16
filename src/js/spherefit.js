import * as THREE from 'three'

export function calcMagOffset(magDatas) {

    let xsum = 0,
        ysum = 0,
        zsum = 0;
    let x2sum = 0,
        y2sum = 0,
        z2sum = 0;
    let xysum = 0,
        yzsum = 0,
        zxsum = 0;
    let Esum = 0,
        Fsum = 0,
        Gsum = 0,
        Hsum = 0;

    for (let i = 0; i < magDatas.length; i++) {

        const x = magDatas[i].x,
            y = magDatas[i].y,
            z = magDatas[i].z;
        const x2 = x * x,
            y2 = y * y,
            z2 = z * z;
        const xy = x * y,
            yz = y * z,
            zx = z * x;

        const E = -x * (x2 + y2 + z2),
            F = -y * (x2 + y2 + z2),
            G = -z * (x2 + y2 + z2),
            H = -(x2 + y2 + z2);

        xsum += x, ysum += y, zsum += z;
        x2sum += x2, y2sum += y2, z2sum += z2;
        xysum += xy, yzsum += yz, zxsum += zx;
        Esum += E, Fsum += F, Gsum += G, Hsum += H;
    }

    let M = new THREE.Matrix4();
    M.set(x2sum, xysum, zxsum, xsum,
        xysum, y2sum, yzsum, ysum,
        zxsum, yzsum, z2sum, zsum,
        xsum, ysum, zsum, magDatas.length);

    let L = new THREE.Matrix4();
    L.set(Esum, 0, 0, 0,
        Fsum, 0, 0, 0,
        Gsum, 0, 0, 0,
        Hsum, 0, 0, 0);

    let P = new THREE.Matrix4();
    P.multiplyMatrices(M.invert(), L)

    const A = P.elements[0],
        B = P.elements[1],
        C = P.elements[2],
        D = P.elements[3];


    const center = new THREE.Vector3(A, B, C).multiplyScalar(-0.5);
    const r = Math.sqrt(center.lengthSq() - D);

    return [center, r];
}