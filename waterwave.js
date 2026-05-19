(async () => {
    const { Application, Sprite, Container } = PIXI;
    const app = new Application();

    await app.init({
        width: 728,
        height: 408,
        backgroundColor: 0x000000,
        resolution: window.devicePixelRatio,
        antialias: true
    });

    document.querySelector("#box").appendChild(app.canvas);

    await PIXI.Assets.load([
        { alias: "1", src: "./images/4.jpg" },
        { alias: "2", src: "./images/5.jpg" },
        { alias: "3", src: "./images/6.jpg" },
    ]);

    const images = [];
    for (let index = 3; index >= 1; index--) {
        const image = Sprite.from(`${index}`);
        image.width = app.screen.width;
        image.height = app.screen.height;
        image.alpha = 0;
        images.push(image);
    }

    let currIndex = 0;
    images[currIndex].alpha = 1;

    const container = new Container();
    for (let img of images) {
        container.addChild(img);
    }
    app.stage.addChild(container);

    // 水波纹滤镜
    const shockwaveFilter = new PIXI.filters.ShockwaveFilter({
        center: { x: app.screen.width / 2, y: app.screen.height / 2 },
        amplitude: 300,
        wavelength: 0,
        speed: 700,
        brightness: 1,
        radius: -1,
        time: 0
    });
    shockwaveFilter.enabled = false;
    container.filters = [shockwaveFilter];

    let waveReady = true;
    let currentAnimation = null;

    // 点击事件
    app.canvas.addEventListener("click", (e) => {
        if (!waveReady) return;

        // ==============================================
        // 终极方案：永远不偏移 + 永远不飞出屏幕
        const rect = app.canvas.getBoundingClientRect();
        
        // 计算视觉百分比 → 映射回画布 728x408 内部
        const percentX = (e.clientX - rect.left) / rect.width;
        const percentY = (e.clientY - rect.top) / rect.height;

        // 最终坐标：永远在画布内，永远精准
        const x = app.screen.width * percentX;
        const y = app.screen.height * percentY;
        // ==============================================

        waveReady = false;

        // 设置波纹中心
        shockwaveFilter.center.x = x;
        shockwaveFilter.center.y = y;
        shockwaveFilter.time = 0;
        shockwaveFilter.wavelength = 300;
        shockwaveFilter.enabled = true;

        const prevIndex = currIndex;
        currIndex = (currIndex + 1) % images.length;

        if (currentAnimation) {
            app.ticker.remove(currentAnimation);
        }

        // 波纹动画
        currentAnimation = () => {
            shockwaveFilter.time += 0.016;

            images[prevIndex].alpha = 1 - shockwaveFilter.time;
            images[currIndex].alpha = shockwaveFilter.time;

            if (shockwaveFilter.time >= 1) {
                shockwaveFilter.time = 0;
                shockwaveFilter.wavelength = 0;
                shockwaveFilter.enabled = false;

                app.ticker.remove(currentAnimation);
                currentAnimation = null;
                waveReady = true;
            }
        };

        app.ticker.add(currentAnimation);
    });
})();