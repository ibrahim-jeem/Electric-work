/* ElectroLoad Pro | app.js
 * Startup (window.onload), modals and project reset. Loaded last.
 * Classic script: shares one global scope with the other files, so keep the load order from index.html.
 */

// On Application Load
window.onload = function() {
    renderFixtureTable();
    recalculateAll();
};

// Modals & Reset
function openPresetModal() { renderPresetModal(); document.getElementById('presetModal').classList.remove('hidden'); }
function closePresetModal() { document.getElementById('presetModal').classList.add('hidden'); }
function toggleFormulaModal() { document.getElementById('formulaModal').classList.toggle('hidden'); }

function resetProject() {
    if(confirm("Reset all load entries to default template?")) {
        boards = [{ id: 'b0', name: 'MDB', type: 'MDB', par: '', sup: 3, dist: 0 }];
        fixtures = [
            { id: 1, name: 'Main Office Lighting', room: 'Office', board: 'b0', sup: 1, category: 'Lighting', qty: 10, watts: 18, pf: 0.95, distance: 15, phase: 'R' },
            { id: 2, name: 'Workstation Sockets', room: 'Office', board: 'b0', sup: 1, category: 'Receptacles', qty: 6, watts: 180, pf: 0.90, distance: 20, phase: 'Y' }
        ];
        renderFixtureTable();
        recalculateAll();
    }
}
    
