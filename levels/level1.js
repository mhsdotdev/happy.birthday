(() => {
  const module = {
    render(container, helpers) {
      container.innerHTML = `
        <div class="card glass">
          <p class="eyebrow">🔐 Level 01 · Identity Glow</p>
          <h1>Who is the birthday queen?</h1>
          <div class="options-grid">
            <button class="choice-btn" data-value="batman">Super Women</button>
            <button class="choice-btn" data-value="hira">Hira</button>
            <button class="choice-btn" data-value="potato">Duckling</button>
            <button class="choice-btn" data-value="alien">Alien</button>
          </div>
          <div class="feedback" id="feedback"></div>
        </div>
      `;

      container.querySelectorAll(".choice-btn").forEach((button) => {
        button.addEventListener("click", () => {
          const isCorrect = button.dataset.value === "hira";
          const feedback = container.querySelector("#feedback");
          if (isCorrect) {
            feedback.textContent = "✅ Identity verified. The gate is opening.";
            helpers.complete();
          } else {
            feedback.textContent = "❌ Not quite. Try the name that belongs to the sparkle.";
            helpers.launchConfetti(20);
          }
        });
      });
    }
  };

  window.GameLevels = window.GameLevels || {};
  window.GameLevels.level1 = module;
})();
