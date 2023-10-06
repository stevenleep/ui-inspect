const widgetID = '8c2d5b6221684d4f84ff109bc9d1294c-content-js'

chrome.runtime.onInstalled.addListener(() => {
  chrome.action.onClicked.addListener((tab) => {
    if (tab.id) {
      const url = new URL(tab.url || '')
      const domain = url.hostname
      const protocol = url.protocol
      const port = url.port
      const cacheID = `${protocol}//${domain}:${port}`

      console.info('cacheID', cacheID)

      chrome.storage.local
        .get(cacheID)
        .then(async (result) => {
          if (result[cacheID]) {
            console.info('unregisterContentScripts', tab);
            // 通知content.js移除
            chrome.tabs.sendMessage(tab.id!, { type: 'stop' }, (res) => {
              console.info('remove', res);
              chrome.storage.local.remove(cacheID).then(() => {
               console.info('remove success')
              });
            })
            return Promise.resolve()
          }
          return Promise.reject()
        })
        .catch(() => {
          console.info('registerContentScripts');
          chrome.scripting.executeScript({
            injectImmediately: true,
            target: { tabId: tab.id! },
            files: ['8c2d5b6221684d4f84ff109bc9d1294c-content.js'],
          }).then(() => {
            chrome.tabs.sendMessage(tab.id!, { type: 'start' }, (res) => {
              console.info('res', res)
              chrome.storage.local.set({ [cacheID]: true })
            })
          })
        })
    }
  })
})

chrome.tabs.onRemoved.addListener(() => {
  chrome.storage.local.clear();
})

// 当tab刷新时，重新注册content.js
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  chrome.storage.local.clear();
})

export {}
