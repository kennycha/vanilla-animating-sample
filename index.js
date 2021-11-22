const ROOT_URL =
  "https://res.cloudinary.com/dkp8v4ni8/image/upload/v1612095825/";
const FILE_NAME = "DyingToGlb_fqke1a.glb";

const BEGIN_FRAME = 0;
const END_FRAME = 5;
const SPEED_RATIO = 2;

let scene;

const handleSceneReady = async (scene) => {
  const camera1 = new BABYLON.ArcRotateCamera(
    "camera1",
    0,
    6,
    10,
    BABYLON.Vector3.Zero(),
    scene
  );
  camera1.setPosition(new BABYLON.Vector3(0, 6, 10));
  camera1.attachControl(renderingCanvas, false);
  camera1.allowUpsideDown = false;
  camera1.minZ = 0.1;
  camera1.inertia = 0.5;
  camera1.wheelPrecision = 50;
  camera1.wheelDeltaPercentage = 0.01;
  camera1.lowerRadiusLimit = 0.1;
  camera1.upperRadiusLimit = 20;
  camera1.pinchPrecision = 50;
  camera1.panningAxis = new BABYLON.Vector3(1, 1, 0);
  camera1.panningInertia = 0.5;
  camera1.panningDistanceLimit = 20;

  const light1 = new BABYLON.DirectionalLight(
    "light1",
    new BABYLON.Vector3(0, 1, 0),
    scene
  );
  light1.intensity = 0.1;

  const light2 = new BABYLON.HemisphericLight(
    "light2",
    new BABYLON.Vector3(0, 1, 1),
    scene
  );
  light2.intensity = 0.9;

  const loadedAssetContainer = await BABYLON.SceneLoader.LoadAssetContainerAsync(
    ROOT_URL,
    FILE_NAME,
    scene
  );

  const { animationGroups, meshes } = loadedAssetContainer;

  animationGroups.forEach((animationGroup) => {
    animationGroup.stop();
  });

  const targetAnimationGroup = animationGroups[0];

  meshes.forEach((mesh) => {
    scene.addMesh(mesh);
  });

  const handleKeydown = (event) => {
    switch (event.key) {
      case "1": {
        // forward
        targetAnimationGroup.normalize(BEGIN_FRAME, END_FRAME);
        if (targetAnimationGroup.isPlaying) {
          if (targetAnimationGroup.speedRatio < 0) {
            targetAnimationGroup.speedRatio = SPEED_RATIO;
          }
        } else if (targetAnimationGroup.isStarted) {
          if (targetAnimationGroup.speedRatio < 0) {
            targetAnimationGroup.speedRatio = SPEED_RATIO;
          }
          targetAnimationGroup.play();
        } else {
          targetAnimationGroup.start(true, SPEED_RATIO, BEGIN_FRAME, END_FRAME);
        }
        break;
      }
      case "2": {
        targetAnimationGroup.normalize(BEGIN_FRAME, END_FRAME);
        // backward
        if (targetAnimationGroup.isPlaying) {
          if (targetAnimationGroup.speedRatio > 0) {
            targetAnimationGroup.speedRatio = -1 * SPEED_RATIO;
          }
        } else if (targetAnimationGroup.isStarted) {
          if (targetAnimationGroup.speedRatio > 0) {
            targetAnimationGroup.speedRatio = -1 * SPEED_RATIO;
          }
          targetAnimationGroup.play();
        } else {
          targetAnimationGroup.start(
            true,
            -1 * SPEED_RATIO,
            BEGIN_FRAME,
            END_FRAME
          );
        }
        break;
      }
      default: {
        break;
      }
    }
  };

  document.addEventListener("keydown", handleKeydown);
};

const initializeScene = () => {
  const renderingCanvas = document.querySelector("#renderingCanvas");

  if (renderingCanvas) {
    const engine = new BABYLON.Engine(renderingCanvas, true);

    scene = new BABYLON.Scene(engine);

    scene.useRightHandedSystem = true;
    scene.clearColor = BABYLON.Color4.FromColor3(
      BABYLON.Color3.FromHexString("#202020")
    );

    scene.onReadyObservable.addOnce(handleSceneReady);

    engine.runRenderLoop(() => {
      scene.render();
    });
  }
};

const init = () => {
  initializeScene();
};

window.addEventListener("load", init);
