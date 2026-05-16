(function() {
    if (document.getElementById('clicker-game-container')) {
        console.log('Clicker game already running.');
        return;
    }

    // --- Styling & Animations ---
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0% { transform: scale(1); } 50% { transform: scale(1.05); } 100% { transform: scale(1); } }
        @keyframes slideIn { from { transform: translateX(-20px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        .game-tab-content { animation: fadeIn 0.3s ease-out; }
        .sidebar-btn { transition: all 0.2s; }
        .sidebar-btn:hover { background: #475569 !important; transform: translateX(5px); }
        .sidebar-btn.active { background: #6366f1 !important; border-left: 4px solid #fff; }
        .game-btn { transition: transform 0.1s; }
        .game-btn:active { transform: scale(0.95); }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #1e293b; }
        ::-webkit-scrollbar-thumb { background: #475569; border-radius: 3px; }
        .world-node { padding: 15px; background: #1e293b; border-radius: 12px; margin-bottom: 10px; border: 1px solid #334155; }
        .skill-card { padding: 15px; background: #1e293b; border-radius: 12px; margin-bottom: 10px; border: 1px solid #334155; display: flex; justify-content: space-between; align-items: center; }
        .settings-row { display: flex; justify-content: space-between; align-items: center; padding: 12px; border-bottom: 1px solid #334155; }
        .settings-label { font-weight: bold; }
        .settings-value { color: #94a3b8; }
        .toggle-switch { width: 50px; height: 24px; background: #334155; border-radius: 12px; border: none; cursor: pointer; position: relative; transition: background 0.2s; }
        .toggle-switch.on { background: #10b981; }
        .toggle-switch::after { content: ''; position: absolute; width: 20px; height: 20px; background: white; border-radius: 10px; top: 2px; left: 2px; transition: left 0.2s; }
        .toggle-switch.on::after { left: 28px; }
        .color-input { width: 40px; height: 40px; border: 1px solid #334155; border-radius: 6px; cursor: pointer; }
        .key-input { padding: 8px; border: 1px solid #334155; border-radius: 6px; background: #0b1220; color: white; width: 100px; text-align: center; font-weight: bold; }
        .key-recording { border: 2px solid #f59e0b !important; }
    `;
    document.head.appendChild(style);

    // --- Number Formatting ---
    const suffixes = ["", "K", "M", "B", "T", "Qd", "Qn", "Sx", "Sp", "Oc", "No", "De", "UDe", "DDe", "TDe", "QaDe", "QiDe", "SxDe", "SpDe", "OcDe", "NoDe", "Vg", "UVg", "DVg", "TVg", "QaVg", "QiVg", "SxVg", "SpVg", "OcVg", "NoVg", "Tg", "UTg", "DTg", "TTg", "QaTg", "QiTg", "SxTg", "SpTg", "OcTg", "NoTg", "Qa", "UQa", "DQa", "TQa", "QaQa", "QiQa", "SxQa", "SpQa", "OcQa", "NoQa", "Qi", "UQi", "DQi", "TQi", "QaQi", "QiQi", "SxQi", "SpQi", "OcQi", "NoQi", "Se", "USe", "DSe", "TSe", "QaSe", "QiSe", "SxSe", "SpSe", "OcSe", "NoSe", "Sg", "USg", "DSg", "TSg", "QaSg", "QiSg", "SxSg", "SpSg", "OcSg", "NoSg", "Og", "UOg", "DOg", "TOg", "QaOg", "QiOg", "SxOg", "SpOg", "OcOg", "NoOg", "Ng", "UNg", "DNg", "TNg", "QaNg", "QiNg", "SxNg", "SpNg", "OcNg", "NoNg", "Ce", "UCe", "DCe", "TCe", "QdCe", "QnCe", "SxCe", "SpCe", "OcCe", "NoCe", "DC", "UDC", "DDC", "TDC", "QdDC", "QnDC", "SxDC", "SpDC", "OcDC", "NoDC", "TC", "UTC", "DTC", "TTC", "QdTC", "QnTC", "SxTC", "SpTC", "OcTC", "NoTC", "QdC", "UQdC", "DQdC", "TQdC", "QdQdC", "QnQdC", "SxQdC", "SpQdC", "OcQdC", "NoQdC", "QnC", "UQnC", "DQnC", "TQnC", "QdQnC", "QnQnC", "SxQnC", "SpQnC", "OcQnC", "NoQnC", "SxC", "USxC", "DSxC", "TSxC", "QdSxC", "QnSxC", "SxSxC", "SpSxC", "OcSxC", "NoSxC", "SpC", "USpC", "DSpC", "TSpC", "QdSpC", "QnSpC", "SxSpC", "SpSpC", "OcSpC", "NoSpC", "OcC", "UOcC", "DOcC", "TOcC", "QdOcC", "QnOcC", "SxOcC", "SpOcC", "OcOcC", "NoOcC", "NoC", "UNoC", "DNoC", "TNoC", "QdNoC", "QnNoC", "SxNoC", "SpNoC", "OcNoC", "NoNoC", "Mi", "Mi-M", "Mi-B", "Mi-T", "DMi", "TMi", "QdMi", "QnMi", "SxMi", "SpMi", "OcMi", "NoMi", "DeMi", "VgMi", "TgMi", "QaMi", "QiMi", "SeMi", "SgMi", "OgMi", "NgMi", "CeMi", "DCeMi", "TCeMi", "Mc", "Na", "Pi", "Fe", "At", "Ze", "Yo", "Xo", "Ve"];

    const formatNumber = (num) => {
        if (num === 0) return "0";
        if (num < 1000) return num.toFixed(1).replace(/\.0$/, "");
        const exponent = Math.floor(Math.log10(Math.abs(num)) / 3);
        const suffix = suffixes[exponent] || `e${exponent * 3}`;
        const shortValue = num / Math.pow(10, exponent * 3);
        return shortValue.toFixed(2).replace(/\.00$/, "") + suffix;
    };

    // --- Settings State ---
    let settings = {
        autoSave: true,
        autoClick: false,
        soundEnabled: false,
        darkMode: true,
        updateSpeed: 100,
        showNotifications: true,
        hideKey: 'e',
        hideCtrl: true,
        hideShift: false,
        hideAlt: false
    };

    // Load settings from localStorage
    const loadSettings = () => {
        const saved = localStorage.getItem('ascension_clicker_settings');
        if (saved) {
            try {
                settings = { ...settings, ...JSON.parse(saved) };
            } catch(e) {}
        }
    };
    loadSettings();

    const saveSettings = () => {
        localStorage.setItem('ascension_clicker_settings', JSON.stringify(settings));
    };

    const getHideKeyCombo = () => {
        const parts = [];
        if (settings.hideCtrl) parts.push('Ctrl');
        if (settings.hideShift) parts.push('Shift');
        if (settings.hideAlt) parts.push('Alt');
        parts.push(settings.hideKey.toUpperCase());
        return parts.join('+');
    };

    // --- State ---
    let score = 0, coins = 0, diamonds = 0, dragonCoins = 0, ancientDiamonds = 0;
    let totalClicks = 0, totalScoreEver = 0, rebirths = 0, artifactLevel = 1, labResearchLevel = 0;
    let currentTab = 'Clicker', currentSubStore = null, isVisible = true;
    let isDragging = false, dragStartX, dragStartY;
    let recordingKey = false;

    // Skills state
    let skills = [
        { name: "Fast Clicks", level: 0, cost: 5, effect: 0.1, type: "ancient" },
        { name: "Diamond Luck", level: 0, cost: 10, effect: 0.05, type: "ancient" },
        { name: "Dragon Breath", level: 0, cost: 20, effect: 0.5, type: "ancient" },
        { name: "Ancient Wisdom", level: 0, cost: 50, effect: 0.2, type: "ancient" },
        { name: "Void Siphoning", level: 0, cost: 100, effect: 0.15, type: "ancient" },
        { name: "Stellar Focus", level: 0, cost: 250, effect: 0.3, type: "ancient" },
        { name: "Omniscient Vision", level: 0, cost: 500, effect: 0.5, type: "ancient" }
    ];

    // World state
    let worlds = [
        { name: "Grasslands", mult: 1, cost: 0, unlocked: true },
        { name: "Frozen Tundra", mult: 5, cost: 1e9, unlocked: false },
        { name: "Volcanic Peaks", mult: 25, cost: 1e15, unlocked: false },
        { name: "Void Rift", mult: 100, cost: 1e25, unlocked: false },
        { name: "Celestial Realm", mult: 1000, cost: 1e40, unlocked: false },
        { name: "Aetherial Plane", mult: 5000, cost: 1e60, unlocked: false },
        { name: "Cyber Hub", mult: 25000, cost: 1e85, unlocked: false },
        { name: "The Singularity", mult: 100000, cost: 1e110, unlocked: false },
        { name: "Omniverse Core", mult: 1000000, cost: 1e150, unlocked: false }
    ];
    let currentWorldIdx = 0;

    const bookPrefixes = ["Flame", "Tide", "Storm", "Gale", "Void", "Solar", "Lunar", "Star", "Terra", "Frost", "Shadow", "Light", "Abyss", "Zenith", "Nova", "Cosmic", "Primal", "Ancient", "Mystic", "Divine"];
    const ringPrefixes = ["Onyx", "Ruby", "Gold", "Jade", "Steel", "Void", "Sun", "Moon", "Bone", "Soul", "Emerald", "Sapphire", "Diamond", "Plasma", "Ether", "Iron", "Bronze", "Silver", "Crystal", "Spirit"];
    const botPrefixes = ["Nano", "Cyber", "Gear", "Mech", "Void", "Quantum", "Steam", "Logic", "Pulse", "Core", "Drift", "Flux", "Shift", "Grid", "Vertex", "Hyper", "Titan", "Zen", "Omen", "Aero"];
    const relicPrefixes = ["Ancient", "Runed", "Sunlit", "Duskworn", "Echo", "Elder", "Runic", "Prime", "Void", "Celest", "Iron", "Storm", "Nether", "Galefire", "Solaris", "Luminous", "Obsidian", "Mirage", "Tempest", "Abyssal"];
    const glyphPrefixes = ["Sigil", "Rune", "Mark", "Cipher", "Script", "Glyph", "Seal", "Writ", "Tablet", "Insignia", "Glyphic", "Orb", "Fragment", "Shard", "Etching", "Carving", "Lattice", "Matrix", "Mote", "Essence"];

    const generateCollection = (type, prefixes, count, costBase, multBase) => {
        return Array.from({length: count}, (_, i) => ({
            id: `${type}_${i}`,
            name: `${prefixes[i % prefixes.length]} ${suffixes[Math.floor(i/prefixes.length)] || 'Omega'} ${type}`,
            nameLower: `${prefixes[i % prefixes.length]} ${suffixes[Math.floor(i/prefixes.length)] || 'Omega'} ${type}`.toLowerCase(),
            owned: false,
            mult: multBase + (i * 0.8),
            cost: Math.floor(costBase * Math.pow(1.6, i)),
            level: 1
        }));
    };

    let books = generateCollection("Book", bookPrefixes, 300, 100, 1.2);
    let rings = generateCollection("Ring", ringPrefixes, 300, 500, 1.5);
    let autoBots = generateCollection("Bot", botPrefixes, 300, 50, 0.5);
    let relics = generateCollection("Relic", relicPrefixes, 300, 10000, 2.5);
    let glyphs = generateCollection("Glyph", glyphPrefixes, 300, 7500, 1.8);

    let auras = Array.from({length: 300}, (_, i) => ({
        id: `Aura_${i}`,
        name: `Aura of ${suffixes[i] || 'Infinity'}`,
        nameLower: `aura of ${suffixes[i] || 'infinity'}`,
        owned: false,
        mult: 5.0 + (i * 8),
        cost: Math.floor(2000 * Math.pow(2.1, i)),
        level: 1
    }));

    const artifactTypes = [
        { name: 'Sword', icon: '⚔️' },
        { name: 'Bow', icon: '🏹' },
        { name: 'Spear', icon: '🔱' },
        { name: 'Battleaxe', icon: '🪓' },
        { name: 'Wand', icon: '🪄' },
        { name: 'Staff', icon: '🦯' },
        { name: 'Goblet', icon: '🍷' }
    ];
    let selectedArtifactType = 'Sword';

    const haloTypes = [
        { id: 'alpha', name: 'Alpha Halo', ability: 'Speed Surge (x5 Autoclick)', duration: 30, cost: 5000000 },
        { id: 'beta', name: 'Beta Halo', ability: 'Diamond Glitch (x10 Diamonds)', duration: 20, cost: 10000000 },
        { id: 'gamma', name: 'Gamma Halo', ability: 'Coin Shower (x20 Coins)', duration: 20, cost: 25000000 },
        { id: 'delta', name: 'Delta Halo', ability: 'Ancient Echo (x5 Ancient Diamonds)', duration: 15, cost: 50000000 },
        { id: 'epsilon', name: 'Epsilon Halo', ability: 'Merchant Greed (50% Discount)', duration: 40, cost: 100000000 }
    ];
    let ownedHalos = [];
    let activeHalo = null;
    let haloTimer = 0;

    // --- Persistence ---
    const saveGame = () => {
        if (!settings.autoSave) return;
        const state = { score, coins, diamonds, dragonCoins, ancientDiamonds, totalClicks, totalScoreEver, rebirths, artifactLevel, labResearchLevel, skills, worlds, currentWorldIdx, books, rings, autoBots, auras, relics, glyphs, quests, selectedArtifactType, ownedHalos };
        localStorage.setItem('ascension_clicker_save', JSON.stringify(state));
    };

    const loadGame = () => {
        const saved = localStorage.getItem('ascension_clicker_save');
        if (saved) {
            try {
                const s = JSON.parse(saved);
                score = s.score; coins = s.coins; diamonds = s.diamonds; dragonCoins = s.dragonCoins; ancientDiamonds = s.ancientDiamonds;
                totalClicks = s.totalClicks; totalScoreEver = s.totalScoreEver; rebirths = s.rebirths; artifactLevel = s.artifactLevel;
                labResearchLevel = s.labResearchLevel; skills = s.skills; worlds = s.worlds; currentWorldIdx = s.currentWorldIdx;
                books = s.books; rings = s.rings; autoBots = s.autoBots; auras = s.auras; relics = s.relics; glyphs = s.glyphs; quests = s.quests;
                selectedArtifactType = s.selectedArtifactType || 'Sword'; ownedHalos = s.ownedHalos || [];
            } catch(e) {}
        }
    };
    loadGame();

    setInterval(saveGame, 5000);

    const questDefinitions = [
        { name: "First Steps", goal: 10, reward: 5 },
        { name: "Novice Clicker", goal: 50, reward: 15 },
        { name: "Persistent Player", goal: 200, reward: 50 },
        { name: "Score Collector", goal: 1000, reward: 200 },
        { name: "Fortune Seeker", goal: 5000, reward: 1000 },
        { name: "Wealthy Merchant", goal: 25000, reward: 5000 },
        { name: "Coin Master", goal: 100000, reward: 20000 },
        { name: "Diamond Miner", goal: 500000, reward: 100000 },
        { name: "Ancient Relic", goal: 2500000, reward: 500000 },
        { name: "Ascension Ready", goal: 10000000, reward: 2000000 }
    ];

    let quests = questDefinitions.map((q, i) => ({
        id: i, ...q, completed: false
    }));

    // --- Logic ---
    const getMultiplier = () => {
        let m = 1;
        [books, rings, auras, relics, glyphs].forEach(l => l.forEach(i => { if (i.owned) m *= i.mult * (1 + (i.level-1)*0.1); }));
        const worldMult = worlds[currentWorldIdx].mult;
        const skillMult = 1 + (skills[0].level * skills[0].effect);
        const artifactBonus = (artifactLevel - 1) * 0.5;
        const rebirthBonus = rebirths;
        return m * (1 + artifactBonus) * (1 + rebirthBonus) * worldMult * skillMult;
    };

    const getCPS = () => {
        let c = 0;
        autoBots.forEach(i => { if (i.owned) c += i.mult * (1 + (i.level-1)*0.1); });
        const boost = (activeHalo === 'alpha') ? 5 : 1;
        return c * getMultiplier() * boost;
    };

    const updateDisplay = () => {
        if (!isVisible) return;
        scoreDisplay.textContent = formatNumber(score);
        currencyDisplay.textContent = `Coins: ${formatNumber(coins)} | Diamonds: ${formatNumber(diamonds)} | Dragon Coins: ${formatNumber(dragonCoins)} | Ancient Diamonds: ${formatNumber(ancientDiamonds)}`;
        multStat.textContent = `Multiplier: x${formatNumber(getMultiplier())}`;
        cpsStat.textContent = `CPS: ${formatNumber(getCPS())}${activeHalo ? ' (BOOSTED)' : ''}`;
       
        document.querySelectorAll('.game-tab-content').forEach(el => el.style.display = 'none');
        document.getElementById(`tab-content-${currentTab}`).style.display = 'block';
       
        if (currentTab === 'Store') {
            storeMainUI.style.display = currentSubStore ? 'none' : 'block';
            subStoreUI.style.display = currentSubStore ? 'block' : 'none';
            if (currentSubStore) renderSubStore();
            else renderStoreMain();
        } else {
            const renderFn = { Stats: renderStats, Rebirth: renderRebirth, Artifact: renderArtifact, Labs: renderLabs, Quests: renderQuests, Skills: renderSkills, World: renderWorld, Settings: renderSettings };
            if (renderFn[currentTab]) renderFn[currentTab]();
        }
    };

    const renderStoreMain = () => {
        storeMainUI.textContent = '';
        const grid = document.createElement('div');
        Object.assign(grid.style, { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' });
       
        addCat('Auto-Bots', 'auto', '#6366f1', grid);
        addCat('Arcane Books', 'books', '#a855f7', grid);
        addCat('Power Rings', 'rings', '#ec4899', grid);
        addCat('Soul Auras', 'auras', '#f43f5e', grid);
        addCat('Relics', 'relics', '#ef4444', grid);
        addCat('Glyphs', 'glyphs', '#06b6d4', grid);
        if (rebirths >= 1) addCat('Divine Halos', 'halos', '#fbbf24', grid);
       
        storeMainUI.appendChild(grid);
    };

    const renderSubStore = () => {
        subStoreList.textContent = '';
        if (currentSubStore === 'halos') { renderHalos(); return; }
       
        let list = { books, rings, auras, auto: autoBots, relics, glyphs }[currentSubStore];
        const fragment = document.createDocumentFragment();
       
        list.forEach((item, i) => {
            const row = document.createElement('div');
            Object.assign(row.style, { padding: '12px', marginBottom: '8px', background: item.owned ? '#064e3b' : '#1e293b', borderRadius: '8px', border: '1px solid #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center' });
           
            const info = document.createElement('div');
            const nameEl = document.createElement('div');
            nameEl.style.fontWeight = 'bold';
            nameEl.textContent = item.name;
            const detailsEl = document.createElement('div');
            detailsEl.style.fontSize = '11px';
            detailsEl.style.opacity = '0.7';
           
            let displayCost = item.cost;
            if (activeHalo === 'epsilon') displayCost *= 0.5;
           
            detailsEl.textContent = `Level ${item.level} | Cost: ${formatNumber(displayCost)}`;
            info.appendChild(nameEl);
            info.appendChild(detailsEl);
            row.appendChild(info);

            const btn = document.createElement('button');
            btn.textContent = item.owned ? 'UPGRADE' : 'BUY';
            btn.className = 'game-btn';
            Object.assign(btn.style, { padding: '6px 12px', background: '#6366f1', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' });
            btn.onclick = (e) => {
                e.stopPropagation();
                let actualCost = item.cost;
                if (activeHalo === 'epsilon') actualCost *= 0.5;
                if (score >= actualCost) {
                    score -= actualCost;
                    if (!item.owned) { item.owned = true; if (currentSubStore === 'auras') dragonCoins++; }
                    else item.level++;
                    item.cost *= 1.6;
                    updateDisplay();
                }
            };
            row.appendChild(btn);
            fragment.appendChild(row);
        });
        subStoreList.appendChild(fragment);
    };

    const renderHalos = () => {
        haloTypes.forEach(h => {
            const row = document.createElement('div');
            Object.assign(row.style, { padding: '12px', marginBottom: '8px', background: '#1e293b', borderRadius: '8px', border: '1px solid #fbbf24', display: 'flex', justifyContent: 'space-between', alignItems: 'center' });
            const info = document.createElement('div');
            info.innerHTML = `<b>${h.name}</b><div style="font-size:10px; color:#fbbf24">${h.ability}</div>`;
            row.appendChild(info);

            const btn = document.createElement('button');
            const owned = ownedHalos.includes(h.id);
            btn.textContent = owned ? (activeHalo === h.id ? `ACTIVE (${Math.ceil(haloTimer)}s)` : 'ACTIVATE') : `BUY (${formatNumber(h.cost)})`;
            Object.assign(btn.style, { padding: '6px 10px', background: owned ? '#059669' : '#fbbf24', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '11px', color: 'white' });
            btn.onclick = () => {
                if (owned) { if (!activeHalo) { activeHalo = h.id; haloTimer = h.duration; } }
                else if (score >= h.cost) { score -= h.cost; ownedHalos.push(h.id); updateDisplay(); }
            };
            row.appendChild(btn);
            subStoreList.appendChild(row);
        });
    };

    const renderStats = () => {
        const tab = document.getElementById('tab-content-Stats');
        tab.textContent = '';
        const title = document.createElement('h2');
        Object.assign(title.style, { color: '#6366f1', marginBottom: '15px' });
        title.textContent = 'Hall of Fame';
        tab.appendChild(title);

        const box = document.createElement('div');
        Object.assign(box.style, { background: '#1e293b', padding: '15px', borderRadius: '10px', lineHeight: '2' });
       
        const lines = [
            `Lifetime Clicks: ${formatNumber(totalClicks)}`,
            `Total Fortune: ${formatNumber(totalScoreEver)}`,
            `Ascensions: ${rebirths}`,
            `Artifact Power: Lv. ${artifactLevel}`,
            `Current World: ${worlds[currentWorldIdx].name}`
        ];
        lines.forEach(l => {
            const d = document.createElement('div');
            d.textContent = l;
            box.appendChild(d);
        });
        tab.appendChild(box);
    };

    const renderRebirth = () => {
        const tab = document.getElementById('tab-content-Rebirth');
        tab.textContent = '';
        const cost = 1e6 * Math.pow(10, rebirths);
        const can = score >= cost;

        const title = document.createElement('h2');
        Object.assign(title.style, { color: '#ef4444', marginBottom: '15px' });
        title.textContent = 'Ascension';
        tab.appendChild(title);

        const desc = document.createElement('p');
        Object.assign(desc.style, { opacity: '0.8', marginBottom: '20px' });
        desc.textContent = 'Shed your current form for ultimate power. Resets score/items for permanent +100% bonus.';
        tab.appendChild(desc);

        const box = document.createElement('div');
        Object.assign(box.style, { background: '#1e293b', padding: '20px', borderRadius: '10px', textAlign: 'center' });
       
        const need = document.createElement('div');
        need.style.marginBottom = '10px';
        need.textContent = `Need: ${formatNumber(cost)} Score`;
        box.appendChild(need);

        const btn = document.createElement('button');
        btn.textContent = 'ASCEND';
        btn.className = 'game-btn';
        Object.assign(btn.style, { width: '100%', padding: '15px', background: can ? '#ef4444' : '#334155', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' });
        btn.onclick = () => { if (can) { rebirths++; score = 0; [books, rings, auras, autoBots, relics, glyphs].forEach(l => l.forEach(i => i.owned = false)); updateDisplay(); } };
        box.appendChild(btn);
        tab.appendChild(box);
    };

    const renderArtifact = () => {
        const tab = document.getElementById('tab-content-Artifact');
        tab.textContent = '';
        const cost = 10 * artifactLevel;

        const title = document.createElement('h2');
        Object.assign(title.style, { color: '#f59e0b', marginBottom: '15px' });
        title.textContent = 'Holy Altar';
        tab.appendChild(title);

        const sel = document.createElement('div');
        Object.assign(sel.style, { display: 'flex', gap: '5px', marginBottom: '15px', flexWrap: 'wrap' });
        artifactTypes.forEach(t => {
            const b = document.createElement('button');
            b.textContent = `${t.icon} ${t.name}`;
            Object.assign(b.style, { padding: '5px 10px', background: selectedArtifactType === t.name ? '#f59e0b' : '#334155', border: 'none', borderRadius: '4px', cursor: 'pointer', color: 'white', fontSize: '11px' });
            b.onclick = () => { selectedArtifactType = t.name; renderArtifact(); };
            sel.appendChild(b);
        });
        tab.appendChild(sel);

        const box = document.createElement('div');
        Object.assign(box.style, { background: '#1e293b', padding: '20px', borderRadius: '10px', textAlign: 'center', marginBottom: '15px' });
        const icon = document.createElement('div');
        icon.style.fontSize = '32px';
        icon.textContent = artifactTypes.find(t => t.name === selectedArtifactType).icon;
        box.appendChild(icon);
        const lv = document.createElement('h3');
        lv.textContent = `${selectedArtifactType} Level ${artifactLevel}`;
        box.appendChild(lv);
        const bonus = document.createElement('p');
        bonus.textContent = `Bonus: +${((artifactLevel - 1) * 50).toFixed(0)}%`;
        box.appendChild(bonus);
        tab.appendChild(box);

        const btn = document.createElement('button');
        btn.textContent = `Upgrade (${cost} Dragon Coins)`;
        Object.assign(btn.style, { width: '100%', padding: '12px', background: '#f59e0b', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' });
        btn.onclick = () => { if (dragonCoins >= cost) { dragonCoins -= cost; artifactLevel++; updateDisplay(); } };
        tab.appendChild(btn);
    };

    const renderLabs = () => {
        const tab = document.getElementById('tab-content-Labs');
        tab.textContent = '';
        const cost = 10 * (labResearchLevel + 1);

        const title = document.createElement('h2');
        Object.assign(title.style, { color: '#10b981', marginBottom: '15px' });
        title.textContent = 'Science Lab';
        tab.appendChild(title);

        const desc = document.createElement('p');
        desc.style.marginBottom = '15px';
        desc.textContent = 'Inject diamonds for efficiency breakthroughs.';
        tab.appendChild(desc);

        const box = document.createElement('div');
        Object.assign(box.style, { background: '#1e293b', padding: '20px', borderRadius: '10px', textAlign: 'center' });
       
        const btn = document.createElement('button');
        btn.textContent = `Research (Cost: ${cost} Diamonds)`;
        Object.assign(btn.style, { width: '100%', padding: '12px', background: '#10b981', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' });
        btn.onclick = () => { if (diamonds >= cost) { diamonds -= cost; labResearchLevel++; updateDisplay(); } };
        box.appendChild(btn);

        const eff = document.createElement('div');
        Object.assign(eff.style, { marginTop: '10px', opacity: '0.7' });
        eff.textContent = `Lab Efficiency: +${labResearchLevel * 5}%`;
        box.appendChild(eff);
        tab.appendChild(box);
    };

    const renderQuests = () => {
        const tab = document.getElementById('tab-content-Quests');
        tab.textContent = '';
        const title = document.createElement('h2');
        Object.assign(title.style, { color: '#8b5cf6', marginBottom: '15px' });
        title.textContent = 'Quests';
        tab.appendChild(title);

        const scroll = document.createElement('div');
        quests.forEach(q => {
            const d = document.createElement('div');
            Object.assign(d.style, { padding: '10px', borderBottom: '1px solid #334155', display: 'flex', justifyContent: 'space-between', opacity: q.completed ? '0.5' : '1' });
           
            const n = document.createElement('span');
            n.textContent = q.name;
            const r = document.createElement('span');
            r.textContent = q.completed ? 'Completed' : `Reward: ${q.reward}c`;
           
            d.appendChild(n);
            d.appendChild(r);
            scroll.appendChild(d);
        });
        tab.appendChild(scroll);
    };

    const renderSkills = () => {
        const tab = document.getElementById('tab-content-Skills');
        tab.textContent = '';
        const title = document.createElement('h2');
        Object.assign(title.style, { color: '#06b6d4', marginBottom: '15px' });
        title.textContent = 'Ancient Skills';
        tab.appendChild(title);

        skills.forEach(skill => {
            const card = document.createElement('div');
            card.className = 'skill-card';
           
            const info = document.createElement('div');
            const name = document.createElement('div');
            name.style.fontWeight = 'bold';
            name.textContent = `${skill.name} (Lv. ${skill.level})`;
            const bonus = document.createElement('div');
            bonus.style.fontSize = '12px';
            bonus.style.opacity = '0.7';
            bonus.textContent = `Effect: +${(skill.level * skill.effect * 100).toFixed(0)}%`;
            info.appendChild(name);
            info.appendChild(bonus);
           
            const btn = document.createElement('button');
            btn.textContent = `Upgrade (${skill.cost} Ancient Diamonds)`;
            Object.assign(btn.style, { padding: '8px 12px', background: '#06b6d4', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '11px' });
            btn.onclick = () => {
                if (ancientDiamonds >= skill.cost) {
                    ancientDiamonds -= skill.cost;
                    skill.level++;
                    skill.cost = Math.floor(skill.cost * 2.5);
                    updateDisplay();
                }
            };
           
            card.appendChild(info);
            card.appendChild(btn);
            tab.appendChild(card);
        });
    };

    const renderWorld = () => {
        const tab = document.getElementById('tab-content-World');
        tab.textContent = '';
        const title = document.createElement('h2');
        Object.assign(title.style, { color: '#f43f5e', marginBottom: '15px' });
        title.textContent = 'Dimensional Map';
        tab.appendChild(title);

        worlds.forEach((w, idx) => {
            const node = document.createElement('div');
            node.className = 'world-node';
            if (currentWorldIdx === idx) node.style.borderColor = '#f43f5e';
           
            const info = document.createElement('div');
            info.style.fontWeight = 'bold';
            info.textContent = `${w.name} ${w.unlocked ? '' : '(LOCKED)'}`;
           
            const bonus = document.createElement('div');
            bonus.style.fontSize = '12px';
            bonus.style.opacity = '0.7';
            bonus.textContent = `Multiplier: x${w.mult}`;
           
            node.appendChild(info);
            node.appendChild(bonus);

            if (!w.unlocked) {
                const btn = document.createElement('button');
                btn.textContent = `Unlock (${formatNumber(w.cost)} Score)`;
                Object.assign(btn.style, { width: '100%', marginTop: '10px', padding: '8px', background: '#f43f5e', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' });
                btn.onclick = () => {
                    if (score >= w.cost) {
                        score -= w.cost;
                        w.unlocked = true;
                        updateDisplay();
                    }
                };
                node.appendChild(btn);
            } else if (currentWorldIdx !== idx) {
                const btn = document.createElement('button');
                btn.textContent = `Travel To`;
                Object.assign(btn.style, { width: '100%', marginTop: '10px', padding: '8px', background: '#334155', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' });
                btn.onclick = () => {
                    currentWorldIdx = idx;
                    updateDisplay();
                };
                node.appendChild(btn);
            } else {
                const active = document.createElement('div');
                active.style.marginTop = '10px';
                active.style.fontSize = '11px';
                active.style.color = '#f43f5e';
                active.textContent = 'CURRENT WORLD';
                node.appendChild(active);
            }
           
            tab.appendChild(node);
        });
    };

    const renderSettings = () => {
        const tab = document.getElementById('tab-content-Settings');
        tab.textContent = '';
        const title = document.createElement('h2');
        Object.assign(title.style, { color: '#6366f1', marginBottom: '15px' });
        title.textContent = 'Settings';
        tab.appendChild(title);

        // Auto Save
        const autoSaveRow = document.createElement('div');
        autoSaveRow.className = 'settings-row';
        const autoSaveLabel = document.createElement('div');
        autoSaveLabel.className = 'settings-label';
        autoSaveLabel.textContent = 'Auto Save';
        const autoSaveToggle = document.createElement('button');
        autoSaveToggle.className = 'toggle-switch' + (settings.autoSave ? ' on' : '');
        autoSaveToggle.onclick = () => {
            settings.autoSave = !settings.autoSave;
            autoSaveToggle.classList.toggle('on');
            saveSettings();
        };
        autoSaveRow.appendChild(autoSaveLabel);
        autoSaveRow.appendChild(autoSaveToggle);
        tab.appendChild(autoSaveRow);

        // Auto Click
        const autoClickRow = document.createElement('div');
        autoClickRow.className = 'settings-row';
        const autoClickLabel = document.createElement('div');
        autoClickLabel.className = 'settings-label';
        autoClickLabel.textContent = 'Auto Click';
        const autoClickToggle = document.createElement('button');
        autoClickToggle.className = 'toggle-switch' + (settings.autoClick ? ' on' : '');
        autoClickToggle.onclick = () => {
            settings.autoClick = !settings.autoClick;
            autoClickToggle.classList.toggle('on');
            saveSettings();
        };
        autoClickRow.appendChild(autoClickLabel);
        autoClickRow.appendChild(autoClickToggle);
        tab.appendChild(autoClickRow);

        // Sound
        const soundRow = document.createElement('div');
        soundRow.className = 'settings-row';
        const soundLabel = document.createElement('div');
        soundLabel.className = 'settings-label';
        soundLabel.textContent = 'Sound Effects';
        const soundToggle = document.createElement('button');
        soundToggle.className = 'toggle-switch' + (settings.soundEnabled ? ' on' : '');
        soundToggle.onclick = () => {
            settings.soundEnabled = !settings.soundEnabled;
            soundToggle.classList.toggle('on');
            saveSettings();
        };
        soundRow.appendChild(soundLabel);
        soundRow.appendChild(soundToggle);
        tab.appendChild(soundRow);

        // Update Speed
        const speedRow = document.createElement('div');
        speedRow.className = 'settings-row';
        const speedLabel = document.createElement('div');
        speedLabel.className = 'settings-label';
        speedLabel.textContent = 'Update Speed (ms)';
        const speedInput = document.createElement('input');
        Object.assign(speedInput.style, { padding: '6px', border: '1px solid #334155', borderRadius: '6px', width: '70px', background: '#0b1220', color: 'white' });
        speedInput.type = 'number';
        speedInput.value = settings.updateSpeed;
        speedInput.min = '50';
        speedInput.max = '5000';
        speedInput.onchange = () => {
            settings.updateSpeed = parseInt(speedInput.value) || 100;
            saveSettings();
        };
        speedRow.appendChild(speedLabel);
        speedRow.appendChild(speedInput);
        tab.appendChild(speedRow);

        // Notifications
        const notifRow = document.createElement('div');
        notifRow.className = 'settings-row';
        const notifLabel = document.createElement('div');
        notifLabel.className = 'settings-label';
        notifLabel.textContent = 'Show Notifications';
        const notifToggle = document.createElement('button');
        notifToggle.className = 'toggle-switch' + (settings.showNotifications ? ' on' : '');
        notifToggle.onclick = () => {
            settings.showNotifications = !settings.showNotifications;
            notifToggle.classList.toggle('on');
            saveSettings();
        };
        notifRow.appendChild(notifLabel);
        notifRow.appendChild(notifToggle);
        tab.appendChild(notifRow);

        // Hide Key Combination
        const hideKeyTitle = document.createElement('h3');
        Object.assign(hideKeyTitle.style, { color: '#06b6d4', marginTop: '20px', marginBottom: '10px' });
        hideKeyTitle.textContent = 'Hide UI Hotkey';
        tab.appendChild(hideKeyTitle);

        const keyRow = document.createElement('div');
        Object.assign(keyRow.style, { display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap' });

        const ctrlCheckbox = document.createElement('input');
        ctrlCheckbox.type = 'checkbox';
        ctrlCheckbox.checked = settings.hideCtrl;
        ctrlCheckbox.onchange = () => {
            settings.hideCtrl = ctrlCheckbox.checked;
            saveSettings();
            updateHotkey();
        };
        keyRow.appendChild(ctrlCheckbox);
        keyRow.appendChild(document.createTextNode('Ctrl'));

        const shiftCheckbox = document.createElement('input');
        shiftCheckbox.type = 'checkbox';
        shiftCheckbox.checked = settings.hideShift;
        shiftCheckbox.onchange = () => {
            settings.hideShift = shiftCheckbox.checked;
            saveSettings();
            updateHotkey();
        };
        keyRow.appendChild(shiftCheckbox);
        keyRow.appendChild(document.createTextNode('Shift'));

        const altCheckbox = document.createElement('input');
        altCheckbox.type = 'checkbox';
        altCheckbox.checked = settings.hideAlt;
        altCheckbox.onchange = () => {
            settings.hideAlt = altCheckbox.checked;
            saveSettings();
            updateHotkey();
        };
        keyRow.appendChild(altCheckbox);
        keyRow.appendChild(document.createTextNode('Alt'));

        tab.appendChild(keyRow);

        const keyInputRow = document.createElement('div');
        Object.assign(keyInputRow.style, { display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '15px' });

        const keyLabel = document.createElement('div');
        keyLabel.className = 'settings-label';
        keyLabel.textContent = 'Key:';
        keyInputRow.appendChild(keyLabel);

        const keyInput = document.createElement('input');
        keyInput.className = 'key-input';
        keyInput.value = settings.hideKey.toUpperCase();
        keyInput.maxLength = '1';
        keyInput.readonly = true;
        keyInputRow.appendChild(keyInput);

        const recordBtn = document.createElement('button');
        recordBtn.textContent = recordingKey ? 'LISTENING...' : 'RECORD KEY';
        Object.assign(recordBtn.style, { padding: '8px 12px', background: recordingKey ? '#f59e0b' : '#6366f1', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' });
        recordBtn.onclick = () => {
            recordingKey = !recordingKey;
            if (recordingKey) {
                keyInput.classList.add('key-recording');
                recordBtn.textContent = 'LISTENING...';
                recordBtn.style.background = '#f59e0b';
                const keyListener = (e) => {
                    if (recordingKey && e.key.length === 1) {
                        settings.hideKey = e.key.toLowerCase();
                        keyInput.value = e.key.toUpperCase();
                        recordingKey = false;
                        keyInput.classList.remove('key-recording');
                        recordBtn.textContent = 'RECORD KEY';
                        recordBtn.style.background = '#6366f1';
                        saveSettings();
                        updateHotkey();
                        window.removeEventListener('keydown', keyListener);
                    }
                };
                window.addEventListener('keydown', keyListener);
            }
        };
        keyInputRow.appendChild(recordBtn);
        tab.appendChild(keyInputRow);

        const hotkeyDisplay = document.createElement('div');
        Object.assign(hotkeyDisplay.style, { padding: '8px', background: '#1e293b', borderRadius: '6px', marginBottom: '20px', textAlign: 'center', fontSize: '12px', color: '#94a3b8' });
        hotkeyDisplay.textContent = `Current: ${getHideKeyCombo()}`;
        tab.appendChild(hotkeyDisplay);

        // Danger Zone
        const dangerTitle = document.createElement('h3');
        Object.assign(dangerTitle.style, { color: '#ef4444', marginTop: '20px', marginBottom: '10px' });
        dangerTitle.textContent = 'Danger Zone';
        tab.appendChild(dangerTitle);

        const wipeBtn = document.createElement('button');
        wipeBtn.textContent = 'WIPE ALL DATA';
        Object.assign(wipeBtn.style, { width: '100%', padding: '12px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' });
        wipeBtn.onclick = () => {
            if (confirm('⚠️ PERMANENTLY DELETE ALL GAME DATA? This cannot be undone!')) {
                localStorage.removeItem('ascension_clicker_save');
                localStorage.removeItem('ascension_clicker_settings');
                location.reload();
            }
        };
        tab.appendChild(wipeBtn);

        const exportBtn = document.createElement('button');
        exportBtn.textContent = 'EXPORT SAVE';
        Object.assign(exportBtn.style, { width: '100%', padding: '12px', background: '#10b981', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', marginTop: '8px' });
        exportBtn.onclick = () => {
            const save = localStorage.getItem('ascension_clicker_save');
            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(save || '{}');
            const downloadAnchorNode = document.createElement('a');
            downloadAnchorNode.setAttribute("href", dataStr);
            downloadAnchorNode.setAttribute("download", "ascension_clicker_save.json");
            document.body.appendChild(downloadAnchorNode);
            downloadAnchorNode.click();
            downloadAnchorNode.remove();
        };
        tab.appendChild(exportBtn);
    };

    const updateHotkey = () => {
        // Will be used by the global keydown listener
    };

    // --- Container ---
    const container = document.createElement('div');
    container.id = 'clicker-game-container';
    Object.assign(container.style, { position: 'fixed', top: '10px', left: '10px', zIndex: 10000, width: '480px', height: '640px', backgroundColor: '#0f172a', color: '#f8fafc', border: '1px solid #334155', borderRadius: '16px', display: 'flex', flexDirection: 'column', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)', overflow: 'hidden', animation: 'fadeIn 0.5s ease-out' });
    document.body.appendChild(container);

    const header = document.createElement('div');
    Object.assign(header.style, { padding: '15px', backgroundColor: '#1e293b', cursor: 'grab', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #334155' });
   
    const titleSpan = document.createElement('span');
    Object.assign(titleSpan.style, { fontWeight: '900', letterSpacing: '1px', background: 'linear-gradient(to right, #6366f1, #a855f7)', webkitBackgroundClip: 'text', webkitTextFillColor: 'transparent' });
    titleSpan.textContent = 'ASCENSION CLICKER';
   
    const hint = document.createElement('small');
    Object.assign(hint.style, { opacity: '0.5', fontSize: '10px' });
    hint.textContent = getHideKeyCombo() + ' TO TOGGLE';
   
    header.appendChild(titleSpan);
    header.appendChild(hint);
    container.appendChild(header);

    header.onmousedown = (e) => { isDragging = true; dragStartX = e.clientX - container.offsetLeft; dragStartY = e.clientY - container.offsetTop; };
    window.addEventListener('mousemove', (e) => { if (isDragging) { container.style.left = (e.clientX - dragStartX) + 'px'; container.style.top = (e.clientY - dragStartY) + 'px'; } });
    window.addEventListener('mouseup', () => isDragging = false);
    window.addEventListener('keydown', (e) => {
        const keyMatches = e.key.toLowerCase() === settings.hideKey.toLowerCase();
        const ctrlMatches = settings.hideCtrl ? e.ctrlKey : !e.ctrlKey;
        const shiftMatches = settings.hideShift ? e.shiftKey : !e.shiftKey;
        const altMatches = settings.hideAlt ? e.altKey : !e.altKey;

        if (keyMatches && ctrlMatches && shiftMatches && altMatches && !recordingKey) {
            isVisible = !isVisible;
            container.style.display = isVisible ? 'flex' : 'none';
            hint.textContent = getHideKeyCombo() + ' TO TOGGLE';
        }
    });

    const layout = document.createElement('div');
    layout.style.display = 'flex'; layout.style.flex = '1'; layout.style.overflow = 'hidden';
    container.appendChild(layout);

    const nav = document.createElement('div');
    Object.assign(nav.style, { width: '120px', background: '#1e293b', borderRight: '1px solid #334155', display: 'flex', flexDirection: 'column', padding: '10px', gap: '8px' });
    layout.appendChild(nav);

    const content = document.createElement('div');
    Object.assign(content.style, { flex: '1', padding: '20px', overflowY: 'auto', position: 'relative' });
    layout.appendChild(content);

    const tabs = ['Clicker', 'Store', 'Quests', 'Stats', 'Rebirth', 'Artifact', 'Labs', 'Skills', 'World', 'Settings'];
    tabs.forEach(t => {
        const btn = document.createElement('button');
        btn.textContent = t.toUpperCase();
        btn.className = 'sidebar-btn';
        Object.assign(btn.style, { padding: '10px', fontSize: '11px', fontWeight: 'bold', border: 'none', background: '#334155', color: 'white', borderRadius: '6px', cursor: 'pointer', textAlign: 'left' });
        btn.onclick = () => {
            currentTab = t; currentSubStore = null;
            nav.querySelectorAll('.sidebar-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            updateDisplay();
        };
        if (t === 'Clicker') btn.classList.add('active');
        nav.appendChild(btn);

        const pane = document.createElement('div');
        pane.id = `tab-content-${t}`;
        pane.className = 'game-tab-content';
        pane.style.display = 'none';
        content.appendChild(pane);
    });

    const clickPane = document.getElementById('tab-content-Clicker');
    const scoreDisplay = document.createElement('div');
    Object.assign(scoreDisplay.style, { fontSize: '42px', fontWeight: '900', textAlign: 'center', margin: '15px 0', fontFamily: 'monospace' });
    clickPane.appendChild(scoreDisplay);

    const statsHeader = document.createElement('div');
    Object.assign(statsHeader.style, { display: 'flex', justifyContent: 'space-around', fontWeight: 'bold', color: '#6366f1', fontSize: '14px', marginBottom: '10px' });
    const multStat = document.createElement('span');
    const cpsStat = document.createElement('span');
    statsHeader.appendChild(multStat);
    statsHeader.appendChild(cpsStat);
    clickPane.appendChild(statsHeader);

    const currencyDisplay = document.createElement('div');
    Object.assign(currencyDisplay.style, { textAlign: 'center', fontSize: '12px', color: '#94a3b8', background: '#1e293b', padding: '8px', borderRadius: '8px' });
    clickPane.appendChild(currencyDisplay);

    const mainBtn = document.createElement('button');
    const mainBtnText = document.createElement('b');
    mainBtnText.textContent = 'ASCEND';
    mainBtn.appendChild(mainBtnText);
    Object.assign(mainBtn.style, { width: '100%', height: '140px', marginTop: '30px', background: 'linear-gradient(135deg, #6366f1, #a855f7)', color: 'white', border: 'none', borderRadius: '20px', fontSize: '32px', cursor: 'pointer', boxShadow: '0 10px 20px -5px rgba(99, 102, 241, 0.5)', animation: 'pulse 2s infinite' });
    mainBtn.onclick = () => {
        const v = getMultiplier();
        score += v;
        totalScoreEver += v;
        totalClicks++;
        if (Math.random()<0.1) coins++;
        if (Math.random()<0.05) diamonds++;
        if (Math.random()<0.01) ancientDiamonds++;
        updateDisplay();
    };
    clickPane.appendChild(mainBtn);

    const storePane = document.getElementById('tab-content-Store');
    const storeMainUI = document.createElement('div'); storePane.appendChild(storeMainUI);
    const subStoreUI = document.createElement('div'); storePane.appendChild(subStoreUI);
    const subStoreList = document.createElement('div');
    const backBtn = document.createElement('button');
    backBtn.textContent = '← BACK TO SELECTION';
    Object.assign(backBtn.style, { width: '100%', padding: '10px', background: 'none', border: 'none', color: '#6366f1', cursor: 'pointer', fontWeight: 'bold', marginBottom: '15px' });
    backBtn.onclick = () => { currentSubStore = null; updateDisplay(); };
    subStoreUI.appendChild(backBtn);
    subStoreUI.appendChild(subStoreList);

    const iconsMap = { auto: 'Auto-Bots', books: 'Arcane Books', rings: 'Power Rings', auras: 'Soul Auras', relics: 'Relics', glyphs: 'Glyphs' };
    const addCat = (lbl, id, col, grid) => {
        const b = document.createElement('button');
        const iDiv = document.createElement('div');
        iDiv.style.fontSize = '16px';
        iDiv.style.marginBottom = '5px';
        iDiv.textContent = iconsMap[id];
        const lDiv = document.createElement('div');
        lDiv.textContent = lbl;
        b.appendChild(iDiv);
        b.appendChild(lDiv);
        Object.assign(b.style, { width: '100%', padding: '20px', marginBottom: '12px', background: col, color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold', textAlign: 'center', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' });
        b.onclick = () => { currentSubStore = id; updateDisplay(); };
        grid.appendChild(b);
    };

    setInterval(() => {
        if (haloTimer > 0) { haloTimer--; if (haloTimer <= 0) activeHalo = null; }
        if (settings.autoClick) mainBtn.click();
        const i = getCPS()/10;
        score += i;
        totalScoreEver += i;
        updateDisplay();
    }, settings.updateSpeed);

    updateDisplay();
})();
