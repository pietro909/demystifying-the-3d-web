/* global THREE:true, $:true */
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

  theLight = new THREE.DirectionalLight(0xD2D2D2, 1);
  theLight.position.set(20, 20, 20);
  theScene.add(theLight);

  theLight2 = new THREE.DirectionalLight(0x193549 /*3B5CA9*/, 1.2);
  theLight2.position.set(-20, -20, 20);
  theScene.add(theLight2);

  requestAnimationFrame(animate);

  setInterval(function () {
    transition = -transition;
  }, 4000);

  function animate() {
    theRenderer.render(theScene, theCamera);

    $(cubes).map(function (index, cube) {
      cube.rotation.y += 0.004;
      cube.rotation.x += 0.004;
      cube.position.x += transition;
      cube.position.x += transition;
    });

    requestAnimationFrame(animate);
  }
}
