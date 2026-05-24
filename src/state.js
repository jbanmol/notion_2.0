/* ==========================================================================
   NEONOTION STATE MANAGER (LOCALSTORAGE SYNC & SEED DATA)
   ========================================================================== */

const STORAGE_KEY = 'neonotion_cyber_workspace_data';

// Default holographic pages seed data
const DEFAULT_WORKSPACE_DATA = {
    activeDocId: 'doc-security-audit',
    currentTheme: 'theme-obsidian',
    globalAudioMuted: false,
    documents: {
        'doc-security-audit': {
            id: 'doc-security-audit',
            title: '🌐 GRID_SECURITY_AUDIT.LOG',
            icon: '🛡️',
            pinned: false,
            createdAt: Date.now(),
            updatedAt: Date.now(),
            blocks: [
                { id: 'b1', type: 'heading-1', content: 'SYSTEM SECURITY INTEGRITY AUDIT' },
                { id: 'b2', type: 'text', content: 'Telemetry logs detected unauthorized penetration queries scanning Sector 4 nodes. Bio-signature matches suggest proxy-tunneling via remote orbital relays.' },
                { id: 'b3', type: 'heading-2', content: 'ACTIVE FIREWALL DEPLOYMENT PROTOCOLS' },
                { id: 'b4', type: 'checklist', content: 'Scaffold secondary encryption decoy subnets', checked: true },
                { id: 'b5', type: 'checklist', content: 'Purge old network terminals in district 9', checked: false },
                { id: 'b6', type: 'checklist', content: 'Synchronize neural firewalls with orbital Aegis Core', checked: false },
                { id: 'b7', type: 'heading-2', content: 'CORRUPT SYNC NODE LOGS' },
                { 
                    id: 'b8', 
                    type: 'code', 
                    content: 'function initialize_sync(Subject_ID) {\n  let Latency = check_ping(Neural_Node_4);\n  if (Latency < 5) {\n    activate_link(Subject_ID, Full_Bandwidth);\n    *NeuralSync::Status = STABLE;\n  } else {\n    optimize_node(Neural_Node_4, Retry=3);\n  }\n}' 
                },
                { id: 'b9', type: 'text', content: 'The code execution above demonstrates sub-optimal network configurations. Adjust frequency matrix parameters immediately.' }
            ]
        },
        'doc-crew-logs': {
            id: 'doc-crew-logs',
            title: '👾 NEON_RUNNER_CREDENTIALS',
            icon: '👾',
            pinned: false,
            createdAt: Date.now(),
            updatedAt: Date.now(),
            blocks: [
                { id: 'b10', type: 'heading-1', content: 'ACTIVE NEON RUNNER ROSTER' },
                { id: 'b11', type: 'text', content: 'The following high-profile data runners are contracted under Project Aegis. Decryption keys required for bio-linked telemetry.' },
                { 
                    id: 'b12', 
                    type: 'table', 
                    content: JSON.stringify({
                        headers: ['ALIAS', 'SPECIALIZATION', 'CREDENTIAL_STATUS', 'OPERATING_ZONE'],
                        rows: [
                            ['HexDecoder', 'Neural Deck Overriding', 'AUTHORIZED', 'NIGHT_CITY'],
                            ['AeroGlitch', 'Physical Substation Breach', 'CLASSIFIED', 'NEO_TOKYO'],
                            ['DataDrifter', 'Cognitive Sync & AI Scraping', 'REVOKED', 'ORBITAL_STATION_9']
                        ]
                    })
                },
                { id: 'b13', type: 'heading-3', content: 'IMPORTANT NOTICE' },
                { id: 'b14', type: 'text', content: 'Verify physical signatures of all field runners before releasing decrypted files. Cybernetic hardware implants must be pre-scanned.' }
            ]
        },
        'doc-quantum-deck': {
            id: 'doc-quantum-deck',
            title: '💾 DECK_HARDWARE_SPECS',
            icon: '💾',
            pinned: true,
            createdAt: Date.now(),
            updatedAt: Date.now(),
            blocks: [
                { id: 'b15', type: 'heading-1', content: 'QUANTUM CHIP DECK SCHEMATICS' },
                { id: 'b16', type: 'text', content: 'System diagnostics of custom hardware deck. Upgraded with cyber-enhanced quantum capacitors.' },
                {
                    id: 'b17',
                    type: 'embed',
                    title: 'Interactive Deck Schematic Matrix // CyberHardware Lab',
                    url: 'https://cyberhardware.net/specs/deck-v9',
                    content: 'Visual telemetry schematic map'
                },
                { id: 'b18', type: 'text', content: 'Adjust voltage rails strictly in the range of 1.25V - 1.40V to prevent core crystal desynchronization.' }
            ]
        },
        'doc-timeline': {
            id: 'doc-timeline',
            title: '📡 OPERATIONS_TIMELINE.LOG',
            icon: '📡',
            pinned: false,
            createdAt: Date.now(),
            updatedAt: Date.now(),
            blocks: [
                { id: 'b_t1', type: 'heading-1', content: 'SYSTEM WIDE OPERATIONS TIMELINE' },
                { id: 'b_t2', type: 'text', content: 'Select event nodes in the timeline cockpit below to decrypt sector logs, query cognition latency metrics, and trace diagnostic telemetry streams.' },
                {
                    id: 'b_t3',
                    type: 'hologram-timeline',
                    content: JSON.stringify([
                        { id: 'node-1', label: 'DATABASE SCRAPING LINK', time: '04:12:00', icon: 'database', status: 'COMPLETE', statusClass: 'green' },
                        { id: 'node-2', label: 'ORBITAL TUNNEL BREACH', time: '06:45:12', icon: 'shield-alert', status: 'CRITICAL', statusClass: 'red' },
                        { id: 'node-3', label: 'QUANTUM KEY EXFILTRATION', time: '09:20:00', icon: 'key', status: 'IN_PROGRESS', statusClass: 'cyan' },
                        { id: 'node-4', label: 'CORE DECK RESYNCHRONIZATION', time: '12:05:44', icon: 'refresh-cw', status: 'STANDBY', statusClass: 'gray' }
                    ])
                }
            ]
        }
    }
};

