(() => {
  const app = document.getElementById("app");
  const canvas = document.getElementById("backgroundCanvas");
  const ctx = canvas.getContext("2d");
  const toast = document.getElementById("toast");
  const sparkleLayer = document.getElementById("cursor-sparkles");

  const levelOrder = ["level1", "level2", "video", "final"];
  const levelFiles = [
    "levels/level1.js",
    "levels/level2.js",
    "levels/video.js",
    "levels/final.js"
  ];

  const state = {
    levelIndex: 0,
    score: 0,
    completed: []
  };

  const modules = {};
  let particles = [];
  let confetti = [];
  let fireworks = [];
  let animationFrameId = null;

  function init() {
    resizeCanvas();
    initParticles();
    bindEffects();
    bootstrap();
  }

  async function bootstrap() {
    renderLoading();
    try {
      await Promise.all(levelFiles.map(loadScript));
      await wait(700);
      renderWelcome();
    } catch (error) {
      app.innerHTML = `
        <section class="screen is-active">
          <div class="card glass">
            <p class="eyebrow">⚠️ Connection issue</p>
            <h1>Some sparkle files are missing.</h1>
            <p class="subtext">Refresh the page and the challenge will resume.</p>
          </div>
        </section>
      `;
    }
  }

  function renderLoading() {
    app.innerHTML = `
      <section class="screen is-active">
        <div class="card glass loading-card">
          <p class="eyebrow">✦ Birthday Protocol</p>
          <h1>Hira's Birthday Challenge</h1>
          <h2>Level 24 · Preparing the glow</h2>
          <div class="progress-track">
            <div class="progress-bar" id="loadingBar"></div>
          </div>
        </div>
      </section>
    `;

    const bar = document.getElementById("loadingBar");
    let width = 0;
    const timer = setInterval(() => {
      width += 4;
      bar.style.width = `${Math.min(width, 100)}%`;
      if (width >= 100) {
        clearInterval(timer);
      }
    }, 30);
  }

  function renderWelcome() {
    app.innerHTML = `
      <section class="screen is-active">
        <div class="card glass">
          <p class="eyebrow">✨ Premium challenge</p>
          <h1>Hira's Birthday Challenge</h1>
          <h2>Level 24 · Unlocked 🤩</h2>
          <p class="subtext">Please read this and tap the button below to begin.</p>
          <div class="chip-row">
            <span class="pill">💖 Simple and sweet</span>
            <span class="pill">✨ Start the fun</span>
          </div>
          <button class="btn btn-primary" id="startBtn">Start</button>
        </div>
      </section>
    `;

    document.getElementById("startBtn").addEventListener("click", () => {
      state.levelIndex = 0;
      renderLevel(levelOrder[0]);
    });
  }

  function renderLevel(key) {
    const module = modules[key];
    if (!module) {
      renderWelcome();
      return;
    }

    app.innerHTML = `
      <section class="screen is-active">
        <div class="screen-inner"></div>
      </section>
    `;

    const container = app.querySelector(".screen-inner");
    module.render(container, helpers);
    requestAnimationFrame(() => {
      container.classList.add("is-visible");
    });
  }

  const helpers = {
    next: () => {
      const nextIndex = state.levelIndex + 1;
      if (nextIndex >= levelOrder.length) {
        renderLevel("final");
        return;
      }

      state.levelIndex = nextIndex;
      renderLevel(levelOrder[nextIndex]);
    },
    complete: () => {
      state.completed.push(levelOrder[state.levelIndex]);
      state.score += 100;
      showToast("Spark unlocked ✨");
      playTone();
      launchConfetti(80);
      launchFireworks(2);
      helpers.next();
    },
    showToast,
    launchConfetti,
    launchFireworks,
    playTone,
    restart: () => {
      state.levelIndex = 0;
      state.score = 0;
      state.completed = [];
      renderWelcome();
    }
  };

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = resolve;
      script.onerror = () => reject(new Error(`Failed to load ${src}`));
      document.head.appendChild(script);
    });
  }

  function wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("visible");
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => toast.classList.remove("visible"), 1800);
  }

  function playTone() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const ctxAudio = new AudioContext();
      const oscillator = ctxAudio.createOscillator();
      const gain = ctxAudio.createGain();
      oscillator.type = "triangle";
      oscillator.frequency.setValueAtTime(800, ctxAudio.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(1200, ctxAudio.currentTime + 0.15);
      gain.gain.setValueAtTime(0.05, ctxAudio.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctxAudio.currentTime + 0.25);
      oscillator.connect(gain);
      gain.connect(ctxAudio.destination);
      oscillator.start();
      oscillator.stop(ctxAudio.currentTime + 0.25);
    } catch (error) {
      // Silent fallback
    }
  }

  function initParticles() {
    particles = [];
    const count = Math.min(90, Math.max(50, Math.floor(window.innerWidth / 18)));
    for (let i = 0; i < count; i += 1) {
      particles.push(createParticle());
    }
    if (!animationFrameId) {
      animationFrameId = requestAnimationFrame(animate);
    }
  }

  function createParticle() {
    return {
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3 + 0.2,
      size: Math.random() * 2 + 1,
      alpha: Math.random() * 0.5 + 0.25
    };
  }

  function animate() {
    animationFrameId = requestAnimationFrame(animate);
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    ctx.fillStyle = "rgba(8, 2, 18, 0.16)";
    ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

    particles.forEach((particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      if (particle.x < 0 || particle.x > window.innerWidth) particle.vx *= -1;
      if (particle.y < 0 || particle.y > window.innerHeight) particle.vy *= -1;

      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${particle.alpha})`;
      ctx.fill();
    });

    confetti.forEach((piece, index) => {
      piece.y += piece.vy;
      piece.x += piece.vx;
      piece.vy += 0.012;
      piece.rotation += piece.spin;
      if (piece.y > window.innerHeight + 20) {
        confetti.splice(index, 1);
      }

      ctx.save();
      ctx.translate(piece.x, piece.y);
      ctx.rotate(piece.rotation);
      ctx.fillStyle = piece.color;
      ctx.fillRect(-piece.width / 2, -piece.height / 2, piece.width, piece.height);
      ctx.restore();
    });

    fireworks.forEach((fire, index) => {
      fire.life -= 1;
      fire.x += fire.vx;
      fire.y += fire.vy;
      fire.vy += 0.015;
      fire.vx *= 0.97;
      if (fire.life <= 0) {
        fireworks.splice(index, 1);
      }

      ctx.beginPath();
      ctx.arc(fire.x, fire.y, 2.2, 0, Math.PI * 2);
      ctx.fillStyle = fire.color;
      ctx.fill();
    });
  }

  function launchConfetti(count = 60) {
    for (let i = 0; i < count; i += 1) {
      confetti.push({
        x: Math.random() * window.innerWidth,
        y: -10,
        vx: (Math.random() - 0.5) * 1.4,
        vy: Math.random() * 2 + 1.2,
        width: 6 + Math.random() * 4,
        height: 10 + Math.random() * 6,
        rotation: Math.random() * Math.PI,
        spin: (Math.random() - 0.5) * 0.15,
        color: ["#ff4fa0", "#8d4dff", "#ffd86f", "#ffffff"][Math.floor(Math.random() * 4)]
      });
    }
  }

  function launchFireworks(amount = 2, x = window.innerWidth / 2, y = window.innerHeight / 2) {
    for (let i = 0; i < amount; i += 1) {
      const color = ["#ff4fa0", "#8d4dff", "#fff", "#ffd86f"][Math.floor(Math.random() * 4)];
      for (let p = 0; p < 16; p += 1) {
        const angle = (Math.PI * 2 * p) / 16;
        fireworks.push({
          x,
          y,
          vx: Math.cos(angle) * (1 + Math.random() * 1.2),
          vy: Math.sin(angle) * (1 + Math.random() * 1.2),
          life: 28 + Math.random() * 10,
          color
        });
      }
    }
  }

  function bindEffects() {
    window.addEventListener("resize", resizeCanvas);
    window.addEventListener("click", (event) => {
      createSparkle(event.clientX, event.clientY);
      launchFireworks(1, event.clientX, event.clientY);
    });
    window.addEventListener("mousemove", (event) => {
      if (Math.random() > 0.85) {
        createSparkle(event.clientX, event.clientY);
      }
    });
  }

  function resizeCanvas() {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    initParticles();
  }

  function createSparkle(x, y) {
    const spark = document.createElement("span");
    spark.className = "spark";
    spark.style.left = `${x}px`;
    spark.style.top = `${y}px`;
    sparkleLayer.appendChild(spark);
    setTimeout(() => spark.remove(), 700);
  }

  window.GameApp = { helpers, modules };
  window.addEventListener("DOMContentLoaded", init);

  Object.defineProperty(window, "GameLevels", {
    configurable: true,
    writable: true,
    value: modules
  });
})();