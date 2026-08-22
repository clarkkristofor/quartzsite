(function() {
  const CARD_SLUGS = [
    "rpgs/protected/sb/playtest-beta-oracle-deck/corruption",
    "rpgs/protected/sb/playtest-beta-oracle-deck/family",
    "rpgs/protected/sb/playtest-beta-oracle-deck/sin",
    "rpgs/protected/sb/playtest-beta-oracle-deck/the-alchemist",
    "rpgs/protected/sb/playtest-beta-oracle-deck/the-called",
    "rpgs/protected/sb/playtest-beta-oracle-deck/the-champion",
    "rpgs/protected/sb/playtest-beta-oracle-deck/the-exorcist",
    "rpgs/protected/sb/playtest-beta-oracle-deck/the-light",
    "rpgs/protected/sb/playtest-beta-oracle-deck/the-mentor",
    "rpgs/protected/sb/playtest-beta-oracle-deck/the-thief"
  ];

  const STORAGE_KEY = "oracle-deck-used";

  function init() {
    const cardFace = document.getElementById("card-face");
    const drawBtn = document.getElementById("draw-btn");

    if (!cardFace || !drawBtn) {
      // Elements not in the DOM yet; try again shortly.
      setTimeout(init, 100);
      return;
    }

    function getUsed() {
      try { return JSON.parse(sessionStorage.getItem(STORAGE_KEY) || "[]"); }
      catch (e) { return []; }
    }
    function setUsed(arr) { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(arr)); }
    function remainingSlugs() {
      const used = getUsed();
      return CARD_SLUGS.filter(s => !used.includes(s));
    }
    function updateButtonState() {
      drawBtn.textContent = remainingSlugs().length === 0 ? "Reshuffle" : "Draw";
    }

    function fetchDecryptedCard(slug, onReady) {
      const iframe = document.createElement("iframe");
      iframe.style.display = "none";
      iframe.src = "/" + slug;
      document.body.appendChild(iframe);

      const start = Date.now();
      const TIMEOUT_MS = 15000;

      function poll() {
        let doc;
        try { doc = iframe.contentDocument; } catch (e) { doc = null; }

        if (doc) {
          const stillEncrypted = doc.querySelector(".encrypted-page");
          const articleBody = doc.querySelector("article.popover-hint .markdown-preview-view");
          if (articleBody && !stillEncrypted) {
            const html = articleBody.innerHTML;
            document.body.removeChild(iframe);
            onReady(html, null);
            return;
          }
        }

        if (Date.now() - start > TIMEOUT_MS) {
          document.body.removeChild(iframe);
          onReady(null, "Card took too long to load. Try again.");
          return;
        }
        setTimeout(poll, 150);
      }

      iframe.addEventListener("load", function() { setTimeout(poll, 150); });
    }

    function drawCard() {
      let remaining = remainingSlugs();

      if (remaining.length === 0) {
        setUsed([]);
        cardFace.innerHTML = '<p class="oracle-hint">Deck reshuffled. Draw a card.</p>';
        updateButtonState();
        return;
      }

      drawBtn.disabled = true;
      const chosen = remaining[Math.floor(Math.random() * remaining.length)];

      fetchDecryptedCard(chosen, function(html, err) {
        drawBtn.disabled = false;
        if (err) {
          cardFace.innerHTML = '<p class="oracle-hint">' + err + '</p>';
          return;
        }
        const used = getUsed();
        used.push(chosen);
        setUsed(used);
        cardFace.innerHTML = html;
        updateButtonState();
      });
    }

    drawBtn.addEventListener("click", drawCard);
    updateButtonState();
  }

  init();
})();