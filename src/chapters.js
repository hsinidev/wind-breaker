import './style.css'

const grid = document.getElementById('chapter-grid')
const searchInput = document.getElementById('chapter-search')
const sortSelect = document.getElementById('chapter-sort')
const arcFilter = document.getElementById('arc-filter')
const nav = document.getElementById('main-nav')

let chapters = []
let readChapters = JSON.parse(localStorage.getItem('wb_read_chapters') || '[]')

// SCROLL SAVE/RESTORE (PROMPT_03)
window.addEventListener('beforeunload', () => {
    localStorage.setItem('wb_scroll_pos', window.scrollY)
})

async function loadChapters() {
  try {
    const response = await fetch('/chapters.json')
    const data = await response.json()
    
    chapters = data.map(item => {
       const volMatch = item.Name.match(/vol-(\d+)/)
       return {
          id: item.Name,
          thumb: item.Thumbnail,
          vol: volMatch ? `vol-${volMatch[1]}` : 'other',
          display: item.Name.replace(/vol-\d+-chapter-/, 'MISSION ').replace('chapter-', 'MISSION ').toUpperCase()
       }
    })
    
    renderChapters()
    populateArcFilter()
    
    // Restore scroll position
    const savedScroll = localStorage.getItem('wb_scroll_pos')
    if (savedScroll) {
        window.scrollTo(0, parseInt(savedScroll))
    }
  } catch (err) {
    console.error('Failed to access archive:', err)
    grid.innerHTML = '<p class="text-neon-cyan font-black col-span-full py-20 text-center uppercase tracking-widest">FATAL: ENCRYPTION ERROR. UNABLE TO DECODE ARCHIVE.</p>'
  }
}

function populateArcFilter() {
    const volumes = [...new Set(chapters.map(c => c.vol))].sort();
    arcFilter.innerHTML = '<option value="all">ALL MISSIONS</option>' + 
        volumes.map(v => `<option value="${v}">${v.toUpperCase().replace('-', ' ')}</option>`).join('');
}

function renderChapters() {
  let filtered = chapters.filter(ch => {
     const matchesSearch = ch.display.includes(searchInput.value.toUpperCase())
     const matchesArc = arcFilter.value === 'all' || ch.vol === arcFilter.value
     return matchesSearch && matchesArc
  })
  
  const getNum = (id) => {
    const m = id.match(/chapter-(\d+\.?\d*)/);
    return m ? parseFloat(m[1]) : 0;
  };

  if (sortSelect.value === 'newest') {
    filtered.sort((a, b) => getNum(b.id) - getNum(a.id) || b.id.localeCompare(a.id));
  } else {
    filtered.sort((a, b) => getNum(a.id) - getNum(b.id) || a.id.localeCompare(b.id));
  }

  grid.innerHTML = filtered.map(ch => {
    const isRead = readChapters.includes(ch.id)
    return `
    <a href="/reader.html?ch=${encodeURIComponent(ch.id)}" class="group block relative card-3d-lift glass-panel p-2 ${isRead ? 'opacity-60' : ''}" data-id="${ch.id}">
      <div class="aspect-[3/4] bg-asphalt mb-3 overflow-hidden border border-white/5 relative">
        <img src="${ch.thumb}" class="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700">
        <div class="absolute inset-0 bg-neon-cyan/5 group-hover:bg-transparent transition-all"></div>
        ${isRead ? '<div class="absolute top-2 left-2 bg-asphalt/80 text-[8px] px-2 py-0.5 border border-white/10 font-black tracking-widest text-off-white/40">ARCHIVED</div>' : ''}
      </div>
      <div class="px-2 pb-2">
        <h4 class="font-black text-[11px] md:text-sm uppercase italic leading-none truncate mb-1 group-hover:text-neon-cyan transition-colors">${ch.display}</h4>
        <p class="text-[9px] font-bold text-off-white/30 tracking-widest uppercase">Field Report</p>
      </div>
      <div class="absolute bottom-2 right-2 w-2 h-2 rounded-full ${isRead ? 'bg-white/10' : 'bg-neon-cyan shadow-[0_0_8px_#00f2ff]'}"></div>
    </a>
  `}).join('')
}

// Global Nav Scroll
let lastScrollY = window.scrollY
window.addEventListener('scroll', () => {
  if (window.scrollY > lastScrollY && window.scrollY > 400) {
    nav.style.transform = 'translateY(-100%)'
  } else {
    nav.style.transform = 'translateY(0)'
  }
  lastScrollY = window.scrollY
})

searchInput.addEventListener('input', renderChapters)
sortSelect.addEventListener('change', renderChapters)
arcFilter.addEventListener('change', renderChapters)

loadChapters()
