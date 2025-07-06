// Service Worker para DuoPass - Cache Offline
// Versão do cache - incremente quando houver mudanças
const CACHE_VERSION = 'duopass-v1.0.0';
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const DYNAMIC_CACHE = `${CACHE_VERSION}-dynamic`;

// Arquivos para cache estático (sempre em cache)
const STATIC_FILES = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  // Adicione outros arquivos críticos aqui
];

// Arquivos que nunca devem ser cacheados
const NEVER_CACHE = [
  '/api/',
  'chrome-extension://',
  'moz-extension://',
  'safari-extension://',
];

// Instalar Service Worker
self.addEventListener('install', (event) => {
  console.log('[SW] Instalando Service Worker...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('[SW] Cache estático criado');
        return cache.addAll(STATIC_FILES);
      })
      .then(() => {
        console.log('[SW] Arquivos estáticos cacheados');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('[SW] Erro ao instalar:', error);
      })
  );
});

// Ativar Service Worker
self.addEventListener('activate', (event) => {
  console.log('[SW] Ativando Service Worker...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => {
              // Remove caches antigos
              return cacheName.startsWith('duopass-') && 
                     cacheName !== STATIC_CACHE && 
                     cacheName !== DYNAMIC_CACHE;
            })
            .map((cacheName) => {
              console.log('[SW] Removendo cache antigo:', cacheName);
              return caches.delete(cacheName);
            })
        );
      })
      .then(() => {
        console.log('[SW] Service Worker ativado');
        return self.clients.claim();
      })
  );
});

// Interceptar requisições
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Ignorar requisições que não devem ser cacheadas
  if (NEVER_CACHE.some(pattern => request.url.includes(pattern))) {
    return;
  }
  
  // Estratégia: Cache First para arquivos estáticos
  if (request.method === 'GET') {
    event.respondWith(
      caches.match(request)
        .then((cachedResponse) => {
          if (cachedResponse) {
            console.log('[SW] Servindo do cache:', request.url);
            return cachedResponse;
          }
          
          // Se não estiver em cache, buscar da rede
          return fetch(request)
            .then((networkResponse) => {
              // Verificar se a resposta é válida
              if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
                return networkResponse;
              }
              
              // Clonar a resposta para cache
              const responseToCache = networkResponse.clone();
              
              // Decidir qual cache usar
              const cacheToUse = STATIC_FILES.includes(url.pathname) ? STATIC_CACHE : DYNAMIC_CACHE;
              
              caches.open(cacheToUse)
                .then((cache) => {
                  console.log('[SW] Cacheando:', request.url);
                  cache.put(request, responseToCache);
                });
              
              return networkResponse;
            })
            .catch((error) => {
              console.log('[SW] Erro de rede:', error);
              
              // Para navegação, retornar página offline ou index.html
              if (request.destination === 'document') {
                return caches.match('/index.html');
              }
              
              // Para outros recursos, retornar erro
              throw error;
            });
        })
    );
  }
});

// Limpar cache dinâmico quando necessário
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    console.log('[SW] Limpando cache dinâmico...');
    
    caches.delete(DYNAMIC_CACHE)
      .then(() => {
        console.log('[SW] Cache dinâmico limpo');
        event.ports[0].postMessage({ success: true });
      })
      .catch((error) => {
        console.error('[SW] Erro ao limpar cache:', error);
        event.ports[0].postMessage({ success: false, error });
      });
  }
});

// Notificar sobre atualizações
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Background Sync (para quando voltar online)
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync:', event.tag);
  
  if (event.tag === 'background-sync') {
    event.waitUntil(
      // Aqui você pode implementar lógica para sincronizar dados
      // quando o usuário voltar online
      Promise.resolve()
    );
  }
});

// Push notifications (se necessário no futuro)
self.addEventListener('push', (event) => {
  console.log('[SW] Push recebido:', event);
  
  const options = {
    body: event.data ? event.data.text() : 'Nova notificação do DuoPass',
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Ver detalhes',
        icon: '/favicon.ico'
      },
      {
        action: 'close',
        title: 'Fechar',
        icon: '/favicon.ico'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('DuoPass', options)
  );
});

// Clique em notificação
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Clique em notificação:', event);
  
  event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

console.log('[SW] Service Worker carregado - Versão:', CACHE_VERSION);