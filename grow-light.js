const profiles = {
    leafy: {
        category: 'Leafy Greens',
        examples: 'Lettuce, spinach, kale',
        stages: [
            { key: 'seedling', name: 'Seedling', timeline: 'Days 1–10', ppfd: [100, 150], hours: [16, 18], dli: [6, 10], channels: [35, 40, 15, 0, 5, 1, 4], title: 'A gentle beginning', note: 'High blue prevents leggy stems and builds compact seedlings (Goto et al., 2010; Naznin et al., 2019).' },
            { key: 'vegetative', name: 'Vegetative [Green cultivars]', timeline: 'Days 11-harvest', ppfd: [200, 250], ppfdSetpoint: 250, hours: [16, 18], dli: [12, 16], channels: [45, 25, 16, 4, 4, 0, 6], title: 'Build leafy momentum', note: '2-5% Far-Red boosts leaf expansion & biomass without bolting if PPFD >= 250 and Temp <= 20°C (Zhen & Bugbee, 2021; Frontiers 2024). Above 250-300 PPFD increases risk of tipburn.' },
            { key: 'vegetative', name: 'Vegetative [Red / pigmented]', timeline: 'Days 11-harvest', ppfd: [200, 250], hours: [16, 18], dli: [12, 16], channels: [45, 25, 18, 0, 4, 2, 6], title: 'Bring out leaf color', note: 'Keep Far-Red at 0% for red cultivars. FR reduces anthocyanin red coloration, while Blue and UV stimulate pigmentation (Li & Kubota, 2009; MDPI Plants 2022).' },
            { key: 'flowering', name: 'Flowering (avoid)', timeline: 'Do not use', ppfd: null, hours: null, dli: null, channels: null, title: 'Harvest before flowering', note: 'Excessive Far-Red + warm temps (>24°C) triggers stem elongation/bolting and bitterness (Plants 2023).' }
        ]
    },
    herbs: {
        category: 'Culinary Herbs',
        examples: 'Basil, mint, cilantro, parsley',
        stages: [
            { key: 'seedling', name: 'Seedling', timeline: 'Days 1-14', ppfd: [120, 180], hours: [16, 18], dli: [7, 11], channels: [35, 40, 15, 0, 5, 1, 4], title: 'A bright little start', note: 'Sturdy main stem and early lateral branching under blue-enriched spectrum (Piovene et al., 2015).' },
            { key: 'vegetative', name: 'Vegetative', timeline: 'Days 15-harvest', ppfd: [200, 300], hours: [16, 18], dli: [15, 20], channels: [55, 25, 12, 2, 2, 0, 4], title: 'Grow fragrant leaves', note: 'R:B ration around 70:30 (or 55R:25B + white) at 200-300 PPFD maximizes biomass & essential oils (Dou et al., 2018; Larsen et al., 2020). Continuous UV slows basil growth by 5-9 days (Tabbert et al.). Use UV only 2-3 days before harvesting.' },
            { key: 'flowering', name: 'Flowering (avoid)', timeline: 'Not specified', ppfd: null, hours: null, dli: null, channels: null, title: 'No flowering recipe available', note: '' }
        ]
    },
    vine: {
        category: 'Fruiting Vine Crops',
        examples: 'Tomatoes, peppers, cucumbers',
        stages: [
            { key: 'seedling', name: 'Seedling', timeline: 'Weeks 1-2', ppfd: [200, 300], hours: [16, 18], dli: [12, 18], channels: [35, 40, 15, 0, 5, 1, 4], title: 'Set strong roots', note: 'Blue and red enhances dry matter, chlorophyll density, and transplant survival (Gomez & Mitchell, 2015; SciHort 2026).' },
            { key: 'vegetative', name: 'Vegetative', timeline: 'Weeks 3-5', ppfd: [400, 600], hours: [16, 16], dli: [23, 30], channels: [50, 20, 15, 2, 3, 2, 8], title: 'Grow a sturdy vine', note: 'Rapid canopy expansion. Requires support in vining and oversized air stones in Deep Water Culture (DWC).' },
            { key: 'flowering', name: 'Flowering / fruiting', timeline: 'Week 6+', ppfd: [400, 600], ppfdLabel: '400–600 (Dwarf: 300)', hours: [14, 16], dli: [20, 30], channels: [60, 12, 8, 8, 4, 4, 4], title: 'Support flowers & fruit', note: '400-600 PPFD optimizes tomato yield. Dwarf cultivars peak in radiation-use efficiency at 300 PPFD (Ke et al., 2023). Blue (405-462nm) and UV help suppress Botrytis/powdery mildew (SciHort 2026).' }
        ]
    },
};

