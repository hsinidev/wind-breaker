import './style.css'

const themeToggle = document.getElementById('theme-toggle')
const clearCacheBtn = document.getElementById('clear-cache')
const storageStats = document.getElementById('storage-stats')
const installBtn = document.getElementById('install-btn')
const installStatus = document.getElementById('install-status')

// THEME LOGIC
let currentTheme = localStorage.getItem('wb_theme') || 'dark'
applyTheme(currentTheme)

themeToggle.onclick = () => {
    currentTheme = currentTheme === 'dark' ? 'light' : 'dark'
    localStorage.setItem('wb_theme', currentTheme)
    applyTheme(currentTheme)
}

function applyTheme(theme) {
    if (theme === 'light') {
        document.documentElement.classList.add('light-mode')
        themeToggle.querySelector('div').style.transform = 'translateX(100%)'
    } else {
        document.documentElement.classList.remove('light-mode')
        themeToggle.querySelector('div').style.transform = 'translateX(0)'
    }
}

// STORAGE LOGIC
async function updateStorageStats() {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
        const { usage, quota } = await navigator.storage.estimate()
        const usageMB = (usage / (1024 * 1024)).toFixed(2)
        const quotaMB = (quota / (1024 * 1024)).toFixed(0)
        storageStats.innerText = `USAGE: ${usageMB}MB / ${quotaMB}MB ARCHIVE QUOTA`
    }
}

clearCacheBtn.onclick = async () => {
    if (confirm('ENCRYPTION WARNING: WIPE ALL LOCAL MISSION DATA?')) {
        const cacheNames = await caches.keys()
        await Promise.all(cacheNames.map(name => caches.delete(name)))
        localStorage.removeItem('wb_read_chapters')
        alert('MEMORY CORE PURGED.')
        window.location.reload()
    }
}

// INSTALL LOGIC
window.addEventListener('beforeinstallprompt', (e) => {
    installBtn.classList.remove('hidden')
    installStatus.innerText = 'PROTOCOL READY FOR DEPLOYMENT'
    installStatus.classList.replace('text-green-500', 'text-warning-yellow')
    
    installBtn.onclick = () => {
        e.prompt()
    }
})

updateStorageStats()
