/* ==========================================================================
   NEONOTION CYBER MODAL SERVICE
   Promise-based replacement for browser alert() / confirm()
   ========================================================================== */

class CyberModalServiceClass {
    constructor() {
        this._modalEl    = null;
        this._resolveRef = null;
    }

    /** Lazily inject the modal DOM on first use */
    _getModal() {
        if (this._modalEl) return this._modalEl;
        this._modalEl = document.getElementById('cyber-modal');
        if (!this._modalEl) {
            console.warn('[CyberModal] #cyber-modal element not found in DOM');
        }
        return this._modalEl;
    }

    /**
     * Show a confirm dialog.
     * @param {string} message - The message to display
     * @param {string} [confirmLabel='CONFIRM'] - Label for the confirm button
     * @returns {Promise<boolean>} Resolves true on confirm, false on cancel/Escape
     */
    confirm(message, confirmLabel = 'CONFIRM') {
        return new Promise(resolve => {
            const modal = this._getModal();
            if (!modal) { resolve(window.confirm(message)); return; }

            this._resolveRef = resolve;
            modal.querySelector('.cyber-modal-msg').textContent = message;
            modal.querySelector('#cyber-modal-confirm').textContent = confirmLabel + ' ✓';
            modal.querySelector('#cyber-modal-cancel').classList.remove('hidden');
            modal.classList.remove('hidden');
            modal.querySelector('#cyber-modal-confirm').focus();

            // ESC to cancel
            this._escHandler = (e) => {
                if (e.key === 'Escape') this._resolve(false);
            };
            document.addEventListener('keydown', this._escHandler);
        });
    }

    /**
     * Show an alert (informational) dialog.
     * @param {string} message
     * @returns {Promise<void>}
     */
    alert(message) {
        return new Promise(resolve => {
            const modal = this._getModal();
            if (!modal) { window.alert(message); resolve(); return; }

            this._resolveRef = resolve;
            modal.querySelector('.cyber-modal-msg').textContent = message;
            modal.querySelector('#cyber-modal-confirm').textContent = 'ACKNOWLEDGED ✓';
            modal.querySelector('#cyber-modal-cancel').classList.add('hidden');
            modal.classList.remove('hidden');
            modal.querySelector('#cyber-modal-confirm').focus();

            this._escHandler = (e) => {
                if (e.key === 'Escape') this._resolve(true);
            };
            document.addEventListener('keydown', this._escHandler);
        });
    }

    _resolve(value) {
        const modal = this._getModal();
        if (modal) modal.classList.add('hidden');
        if (this._escHandler) {
            document.removeEventListener('keydown', this._escHandler);
            this._escHandler = null;
        }
        if (this._resolveRef) {
            this._resolveRef(value);
            this._resolveRef = null;
        }
    }

    /** Wire the modal buttons — call once after DOM is ready */
    init() {
        const modal = this._getModal();
        if (!modal) return;

        modal.querySelector('#cyber-modal-confirm').addEventListener('click', () => this._resolve(true));
        modal.querySelector('#cyber-modal-cancel').addEventListener('click',  () => this._resolve(false));

        // Click backdrop to cancel
        modal.addEventListener('click', (e) => {
            if (e.target === modal) this._resolve(false);
        });
    }
}

export const CyberModalService = new CyberModalServiceClass();
