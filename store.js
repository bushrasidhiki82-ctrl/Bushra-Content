/* ===== Data layer =====
   The ONLY file that touches storage. To move to Firebase/Supabase later,
   replace load() and save() with calls to your cloud database (make them async
   and `await` them in app.js boot). Everything else stays the same. */
window.CH = window.CH || {};
CH.store = {
  key: 'creatorhub:v1',
  load() { try { return JSON.parse(localStorage.getItem(this.key)); } catch (e) { return null; } },
  save(state) { try { localStorage.setItem(this.key, JSON.stringify(state)); } catch (e) { /* storage blocked */ } }
};
