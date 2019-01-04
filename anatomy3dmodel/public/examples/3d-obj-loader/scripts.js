//init, variables

//scene
var scene = new THREE.Scene();

//camera
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
camera.position.z = 200;

//renderer
var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );
//아래는 추가.
var container = document.getElementById( 'ThreeJS' );
// container.appendChild( renderer.domElement );


//controls
var controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.enableZoom = true;

var xspeed = 5;
var yspeed = 5;

// custom controls
/*
controls = new THREE.FirstPersonControls( camera );
controls.movementSpeed = 1000;
controls.lookSpeed = 0.125;
controls.lookVertical = true;
controls.constrainVertical = true;
controls.verticalMin = 1.1;
controls.verticalMax = 2.2;
*/



// custom global variables init
var targetList = [];
var projector, mouse = { x: 0, y: 0 };
var sprite1;
var canvas1, context1, texture1;

// 마우스 클릭 init
var container, stats, INTERSECTED;
var keyboard = new THREEx.KeyboardState();
var clock = new THREE.Clock();

//loader init
var mtlLoader = new THREE.MTLLoader();
mtlLoader.setTexturePath('/examples/3d-obj-loader/assets/export/');
mtlLoader.setPath('/examples/3d-obj-loader/assets/export/');

/* function list */
//nervous();
// skeletal();
//lymphaticsystem();
// arteries();
// digestivesystem();
// muscle();
// reoroductivesystem();
//veins();
//urinarysystem();
// respiratory();


//
// EVENTS 관련
THREEx.WindowResize(renderer, camera);
THREEx.FullScreen.bindKey({ charCode : 'm'.charCodeAt(0) });

// STATS
stats = new Stats();
stats.domElement.style.position = 'absolute';
stats.domElement.style.bottom = '0px';
stats.domElement.style.zIndex = 100;
// container.appendChild( stats.domElement );

// 배경 관련
var keyLight = new THREE.DirectionalLight(new THREE.Color('hsl(30, 100%, 75%)'), 1.0);
keyLight.position.set(-100, 0, 100);

var fillLight = new THREE.DirectionalLight(new THREE.Color('hsl(240, 100%, 75%)'), 0.75);
fillLight.position.set(100, 0, 100);

var backLight = new THREE.DirectionalLight(0xffffff, 1.0);
backLight.position.set(100, 0, -100).normalize();

scene.add(keyLight);
scene.add(fillLight);
scene.add(backLight);

////////////
// CUSTOM //
////////////

// 마우스 클릭

// initialize object to perform world/screen calculations
projector = new THREE.Projector();
// when the mouse click, call the given function
document.addEventListener( 'mousedown', onDocumentMouseDown, false ); 

//마우스 툴팁

document.addEventListener( 'mousemove', onDocumentMouseMove, false );


//키보드 이벤트
document.addEventListener('keydown', onDocumentKeyDown, false);


/////// draw text on canvas - 툴팁 관련 ///////// - start

// create a canvas element
canvas1 = document.createElement('canvas');
context1 = canvas1.getContext('2d');
context1.font = "Bold 20px Arial";
context1.fillStyle = "rgba(0,0,0,0.95)";
context1.fillText('Hello, world!', 0, 20);

// canvas contents will be used for a texture - 툴팁 관련
texture1 = new THREE.Texture(canvas1) 
texture1.needsUpdate = true;

var spriteMaterial = new THREE.SpriteMaterial( { map: texture1, useScreenCoordinates: true } ); //, alignment: THREE.SpriteAlignment.topLeft

sprite1 = new THREE.Sprite( spriteMaterial );
sprite1.scale.set(150,100,1.0);
sprite1.position.set( 100, 50, 0 );
scene.add( sprite1 );	

/////// draw text on canvas - 툴팁 관련 ///////// - end




//functions



function onDocumentMouseDown( event ) //마우스 클릭
{
	// the following line would stop any other event handler from firing
	// (such as the mouse's TrackballControls)
	// event.preventDefault();
	
	// update the mouse variable
	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
	
	// find intersections

	// create a Ray with origin at the mouse position
	//   and direction into the scene (camera direction)
    var vector = new THREE.Vector3( mouse.x, mouse.y, 1 );
    projector.unprojectVector( vector, camera );  //projector.vector.unproject( vector, camera );
	var ray = new THREE.Raycaster( camera.position, vector.sub( camera.position ).normalize() );

	// create an array containing all objects in the scene with which the ray intersects
    var intersects = ray.intersectObjects( targetList );

	// if there is one (or more) intersections
	if ( intersects.length > 0 ) 
	{
        // 눌려지는 모든 곳
        // for(var i=0; i<intersects.length; i++) {
        //     console.log("이 기관의 이름은 : "+intersects[i].object.name);
        // } 
        // 클릭한 곳 중 제일 가까운 곳.
        console.log("이 기관의 이름은 " +intersects[0].object.name );
        
		// change the color of the closest face.
		// intersects[ 0 ].object.color.setRGB( 0.8 * Math.random() + 0.2, 0, 0 ); 
		// intersects[ 0 ].object.geometry.colorsNeedUpdate = true;
	}

}

