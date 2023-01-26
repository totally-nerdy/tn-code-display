class CodeDisplay extends HTMLElement {
  constructor () {
    super()

    this._code = this.firstElementChild.value
    this._language = this.getAttribute('data-language')
    this._style = this.getAttribute('data-style') || 'monokai-sublime'
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
    this._loadScriptsAndDisplay(this)
  }
}

customElements.define('tn-code-display', CodeDisplay)
