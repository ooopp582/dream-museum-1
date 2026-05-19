// ======================== 纯鼠标粒子拖尾 · 按速度自动生成粒子 ========================
(function() {
    const particleCanvas = document.createElement("canvas");
    particleCanvas.id = "mouse-particles";
    particleCanvas.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        z-index: 9998;
        pointer-events: none;
    `;
    document.body.appendChild(particleCanvas);

    const pCtx = particleCanvas.getContext("2d");
    let w = particleCanvas.width = window.innerWidth;
    let h = particleCanvas.height = window.innerHeight;

    window.addEventListener("resize", () => {
        w = particleCanvas.width = window.innerWidth;
        h = particleCanvas.height = window.innerHeight;
    });

    let particles = [];
    let lastX = 0;
    let lastY = 0;
    let lastTime = Date.now();

    // 粒子基础配置
    const EMITTER_RADIUS = 40;

    document.addEventListener("mousemove", (e) => {
        const x = e.clientX;
        const y = e.clientY;
        const now = Date.now();
        const dt = now - lastTime || 1;

        // 计算鼠标移动速度
        const dx = x - lastX;
        const dy = y - lastY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const speed = dist / dt;

        // 速度决定一次生成多少粒子
        const baseCount = 0;
        const speedFactor = speed * 15; // 可调灵敏度
        let count = Math.floor(baseCount + speedFactor);

        // 限制上下限，避免爆量或完全没有
        count = Math.max(0, Math.min(count, 6));

        // 生成粒子
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const d = Math.random() * EMITTER_RADIUS;
            const sx = x + Math.cos(angle) * d;
            const sy = y + Math.sin(angle) * d;

            particles.push({
                x: sx,
                y: sy,
                size: Math.random() * 6 + 1,
                vx: (Math.random() - 0.5) * 1.5,
                vy: (Math.random() - 0.5) * 1.5,
                life: 50 + Math.random() * 30,
                color: `hsla(${200 + Math.random() * 60}, 80%, 60%, 0.6)`
            });
        }

        lastX = x;
        lastY = y;
        lastTime = now;
    });

    // 粒子动画
    function animate() {
        requestAnimationFrame(animate);
        pCtx.clearRect(0, 0, w, h);

        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.life--;
            p.size *= 0.97;

            if (p.life > 0) {
                pCtx.beginPath();
                pCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                pCtx.fillStyle = p.color;
                pCtx.fill();
            } else {
                particles.splice(i, 1);
                i--;
            }
        }
    }
    animate();
})();