//좀 망한듯-마우스 툴팁
function onDocumentMouseMove( event ) //mouse hover
{
	// the following line would stop any other event handler from firing
	// (such as the mouse's TrackballControls)
	// event.preventDefault();

	// update sprite position
	sprite1 = new THREE.Sprite( spriteMaterial );
	sprite1.position.set( event.clientX, event.clientY - 20, 0 );
	
	// update the mouse variable
	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
	
	// find intersections

	// create a Ray with origin at the mouse position
	//   and direction into the scene (camera direction)
    var vector = new THREE.Vector3( mouse.x, mouse.y, 1 );
    projector.unprojectVector( vector, camera ); //projector.vector.unproject( vector, camera );
	var ray = new THREE.Raycaster( camera.position, vector.sub( camera.position ).normalize() );

	// create an array containing all objects in the scene with which the ray intersects
    var intersects = ray.intersectObjects( targetList );

	// INTERSECTED = the object in the scene currently closest to the camera 
	//		and intersected by the Ray projected from the mouse position 	
	
	// if there is one (or more) intersections
	if ( intersects.length > 0 )
	{
		// if the closest object intersected is not the currently stored intersection object
		if ( intersects[ 0 ].object != INTERSECTED ) 
		{
		    // restore previous intersection object (if it exists) to its original color
			if ( INTERSECTED ) 
				INTERSECTED.material.color.setHex( INTERSECTED.currentHex ); //문제의 코드
			// store reference to closest object as current intersection object //문제의 코드
			INTERSECTED = intersects[ 0 ].object;
			// store color of closest object (for later restoration)
			INTERSECTED.currentHex = INTERSECTED.material.color.getHex();
			// set a new color for closest object
			INTERSECTED.material.color.setHex( 0xffff00 );
			
			// update text, if it has a "name" field.
			if ( intersects[ 0 ].object.name )
			{
			    context1.clearRect(0,0,640,480);
				var message = intersects[ 0 ].object.name;
				var metrics = context1.measureText(message);
				var width = metrics.width;
				context1.fillStyle = "rgba(0,0,0,0.95)"; // black border
				context1.fillRect( 0,0, width+8,20+8);
				context1.fillStyle = "rgba(255,255,255,0.95)"; // white filler
				context1.fillRect( 2,2, width+4,20+4 );
				context1.fillStyle = "rgba(0,0,0,1)"; // text color
				context1.fillText( message, 4,20 );
				texture1.needsUpdate = true;
			}
			else
			{
				context1.clearRect(0,0,300,300);
				texture1.needsUpdate = true;
			}
		}
	} 

	else // there are no intersections
	{
		// restore previous intersection object (if it exists) to its original color
		if ( INTERSECTED ) 
			INTERSECTED.material.color.setHex( INTERSECTED.currentHex ); //문제의 코드
		// remove previous intersection object reference
		//     by setting current intersection object to "nothing"
		INTERSECTED = null;
		context1.clearRect(0,0,300,300);
		texture1.needsUpdate = true;
	}

	// if ( keyboard.pressed("z") ) 
	// { 
    //     //console.log("hello");// do something
    //     //누른채로 호버하면 뭔가 가능할 듯.

	// }
}

//키보드 카메라 이동
function onDocumentKeyDown(event){

    var keyCode = event.which;
    switch(keyCode){
        case 87:        //Keyboard 'W'
            camera.position.y += yspeed;
            break;
        case 83:        //Keyboard 'S'
            camera.position.y -= yspeed;
            break;
        case 65:        //Keyboard 'A'
            camera.position.x -= xspeed;
            break;
        case 68:        //Keyboard 'D'
            camera.position.x += xspeed;
            break;
        case 84:        //Keyboadr 'T'  :: Reset position
            camera.position.set( 0, 0, 200);
            domElement.offsetLeft = 0;
            domElement.offsetTop = 0;
            break;
    }
    console.log('Camera : ' + camera.position.x, camera.position.y, camera.position.z);

}

