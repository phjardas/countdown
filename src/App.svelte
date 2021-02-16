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

  let title = '';
  let date = '';
  let icon = 'h';
  let color = '#ff0000';

  $: params = title &&
    date && {
      l: title,
      t: date,
      i: icon,
      p: color.replace(/^#/, ''),
    };

  $: s =
    params &&
    btoa(JSON.stringify(params))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');

  $: url = s && `${location.origin.replace(/:(80|443)$/, '')}/r/${s}/`;
</script>

<h1>Countdown</h1>
<form id="form">
  <label for="l">Title:</label>
  <input id="l" maxlength="50" required bind:value={title} />
  <label for="t">Target date:</label>
  <input type="date" id="t" required bind:value={date} />
  <label for="i">Icon:</label>
  <select id="i" required bind:value={icon}>
    {#each icons as icon}
      <option value={icon.id}>{icon.label}</option>
    {/each}
  </select>
  <label for="p">Primary color:</label>
  <input type="color" id="p" required bind:value={color} />
</form>
{#if url}
  <p>
    <a href={url} class="button" style={`--color: ${color}`}>Copy and share this link!</a>
  </p>
  <iframe id="preview" title="Preview" src={`${url}?p`} />
{/if}
