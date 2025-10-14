console.log('🎯 DevMark Content Script cargado en:', window.location.href);

function getSupabaseToken() {
    console.log('🔍 Buscando token de Supabase...');
    
    try {
        const keys = Object.keys(localStorage);
        console.log(' Keys en localStorage:', keys);
        
        const supabaseKeys = keys.filter(key => 
            key.toLowerCase().includes('supabase') || 
            key.toLowerCase().includes('auth')
        );
        
        console.log('🔑 Supabase keys encontradas:', supabaseKeys);
        
        for (const key of supabaseKeys) {
            try {
                const value = localStorage.getItem(key);
                console.log(`📄 ${key}:`, value ? value.substring(0, 100) + '...' : 'null');
                
                if (value && value.includes('access_token')) {
                    const data = JSON.parse(value);
                    if (data.access_token) {
                        console.log(' Token encontrado en localStorage');
                        return data.access_token;
                    }
                }
            } catch (e) {
                console.log(` Error parseando ${key}:`, e);
            }
        }
    } catch (error) {
        console.log(' Error accediendo localStorage:', error);
    }

    try {
        const sessionKeys = Object.keys(sessionStorage);
        console.log('📝 Keys en sessionStorage:', sessionKeys);
        
        for (const key of sessionKeys) {
            if (key.includes('supabase') || key.includes('auth')) {
                const value = sessionStorage.getItem(key);
                if (value && value.includes('access_token')) {
                    const data = JSON.parse(value);
                    if (data.access_token) {

                        return data.access_token;
                    }
                }
            }
        }
    } catch (error) {
    }

    if (window.supabase) {
        console.log('⚡ Supabase instance encontrada');
        return new Promise((resolve) => {
            window.supabase.auth.getSession().then(({ data }) => {
                if (data.session?.access_token) {
                    console.log(' Token obtenido de Supabase client');
                    resolve(data.session.access_token);
                } else {
                    console.log(' No hay sesión en Supabase client');
                    resolve(null);
                }
            }).catch((error) => {
                console.log(' Error con Supabase client:', error);
                resolve(null);
            });
        });
    } else {
        console.log(' No se encontró instancia de Supabase');
        return Promise.resolve(null);
    }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('📨 Mensaje recibido:', request.action);
    
    if (request.action === "getSupabaseToken") {
        getSupabaseToken().then(token => {
            console.log(' Enviando token:', token ? token.substring(0, 20) + '...' : 'null');
            sendResponse({ token });
        }).catch(error => {
            console.log(' Error obteniendo token:', error);
            sendResponse({ token: null });
        });
        return true;
    }
    
    return false;
});

console.log(' Content script completamente cargado');