async function run() {
  const out = document.getElementById('out');
  const btn = document.getElementById('btn');
  btn.addEventListener('click', async () => {
    try {
      if (!globalThis.reaLab) {
        out.textContent = 'reaLab bridge missing (open via Electron or use Node inventory scripts).';
        return;
      }
      const result = await globalThis.reaLab.exportSnapshot({ label: 'ui-click' });
      out.textContent = JSON.stringify(result, null, 2);
    } catch (err) {
      out.textContent = String(err && err.stack ? err.stack : err);
    }
  });
}
run();
