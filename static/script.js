import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const canvas = document.getElementById('hourglassCanvas');
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xF5F5DC); // Set background color to beige

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 7;

const controls = new OrbitControls(camera, renderer.domElement);

// Add lighting for realistic rendering
const light = new THREE.PointLight(0xffffff, 1, 100);
light.position.set(10, 10, 10);
scene.add(light);

scene.add(new THREE.AmbientLight(0x404040, 0.5)); // Soft ambient light

// Create rounded hourglass geometry
const topSphere = new THREE.SphereGeometry(1, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2);
const bottomSphere = new THREE.SphereGeometry(1, 32, 32, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2);
const cylinder = new THREE.CylinderGeometry(0.1, 0.1, 0.5, 32, 32);

const hourglassMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    metalness: 0.2,
    roughness: 0.1,
    transmission: 0.95, // Glass effect
    clearcoat: 0.2,
    clearcoatRoughness: 0.05,
});

const topGlass = new THREE.Mesh(topSphere, hourglassMaterial);
topGlass.position.y = 1;

const bottomGlass = new THREE.Mesh(bottomSphere, hourglassMaterial);
bottomGlass.position.y = -1;

const neck = new THREE.Mesh(cylinder, hourglassMaterial);
neck.position.y = 0;

const hourglass = new THREE.Group();
hourglass.add(topGlass);
hourglass.add(bottomGlass);
hourglass.add(neck);

scene.add(hourglass);

// Create sand particles
const sandParticles = [];
const sandMaterial = new THREE.PointsMaterial({ color: 0xFFD700, size: 0.05 });

for (let i = 0; i < 1000; i++) {
    const particle = new THREE.Vector3(
        (Math.random() - 0.5) * 1.8,
        Math.random() * 1.8 - 0.5,
        (Math.random() - 0.5) * 1.8
    );
    sandParticles.push(particle);
}

const sandGeometry = new THREE.BufferGeometry().setFromPoints(sandParticles);
const sand = new THREE.Points(sandGeometry, sandMaterial);
scene.add(sand);

// Get sliders
const timeSlider = document.getElementById('timeSlider');
const holeSizeSlider = document.getElementById('holeSizeSlider');

function animate() {
    requestAnimationFrame(animate);

    // Update sand particles
    sandParticles.forEach(particle => {
        particle.y -= 0.01 * timeSlider.value;
        if (particle.y < -1.5) {
            particle.y = 1.5; // Reset particle position
        }
    });
    sandGeometry.setFromPoints(sandParticles);

    controls.update();
    renderer.render(scene, camera);
}

animate();