const channelInfo = [
    { name: 'Red', color: '#de7567' },
    { name: 'Blue', color: '#667ed2' },
    { name: 'Green', color: '#82a77a' },
    { name: 'Far-red', color: '#986d91' },
    { name: 'Violet', color: '#9276ba' },
    { name: 'UV', color: '#c090c7' },
    { name: 'Yellow / orange', color: '#d8bc73' }
];

const cropSelect = document.getElementById('crop-select');
const stageSelect = document.getElementById('stage-select');
const intensityInput = document.getElementById('intensity');
const hoursInput = document.getElementById('hours');
let currentRecipe;

function selectedProfile() {
    return profiles[cropSelect.value];
}

function selectedRecipe() {
    return selectedProfile().stages[Number(stageSelect.value)];
}

function formatRange(range, suffix = '') {
    if (range[0] === range[1]) return `${range[0]}${suffix}`;
    return `${range[0]}–${range[1]}${suffix}`;
}

function updateStageOptions() {
    const stages = selectedProfile().stages;
    const selectedStageKey = currentRecipe?.key;
    const matchingStage = stages.findIndex(stage => stage.key === selectedStageKey);
    const stageIndex = matchingStage >= 0 ? matchingStage : 0;
    stageSelect.replaceChildren(...stages.map((stage, index) => {
        const option = document.createElement('option');
        option.value = String(index);
        option.textContent = stage.name;
        return option;
    }));
    stageSelect.value = String(stageIndex);
    applyRecipe();
}

function applyRecipe() {
    currentRecipe = selectedRecipe();
    const profile = selectedProfile();
    const hasRecommendation = currentRecipe.ppfd !== null && currentRecipe.hours !== null;
    intensityInput.disabled = !hasRecommendation;
    hoursInput.disabled = !hasRecommendation;
    intensityInput.value = '100';
    if (hasRecommendation) {
        const defaultHours = Math.round((currentRecipe.hours[0] + currentRecipe.hours[1]) / 2);
        hoursInput.min = String(currentRecipe.hours[0]);
        hoursInput.max = String(currentRecipe.hours[1]);
        hoursInput.value = String(defaultHours);
        document.querySelector('#hours + .range-ends span:first-child').textContent =
            `${currentRecipe.hours[0]} hour${currentRecipe.hours[0] === 1 ? '' : 's'}`;
        document.querySelector('#hours + .range-ends span:last-child').textContent =
            `${currentRecipe.hours[1]} hour${currentRecipe.hours[1] === 1 ? '' : 's'}`;
    } else {
        hoursInput.value = '0';
        document.querySelector('#hours + .range-ends span:first-child').textContent = 'N/A';
        document.querySelector('#hours + .range-ends span:last-child').textContent = 'N/A';
    }
    document.getElementById('recipe-kicker').textContent =
        `${profile.category.toUpperCase()} · ${currentRecipe.name.toUpperCase()}`;
    document.getElementById('recipe-description').textContent = currentRecipe.note;
    document.getElementById('stage-note').textContent = currentRecipe.note;
    document.getElementById('stage-timeline').textContent = currentRecipe.timeline;
    document.getElementById('crop-examples').textContent = profile.examples;
    renderEstimate();
    renderSpectrum();
}

