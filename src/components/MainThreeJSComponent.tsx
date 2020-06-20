import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

import REDDRAGON from '../assets/tiles/Regular/REDDRAGON.png';
import ONE_CHARACTER from '../assets/tiles/Regular/1_CHARACTER.png';
import GREENDRAGON from '../assets/tiles/Regular/GREENDRAGON.png';
import SOUTH from '../assets/tiles/Regular/SOUTH.png';
import NORTH from '../assets/tiles/Regular/NORTH.png';
import ONE_BAMBOO from '../assets/tiles/Regular/1_BAMBOO.png';

const MainThreeJSComponent: React.FC = (): JSX.Element => {
  /**
   * ThreeJS
   */

  let scene: THREE.Scene;
  let camera: THREE.PerspectiveCamera;
  let renderer: THREE.WebGLRenderer;
  let geometry: THREE.BoxGeometry;
  let cube: THREE.Mesh;

  const FOV = 75;
  const NEAR = 0.1;
  const FAR = 1000;

  const RENDERER_COLOR = '0x531cb3';
  const RENDERER_ALPHA = 0.15;

  const GEOMETRY_DIMENSIONS: number[] = [3, 4, 3];

  const CAMERA_POSITION_Z = 5;

  /**
   * Ref
   */
  const ThreeJSRefContainer = useRef<HTMLDivElement>(document.createElement('div'));

  const loadMaterials = () => {
    const loader: THREE.TextureLoader = new THREE.TextureLoader();
    const materials = [
      new THREE.MeshBasicMaterial({ map: loader.load(ONE_CHARACTER) }),
      new THREE.MeshBasicMaterial({ map: loader.load(GREENDRAGON) }),
      new THREE.MeshBasicMaterial({ map: loader.load(REDDRAGON) }),
      new THREE.MeshBasicMaterial({ map: loader.load(ONE_BAMBOO) }),
      new THREE.MeshBasicMaterial({ map: loader.load(NORTH) }),
      new THREE.MeshBasicMaterial({ map: loader.load(SOUTH) }),
    ];

    return materials;
  };
  const initThree = () => {
    scene = new THREE.Scene();
    const { clientHeight, clientWidth } = ThreeJSRefContainer.current;
    camera = new THREE.PerspectiveCamera(FOV, clientWidth / clientHeight, NEAR, FAR);
    renderer = new THREE.WebGLRenderer({ alpha: true });

    renderer.setSize(clientWidth, clientHeight);
    renderer.setClearColor(RENDERER_COLOR, RENDERER_ALPHA);

    ThreeJSRefContainer.current.appendChild(renderer.domElement);

    geometry = new THREE.BoxGeometry(...GEOMETRY_DIMENSIONS);
    cube = new THREE.Mesh(geometry, loadMaterials());
    scene.add(cube);
    camera.position.z = CAMERA_POSITION_Z;
  };

  const animate = () => {
    requestAnimationFrame(animate);
    cube.rotation.y += 0.01;
    cube.rotation.x += 0.01;
    renderer.render(scene, camera);
  };

  const onWindowResize = () => {
    const { clientHeight, clientWidth } = ThreeJSRefContainer.current;
    camera.aspect = clientWidth / clientHeight;
    renderer.setSize(clientWidth, clientHeight);
    console.log(`ClientWidth: ${clientWidth}, ClientHeight: ${clientHeight}`);
  };

  useEffect(() => {
    initThree();
    animate();
    window.addEventListener('resize', onWindowResize);
    return () => window.removeEventListener('resize', onWindowResize);
    // eslint-disable-next-line
  }, []);

  return <div className="portrait-threejs landscape-threejs margin-30" ref={ThreeJSRefContainer} />;
};

export default MainThreeJSComponent;
