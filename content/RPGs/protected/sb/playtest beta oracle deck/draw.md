---
password: 8;qTcpW]j]=m_EOx,aTo{XcB
publish: true
---
<div id="oracle-deck-widget">
  <div id="card-face">
    <p class="oracle-hint">Draw a card</p>
  </div>
  <button id="draw-btn">Draw</button>
</div>

<style>
#oracle-deck-widget { max-width: 500px; margin: 2rem auto; text-align: center; }
#card-face { border: 1px solid var(--midgray, #888); border-radius: 12px; padding: 2rem; min-height: 200px; margin-bottom: 1.5rem; background: var(--light, #fff); text-align: left; }
#card-face h2 { margin-top: 1rem; font-size: 1rem; text-transform: uppercase; letter-spacing: 0.05em; opacity: 0.7; }
#card-face h2:first-child { margin-top: 0; }
#draw-btn { padding: 0.75rem 2rem; font-size: 1.1rem; cursor: pointer; border-radius: 8px; border: none; background: var(--secondary, #8b0000); color: white; }
#draw-btn:disabled { opacity: 0.5; cursor: default; }
.oracle-hint { opacity: 0.6; font-style: italic; text-align: center; }
</style>

<script src="/static/oracle-deck.js"></script>