/** Backfill missing metadata fields for documents loaded from old localStorage */
function backfillDocument(doc) {
    if (!doc.icon)      doc.icon = '📄';
    if (doc.pinned === undefined) doc.pinned = false;
    if (!doc.createdAt) doc.createdAt = Date.now();
    if (!doc.updatedAt) doc.updatedAt = Date.now();
    return doc;
}

class StateManager {
    constructor() {
        this.data = this.loadFromStorage();
        this.listeners = [];
    }

    loadFromStorage() {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                // Backfill metadata on all docs
                Object.values(parsed.documents).forEach(doc => backfillDocument(doc));
                if (parsed.globalAudioMuted === undefined) parsed.globalAudioMuted = false;
                return parsed;
            } catch (e) {
                console.error("Error loading cached state, seeding default telemetry instead.", e);
            }
        }
        return JSON.parse(JSON.stringify(DEFAULT_WORKSPACE_DATA));
    }

    saveToStorage() {
        const payloadStr = JSON.stringify(this.data);
        localStorage.setItem(STORAGE_KEY, payloadStr);
        this.notifyListeners();
        if (window.app && window.app.log) {
            window.app.log(`AUTO_SAVE // SUCCESS // EXFILTRATED ${payloadStr.length} BYTES`);
        }
    }

    notifyListeners() {
        this.listeners.forEach(fn => fn(this.data));
    }

    subscribe(fn) {
        this.listeners.push(fn);
        return () => {
            this.listeners = this.listeners.filter(l => l !== fn);
        };
    }

    // --- State Queries ---
    getDocuments() {
        return Object.values(this.data.documents);
    }

    getActiveDocument() {
        return this.data.documents[this.data.activeDocId] || Object.values(this.data.documents)[0];
    }

    getActiveTheme() {
        return this.data.currentTheme || 'theme-obsidian';
    }

    isGlobalAudioMuted() {
        return this.data.globalAudioMuted === true;
    }

    setGlobalAudioMuted(muted) {
        this.data.globalAudioMuted = muted;
        this.saveToStorage();
    }

    // --- State Mutations ---
    setActiveDocument(id) {
        if (this.data.documents[id]) {
            this.data.activeDocId = id;
            this.saveToStorage();
        }
    }

    setTheme(themeName) {
        this.data.currentTheme = themeName;
        this.saveToStorage();
    }

    updateDocumentTitle(id, newTitle) {
        if (this.data.documents[id]) {
            this.data.documents[id].title = newTitle;
            this.data.documents[id].updatedAt = Date.now();
            this.saveToStorage();
        }
    }

    updateDocumentBlocks(id, newBlocks) {
        if (this.data.documents[id]) {
            this.data.documents[id].blocks = newBlocks;
            this.data.documents[id].updatedAt = Date.now();
            this.saveToStorage();
        }
    }

    updateDocumentIcon(id, emoji) {
        if (this.data.documents[id]) {
            this.data.documents[id].icon = emoji;
            this.data.documents[id].updatedAt = Date.now();
            this.saveToStorage();
        }
    }

    toggleDocumentPin(id) {
        if (this.data.documents[id]) {
            this.data.documents[id].pinned = !this.data.documents[id].pinned;
            this.saveToStorage();
        }
    }

    moveBlock(docId, fromIndex, toIndex) {
        const doc = this.data.documents[docId];
        if (!doc) return;
        const blocks = [...doc.blocks];
        const [moved] = blocks.splice(fromIndex, 1);
        blocks.splice(toIndex, 0, moved);
        doc.blocks = blocks;
        doc.updatedAt = Date.now();
        this.saveToStorage();
    }

    createNewDocument() {
        const id = 'doc-' + Date.now();
        const now = Date.now();
        this.data.documents[id] = {
            id,
            title: 'NEW_UNNAMED_NODE.EXE',
            icon: '📄',
            pinned: false,
            createdAt: now,
            updatedAt: now,
            blocks: [
                { id: 'block-' + Date.now(), type: 'text', content: '' }
            ]
        };
        this.data.activeDocId = id;
        this.saveToStorage();
        return id;
    }

    deleteDocument(id) {
        if (Object.keys(this.data.documents).length <= 1) {
            return false; // Signal callers to show a cyber modal instead
        }
        
        delete this.data.documents[id];
        if (this.data.activeDocId === id) {
            this.data.activeDocId = Object.keys(this.data.documents)[0];
        }
        this.saveToStorage();
        return true;
    }
}

export const state = new StateManager();

/** Utility: format a timestamp as relative time (e.g. "2h ago") */
export function relativeTime(ts) {
    const diff = Date.now() - ts;
    const mins  = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days  = Math.floor(diff / 86400000);
    if (mins  < 1)   return 'just now';
    if (mins  < 60)  return `${mins}m ago`;
    if (hours < 24)  return `${hours}h ago`;
    return `${days}d ago`;
}
