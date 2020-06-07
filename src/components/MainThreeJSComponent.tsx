import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

import CHUN from '../assets/tiles/Regular/Chun.png';
import MAN1 from '../assets/tiles/Regular/Man1.png';
import HATSU from '../assets/tiles/Regular/Hatsu.png';
import NAN from '../assets/tiles/Regular/Nan.png';
import PEI from '../assets/tiles/Regular/Pei.png';
import SOU1 from '../assets/tiles/Regular/Sou1.png';

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
      new THREE.MeshBasicMaterial({ map: loader.load(MAN1) }),
      new THREE.MeshBasicMaterial({ map: loader.load(HATSU) }),
      new THREE.MeshBasicMaterial({ map: loader.load(CHUN) }),
      new THREE.MeshBasicMaterial({ map: loader.load(SOU1) }),
      new THREE.MeshBasicMaterial({ map: loader.load(PEI) }),
      new THREE.MeshBasicMaterial({ map: loader.load(NAN) }),
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
  }, []);

  return <div className="portrait-threejs landscape-threejs margin-30" ref={ThreeJSRefContainer} />;
};

export default MainThreeJSComponent;
