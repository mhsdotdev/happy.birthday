(() => {
  const module = {
    render(container, helpers) {
      const videos = [
        "assets/videos/video1.mp4",
        "assets/videos/video2.mp4",
        "assets/videos/video3.mp4"
      ];
      let currentIndex = 0;

      container.innerHTML = `
        <div class="card glass video-card">
          <p class="eyebrow">🎬 Level 03 · Birthday Reel</p>
          <h1>Yaha reels dekg lain 🤡</h1>
          <p class="subtext">Watch the clips, then unlock the final glow.</p>
          <div class="video-panel">
            <video id="birthdayVideo" class="video-player" controls preload="metadata" playsinline>
              <source src="${videos[0]}" type="video/mp4">
            </video>
          </div>
          <button class="btn btn-primary" id="playReveal">Play the first clip</button>
        </div>
      `;

      const player = container.querySelector("#birthdayVideo");
      const button = container.querySelector("#playReveal");
      const message = container.querySelector(".subtext");

      const playNextClip = () => {
        if (currentIndex >= videos.length) {
          helpers.launchFireworks(3);
          helpers.showToast("The reel is glowing brighter");
          helpers.complete();
          return;
        }

        const source = videos[currentIndex];
        player.src = source;
        player.load();
        player.play().catch(() => {});

        const clipNumber = currentIndex + 1;
        message.textContent = `Clip ${clipNumber} of 3 · ${clipNumber === 3 ? "Final sparkle" : "The next clip is coming up"}`;
        button.textContent = clipNumber === 3 ? "Reveal the final glow" : "Play next clip";
        currentIndex += 1;
      };

      button.addEventListener("click", () => {
        playNextClip();
      });

      player.addEventListener("ended", () => {
        if (currentIndex < videos.length) {
          playNextClip();
        } else {
          helpers.launchFireworks(3);
          helpers.showToast("The reel is glowing brighter");
          helpers.complete();
        }
      });
    }
  };

  window.GameLevels = window.GameLevels || {};
  window.GameLevels.video = module;
})();
