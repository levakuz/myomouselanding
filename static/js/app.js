// import { OrbitControls } from './three/examples/js/controls/OrbitControls.js';
// import { OrbitControls } from "https://threejs.org/examples/jsm/controls/OrbitControls.js";
import * as THREE from "./three.module.js"
import {OrbitControls} from "./three/examples/jsm/controls/OrbitControls.js";
import {GLTFLoader} from "./three/examples/jsm/loaders/GLTFLoader.js";

var APP = {

	Player: function () {

		var renderer = new THREE.WebGLRenderer( { antialias: true, 		"shadows": true,
		"shadowType": 1,
		"vr": false,
		"physicallyCorrectLights": true,
		"toneMapping": 2,
		"toneMappingExposure": 1} );
		renderer.setPixelRatio( window.devicePixelRatio ); // TODO: Use player.setPixelRatio()
		renderer.outputEncoding = THREE.sRGBEncoding;
		const scene = new THREE.Scene();
		let camera
		var vrButton = VRButton.createButton( renderer ); // eslint-disable-line no-undef

		var events = {};
		let controls
		var dom = document.createElement( 'div' );
		dom.appendChild( renderer.domElement );

		this.dom = dom;


		const loader = new GLTFLoader();
		loader.load(
			// resource URL
			'static/scene.glb',
			// called when the resource is loaded
			function ( gltf ) {
				console.log(gltf.scene)
				scene.add( gltf.scene );

				gltf.animations; // Array<THREE.AnimationClip>
				gltf.scene; // THREE.Group
				gltf.scenes; // Array<THREE.Group>
				gltf.cameras; // Array<THREE.Camera>
				gltf.asset; // Object
				// this.setCamera(gltf.cameras)
				var canvas_wrapper = document.getElementById('canvas_wrapper')
				let loading_status_wrapper = document.getElementById('loading_status_wrapper')
                canvas_wrapper.removeChild(loading_status_wrapper);
                canvas_wrapper.appendChild( renderer.domElement );
				let ambient = scene.getObjectByProperty('name', "AmbientLight")
				ambient.removeFromParent(scene)
				let spotlight = scene.getObjectByProperty('name', "SpotLight")
				spotlight.removeFromParent(scene)
				let spotlight1 = scene.getObjectByProperty('name', "SpotLight_2")
				spotlight1.removeFromParent(scene)
				let spotlight2 = scene.getObjectByProperty('name', "SpotLight_4")
				spotlight2.removeFromParent(scene)
				const spotLight = new THREE.SpotLight( 0xffffff )
				spotLight.position.set(5,10,-14.7)
				scene.add(spotLight)
				const spotLight2 = new THREE.SpotLight( 0xffffff )
				spotLight2.position.set(9,6,13.2)
				scene.add(spotLight2)
				const spotLight3 = new THREE.SpotLight( 0xffffff )
				spotLight3.position.set(-3.85,3,13.6)
				scene.add(spotLight3)
				scene.add(gltf.cameras[0])
				if (window.screen.width >= 1700){
					// player.setSize( 840, 640);
					renderer.setSize(600, 600)
				}
				else
				{
					// player.setSize( 300, 200);
					renderer.setSize(300, 300)
				}
				camera = gltf.cameras[0]
				camera.fov = 50
				camera.position.x = 6
				camera.position.y = 3.633
				camera.position.x = 9.666
				camera.far = 100
				camera.aspect = 1
			   	camera.fov = 50
			  	camera.zoom = 1
			  	camera.near = 0.01
				camera.far = 1000
				camera.focus = 10
				// camera.aspect =  1.5256410256410255
				camera.filmGauge = 35
				camera.filmOffset = 0
				camera.updateProjectionMatrix();
				console.log(camera)
				controls = new OrbitControls( camera, renderer.domElement );
				controls.update()
				animate()

			},
			// called while loading is progressing
			function ( xhr ) {

				console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
				let loading_status = document.getElementById('loading_status')
                const node = document.createTextNode((xhr.loaded / xhr.total * 100).toFixed(2) + '% loaded')
                loading_status.value= (xhr.loaded / xhr.total * 100)
			},
			// called when loading has errors
			function ( error ) {

				console.log( 'An error happened' );

			}
		);


		this.setSize = function ( width, height ) {

			this.width = width;
			this.height = height;

			if ( camera ) {

				// camera.aspect = width / height
				// camera.updateProjectionMatrix();

			}

			renderer.setSize( width, height );

		};

		function dispatch( array, event ) {

			for ( var i = 0, l = array.length; i < l; i ++ ) {

				array[ i ]( event );

			}

		}

		var time, startTime, prevTime;
		function animate() {

			requestAnimationFrame( animate );

			// required if controls.enableDamping or controls.autoRotate are set to true
			controls.update();

			renderer.render( scene, camera );

		}


		this.play = function () {

			if ( renderer.xr.enabled ) dom.append( vrButton );

			startTime = prevTime = performance.now();

			document.addEventListener( 'keydown', onKeyDown );
			document.addEventListener( 'keyup', onKeyUp );
			document.addEventListener( 'pointerdown', onPointerDown );
			document.addEventListener( 'pointerup', onPointerUp );
			document.addEventListener( 'pointermove', onPointerMove );

			dispatch( events.start, arguments );

			renderer.setAnimationLoop( animate );

		};

		this.stop = function () {

			if ( renderer.xr.enabled ) vrButton.remove();

			document.removeEventListener( 'keydown', onKeyDown );
			document.removeEventListener( 'keyup', onKeyUp );
			document.removeEventListener( 'pointerdown', onPointerDown );
			document.removeEventListener( 'pointerup', onPointerUp );
			document.removeEventListener( 'pointermove', onPointerMove );

			dispatch( events.stop, arguments );

			renderer.setAnimationLoop( null );

		};

		this.render = function ( time ) {

			dispatch( events.update, { time: time * 1000, delta: 0 /* TODO */ } );

			renderer.render( scene, camera );

		};

		this.dispose = function () {

			renderer.dispose();

			camera = undefined;
			scene = undefined;

		};

		//

		function onKeyDown( event ) {

			dispatch( events.keydown, event );

		}

		function onKeyUp( event ) {

			dispatch( events.keyup, event );

		}

		function onPointerDown( event ) {

			dispatch( events.pointerdown, event );

		}

		function onPointerUp( event ) {

			dispatch( events.pointerup, event );

		}

		function onPointerMove( event ) {

			dispatch( events.pointermove, event );

		}
		var white_line_button = document.getElementById('white-line-button')
		white_line_button.addEventListener('click', function (){chagelinesColor('white')})
		var grey_line_button = document.getElementById('grey-line-button')
		grey_line_button.addEventListener('click', function (){chagelinesColor('grey')})
		var black_line_button = document.getElementById('black-line-button')
		black_line_button.addEventListener('click', function (){chagelinesColor('black')})
		var blue_line_button = document.getElementById('blue-line-button')
		blue_line_button.addEventListener('click', function (){chagelinesColor('blue')})
		var green_line_button = document.getElementById('green-line-button')
		green_line_button.addEventListener('click', function (){chagelinesColor('green')})
		var red_line_button = document.getElementById('red-line-button')
		red_line_button.addEventListener('click', function (){chagelinesColor('red')})
		var orange_line_button = document.getElementById('orange-line-button')
		orange_line_button.addEventListener('click', function (){chagelinesColor('orange')})
		var yellow_line_button = document.getElementById('yellow-line-button')
		yellow_line_button.addEventListener('click', function (){chagelinesColor('yellow')})

		var white_band_button = document.getElementById('white-band-button')
		white_band_button.addEventListener('click', function (){chagebracerColor('white')})
		var grey_band_button = document.getElementById('grey-band-button')
		grey_band_button.addEventListener('click', function (){chagebracerColor('grey')})
		var black_band_button = document.getElementById('black-band-button')
		black_band_button.addEventListener('click', function (){chagebracerColor('black')})
		var blue_band_button = document.getElementById('blue-band-button')
		blue_band_button.addEventListener('click', function (){chagebracerColor('blue')})
		var green_band_button = document.getElementById('green-band-button')
		green_band_button.addEventListener('click', function (){chagebracerColor('green')})
		var red_band_button = document.getElementById('red-band-button')
		red_band_button.addEventListener('click', function (){chagebracerColor('red')})
		var orange_band_button = document.getElementById('orange-band-button')
		orange_band_button.addEventListener('click', function (){chagebracerColor('orange')})
		var yellow_band_button = document.getElementById('yellow-band-button')
		yellow_band_button.addEventListener('click', function (){chagebracerColor('yellow')})

		const colors = {
			white: '0xffffff',
			grey: '0x9e9e9e',
			black: '0x212121',
			blue: '0x3f51b5',
			green: '0x4caf50',
			red: '0xf44336',
			orange: '0xff5722',
			yellow: '0xfbc02d'
		}
		const line_buttons = {
			white: white_line_button,
			grey: grey_line_button,
			black: black_line_button,
			blue: blue_line_button,
			green: green_line_button,
			red: red_line_button,
			orange: orange_line_button,
			yellow: yellow_line_button
		}

		const band_buttons = {
			white: white_band_button,
			grey: grey_band_button,
			black: black_band_button,
			blue: blue_band_button,
			green: green_band_button,
			red: red_band_button,
			orange: orange_band_button,
			yellow: yellow_band_button
		}
		// var lines_color_input = document.getElementById("linecolorpicker")
		// console.log(lines_color_input)
		// lines_color_input.addEventListener('change', function (color){
		// 	console.log(lines_color_input.value)
		// 	chagelinesColor(lines_color_input.value)
		// })
		// var bracer_color_input = document.getElementById("bracercolorpicker")
		// console.log(bracer_color_input)
		// bracer_color_input.addEventListener('change', function (color){
		// 	console.log(bracer_color_input.value)
		// 	chagebracerColor(bracer_color_input.value)
		// })

		function chagelinesColor(color){
			let a = scene.getObjectByProperty('name', "2liner")
			let b = scene.getObjectByProperty('name', "2linel")
			a.material.color.setHex(colors[color])
			b.material.color.setHex(colors[color])
			for(let i in line_buttons){
				line_buttons[i].style.borderWidth = 0
			}
			let active_btn = line_buttons[color]
			active_btn.style.borderColor = 'white'
			active_btn.style.borderWidth = '2px'
			active_btn.style.padding = '2px'
		}
		function chagebracerColor(color){
			let a = scene.getObjectByProperty('name', "bracer")
			a.material.color.setHex(colors[color])
			for(let i in band_buttons){
				band_buttons[i].style.borderWidth = 0
			}
			let active_btn = band_buttons[color]
			active_btn.style.borderColor = 'white'
			active_btn.style.borderWidth = '2px'
			active_btn.style.padding = '2px'
		}

	}

};



export { APP };
