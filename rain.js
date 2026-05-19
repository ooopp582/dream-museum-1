(async () => {
  const {
    Application,
    Assets,
    Sprite,
    Container,
    TextStyle,
    Text,
    DisplacementFilter
  } = PIXI;

  const app = new Application();

  await app.init({
    width: 1920,
    height: 1080,
    preferCanvas: true,
  });

  document.body.appendChild(app.view);

  await Assets.load([
    { alias: "bg", src: "./images.jpg" },
    { alias: "displacement_map", src: "./displacement_map.jpg" },
  ]);

  // 背景
  const backgroundImage = Sprite.from('bg');
  backgroundImage.anchor.set(0.5);
  backgroundImage.position.set(app.screen.width / 2, app.screen.height / 2);

  const container = new Container();
  container.addChild(backgroundImage);
  app.stage.addChild(container);

  // 文字
  const style = new TextStyle({
    fontSize: 100,
    fill: 0xffffff,
    dropShadow: true,
    dropShadowAngle: Math.PI / 2,
    dropShadowBlur: 4,
    dropShadowColor: "#000000",
  });

  const text = new Text("Chuan Qi Shou Yi Ren", style);
  text.anchor.set(0.5);
  text.position.set(app.screen.width / 2, app.screen.height / 2);
  container.addChild(text);

  //波纹
  const displacementSprite = Sprite.from('displacement_map');
  displacementSprite.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;
  displacementSprite.width = 1920;
  displacementSprite.height = 1080;

  // 滤镜
  const displacementFilter = new DisplacementFilter(displacementSprite);
  displacementFilter.scale.set(30, 30);

  container.addChild(displacementSprite);
  container.filters = [displacementFilter]; 

  //水滴
  const shockwaveFilter1 = createShockwaveFilter(40, 30, 200, 80);
  const shockwaveFilter2 = createShockwaveFilter(80, 45, 240, 100);
  const shockwaveFilter3 = createShockwaveFilter(105, 65, 160, 140);

  container.filters = [displacementFilter, shockwaveFilter1, shockwaveFilter2, shockwaveFilter3];

  // 位移图动画
  app.ticker.add(() => {
    displacementSprite.x++;
    if (displacementSprite.x > app.screen.width){
      displacementSprite.x = 0;
    }
    
    createRaindrops(shockwaveFilter1, 0.7)
    createRaindrops(shockwaveFilter2, 0.5)
    createRaindrops(shockwaveFilter3, 1)
    
  });

  function createRaindrops(filter, resetTime){
    filter.time += 0.01;
    if (filter.time > resetTime){
      filter.time = 0;
      filter.center = {
        x: Math.random() * app.screen.width,
        y: Math.random() * app.screen.height,
      };
    }
  }

  function createShockwaveFilter(amplitude, wavelength, speed, radius){
    const shockwaveFilter = new PIXI.filters.ShockwaveFilter({
      center: { 
        x: Math.random() * app.screen.width,
        y: Math.random() * app.screen.height
      },
      amplitude,
      wavelength,
      speed,
      radius,
    });
    return shockwaveFilter;
  }

})();