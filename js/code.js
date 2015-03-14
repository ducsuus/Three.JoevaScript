console.log("Starting!");

var camera, scene, renderer;
var geometry, material, mesh;

var upRot = 0;
var sideRot = 0;

var mouseDown = false;
var mouseX = 0;
var mouseY = 0;

var xPos = 0;
var zPos = 0;
var yPos = 0;

var keyStates = new Object();

var mouseDown = false;
var mouseX = 0;
var mouseY = 0;

// Hook pointer lock state change events
document.addEventListener('pointerlockchange', this.changeCallback, false);
document.addEventListener('mozpointerlockchange', this.changeCallback, false);
document.addEventListener('webkitpointerlockchange', this.changeCallback, false);

document.body.addEventListener('click', function() {
    setPointerLock();
}, false);


init();
animate();

// Lock mouse cursor to a "canvas" or other HTML element
function setPointerLock(e) {

    // 
    // Set the HTML Body to be the scope of pointer locking
    //alert('Let us try to lock the pointer the easy way ...');
    element1 = document.body;
    element1.requestPointerLock = element1.requestPointerLock ||
            element1.mozRequestPointerLock ||
            element1.webkitRequestPointerLock;
    // Ask the browser to lock the pointer
    element1.requestPointerLock();

    // alert('Pointer is locked - allegedly!');
}

function changeCallback(e) {
    // alert('In ChangeCallback');
    if (document.pointerLockElement === document.body ||
            document.mozPointerLockElement === document.body ||
            document.webkitPointerLockElement === document.body) {
        // Pointer was just locked
        // Enable the mousemove listener
        document.addEventListener('mousemove', function(e){ moveCallback(e);}, false);




    } else {
        // NOTE: THIS DOESN'T WORK! - THIS ELSE SECTION IS NEVER CALLED!

        // Pointer was just unlocked
        // Disable the mousemove listener
        document.removeEventListener("mousemove", function(e){ moveCallback(e);}, false);
        this.unlockHook(this.element);




    }
}

function moveCallback(e) {
    var movementX = e.movementX ||
            e.mozMovementX ||
            e.webkitMovementX ||
            0;

    var movementY = e.movementY ||
            e.mozMovementY ||
            e.webkitMovementY ||
            0;

    // alert('Mouse moved - x:' + movementX);


    rotateScene(movementX, movementY);
    
}



function onMouseMove(evt) {
    if (!mouseDown) {
        // Ignore this ...
        // return;
    }

    evt.preventDefault();

    var deltaX = evt.clientX - mouseX,
            deltaY = evt.clientY - mouseY;
    mouseX = evt.clientX;
    mouseY = evt.clientY;
    //rotateScene(deltaX, deltaY);
}

function onMouseDown(evt) {
    evt.preventDefault();

    mouseDown = true;
    mouseX = evt.clientX;
    mouseY = evt.clientY;
    // alert('x='+mouseX + ' y='+mouseY);
}

function onMouseUp(evt) {
    evt.preventDefault();
    mouseDown = false;

}

function addMouseHandler(canvas) {
    canvas.addEventListener('mousemove', function(e) {
        onMouseMove(e);
    }, false);
    canvas.addEventListener('mousedown', function(e) {
        onMouseDown(e);
    }, false);
    canvas.addEventListener('mouseup', function(e) {
        onMouseUp(e);
    }, false);

}

function rotateScene(deltaX, deltaY) {
    // using deg2Rad on delta* here limits your scope of up/down/let/right movement - could be handy

    camera.rotation.y -= deltaX / 160;
    camera.rotation.x -= deltaY / 160;
    //upRot = deltaX;
    //sideRot = deltaY;

}
/*
 ** General Rendering
 */