function renderEstimate() {
    if (currentRecipe.ppfd === null || currentRecipe.hours === null) {
        document.getElementById('intensity-value').value = 'N/A';
        document.getElementById('hours-value').value = 'N/A';
        document.getElementById('ppfd-value').textContent = 'N/A';
        document.getElementById('dli-value').textContent = 'N/A';
        document.getElementById('ppfd-range').textContent = 'No target';
        document.getElementById('hours-range').textContent = 'No target';
        renderLightPreview();
        return;
    }

    const intensity = Number(intensityInput.value);
    const hours = Number(hoursInput.value);
    const targetPpfd = currentRecipe.ppfdSetpoint ??
        Math.round((currentRecipe.ppfd[0] + currentRecipe.ppfd[1]) / 2);
    const ppfd = Math.round(targetPpfd * intensity / 100);
    const dli = (ppfd * hours * 0.0036).toFixed(1);
    document.getElementById('intensity-value').value = `${intensity}%`;
    document.getElementById('hours-value').value = `${hours} h`;
    document.getElementById('ppfd-value').textContent = ppfd.toLocaleString();
    document.getElementById('dli-value').textContent = dli;
    document.getElementById('ppfd-range').textContent =
        `Target ${currentRecipe.ppfdLabel || formatRange(currentRecipe.ppfd)} μmol/m²/s`;
    document.getElementById('hours-range').textContent =
        currentRecipe.dli
            ? `DLI target ${formatRange(currentRecipe.dli)} mol/m²/day`
            : 'No DLI target';
    renderLightPreview();
}

function renderLightPreview() {
    const preview = document.getElementById('light-preview');
    if (currentRecipe.channels === null) {
        preview.style.backgroundColor = '#e6e9e2';
        preview.setAttribute('aria-label', 'No spectrum recommendation in the datasheet');
        return;
    }

    const channelRgb = [
        [255, 24, 0],
        [0, 56, 255],
        [0, 255, 38],
        [190, 0, 0],
        [120, 0, 255],
        [45, 0, 100],
        [255, 155, 0]
    ];
    const total = currentRecipe.channels.reduce((sum, value) => sum + value, 0);

    if (total === 0) {
        preview.style.backgroundColor = '#202820';
        preview.setAttribute('aria-label', 'No light output for this recipe');
        return;
    }

    const mixed = [0, 0, 0];
    currentRecipe.channels.forEach((value, channelIndex) => {
        channelRgb[channelIndex].forEach((component, colorIndex) => {
            mixed[colorIndex] += component * value / total;
        });
    });
    const brightest = Math.max(...mixed);
    const normalized = mixed.map(value => Math.round(value / brightest * 215));
    preview.style.backgroundColor = `rgb(${normalized.join(', ')})`;
    preview.setAttribute('aria-label', `Approximate LED light color, RGB ${normalized.join(', ')}`);
}

function renderSpectrum() {
    const track = document.getElementById('spectrum-track');
    const legend = document.getElementById('channel-legend');
    if (currentRecipe.channels === null) {
        track.replaceChildren();
        legend.replaceChildren();
        document.querySelector('.mix-total').firstChild.textContent = 'N/A ';
        document.querySelector('.mix-total span').textContent = 'no data';
        track.setAttribute('aria-label', 'No spectrum recommendation in the datasheet');
        return;
    }

    const total = currentRecipe.channels.reduce((sum, value) => sum + value, 0);
    track.replaceChildren();
    legend.replaceChildren();
    document.querySelector('.mix-total').firstChild.textContent = `${total}% `;
    document.querySelector('.mix-total span').textContent = 'total';

    currentRecipe.channels.forEach((value, index) => {
        const segment = document.createElement('span');
        segment.className = 'spectrum-segment';
        segment.style.width = `${value}%`;
        segment.style.backgroundColor = channelInfo[index].color;
        track.append(segment);

        const item = document.createElement('div');
        item.className = 'channel-item';
        const swatch = document.createElement('span');
        swatch.className = 'channel-swatch';
        swatch.style.backgroundColor = channelInfo[index].color;
        const name = document.createElement('span');
        name.className = 'channel-name';
        name.textContent = channelInfo[index].name;
        const amount = document.createElement('span');
        amount.className = 'channel-value';
        amount.textContent = `${value}%`;
        item.append(swatch, name, amount);
        legend.append(item);
    });

    track.setAttribute('aria-label', currentRecipe.channels.map((value, index) =>
        `${channelInfo[index].name} ${value}%`).join(', '));
}

cropSelect.addEventListener('change', updateStageOptions);
stageSelect.addEventListener('change', applyRecipe);
intensityInput.addEventListener('input', renderEstimate);
hoursInput.addEventListener('input', renderEstimate);

updateStageOptions();
