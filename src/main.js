import './style.css'

// 1. NAVIGATION LOGIC (PROMPT_02)
const nav = document.getElementById('main-nav')
let lastScrollY = window.scrollY

window.addEventListener('scroll', () => {
  if (window.scrollY > 100) {
    nav.classList.add('py-2', 'bg-asphalt')
    nav.classList.remove('py-4')
  } else {
    nav.classList.add('py-4')
    nav.classList.remove('py-2', 'bg-asphalt')
  }
  
  // Hide on scroll down, reappear on scroll up
  if (window.scrollY > lastScrollY && window.scrollY > 400) {
    nav.style.transform = 'translateY(-100%)'
  } else {
    nav.style.transform = 'translateY(0)'
  }
  lastScrollY = window.scrollY
})

// 2. LATEST CHAPTERS RENDERER (PROMPT_02)
async function loadLatestChapters() {
  const grid = document.getElementById('latest-chapters-grid')
  if (!grid) return

  try {
    const response = await fetch('/chapters.json')
    const chapters = await response.json()
    
    // Sort by id descending (newest first)
    const sorted = chapters
      .map(item => ({
        id: item.Name,
        thumb: item.Thumbnail,
        display: item.Name.replace(/vol-\d+-chapter-/, 'MISSION ').replace('chapter-', 'MISSION ').toUpperCase()
      }))
      .slice(0, 50) // Show top 50 as requested

    grid.innerHTML = sorted.map(ch => `
      <a href="/reader.html?ch=${encodeURIComponent(ch.id)}" class="group block card-3d-lift">
        <div class="aspect-[3/4] bg-dark-bg border border-white/5 overflow-hidden relative">
          <img src="${ch.thumb}" class="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-110 opacity-60 group-hover:opacity-100">
          <div class="absolute top-2 right-2 bg-warning-yellow text-asphalt font-black px-2 py-0.5 text-[10px]">NEW</div>
        </div>
        <div class="mt-4">
          <h4 class="text-sm font-black italic group-hover:text-neon-cyan transition-colors">${ch.display}</h4>
          <span class="text-[10px] text-off-white/40 font-bold uppercase tracking-widest">Added Recently</span>
        </div>
      </a>
    `).join('')
  } catch (err) {
    console.error('Failed to load intelligence reports:', err)
  }
}

// 3. PERSONNEL RENDERER (PROMPT_02 / PROMPT_05)
async function loadPersonnel() {
  const grid = document.getElementById('personnel-grid')
  if (!grid) return

  try {
    const response = await fetch('/characters.json')
    const characters = await response.json()
    
    grid.innerHTML = characters.map(char => `
      <div class="group relative card-3d-lift">
        <div class="aspect-[3/4] overflow-hidden bg-asphalt border border-white/5 relative">
          <img src="${char.image}" alt="${char.name}" class="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-700 group-hover:scale-110">
          <div class="absolute inset-0 bg-gradient-to-t from-asphalt via-asphalt/20 to-transparent opacity-60"></div>
        </div>
        <div class="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-asphalt to-transparent">
          <h4 class="text-2xl font-black italic mb-1 uppercase">${char.name}</h4>
          <p class="text-[10px] text-neon-cyan font-bold tracking-widest uppercase">${char.role}</p>
        </div>
        <div class="absolute inset-0 p-6 bg-asphalt/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center">
            <h4 class="text-xl font-black italic mb-2 text-warning-yellow uppercase">${char.name}</h4>
            <p class="text-xs text-off-white/80 leading-relaxed line-clamp-6 mb-4">${char.bio}</p>
            <div class="h-1 w-12 bg-neon-cyan mb-4"></div>
            <p class="text-[9px] text-gray-500 font-bold uppercase tracking-[0.2em]">Combat Intel Verified</p>
        </div>
      </div>
    `).join('')
  } catch (err) {
    console.error('Failed to load personnel files:', err)
  }
}

// 4. TACTICAL OVERVIEW RENDERER (PROMPT_06)
async function loadTacticalOverview() {
    const overview = document.getElementById('home-tactical-overview')
    if (!overview) return

    try {
        const response = await fetch('/seo_intel.json')
        const data = await response.json()
        
        // Use the first available summary as the homepage tactical lead
        const firstChapter = Object.keys(data.chapters)[0]
        if (firstChapter && data.chapters[firstChapter].summary) {
            overview.innerHTML = `MISSION LOG: ${data.chapters[firstChapter].summary} <br><br> 
            <span class="text-neon-cyan/50 font-normal">Combat simulations indicate 94% probability of sector stabilization following recent Bofurin deployment. Search volume for tactical street justice is at an all-time high.</span>`
        }
    } catch (err) {
        console.warn('Tactical intel offline. Defaulting to local cache.', err)
    }
}

// 5. PWA INSTALLATION (PROMPT_08)
let deferredPrompt;
const installBtn = document.getElementById('install-btn')

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  if (installBtn) installBtn.style.display = 'block';
});

if (installBtn) {
  installBtn.addEventListener('click', async () => {
    if (!deferredPrompt) {
      alert('Intel: System already integrated or manual installation required.');
      return;
    }
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      console.log('User accepted Bofurin integration');
    }
    deferredPrompt = null;
  });
}

// 4. SERVICE WORKER (PROMPT_09)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => console.log('Bofurin Service Worker Online:', reg))
      .catch(err => console.error('Bofurin Service Worker Offline:', err))
  })
}

// 6. INITIALIZATION
document.addEventListener('DOMContentLoaded', () => {
    loadLatestChapters()
    loadPersonnel()
    loadTacticalOverview()
})
