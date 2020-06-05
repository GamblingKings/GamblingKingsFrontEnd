import React, { useState, useEffect, useRef } from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import * as THREE from 'three';
import { HistoryParams } from '../types/react-router';

import CHUN from '../assets/tiles/Regular/Chun.png';
import MAN1 from '../assets/tiles/Regular/Man1.png';
import HATSU from '../assets/tiles/Regular/Hatsu.png';
import NAN from '../assets/tiles/Regular/Nan.png';
import PEI from '../assets/tiles/Regular/Pei.png';
import SOU1 from '../assets/tiles/Regular/Sou1.png';

/**
 * Landing Page for the application.
 */
const MainPage = ({ history }: RouteComponentProps<HistoryParams>): JSX.Element => {
  /**
   * States
   */
  const [username, setUsername] = useState<string>('');

  /**
   * State Handlers.
   */
  const handleSetUsername = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  /**
   * Ref
   */

  const ThreeJSRefContainer = useRef<HTMLDivElement>(document.createElement('div'));

  /**
   * Methods
   */
  const connect = (event: React.FormEvent<HTMLInputElement>) => {
    event.preventDefault();
    console.log(event);
    console.log(username);
    // TODO: connect to WS
    history.push('/lobby');
  };

  /**
   * ThreeJS
   */

  let scene: THREE.Scene;
  let camera: THREE.PerspectiveCamera;
  let renderer: THREE.WebGLRenderer;
  let geometry: THREE.BoxGeometry;
  let cube: THREE.Mesh;

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
    camera = new THREE.PerspectiveCamera(75, clientWidth / clientHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ alpha: true });

    renderer.setSize(clientWidth, clientHeight);
    renderer.setClearColor(0x531cb3, 0.15);

    ThreeJSRefContainer.current.appendChild(renderer.domElement);

    geometry = new THREE.BoxGeometry(3, 4, 3);
    cube = new THREE.Mesh(geometry, loadMaterials());
    scene.add(cube);
    camera.position.z = 5;
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

  return (
    <div className="main-page flex-column justify-content-center">
      <div className="justify-content-center flex-row">
        <div className="background-color-white align-center margin-bottom-20 padding-20 text-align-center border-radius-5">
          <strong>
            <h1>Mahjong</h1>
          </strong>
          <div className="portrait-threejs landscape-threejs margin-30" ref={ThreeJSRefContainer} />
          <form className="flex-column margin-20">
            <input
              value={username}
              onChange={handleSetUsername}
              className="margin-bottom-10 font-size-1rem padding-5"
              placeholder="Enter a name"
            />
            <input
              type="submit"
              value="Play"
              onClick={connect}
              className="background-color-primary button color-white padding-5"
            />
          </form>
        </div>
      </div>
      <footer className="flex-row justify-content-center">
        <div className="background-color-white padding-5 padding-left-10 padding-right-10">
          <p>
            <Link to="/aboutus" className="color-black">
              about
            </Link>
            &nbsp;| how to play
          </p>
        </div>
      </footer>
    </div>
  );
};

export default MainPage;
