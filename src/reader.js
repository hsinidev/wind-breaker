import './style.css'

const container = document.getElementById('reader-container')
const loadingOverlay = document.getElementById('loading-overlay')
const progressBar = document.getElementById('reading-progress-bar')
const progressText = document.getElementById('reading-progress-text')
const titleText = document.getElementById('chapter-title')
const summaryPanel = document.getElementById('summary-panel')
const summaryContent = document.getElementById('chapter-summary-content')

const params = new URLSearchParams(window.location.search)
const chapterId = params.get('ch')

let mangaData = {}
let currentChapterIdx = -1
let allChapterKeys = []

async function initReader() {
  if (!chapterId) {
    window.location.href = '/chapters.html'
    return
  }

  try {
    const [mangaRes, chRes, summaryRes, seoRes] = await Promise.all([
      fetch('/manga_data.json'),
      fetch('/chapters.json'),
      fetch('/summaries.json').catch(() => null),
      fetch('/seo_intel.json').catch(() => null)
    ])
    
    mangaData = await mangaRes.json()
    const allChapters = await chRes.json()
    const summaries = summaryRes ? await summaryRes.json() : {}
    const seoIntel = seoRes ? await seoRes.json() : { chapters: {} }

    allChapterKeys = allChapters.map(c => c.Name)
    currentChapterIdx = allChapterKeys.indexOf(chapterId)

    setupNavigation()
    loadChapterImages()
    markAsRead()
    updateMetaInfo()
    loadSummary(summaries, seoIntel.chapters[chapterId])
  } catch (err) {
    console.error('Reader Load Fail:', err)
  }
}

function updateMetaInfo() {
    const formattedTitle = chapterId.replace(/vol-\d+-chapter-/, 'MISSION ').toUpperCase()
    titleText.innerText = formattedTitle
    document.title = `${formattedTitle} | WIND BREAKER MANGA ONLINE`
    
    // Update dynamic canonical
    const canonical = document.getElementById('dynamic-canonical')
    if (canonical) {
        canonical.href = `https://wdbreaker.com/reader.html?ch=${chapterId}`
    }

    // Dynamic Schema injection
    const schemaBlock = document.getElementById('dynamic-schema')
    if (schemaBlock) {
        const schema = {
            "@context": "https://schema.org",
            "@type": "ComicIssue",
            "name": formattedTitle,
            "isPartOf": {
                "@type": "ComicSeries",
                "name": "WIND BREAKER MANGA ONLINE",
                "url": "https://wdbreaker.com/"
            },
            "url": `https://wdbreaker.com/reader.html?ch=${chapterId}`,
            "author": {
                "@type": "Person",
                "name": "Satoru Nii"
            }
        }
        schemaBlock.textContent = JSON.stringify(schema)
    }
}

function markAsRead() {
    let read = JSON.parse(localStorage.getItem('wb_read_chapters') || '[]')
    if (!read.includes(chapterId)) {
        read.push(chapterId)
        localStorage.setItem('wb_read_chapters', JSON.stringify(read))
    }
}

function setupNavigation() {
    const prevBtn = document.getElementById('prev-ch')
    const nextBtn = document.getElementById('next-ch')
    
    if (currentChapterIdx > 0) {
        prevBtn.onclick = () => window.location.href = `/reader.html?ch=${allChapterKeys[currentChapterIdx - 1]}`
    } else {
        prevBtn.disabled = true
    }

    if (currentChapterIdx < allChapterKeys.length - 1) {
        nextBtn.onclick = () => window.location.href = `/reader.html?ch=${allChapterKeys[currentChapterIdx + 1]}`
    } else {
        nextBtn.disabled = true
    }

    document.getElementById('index-toggle').onclick = () => window.location.href = '/chapters.html'
    
    // Summary Panel Toggles
    document.getElementById('summary-close').onclick = () => summaryPanel.classList.add('translate-x-full')
    // Click on progress text to toggle summary
    progressText.onclick = () => summaryPanel.classList.toggle('translate-x-full')
    progressText.style.cursor = 'pointer'
}

function loadSummary(summaries, seoChapterData) {
    let summaryText = summaries[chapterId] || "NO BASIC INTEL AVAILABLE."
    let tacticalReport = ""
    
    if (seoChapterData) {
        summaryText = seoChapterData.summary || summaryText
        if (seoChapterData.tactical_report) {
            tacticalReport = `
                <div class="mt-8 p-4 bg-black/40 border border-neon-cyan/30 rounded">
                    <h4 class="text-neon-cyan font-bold italic mb-4 text-xs uppercase tracking-widest">Full Tactical Intel Report:</h4>
                    <div class="prose prose-invert prose-xs leading-relaxed opacity-90 overflow-hidden max-h-40 relative" id="tactical-text">
                        ${seoChapterData.tactical_report}
                        <div class="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-asphalt to-transparent" id="tactical-fade"></div>
                    </div>
                    <button id="tactical-expand" class="mt-4 text-[10px] text-warning-yellow font-black italic uppercase tracking-widest hover:underline">EXPAND FULL REPORT &rarr;</button>
                </div>
            `
        }
    }
    
    summaryContent.innerHTML = `<p>${summaryText}</p>${tacticalReport}`
    
    const expandBtn = document.getElementById('tactical-expand')
    if (expandBtn) {
        expandBtn.onclick = () => {
            const text = document.getElementById('tactical-text')
            const fade = document.getElementById('tactical-fade')
            text.classList.remove('max-h-40')
            fade.classList.add('hidden')
            expandBtn.classList.add('hidden')
        }
    }
}

function loadChapterImages() {
  const images = mangaData[chapterId] || []
  if (images.length === 0) {
    container.innerHTML = `<p class="py-40 text-center font-black italic text-neon-cyan">ZERO ENCRYPTION DATA FOUND FOR: ${chapterId}</p>`
    loadingOverlay.classList.add('hidden')
    return
  }

  images.forEach((imgUrl, idx) => {
    const imgElement = document.createElement('img')
    imgElement.dataset.src = imgUrl
    imgElement.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7' // lazy load placeholder
    imgElement.className = 'w-full block opacity-0 transition-opacity duration-1000'
    imgElement.loading = 'lazy'
    imgElement.id = `page-${idx}`
    
    container.appendChild(imgElement)
  })

  setupIntersectionObserver()
  startLazyLoading()
}

function startLazyLoading() {
    const lazyImages = document.querySelectorAll('img[data-src]')
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target
                img.src = img.dataset.src
                img.onload = () => img.classList.remove('opacity-0')
                observer.unobserve(img)
            }
        })
    }, { rootMargin: '1000px' })

    lazyImages.forEach(img => observer.observe(img))
    loadingOverlay.classList.add('hidden')
}

function setupIntersectionObserver() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const pageIdx = parseInt(entry.target.id.split('-')[1])
        const total = document.querySelectorAll('#reader-container img').length
        const progress = Math.round(((pageIdx + 1) / total) * 100)
        
        progressBar.style.width = `${progress}%`
        progressText.innerText = `${progress}% COMPLETE`
      }
    })
  }, { threshold: 0.1 })

  document.querySelectorAll('#reader-container img').forEach(img => observer.observe(img))
}

// Global Interaction: Hide header on scroll down, show on scroll up
let lastScroll = 0
window.addEventListener('scroll', () => {
    const header = document.getElementById('reader-header')
    if (window.scrollY > lastScroll && window.scrollY > 200) {
        header.style.opacity = '0'
        header.style.pointerEvents = 'none'
    } else {
        header.style.opacity = '1'
        header.style.pointerEvents = 'auto'
    }
    lastScroll = window.scrollY
})

initReader()
