/* global THREE:true, $:true */

function makeParticles(scene, container) {
    'use strict';

    var particles, pX, pY, pZ, particle, sprite1, sprite2, sprite3, sprite4, sprite5, parameters, theCloud;
    var particleCount = 4000;
    var materials = [];
    var HEIGHT = container.outerHeight();
    var WIDTH = container.width();
             

    scene.fog = new THREE.FogExp2(0x000000, 0.006);

    particles = new THREE.Geometry();

    for (var p = 0; p < particleCount; p++) {
            // create a particle with random
            // position values, -250 -> 250
            pX = Math.random() * 500 - 250;
            pY = Math.random() * 500 - 250;
            pZ = Math.random() * 500 - 250;
            particle = new THREE.Vector3(pX, pY, pZ);
            particles.vertices.push(particle);
        }

    // snowflakes by http://en.wikipedia.org/wiki/File:Sketch_of_snow_crystal_by_Ren%C3%A9_Descartes.jpg
    sprite1 = THREE.ImageUtils.loadTexture("images/snowflake1.png");
    sprite2 = THREE.ImageUtils.loadTexture("images/snowflake2.png");
    sprite3 = THREE.ImageUtils.loadTexture("images/snowflake3.png");
    sprite4 = THREE.ImageUtils.loadTexture("images/snowflake4.png");
    sprite5 = THREE.ImageUtils.loadTexture("images/snowflake5.png");

    parameters = [
        [0x645862, 3, sprite1, 0.2],
        [0x998C79, 2, sprite2, 0.4],
        [0x4C3C4C, 3, sprite3, 0.3],
        [0x83776F, 1, sprite4, 0.5],
        [0x4C3C4C, 3, sprite5, 0.6]
    ];

    for (var i = 0; i < parameters.length; i++) {

        materials[i] = new THREE.PointsMaterial({
            size: Math.random() * 2, //parameters[i][1],
            map: parameters[i][2],
            blending: THREE.AdditiveBlending,
            depthTest: false,
            transparent: true,
            opacity: Math.random() 
        });

        theCloud = new THREE.Points(particles, materials[i]);

        theCloud.rotation.y = Math.random() * 6;
        theCloud.rotation.x = Math.random() * 6;
        theCloud.rotation.z = Math.random() * 6;

        scene.add(theCloud);

    }
 
}

function onStart() {
  'use strict';

  var
    onResizeEnd, theGeometry, theMaterial, theLight, theLight2, elem,
    cubes = [],
    theColor = 0xf0634c,
    transition = 0.002,
    
    body = $('body'), h = body.height(), w = body.width(),
    theContainer = $("#animation"),
    theRenderer = new THREE.WebGLRenderer({alpha: true}),
    theScene = new THREE.Scene(),
    theCamera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);

  theRenderer.setSize(w, h);
  theCamera.position.set(0, 0, 10);
  theContainer.replaceWith(theRenderer.domElement);

  theMaterial = new THREE.MeshLambertMaterial({
    color: theColor
  });

  $(window).resize(function () {
    clearTimeout(onResizeEnd);
    onResizeEnd = setTimeout(function () {
      var
        h = body.height(),
        w = body.width();

      theRenderer.setSize(w, h);
      theCamera.aspect = w / h;
      theCamera.updateProjectionMatrix();
    }, 400);
  });

  function buildScene(cubeNumber, cubeSize) {
    cubes = [];
    theGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);

    for (var i = 0; i < cubeNumber; i += 1) {
      for (var k = 0; k < cubeNumber; k += 1) {
        elem = new THREE.Mesh(theGeometry, theMaterial);
        cubes.push(elem);
        elem.position.set(-(cubeNumber * cubeSize / 2) + (cubeSize * k), -(cubeNumber * cubeSize / 2) + (cubeSize * i), 0);
        theScene.add(elem);
      }
    }

  }

  buildScene(Math.round(w / 16), w / 600);

  makeParticles(theScene, theContainer);

  theLight = new THREE.DirectionalLight(0xFFFFFF, 1);
  theLight.position.set(20, 20, 20);
  theScene.add(theLight);

  theLight2 = new THREE.DirectionalLight(0x5342E3/*3B5CA9*/, 1.2);
  theLight2.position.set(-20, -20, 20);
  theScene.add(theLight2);

  requestAnimationFrame(animate);

  setInterval(function () {
    transition = -transition;
  }, 4000);

  function animate() {
    var object, opacity;
    var time = Date.now() * 0.00001;

    theRenderer.render(theScene, theCamera);

    $(cubes).map(function (index, cube) {
      cube.rotation.y += 0.004;
      cube.rotation.x += 0.004;
      cube.position.x += transition;
      cube.position.x += transition;
    });

    for (var i = 0; i < theScene.children.length; i++) {
        object = theScene.children[i];
        if (object instanceof THREE.Points) {
            object.rotation.x += 0.0004; // = time * ( i < 4 ? i + 1 : -( i + 1 ) );
        }
    }

    requestAnimationFrame(animate);
  }
}