function init() {

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);

    // Set the order in which the camera should rotate: Y rotation, then X rotation, then Z rotation
    //camera.eulerOrder = "YXZ"; // It has been changed to .rotation.order!!
    camera.rotation.order = "YXZ";

    camera.position.x = 0;
    camera.position.y = 0;
    camera.position.z = 1000;

    camera.rotation.y = degToRad(0);

    scene = new THREE.Scene();

    renderer = new THREE.WebGLRenderer({antialias:true});
    renderer.setSize(window.innerWidth, window.innerHeight);

    renderer.shadowMapEnabled = true;
    /*renderer.shadowMapSoft = true;

    renderer.shadowCameraNear = 3;
    renderer.shadowCameraFar = camera.far;
    renderer.shadowCameraFov = 50;

    renderer.shadowMapBias = 0.0039;
    renderer.shadowMapDarkness = 0.5;
    renderer.shadowMapWidth = 1024;
    renderer.shadowMapHeight = 1024;*/

    //***************************************

    scene.add( new THREE.AmbientLight( 0x212223 ) );
    //scene.add(new THREE.HemisphereLight( 0x0000ff, 0x00ff00, 0.6 ));

    //var light = new THREE.DirectionalLight( 0xffffff, 1, 900 );
    
    //scene.add( light );

    var light = new THREE.SpotLight( 0xffffff, 1, 0 );

    light.position.x = 250;
    light.position.y = 1000;
    light.position.z = 1;

    light.castShadow = true;
    light.shadowDarkness = 0.5;

    light.shadowCameraVisible = true;

    light.shadowCameraRight = 5;
    light.shadowCameraLeft = -5;
    light.shadowCameraTop = 5;
    light.shadowCameraBottom = -5;

    light.shadowMapWidth = 1024;
    light.shadowMapHeight = 1024;

    light.shadowCameraNear = 500;
    light.shadowCameraFar = 4000;
    light.shadowCameraFov = 30;

    scene.add( light );

    var maxAnisotropy = renderer.getMaxAnisotropy();

    // Testing vars

    var jMaterial = new THREE.MeshLambertMaterial({color: 0xffff11});

    // Floor

    var floorTexture = THREE.ImageUtils.loadTexture( "/assets/textures/crate.gif" );
    var floorMaterial = new THREE.MeshLambertMaterial( { color: 0xffffff, map: floorTexture} );

    floorTexture.anisotropy = maxAnisotropy;
    floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
    floorTexture.repeat.set( 512, 512 );

    var geometry = new THREE.PlaneBufferGeometry( 100, 100 );

    var floor = new THREE.Mesh( geometry, jMaterial );

    // Make the floor horizontal
    floor.rotation.x = - Math.PI / 2;
    // Make the floor really big (really)
    floor.scale.set( 1000, 1000, 1000 );

    floor.position.y = -100;

    floor.castShadow = true;
    floor.receiveShadow = true;

    scene.add( floor )


    // Geo Dome

    //var shadowMaterial = new THREE.MeshBasicMaterial({color: 0xff0099});
    var shadowGeo = new THREE.IcosahedronGeometry(200, 1);

    geo = new THREE.Mesh(shadowGeo, jMaterial);
    scene.add(geo);

    geo.castShadow = true;
    geo.receiveShadow = true;

    // Cube

    cube = new THREE.Mesh(new THREE.CubeGeometry(50, 50, 50), jMaterial);
    cube.position.x = 0;
    cube.position.y = -50;
    cube.position.z = 700;

    cube.rotation.y = 45;
    cube.rotation.x = 10;

    scene.add(cube);   

    // Textured Cube

    var texturedCubeTexture = THREE.ImageUtils.loadTexture( "/assets/textures/crate.gif" );

    texturedCubeTexture.wrapS = texturedCubeTexture.wrapT = THREE.RepeatWrapping;
    texturedCubeTexture.repeat.set( 100, 100 );

    texturedCubeMaterial = new THREE.MeshLambertMaterial({color: 0xffffff, map: texturedCubeTexture});

    texturedCube = new THREE.Mesh(new THREE.PlaneBufferGeometry(10000, 10000), texturedCubeMaterial);
    texturedCube.position.x = 0;
    texturedCube.position.y = -90;
    texturedCube.position.z = 250;

    texturedCube.rotation.x = - Math.PI / 2;
    texturedCube.rotation.y = 0;
    texturedCube.rotation.z = 0;

    //texturedCube.scale.set(20, 20, 20);

    scene.add(texturedCube);

    document.body.appendChild(renderer.domElement);

    // Delete me

    joeNum = 0;

}

