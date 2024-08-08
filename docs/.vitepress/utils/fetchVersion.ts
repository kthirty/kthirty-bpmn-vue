
export function fetchVersion () {
  return fetch('https://api.github.com/repos/kthirty/kthirty-boot-vue/contents/package.json?ref=master', {
    headers: {
      Accept: 'application/vnd.github.v3.raw',
    }
  }).then(res => res.json())
    .then(json => json.version ?? '')
    .then(version => {
      if (!version) return
      const tagLineParagragh = document.querySelector('div.VPHero.has-image.VPHomeHero > div > div.main > p.tagline')
      const docsVersionSpan = document.createElement('samp')
      docsVersionSpan.classList.add('tag-version')
      docsVersionSpan.innerText = version
      tagLineParagragh?.appendChild(docsVersionSpan)
    })
}
