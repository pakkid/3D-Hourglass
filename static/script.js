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

// Create hourglass geometry
const hourglassMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    metalness: 0.2,
    roughness: 0.1,
    transmission: 0.95, // Glass effect
    clearcoat: 0.2,
    clearcoatRoughness: 0.05,
});

// Top and bottom spheres
const topSphere = new THREE.SphereGeometry(1, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2);
const bottomSphere = new THREE.SphereGeometry(1, 32, 32, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2);
const topGlass = new THREE.Mesh(topSphere, hourglassMaterial);
const bottomGlass = new THREE.Mesh(bottomSphere, hourglassMaterial);
topGlass.position.y = 1;
bottomGlass.position.y = -1;

// Neck cylinder
const neck = new THREE.CylinderGeometry(0.1, 0.1, 0.5, 32, 32);
const neckMesh = new THREE.Mesh(neck, hourglassMaterial);
neckMesh.position.y = 0;

// Base and top caps
const baseGeometry = new THREE.CylinderGeometry(1.2, 1.2, 0.1, 32);
const baseMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
const base = new THREE.Mesh(baseGeometry, baseMaterial);
const topCap = base.clone();
base.position.y = -2.1;
topCap.position.y = 2.1;

// Combine all parts into a single group
const hourglass = new THREE.Group();
hourglass.add(topGlass);
hourglass.add(bottomGlass);
hourglass.add(neckMesh);
hourglass.add(base);
hourglass.add(topCap);

scene.add(hourglass);

// Create sand particles
const sandParticles = [];
const sandMaterial = new THREE.PointsMaterial({ color: 0xFFD700, size: 0.05 });

for (let i = 0; i < 5000; i++) {
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

        // Collision detection with the hourglass
        if (particle.y < -1.5) {
            particle.y = 1.5; // Reset particle position
        } else if (particle.y < 0 && Math.abs(particle.x) < 0.1 && Math.abs(particle.z) < 0.1) {
            particle.y -= 0.02 * timeSlider.value; // Speed up through the neck
        } else if (particle.y < 0 && (Math.abs(particle.x) >= 0.1 || Math.abs(particle.z) >= 0.1)) {
            particle.y += 0.01 * timeSlider.value; // Slow down outside the neck
        }
    });
    sandGeometry.setFromPoints(sandParticles);

    controls.update();
    renderer.render(scene, camera);
}

animate();

// Additional detail for the hourglass
const detailMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
const detailGeometry = new THREE.TorusGeometry(1.2, 0.05, 16, 100);
const topDetail = new THREE.Mesh(detailGeometry, detailMaterial);
const bottomDetail = topDetail.clone();
topDetail.position.y = 2.15;
bottomDetail.position.y = -2.15;

hourglass.add(topDetail);
hourglass.add(bottomDetail);

// Add more sand particles for realism
for (let i = 0; i < 5000; i++) {
    const particle = new THREE.Vector3(
        (Math.random() - 0.5) * 1.8,
        Math.random() * 1.8 - 0.5,
        (Math.random() - 0.5) * 1.8
    );
    sandParticles.push(particle);
}

const moreSandGeometry = new THREE.BufferGeometry().setFromPoints(sandParticles);
const moreSand = new THREE.Points(moreSandGeometry, sandMaterial);
scene.add(moreSand);

// Add more detail to the hourglass base
const baseDetailGeometry = new THREE.CylinderGeometry(1.3, 1.3, 0.1, 32);
const baseDetail = new THREE.Mesh(baseDetailGeometry, baseMaterial);
const topBaseDetail = baseDetail.clone();
baseDetail.position.y = -2.2;
topBaseDetail.position.y = 2.2;

hourglass.add(baseDetail);
hourglass.add(topBaseDetail);

// Add more lighting for better visual effect
const additionalLight = new THREE.PointLight(0xffffff, 0.5, 100);
additionalLight.position.set(-10, -10, -10);
scene.add(additionalLight);

// Add more detail to the neck
const neckDetailGeometry = new THREE.CylinderGeometry(0.15, 0.15, 0.1, 32);
const neckDetail = new THREE.Mesh(neckDetailGeometry, hourglassMaterial);
neckDetail.position.y = 0.25;
hourglass.add(neckDetail);

const neckDetail2 = neckDetail.clone();
neckDetail2.position.y = -0.25;
hourglass.add(neckDetail2);

// Add more sand particles for realism
for (let i = 0; i < 5000; i++) {
    const particle = new THREE.Vector3(
        (Math.random() - 0.5) * 1.8,
        Math.random() * 1.8 - 0.5,
        (Math.random() - 0.5) * 1.8
    );
    sandParticles.push(particle);
}

const evenMoreSandGeometry = new THREE.BufferGeometry().setFromPoints(sandParticles);
const evenMoreSand = new THREE.Points(evenMoreSandGeometry, sandMaterial);
scene.add(evenMoreSand);

// Add more detail to the hourglass top and bottom
const topDetail2 = new THREE.Mesh(detailGeometry, detailMaterial);
const bottomDetail2 = topDetail2.clone();
topDetail2.position.y = 2.25;
bottomDetail2.position.y = -2.25;

hourglass.add(topDetail2);
hourglass.add(bottomDetail2);

// Add more sand particles for realism
for (let i = 0; i < 5000; i++) {
    const particle = new THREE.Vector3(
        (Math.random() - 0.5) * 1.8,
        Math.random() * 1.8 - 0.5,
        (Math.random() - 0.5) * 1.8
    );
    sandParticles.push(particle);
}

const finalSandGeometry = new THREE.BufferGeometry().setFromPoints(sandParticles);
const finalSand = new THREE.Points(finalSandGeometry, sandMaterial);
scene.add(finalSand);