function animate() {

    requestAnimationFrame(animate);

    // Silly function name, basically checks to see what keys are pressed and then changes the xPos, yPos, zPos, ETC variables - this allows for multiple keys to be detected and removes the press, then delay, then spam press of a key
    calculateMovement();


    /*mesh.rotation.x += 0.01;
    mesh.rotation.y += 0.02;

    jmesh.rotation.x += 0.02;
    jmesh.rotation.y += 0.01;*/

    cube.rotation.x += 0.02;
    cube.rotation.y += 0.01;

    cube.position.z -= 5;

    //texturedCube.scale.set(joeNum, joeNum, joeNum);
    //joeNum += 0.1;

    geo.rotation.x += 0.02;
    geo.rotation.y += 0.01;




    // pitch
    camera.rotation.x += degToRad(upRot);
    // yaw
    camera.rotation.y += degToRad(sideRot);


    // Normalise the rotation of the camera so that we have no values negative or above 360
    normaliseCameraRotation();

    // Make sure the camera can't look up or down to far
    if(radToDeg(camera.rotation.x) > 90 && radToDeg(camera.rotation.x) <= 180 ){
        camera.rotation.x = degToRad(90);
    }
    else if(radToDeg(camera.rotation.x) > 180 && radToDeg(camera.rotation.x) < 270 ){
        camera.rotation.x = degToRad(270);
    }


    upRot = 0;
    sideRot = 0;

    camera.position.x += (Math.sin(camera.rotation.y) * zPos) + (Math.cos(camera.rotation.y) * xPos);
    camera.position.y += degToRad(yPos);
    camera.position.z += (Math.cos(camera.rotation.y) * zPos) - (Math.sin(camera.rotation.y) * xPos);

    xPos = 0;
    yPos = 0;
    zPos = 0;

    renderer.render(scene, camera);

}

/*
 ** Unit Processing
 */

// Converts from degrees to radians.
function degToRad(degrees) {
    return degrees * Math.PI / 180;
}
;

// Converts from radians to degrees.
function radToDeg(radians) {
    return radians * 180 / Math.PI;
}
;

function normaliseCameraRotation(){
    // y rotation (yaw)
    if (radToDeg(camera.rotation.y) < 0) {
        camera.rotation.y += degToRad(360);
    } else if (radToDeg(camera.rotation.y) > 360) {
        camera.rotation.y -= degToRad(360);
    } 

    // x rotation (pitch)
    if (radToDeg(camera.rotation.x) < 0) {
        camera.rotation.x += degToRad(360);
    } else if (radToDeg(camera.rotation.x) > 360) {
        camera.rotation.x -= degToRad(360);
    } 

    // z rotation (roll)
    if (radToDeg(camera.rotation.z) < 0) {
        camera.rotation.z += degToRad(360);
    } else if (radToDeg(camera.rotation.z) > 360) {
        camera.rotation.z -= degToRad(360);
    } 
}

/*
 ** Input Detection
 */

document.onkeydown = checkKeyDown;

function checkKeyDown(e) {

    e = e || window.event;

    if (!isNaN(e.keyCode)) {
        keyStates[parseInt(e.keyCode)] = true;
    }
}

document.onkeyup = checkKeyUp;

function checkKeyUp(e) {

    e = e || window.event;

    if (!isNaN(e.keyCode)) {
        keyStates[parseInt(e.keyCode)] = false;
    }
}




function calculateMovement() {

    // W
    if (keyStates[87] == true) {
        zPos -= 10
    }
    // S
    if (keyStates[83] == true) {
        zPos += 10;
    }
    // A
    if (keyStates[65] == true) {
        xPos -= 10;
    }
    // D
    if (keyStates[68] == true) {
        xPos += 10;
    }
    // Up Arrow
    if (keyStates[38] == true) {
        upRot += 1;
    }
    // Down Arrow
    if (keyStates[40] == true) {
        upRot -= 1;
    }
    // Left Arrow
    if (keyStates[37] == true) {
        sideRot += 1;
    }
    // Right Arrow
    if (keyStates[39] == true) {
        sideRot -= 1;
    }

}