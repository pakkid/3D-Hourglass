import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const canvas = document.getElementById('hourglassCanvas');
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(window.innerWidth, window.innerHeight);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

const controls = new OrbitControls(camera, renderer.domElement);

const hourglassGeometry = new THREE.CylinderGeometry(1, 1, 3, 32);
const hourglassMaterial = new THREE.MeshBasicMaterial({ color: 0x8B4513, wireframe: true });
const hourglass = new THREE.Mesh(hourglassGeometry, hourglassMaterial);
scene.add(hourglass);

const sandParticles = [];
const sandMaterial = new THREE.PointsMaterial({ color: 0xFFD700, size: 0.05 });

for (let i = 0; i < 1000; i++) {
    const particle = new THREE.Vector3(
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2
    );
    sandParticles.push(particle);
}

const sandGeometry = new THREE.BufferGeometry().setFromPoints(sandParticles);
const sand = new THREE.Points(sandGeometry, sandMaterial);
scene.add(sand);

const timeSlider = document.getElementById('timeSlider');
const holeSizeSlider = document.getElementById('holeSizeSlider');

function animate() {
    requestAnimationFrame(animate);

    // Update sand particles
    sandParticles.forEach(particle => {
        particle.y -= 0.01 * timeSlider.value;
        if (particle.y < -1.5) {
            particle.y = 1.5;
        }
    });
    sandGeometry.setFromPoints(sandParticles);

    controls.update();
    renderer.render(scene, camera);
}

animate();