/*
//cubemap
// var path_cubemap = "/examples/3d-obj-loader/assets/texture/surgery/";
// var format = '.png';
// var urls=[
//     path_cubemap + 'px' + format, path_cubemap + 'nx' + format,
//     path_cubemap + 'py' + format, path_cubemap + 'ny' + format,
//     path_cubemap + 'pz' + format, path_cubemap + 'nz' + format,

// ]

// var reflectionCube  = new THREE.CubeTextureLoader().load(urls);
// reflectionCube .format = THREE.RGBFormat;


// var refractionCube = new THREE.CubeTextureLoader().load( urls );
// refractionCube.mapping = THREE.CubeRefractionMapping;
// refractionCube.format = THREE.RGBFormat;
// scene = new THREE.Scene();
// scene.background = reflectionCube;
// //scene에 배경화면 추가

// light = new THREE.HemisphereLight( 0xbbbbff, 0x444422 );
// light.position.set( 0, 1, 0 );
// scene.add( light );

*/


var animate = function () {
	requestAnimationFrame( animate );
    controls.update();
    stats.update();
	renderer.render(scene, camera);
};


/////////////////////////////////////////////////////////////////////////////////
// init 없이 그냥 실행.


animate();







//3d 모델 렌더링

function dotest() {
	console.log("hi");
}

function muscle() {
	mtlLoader.load('muscular.mtl', function (materials) {

		materials.preload();
	
		var objLoader = new THREE.OBJLoader();
		objLoader.setMaterials(materials);
		objLoader.setPath('/examples/3d-obj-loader/assets/export/');
		objLoader.load('muscular.obj', function (object) {
		   // objLoader.load('untilted.obj', function (object) {
			for ( var i = 0, l = object.children.length; i < l; i ++ ) {
				//console.log(object.children[ i ]); //확인용
				targetList.push(object.children[ i ]); //모든 객체의 객체 집어넣는 것.
				// console.log(targetList[ i ].name); //확인용
			}
			object.position.y -= 90; 
			
			scene.add(object);
		});
	
		
	});
}

function digestivesystem() {
	mtlLoader.load('digestivesystem.mtl', function (materials) {

		materials.preload();
	
		var objLoader = new THREE.OBJLoader();
		objLoader.setMaterials(materials);
		objLoader.setPath('/examples/3d-obj-loader/assets/export/');
		   objLoader.load('digestivesystem.obj', function (object) {
		   // objLoader.load('untilted.obj', function (object) {
			for ( var i = 0, l = object.children.length; i < l; i ++ ) {
				//console.log(object.children[ i ]); //확인용
				targetList.push(object.children[ i ]); //모든 객체의 객체 집어넣는 것.
				// console.log(targetList[ i ].name); //확인용
			}
			object.position.y -= 90; 
	
			
			scene.add(object);
	
		});
	
	});
}


function reoroductivesystem() {
	mtlLoader.load('reoroductivesystem.mtl', function (materials) {

		materials.preload();
	
		var objLoader = new THREE.OBJLoader();
		objLoader.setMaterials(materials);
		objLoader.setPath('/examples/3d-obj-loader/assets/export/');
		   objLoader.load('reoroductivesystem.obj', function (object) {
		   // objLoader.load('untilted.obj', function (object) {
			for ( var i = 0, l = object.children.length; i < l; i ++ ) {
				//console.log(object.children[ i ]); //확인용
				targetList.push(object.children[ i ]); //모든 객체의 객체 집어넣는 것.
				// console.log(targetList[ i ].name); //확인용
			}
			object.position.y -= 90; 
	
			
			scene.add(object);
	
		});
	
	});
}

function respiratory() {
	mtlLoader.load('respiratory.mtl', function (materials) {

    	materials.preload();

		var objLoader = new THREE.OBJLoader();
		objLoader.setMaterials(materials);
		objLoader.setPath('/examples/3d-obj-loader/assets/export/');
		objLoader.load('respiratory.obj', function (object) {
		// objLoader.load('untilted.obj', function (object) {
			for ( var i = 0, l = object.children.length; i < l; i ++ ) {
				//console.log(object.children[ i ]); //확인용
				targetList.push(object.children[ i ]); //모든 객체의 객체 집어넣는 것.
				// console.log(targetList[ i ].name); //확인용
			}
			object.position.y -= 90; 

			
			scene.add(object);

		});

	});
}

function urinarysystem() {
	mtlLoader.load('urinarysystem.mtl', function (materials) {

		materials.preload();

		var objLoader = new THREE.OBJLoader();
		objLoader.setMaterials(materials);
		objLoader.setPath('/examples/3d-obj-loader/assets/export/');
		objLoader.load('urinarysystem.obj', function (object) {
		// objLoader.load('untilted.obj', function (object) {
			for ( var i = 0, l = object.children.length; i < l; i ++ ) {
				//console.log(object.children[ i ]); //확인용
				targetList.push(object.children[ i ]); //모든 객체의 객체 집어넣는 것.
				// console.log(targetList[ i ].name); //확인용
			}
			object.position.y -= 90; 

			
			scene.add(object);

		});

	});
}

