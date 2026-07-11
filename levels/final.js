(() => {
  const module = {
    render(container, helpers) {
      container.innerHTML = `
        <div class="card glass final-card">
          <div class="final-emoji">🎂💖</div>
          <p class="eyebrow">🏁 Celebrate Your Day</p>
          <h1>Happy Birthday,Miss Hira Sajid!</h1>
          <h2>Your sparkle challenge is complete</h2>
          <p class="subtext">You unlocked every glow, every laugh, and every little burst of magic.</p>
          <div class="link-row">
            <a href="assets/letter/bithday.pdf" target="_blank" rel="noreferrer">Open the birthday letter</a>
            <button class="btn btn-secondary" id="startOver">Play again</button>
          </div>
        </div>
      `;

      container.querySelector("#startOver").addEventListener("click", () => {
        helpers.restart();
      });

      helpers.launchConfetti(140);
      helpers.launchFireworks(4);
    }
  };

  window.GameLevels = window.GameLevels || {};
  window.GameLevels.final = module;
})();
