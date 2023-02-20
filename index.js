class CodeDisplay extends HTMLElement {
  constructor () {
    super()

    const LOADING_IMAGE = '<svg fill="%LOADING_COLOR%" height="20" viewBox="0 0 120 30" xmlns="http://www.w3.org/2000/svg"><circle cx="15" cy="15" r="15"><animate attributeName="r" begin="0s" calcMode="linear" dur="0.8s" from="15" repeatCount="indefinite" to="15" values="15;9;15"/><animate attributeName="fill-opacity" begin="0s" calcMode="linear" dur="0.8s" from="1" repeatCount="indefinite" to="1" values="1;.5;1"/></circle><circle cx="60" cy="15" r="9" fill-opacity=".3"><animate attributeName="r" begin="0s" calcMode="linear" dur="0.8s" from="9" repeatCount="indefinite" to="9" values="9;15;9"/><animate attributeName="fill-opacity" begin="0s" calcMode="linear" dur="0.8s" from="0.5" repeatCount="indefinite" to="0.5" values=".5;1;.5"/></circle><circle cx="105" cy="15" r="15"><animate attributeName="r" begin="0s" calcMode="linear" dur="0.8s" from="15" repeatCount="indefinite" to="15" values="15;9;15"/><animate attributeName="fill-opacity" begin="0s" calcMode="linear" dur="0.8s" from="1" repeatCount="indefinite" to="1" values="1;.5;1"/></circle></svg>'

    this._code = this.firstElementChild.value
    this._language = this.getAttribute('data-language')
    this._style = this.getAttribute('data-style') || 'monokai-sublime'
    this._loadingColor = this.getAttribute('data-loading-color') || '#10c100'
    this._scripts = [
      'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/highlight.min.js',
      'https://www.unpkg.com/prettier@2.8.3/standalone.js'
    ]
    this._display = function (self) {
      const _prettyCode = prettier.format(self._code, {
        parser: self._parser,
        plugins: prettierPlugins
      })
      const _style = document.createElement('style')
      const _template = document.createElement('template')

      _style.innerHTML = `@import '//cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/styles/${self._style}.min.css';`
      _template.innerHTML = `<pre><code class="language-${self._language}"></code></pre>`

      // Remove loading image again before adding the code box
      self.shadowRoot.querySelector('svg').remove()
      self.shadowRoot.appendChild(_template.content.cloneNode(true))
      self.shadowRoot.appendChild(_style)
      self.shadowRoot.querySelector('pre code').appendChild(document.createTextNode(_prettyCode))

      hljs.highlightElement(self.shadowRoot.querySelector('pre code'))
    }
    this._loadScriptsAndDisplay = function (self) {
      const script = self._scripts.shift()
      const el = document.createElement('script')

      self.shadowRoot.appendChild(el)

      el.onload = function (e) {
        //console.debug(script + ' loaded');
        if (self._scripts.length) {
          self._loadScriptsAndDisplay(self)
        } else {
          self._display(self)
        }
      }
      el.src = script
    }

    switch (this._language) {
      case 'css':
        this._scripts.push('https://www.unpkg.com/prettier@2.8.3/parser-postcss.js')
        this._parser = 'css'
        break
      case 'scss':
        this._scripts.push('https://www.unpkg.com/prettier@2.8.3/parser-postcss.js')
        this._parser = 'scss'
        break
      case 'less':
        this._scripts.push('https://www.unpkg.com/prettier@2.8.3/parser-postcss.js')
        this._parser = 'less'
        break
      case 'javascript':
        this._scripts.push('https://www.unpkg.com/prettier@2.8.3/parser-meriyah.js')
        this._parser = 'meriyah'
        break
      case 'html':
        this._scripts.push('https://www.unpkg.com/prettier@2.8.3/parser-html.js')
        this._parser = 'html'
        break
    }

    this.attachShadow({ mode: 'open' })

    // Display loading image
    const _loaderTemplate = document.createElement('template')
    _loaderTemplate.innerHTML = LOADING_IMAGE.replace('%LOADING_COLOR%', this._loadingColor)
    this.shadowRoot.appendChild(_loaderTemplate.content.cloneNode(true))

    this._loadScriptsAndDisplay(this)
  }
}

customElements.define('tn-code-display', CodeDisplay)
