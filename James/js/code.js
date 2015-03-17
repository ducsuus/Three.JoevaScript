//Set the scene size
var WIDTH = 400, HEIGHT = 300;

//Sets some camera attributes
var VIEW_ANGLE = 45,
	ASPECT = WIDTH/HEIGHT,
	NEAR = 0.1,
	FAR = 10000;
	
//Gets the DOM element to attach 
var $container = $("#container");

//Creates a WebGL render, camera and a scene
var renderer = new THREE.WebGLRenderer();
var camera = new THREE.PerspectiveCamera(
	VIEW_ANGLE,
	ASPECT,
	NEAR,
	FAR);
	
var scene = new THREE.Scene();

//Adds camera to the scene
scene.add(camera);

//Camera starts at 0,0,0
//Moves Z back 30000
camera.position.z = 300;

//Starts the renderer
renderer.setSize(WIDTH, HEIGHT);

//Attach the render supplied DOM element
$container.append(renderer.domElement);

//Sets up sphere vars
var radius = 50, segments = 16, rings = 16;

//Creates a new mesh with sphere geometry
var sphere = new THREE.Mesh(
	new THREE.SphereGeometry(
		radius,
		segments,
		rings),
		
	sphereMaterial);
	
	//Adds sphere to scene
	scene.add(sphere);

//Creates the sphere's material
var sphereMaterial = 
	new THREE.MeshLambertMaterial(
	{
		color: 0xCC0000
	});




























