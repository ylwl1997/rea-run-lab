/**
 * Preload bridge — exposes a narrow lab API to the renderer.
 */
const { contextBridge, ipcRenderer } = (() => {
  try {
    return require('electron');
  } catch {
    return {
      contextBridge: { exposeInMainWorld(name, api) { globalThis[name] = api; } },
      ipcRenderer: {
        invoke: async (channel, ...args) => {
          if (channel === 'lab:export-snapshot') {
            const { buildExportPayload } = require('../lib/exportPath');
            return { ok: true, payload: buildExportPayload({ label: (args[0] && args[0].label) || 'preload-stub' }) };
          }
          if (channel === 'lab:list-routes') {
            return { routes: [{ id: 'home', path: '/' }, { id: 'export', path: '/export' }] };
          }
          return null;
        },
      },
    };
  }
})();

contextBridge.exposeInMainWorld('reaLab', {
  exportSnapshot: (opts) => ipcRenderer.invoke('lab:export-snapshot', opts),
  listRoutes: () => ipcRenderer.invoke('lab:list-routes'),
});
