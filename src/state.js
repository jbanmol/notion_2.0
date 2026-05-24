/* ==========================================================================
   NEONOTION STATE MANAGER (LOCALSTORAGE SYNC & SEED DATA)
   ========================================================================== */

const STORAGE_KEY = 'neonotion_cyber_workspace_data';

// Default holographic pages seed data
const DEFAULT_WORKSPACE_DATA = {
    activeDocId: 'doc-security-audit',
    currentTheme: 'theme-obsidian',
    documents: {
        'doc-security-audit': {
            id: 'doc-security-audit',
            title: '🌐 GRID_SECURITY_AUDIT.LOG',
            icon: 'shield-alert',
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
            icon: 'users',
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
            icon: 'cpu',
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
            icon: 'git-branch',
            blocks: [
                { id: 'b19', type: 'heading-1', content: 'COGNITIVE INTRUSION MISSION TIMELINE' },
                { id: 'b20', type: 'text', content: 'Operational countdown matrix outlining the neural decryption and database exfiltration hack vector. Monitor sub-millisecond status parameters.' },
                {
                    id: 'b21',
                    type: 'timeline',
                    content: JSON.stringify([
                        { time: 'T-MINUS 12:00', title: 'SUBNET RADAR INITIALIZED', status: 'COMPLETED', details: 'District 9 network structures successfully mapped under dynamic scanning probes.', icon: 'activity', color: 'cyan' },
                        { time: 'T-MINUS 08:30', title: 'DECRYPTION MODULE ENGAGED', status: 'COMPLETED', details: 'Corrupted sync protocols loaded in memory deck. Security proxies bypassed.', icon: 'key', color: 'cyan' },
                        { time: 'T-MINUS 02:15', title: 'FIREWALL BREACH DETECTED', status: 'WARNING', details: 'Intrusion alert flagged in district central subgrid! Automated countermeasures deploy.', icon: 'alert-triangle', color: 'pink' },
                        { time: 'T-MINUS 00:05', title: 'ZEN_FOCUS DATA EXTRACTION', status: 'ONLINE', details: 'Streaming dynamic database profiles directly to secure local IndexedDB caches.', icon: 'download', color: 'violet' },
                        { time: 'T-PLUS 04:00', title: 'SUBNET COOLDOWN & DECOY DEPLOY', status: 'PENDING', details: 'Trigger proxy shutoffs and purge logs to fully anonymize workspace coordinates.', icon: 'shield-alert', color: 'muted' }
                    ])
                },
                { id: 'b22', type: 'heading-3', content: 'SYSTEM MEMO' },
                { id: 'b23', type: 'text', content: 'Ensure focus parameters and mechanical click indicators remain active during exfiltration sequences. Interrogating individual timeline nodes displays advanced quantum logs.' }
            ]
        }
    }
};

class StateManager {
    constructor() {
        this.data = this.loadFromStorage();
        this.listeners = [];
    }

    loadFromStorage() {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                return JSON.parse(stored);
            } catch (e) {
                console.error("Error loading cached state, seeding default telemetry instead.", e);
            }
        }
        return JSON.parse(JSON.stringify(DEFAULT_WORKSPACE_DATA));
    }

    saveToStorage() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
        this.notifyListeners();
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
            this.saveToStorage();
        }
    }

    updateDocumentBlocks(id, newBlocks) {
        if (this.data.documents[id]) {
            this.data.documents[id].blocks = newBlocks;
            this.saveToStorage();
        }
    }

    createNewDocument() {
        const id = 'doc-' + Date.now();
        this.data.documents[id] = {
            id: id,
            title: 'NEW_UNNAMED_NODE.EXE',
            icon: 'file-text',
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
            alert("SYSTEM ERROR: CANNOT PURGE CORE NODE. AT LEAST ONE ACTIVE WORKSPACE ELEMENT REQUIRED.");
            return;
        }
        
        delete this.data.documents[id];
        if (this.data.activeDocId === id) {
            this.data.activeDocId = Object.keys(this.data.documents)[0];
        }
        this.saveToStorage();
    }
}

export const state = new StateManager();
