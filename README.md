# Countdown

# New Icons

Prerequisite: Install Inkscape.

```bash
sudo add-apt-repository ppa:inkscape.dev/stable
sudo apt install inkscape
```

- Find an icon from [Font Awesome](https://fontawesome.com/icons?s=solid&m=free) and download the SVG.
- Remove all attributes from the SVG except `viewBox` and save it as `functions/render/icons/<id>.svg`.
- Adjust the viewbox to be square.
- Convert the SVG to PNG: `inkscape --export-type=png -w 1024 -h 1024 functions/render/icons/<id>.svg`
- Update the icon options in `src/App.svelte`.
