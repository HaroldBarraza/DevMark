document.addEventListener('DOMContentLoaded', async function() {
    await initializePopup();
});

async function initializePopup() {
    try {
        const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
        const currentUrl = activeTab.url;
        
        // Display current URL
        document.getElementById('currentUrl').textContent = 
            currentUrl.length > 60 ? currentUrl.substring(0, 60) + '...' : currentUrl;
        
        await checkAuthStatus();
        
    } catch (error) {
        console.error('Error initializing popup:', error);
        showLoginSection();
    }
}

function setupEventListeners() {
    document.getElementById('reloadExtension').addEventListener('click', async function() {
        await checkAuthStatus();
    });

    document.getElementById('createBookmark').addEventListener('click', openBookmarkForm);
}

async function checkAuthStatus() {
    showLoading();
    
    try {
        const { authToken, tokenExpiry } = await chrome.storage.local.get(['authToken', 'tokenExpiry']);
        
        if (authToken && tokenExpiry) {
            const currentTime = Math.floor(Date.now() / 1000);
            if (tokenExpiry > currentTime) {
                showBookmarkSection();
                setupEventListeners();
                return;
            } else {
                console.log(' Token expired, removing...');
                await chrome.storage.local.remove(['authToken', 'tokenExpiry']);
            }
        }

        const tokenData = await fetchTokenFromDevMarkSite();
        
        if (tokenData && tokenData.token) {
            showBookmarkSection();
            setupEventListeners();
        } else {
            showLoginSection();
        }
        
    } catch (error) {
        console.error('Error checking authentication:', error);
        showLoginSection();
    }
}

async function fetchTokenFromDevMarkSite() {
    return new Promise((resolve) => {
        chrome.tabs.create({
            url: 'https://dev-mark-g88i9l2mr-harolds-projects-a73372ca.vercel.app',
            active: false
        }, (tab) => {
            chrome.tabs.onUpdated.addListener(function listener(tabId, info) {
                if (tabId === tab.id && info.status === 'complete') {
                    chrome.tabs.onUpdated.removeListener(listener);
                    
                    chrome.scripting.executeScript({
                        target: { tabId: tab.id },
                        func: extractAuthToken
                    }, async (results) => {
                        const tokenData = results[0]?.result;
                        
                        if (tokenData && tokenData.token) {
                            // Store token in chrome.storage
                            await chrome.storage.local.set({
                                authToken: tokenData.token,
                                tokenExpiry: tokenData.expires_at
                            });
                        }
                        
                        chrome.tabs.remove(tab.id);
                        resolve(tokenData);
                    });
                }
            });
        });
    });
}

function extractAuthToken() {
    try {
        const keys = Object.keys(localStorage);
        const supabaseKey = keys.find(key => 
            key.includes('sb-') && key.includes('-auth-token')
        );
        
        if (supabaseKey) {
            const authData = JSON.parse(localStorage.getItem(supabaseKey));
            if (authData && authData.access_token) {
                const currentTime = Math.floor(Date.now() / 1000);
                if (authData.expires_at && authData.expires_at > currentTime) {
                    return {
                        token: authData.access_token,
                        expires_at: authData.expires_at
                    };
                }
            }
        }
        return null;
    } catch (error) {
        console.error('Error extracting token:', error);
        return null;
    }
}

async function openBookmarkForm() {
    try {
        const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
        const currentUrl = activeTab.url;
        
        // Create the bookmark creation URL with the current page URL as parameter
        const createUrl = `https://dev-mark-g88i9l2mr-harolds-projects-a73372ca.vercel.app/bookmark/create?url=${encodeURIComponent(currentUrl)}`;
        
        console.log('🔗 Opening bookmark form with URL:', currentUrl);
        
        // Open the bookmark creation page in a new tab
        await chrome.tabs.create({ 
            url: createUrl,
            active: true 
        });
        
        // Close the popup
        setTimeout(() => {
            window.close();
        }, 300);
        
    } catch (error) {
        console.error('Error opening bookmark form:', error);
        showMessage('❌ Error opening bookmark form', 'error');
    }
}

function showLoading() {
    document.getElementById('loadingSection').classList.remove('hidden');
    document.getElementById('loginSection').classList.add('hidden');
    document.getElementById('bookmarkSection').classList.add('hidden');
}

function showLoginSection() {
    document.getElementById('loadingSection').classList.add('hidden');
    document.getElementById('loginSection').classList.remove('hidden');
    document.getElementById('bookmarkSection').classList.add('hidden');
}

function showBookmarkSection() {
    document.getElementById('loadingSection').classList.add('hidden');
    document.getElementById('loginSection').classList.add('hidden');
    document.getElementById('bookmarkSection').classList.remove('hidden');
}

function showMessage(message, type) {
    const messageDiv = document.getElementById('message');
    messageDiv.textContent = message;
    messageDiv.className = type;
    messageDiv.classList.remove('hidden');

    setTimeout(() => {
        if (messageDiv.textContent === message) {
            messageDiv.classList.add('hidden');
        }
    }, 3000);
}