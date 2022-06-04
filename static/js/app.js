// import { OrbitControls } from './three/examples/js/controls/OrbitControls.js';
// import { OrbitControls } from "https://threejs.org/examples/jsm/controls/OrbitControls.js";
import * as THREE from "./three.module.js"
import {OrbitControls} from "./three/examples/jsm/controls/OrbitControls.js";
// import {GLTFLoader} from "./three/examples/jsm/loaders/GLTFLoader.js";

var APP = {

	Player: function () {

		var renderer = new THREE.WebGLRenderer( { antialias: true } );
		renderer.setPixelRatio( window.devicePixelRatio ); // TODO: Use player.setPixelRatio()
		renderer.outputEncoding = THREE.sRGBEncoding;

		var loader = new THREE.ObjectLoader();
		var camera, scene;

		var vrButton = VRButton.createButton( renderer ); // eslint-disable-line no-undef

		var events = {};

		var dom = document.createElement( 'div' );
		dom.appendChild( renderer.domElement );

		this.dom = dom;

		this.width = 500;
		this.height = 500;
		// const loader = new GLTFLoader();
// loader.load(
// 	// resource URL
// 	'static/scene.glb',
// 	// called when the resource is loaded
// 	function ( gltf ) {
// 		console.log(gltf.scene)
// 		scene.add( gltf.scene );
//
// 		gltf.animations; // Array<THREE.AnimationClip>
// 		gltf.scene; // THREE.Group
// 		gltf.scenes; // Array<THREE.Group>
// 		gltf.cameras; // Array<THREE.Camera>
// 		gltf.asset; // Object
// 		// this.setCamera(gltf.cameras)
//
// 	},
// 	// called while loading is progressing
// 	function ( xhr ) {
//
// 		console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
//
// 	},
// 	// called when loading has errors
// 	function ( error ) {
//
// 		console.log( 'An error happened' );
//
// 	}
// );
		this.load = function ( json ) {

			var project = json.project;

			if ( project.vr !== undefined ) renderer.xr.enabled = project.vr;
			if ( project.shadows !== undefined ) renderer.shadowMap.enabled = project.shadows;
			if ( project.shadowType !== undefined ) renderer.shadowMap.type = project.shadowType;
			if ( project.toneMapping !== undefined ) renderer.toneMapping = project.toneMapping;
			if ( project.toneMappingExposure !== undefined ) renderer.toneMappingExposure = project.toneMappingExposure;
			if ( project.physicallyCorrectLights !== undefined ) renderer.physicallyCorrectLights = project.physicallyCorrectLights;

			this.setScene( loader.parse( json.scene ) );
			this.setCamera( loader.parse( json.camera ) );
			const controls = new OrbitControls( camera, renderer.domElement );
			controls.update();
			console.log(scene)




			function animate() {

				requestAnimationFrame( animate );

				// required if controls.enableDamping or controls.autoRotate are set to true
				controls.update();

				renderer.render( scene, camera );

			}


			events = {
				init: [],
				start: [],
				stop: [],
				keydown: [],
				keyup: [],
				pointerdown: [],
				pointerup: [],
				pointermove: [],
				update: []
			};

			var scriptWrapParams = 'player,renderer,scene,camera';
			var scriptWrapResultObj = {};

			for ( var eventKey in events ) {

				scriptWrapParams += ',' + eventKey;
				scriptWrapResultObj[ eventKey ] = eventKey;

			}

			var scriptWrapResult = JSON.stringify( scriptWrapResultObj ).replace( /\"/g, '' );

			for ( var uuid in json.scripts ) {

				var object = scene.getObjectByProperty( 'uuid', uuid, true );
				if ( object === undefined ) {

					console.warn( 'APP.Player: Script without object.', uuid );
					continue;

				}

				var scripts = json.scripts[ uuid ];

				for ( var i = 0; i < scripts.length; i ++ ) {

					var script = scripts[ i ];

					var functions = ( new Function( scriptWrapParams, script.source + '\nreturn ' + scriptWrapResult + ';' ).bind( object ) )( this, renderer, scene, camera );

					for ( var name in functions ) {

						if ( functions[ name ] === undefined ) continue;

						if ( events[ name ] === undefined ) {

							console.warn( 'APP.Player: Event type not supported (', name, ')' );
							continue;

						}

						events[ name ].push( functions[ name ].bind( object ) );

					}

				}

			}

			dispatch( events.init, arguments );

		};

		this.setCamera = function ( value ) {

			camera = value;
			camera.aspect = this.width / this.height;
			camera.updateProjectionMatrix();

		};

		this.setScene = function ( value ) {

			scene = value;

		};

		this.setPixelRatio = function ( pixelRatio ) {

			renderer.setPixelRatio( pixelRatio );

		};

		this.setSize = function ( width, height ) {

			this.width = width;
			this.height = height;

			if ( camera ) {

				camera.aspect = this.width / this.height;
				camera.updateProjectionMatrix();

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

			time = performance.now();

			try {

				dispatch( events.update, { time: time - startTime, delta: time - prevTime } );

			} catch ( e ) {

				console.error( ( e.message || e ), ( e.stack || '' ) );

			}

			renderer.render( scene, camera );

			prevTime = time;

		}


		// function chagelinesColor(color){
		// 		let a = scene.getObjectByProperty('name', "2liner")
		// 		let b = scene.getObjectByProperty('name', "2linel")
		// 		console.log(a.material.color)
		// 		a.material.color.setHex(color)
		// 		b.material.color.setHex(color)
		// 	}

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
		}
		function chagebracerColor(color){
			let a = scene.getObjectByProperty('name', "bracer")
			a.material.color.setHex(colors[color])
		}

	}

};



export { APP };
