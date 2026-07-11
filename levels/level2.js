(() => {
  const module = {
    render(container, helpers) {
      container.innerHTML = `
        <div class="card glass">
          <p class="eyebrow">🪩 Level 02 · Secret Wish</p>
          <h1>Complete the birthday wish</h1>
          <p class="subtext">Type the Band to reveal the next spark.</p>
          <p class="subtext" style="font-size: 0.95rem; color: #ffd9f2;">
            Hint: <em>"Dekho ye chaand taare, kehte hain ye bhi saare"</em>
          </p>
          <div class="input-shell">
            <input id="wishInput" type="text" placeholder="Type the missing word" />
            <button class="btn btn-primary" id="checkWish">Reveal</button>
          </div>
          <div class="feedback" id="feedback"></div>
        </div>
      `;

      const input = container.querySelector("#wishInput");
      const button = container.querySelector("#checkWish");
      const feedback = container.querySelector("#feedback");

      const handleCheck = () => {
        const answer = input.value.trim().toLowerCase();
        if (answer === "kaavish") {
          feedback.textContent = "✨ Perfect. The stars are aligning.";
          helpers.complete();
        } else {
          feedback.textContent = "💫 Almost there. The missing word is the celebration itself.";
        }
      };

      button.addEventListener("click", handleCheck);
      input.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
          handleCheck();
        }
      });
    }
  };

  window.GameLevels = window.GameLevels || {};
  window.GameLevels.level2 = module;
})();
