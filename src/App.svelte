<script>
  const icons = [
    { id: 'a', label: 'Car' },
    { id: 'b', label: 'Beer' },
    { id: 'c', label: 'Check' },
    { id: 'h', label: 'Heart' },
    { id: 'm', label: 'Music' },
    { id: 'p', label: 'Plane' },
    { id: 's', label: 'Star' },
    { id: 'u', label: 'Umbrella' },
  ].sort((a, b) => a.label.localeCompare(b.label));

  let title = 'Test';
  let date = '2021-04-19';
  let icon = 'h';
  let color = hslToHex(Math.floor(Math.random() * 360), 100, 50);

  const shareable = typeof navigator.share === 'function';
  let shared = false;

  $: url = title && date && createURL({ title, date, icon, color });

  $: iconURLs = icons.reduce((a, b) => ({ ...a, [b.id]: createURL({ icon: b.id, color }) + 'favicon-32x32.png' }), {});

  function createURL({ title = '', date = '2021-01-01', icon = '', color = '' }) {
    const ps = {
      l: title,
      t: date,
      i: icon,
      p: color.replace(/^#/, ''),
    };
    const s = btoa(JSON.stringify(ps)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
    return `${location.origin.replace(/:(80|443)$/, '')}/r/${s}/`;
  }

  function shareLink() {
    navigator.share({ title, url });
  }

  function copyLink() {
    navigator.clipboard.writeText(url);
    shared = true;
    setTimeout(() => (shared = false), 5000);
  }

  function hslToHex(h, s, l) {
    l /= 100;
    const a = (s * Math.min(l, 1 - l)) / 100;
    const f = (n) => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color)
        .toString(16)
        .padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  }
</script>

<div class="page" style={`--color: ${color}`}>
  <h1>Countdown</h1>
  <p>
    Mit diesem Formular kannst du eine App mit einem Countdown zu einem bestimmten Datum generieren. Teile den Link mit deinen Freunden, die sich die App dann
    auf ihren Handies installieren können.
  </p>
  <form id="form">
    <label for="l">Überschrift</label>
    <input id="l" maxlength="50" required bind:value={title} />
    <label for="t">Ziel-Datum</label>
    <input type="date" id="t" required bind:value={date} />
    <label for="i">Bild</label>
    <div class="icon-select">
      {#each icons as i}
        <button type="button" on:click={() => (icon = i.id)} class="icon-select-btn" class:selected={i.id === icon}>
          <img src={iconURLs[i.id]} alt={i.label} width="32" height="32" />
        </button>
      {/each}
    </div>
    <label for="p">Farbe</label>
    <input type="color" id="p" required bind:value={color} />
  </form>
  {#if url}
    {#if shareable}
      <p>
        <button type="button" class="button" on:click={shareLink}>Teile diesen Countdown!</button>
      </p>
    {:else}
      <p>
        <button type="button" class="button" on:click={copyLink}>Teile diesen Countdown!</button>
        {#if shared}<div>Der Link ist in deiner Zwischenablage.</div>{/if}
      </p>
    {/if}
  {/if}
</div>