function veins() {
	mtlLoader.load('veins.mtl', function (materials) {

		materials.preload();
	
		var objLoader = new THREE.OBJLoader();
		objLoader.setMaterials(materials);
		objLoader.setPath('/examples/3d-obj-loader/assets/export/');
			objLoader.load('veins.obj', function (object) {
			// objLoader.load('untilted.obj', function (object) {
			for ( var i = 0, l = object.children.length; i < l; i ++ ) {
				//console.log(object.children[ i ]); //확인용
				targetList.push(object.children[ i ]); //모든 객체의 객체 집어넣는 것.
				// console.log(targetList[ i ].name); //확인용
			}
			object.position.y -= 90; 
	
			
			scene.add(object);
	
		});
	
		});
}



function nervous() {
	mtlLoader.load('nelvous_2.mtl', function (materials) {

		materials.preload();
	
		var objLoader = new THREE.OBJLoader();
		objLoader.setMaterials(materials);
		objLoader.setPath('/examples/3d-obj-loader/assets/export/');
		   objLoader.load('nelvous_2.obj', function (object) {
		   // objLoader.load('untilted.obj', function (object) {
			for ( var i = 0, l = object.children.length; i < l; i ++ ) {
				//console.log(object.children[ i ]); //확인용
				targetList.push(object.children[ i ]); //모든 객체의 객체 집어넣는 것.
				// console.log(targetList[ i ].name); //확인용
			}
			object.position.y -= 90; 
	
			
			scene.add(object);
	
		});
	
	});
}

function skeletal() {
	//안나옴
	mtlLoader.load('skeletal.mtl', function (materials) {

		materials.preload();

		var objLoader = new THREE.OBJLoader();
		objLoader.setMaterials(materials);
		objLoader.setPath('/examples/3d-obj-loader/assets/export/');
		objLoader.load('skeletal.obj', function (object) {
		// objLoader.load('untilted.obj', function (object) {
			for ( var i = 0, l = object.children.length; i < l; i ++ ) {
				//console.log(object.children[ i ]); //확인용
				targetList.push(object.children[ i ]); //모든 객체의 객체 집어넣는 것.
				// console.log(targetList[ i ].name); //확인용
			}
			object.position.y -= 90;
		});
	});

}

function lymphaticsystem() {
	mtlLoader.load('lymphaticsystem.mtl', function (materials) {

		materials.preload();

		var objLoader = new THREE.OBJLoader();
		objLoader.setMaterials(materials);
		objLoader.setPath('/examples/3d-obj-loader/assets/export/');
		objLoader.load('lymphaticsystem.obj', function (object) {
		// objLoader.load('untilted.obj', function (object) {
			for ( var i = 0, l = object.children.length; i < l; i ++ ) {
				//console.log(object.children[ i ]); //확인용
				targetList.push(object.children[ i ]); //모든 객체의 객체 집어넣는 것.
				// console.log(targetList[ i ].name); //확인용
			}
			object.position.y -= 90; 

			
			scene.add(object);

		});

	});
}

function arteries() {
	mtlLoader.load('arteries.mtl', function (materials) {

		materials.preload();
	
		var objLoader = new THREE.OBJLoader();
		objLoader.setMaterials(materials);
		objLoader.setPath('/examples/3d-obj-loader/assets/export/');
			objLoader.load('arteries.obj', function (object) {
			// objLoader.load('untilted.obj', function (object) {
			for ( var i = 0, l = object.children.length; i < l; i ++ ) {
				//console.log(object.children[ i ]); //확인용
				targetList.push(object.children[ i ]); //모든 객체의 객체 집어넣는 것.
				// console.log(targetList[ i ].name); //확인용
			}
			object.position.y -= 90; 
	
			
			scene.add(object);
	
		});
	
	});
}

// 필요시 쓴다.

// function includeJs(jsFilePath) {
//     var js = document.createElement("script");
 
//     js.type = "text/javascript";
//     js.src = jsFilePath;
 
//     document.body.appendChild(js);
// }
// includeJs("/path/to/some/file.js");

// function onWindowResize() {
//     SCREEN_HEIGHT = window.innerHeight;
//     SCREEN_WIDTH = window.innerWidth;
//     renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );
//     camera.aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
//     camera.updateProjectionMatrix();
//     composer.reset();
// }

function onWindowResize() {
    SCREEN_HEIGHT = window.innerHeight;
    SCREEN_WIDTH = window.innerWidth;
    renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );
    camera.aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
    camera.updateProjectionMatrix();
    composer.reset();
}
