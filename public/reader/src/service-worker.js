/*
 Copyright 2015 Google Inc. All Rights Reserved.
 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at
 http://www.apache.org/licenses/LICENSE-2.0
 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
*/

'use strict';

const CACHE_VERSION = 31;
const CACHE_NAME = "reader-cache";
const CURRENT_CACHE_NAME = CACHE_NAME + '-v' + CACHE_VERSION;
const isLocalEnv = self.location.hostname === "localhost";
let purgePresentOnce = false;

const includesPurge = (url = "") => {
    if (url.includes("purge")) {
        purgePresentOnce = true;
        deleteCache();
    }
    return purgePresentOnce || url.includes("purge");
};

const needToCacheRequest = (event) => {
    const destination = event.request.destination;
    const destinationsAccepted = ["script", "style", "image", "document", "manifest", "font"];
    return destinationsAccepted.includes(destination) && !(includesPurge(event.request.url) || includesPurge(event.request.referrer));
};

function deleteCache() {
    if (deleteCache.done) {
        return;
    }
    caches.keys().then(function (cacheNames) {
        return Promise.all(
            cacheNames.map(function (cacheName) {
                if (cacheName.startsWith(CACHE_NAME) // its our cache
                    && (cacheName !== CURRENT_CACHE_NAME || purgePresentOnce)) { // its a has become stale
                    console.log("Deleting cache ", cacheName);
                    deleteCache.done = true;
                    return caches.delete(cacheName);
                }
            })
        );
    });
}

self.addEventListener('activate', (event) => {
    deleteCache();
});


self.addEventListener('fetch', (event) => {
    if (isLocalEnv) {
        return
    }
    const value = event.request.method === 'GET' && needToCacheRequest(event);
    if (value) {
        event.respondWith(
            caches
                .match(event.request)
                .then(cachedResponse => {
                    if (cachedResponse) {
                        console.log("serving from cache", event.request.url);
                        return cachedResponse;
                    }

                    const fetchPromise = fetch(event.request).catch(error => console.warn('Fetch failed; error', error));
                    fetchPromise.then((response) => {
                        if (response && response.ok && needToCacheRequest(event)) {
                            const myResponse = response.clone();
                            caches
                                .open(CURRENT_CACHE_NAME)
                                .then((cache) => cache.put(event.request, myResponse));
                        }
                    });
                    return fetchPromise;
                })
        );
    }
});
