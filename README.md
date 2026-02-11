# LexiSync Pro
**A Privacy-First Contextual Thesaurus for Chrome.**

LexiSync Pro is a high-performance browser extension designed to help writers and researchers find the perfect word without breaking their flow. Built with modern **Manifest V3** standards, it offers instant synonym lookups via a sleek, isolated UI.

## Technical Architecture
This project was built to demonstrate extension design patterns:

* **Security & Least Privilege:** Utilizes `activeTab` and `scripting` APIs instead of broad host permissions. The extension only "wakes up" and interacts with the DOM when explicitly summoned by the user.
* **UI Isolation (Shadow DOM):** Injected overlays are wrapped in a **Shadow Root**. This ensures that the extension's styles are never corrupted by the host website's CSS, and vice versa.
* **Performance Optimization:** Includes a `chrome.storage.local` caching layer. If a user looks up the same word twice, the result is served instantly from local storage, bypassing the network request.
* **Event-Driven Background Logic:** The Service Worker manages the context menu and script injection, ensuring the extension consumes **zero** RAM when not in use.

## Key Features
* **Right-Click Lookup:** Highlight any word on any website to see synonyms in a non-intrusive tooltip.
* **Quick-Search Popup:** A dedicated toolbar interface for manual searches with an optimized debounced input.
* **Zero-Tracking:** No analytics, no tracking, and no remote code execution.

## 📂 Project Structure
```text
lexisync-pro/
├── icons/            # Scaled assets for Chrome Web Store
├── manifest.json     # Extension configuration (MV3)
├── background.js     # Service Worker (Event handling & injection)
├── content.js        # Shadow DOM UI & Injection logic
├── popup.html        # Main search interface UI
└── popup.js          # Logic for the manual search bar
```
