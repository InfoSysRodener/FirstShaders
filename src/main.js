import '../style.css'
import * as THREE from 'three';
import * as dat from 'dat.gui';
import SceneManager from './sceneManager/scene';
import gsap from 'gsap';
const gui = new dat.GUI();

//import shader
import vertexShader from './shaders/test/vertex.glsl?raw';
import fragmentShader from './shaders/test/fragment.glsl?raw';

//scene
const canvas = document.querySelector('#canvas');
const scene = new SceneManager(canvas);
scene.scene.background = 0x000000;
scene.addOrbitControl();
const axesHelper = new THREE.AxesHelper(5);


//lights
const directionalLight = new THREE.DirectionalLight(0xFFFFFF,1);
directionalLight.position.set(10,10,10);
scene.add(directionalLight);
// const directionalHelper = new THREE.DirectionalLightHelper( directionalLight, 5 );
//scene.add(directionalHelper);

// gui.add(directionalHelper, 'visible').name('DLight Helper')

const ambiantLight = new THREE.AmbientLight(0xFFFFFF,1);
scene.add(ambiantLight);





const width = 40;  
const height = 40;   
const geometry = new THREE.PlaneBufferGeometry(1,1,10,10);

const count = geometry.attributes.position.count;
const randoms = new Float32Array(count);

for(let i=0; i < count; i++){
	randoms[i] = Math.random();
}

geometry.setAttribute('aRandom', new THREE.BufferAttribute(randoms,1));


const material = new THREE.RawShaderMaterial({
	vertexShader:vertexShader,
	fragmentShader:fragmentShader,
	uniforms:{
		uFrequency:{ value: new THREE.Vector2(10, 5) },
		uTime:{ value: 0},
		uColor:{ value: new THREE.Color('orange')},
		uTexture:{ value: new THREE.TextureLoader().load('/texture/Philippines-Flag.png')}
	},
	side:THREE.DoubleSide
});
const plane = new THREE.Mesh(geometry,material);
// plane.rotation.x = Math.PI * 1.50;
scene.add(plane);

gui.add(material,'wireframe');
gui.add(material.uniforms.uFrequency.value, 'x').min(1).max(20).name('frequencyX');
gui.add(material.uniforms.uFrequency.value, 'y').min(1).max(20).name('frequencyY');
// gui.addColor(material.uniforms.uColor.value,'color').name('Color');

const clock = new THREE.Clock();

const animate = () => {
	const elapsedTime = clock.getElapsedTime();

	//update materials
	material.uniforms.uTime.value = elapsedTime;

	
	scene.onUpdate();
	scene.onUpdateStats();
	requestAnimationFrame( animate );
};

animate();