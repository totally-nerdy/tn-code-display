class CodeDisplay extends HTMLElement {
  constructor () {
    super()

    const LOADING_IMAGE = '<svg fill="%LOADING_COLOR%" height="20" viewBox="0 0 120 30" xmlns="http://www.w3.org/2000/svg"><circle cx="15" cy="15" r="15"><animate attributeName="r" begin="0s" calcMode="linear" dur="0.8s" from="15" repeatCount="indefinite" to="15" values="15;9;15"/><animate attributeName="fill-opacity" begin="0s" calcMode="linear" dur="0.8s" from="1" repeatCount="indefinite" to="1" values="1;.5;1"/></circle><circle cx="60" cy="15" r="9" fill-opacity=".3"><animate attributeName="r" begin="0s" calcMode="linear" dur="0.8s" from="9" repeatCount="indefinite" to="9" values="9;15;9"/><animate attributeName="fill-opacity" begin="0s" calcMode="linear" dur="0.8s" from="0.5" repeatCount="indefinite" to="0.5" values=".5;1;.5"/></circle><circle cx="105" cy="15" r="15"><animate attributeName="r" begin="0s" calcMode="linear" dur="0.8s" from="15" repeatCount="indefinite" to="15" values="15;9;15"/><animate attributeName="fill-opacity" begin="0s" calcMode="linear" dur="0.8s" from="1" repeatCount="indefinite" to="1" values="1;.5;1"/></circle></svg>'
    const CLIPBOARD_IMAGE = '<svg fill="#000" width="24" height="24" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M9.5 0a.5.5 0 0 1 .5.5.5.5 0 0 0 .5.5.5.5 0 0 1 .5.5V2a.5.5 0 0 1-.5.5h-5A.5.5 0 0 1 5 2v-.5a.5.5 0 0 1 .5-.5.5.5 0 0 0 .5-.5.5.5 0 0 1 .5-.5z"/><path d="M3.5 1h.585A1.5 1.5 0 0 0 4 1.5V2a1.5 1.5 0 0 0 1.5 1.5h5A1.5 1.5 0 0 0 12 2v-.5q-.001-.264-.085-.5h.585A1.5 1.5 0 0 1 14 2.5v12a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 14.5v-12A1.5 1.5 0 0 1 3.5 1"/></svg>'
    const CLIPBOARD_CHECK_IMAGE = '<svg fill="#000" width="24" height="24" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M10 .5a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5.5.5 0 0 1-.5.5.5.5 0 0 0-.5.5V2a.5.5 0 0 0 .5.5h5A.5.5 0 0 0 11 2v-.5a.5.5 0 0 0-.5-.5.5.5 0 0 1-.5-.5"/><path d="M4.085 1H3.5A1.5 1.5 0 0 0 2 2.5v12A1.5 1.5 0 0 0 3.5 16h9a1.5 1.5 0 0 0 1.5-1.5v-12A1.5 1.5 0 0 0 12.5 1h-.585q.084.236.085.5V2a1.5 1.5 0 0 1-1.5 1.5h-5A1.5 1.5 0 0 1 4 2v-.5q.001-.264.085-.5m6.769 6.854-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 9.793l2.646-2.647a.5.5 0 0 1 .708.708"/></svg>'

    this._code = this.firstElementChild.value
    this._prettyCode = ''
    this._language = this.getAttribute('data-language')
    this._style = this.getAttribute('data-style') || 'monokai-sublime'
    this._loadingColor = this.getAttribute('data-loading-color') || '#10c100'
    this._clipboard = Boolean(this.getAttribute('data-clipboard') || false)
    this._scripts = [
      'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/highlight.min.js',
      'https://www.unpkg.com/prettier@2.8.3/standalone.js'
    ]
    this._display = function (self) {
      self._prettyCode = prettier.format(self._code, {
        parser: self._parser,
        plugins: prettierPlugins
      })
      const _style = document.createElement('style')
      const _template = document.createElement('template')

      _style.innerHTML =
        `
        @import '//cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/styles/${self._style}.min.css';
        #container {
          position: relative;
        }
        #clipboard {
          display: none;
          position: absolute;
          top: 0;
          right: 0;
          margin-top: 4px;
          margin-right: 4px;
          padding: 10px;
          background-color: #fff;
          border-radius: 2px;
          cursor: pointer;
        }
        `
      _template.innerHTML = `<pre id="container"><code class="language-${self._language}"></code><div id="clipboard">${CLIPBOARD_IMAGE}</div></pre>`

      // Remove loading image again before adding the code box
      self.shadowRoot.querySelector('svg').remove()
      self.shadowRoot.appendChild(_template.content.cloneNode(true))
      self.shadowRoot.appendChild(_style)
      self.shadowRoot.querySelector('pre code').appendChild(document.createTextNode(self._prettyCode))

      // Adding event listeners
      if (this._clipboard) {
        self.shadowRoot.querySelector('pre').addEventListener('mouseenter', this._onMouseEnter)
        self.shadowRoot.querySelector('pre').addEventListener('mouseleave', this._onMouseLeave)
        self.shadowRoot.querySelector('pre div[id="clipboard"]').addEventListener('click', this._onClickClipboard.bind(this))
      }

      // Highlight.js
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
    this._onMouseEnter = function (self) {
      self.target.querySelector('div[id="clipboard"]').style.display = 'block'
    }
    this._onMouseLeave = function (self) {
      const clipboard = self.target.querySelector('div[id="clipboard"]')
      clipboard.style.display = 'none'

      const _template = document.createElement('template')
      _template.innerHTML = CLIPBOARD_IMAGE
      clipboard.replaceChildren(_template.content.cloneNode(true))
    }
    this._onClickClipboard = function () {
      const clipboard = this.shadowRoot.querySelector('div[id="clipboard"]')

      // navigator.clipboard.writeText(this._code) // copy original code
      navigator.clipboard.writeText(this._prettyCode) // copy formatted code

      const _template = document.createElement('template')
      _template.innerHTML = CLIPBOARD_CHECK_IMAGE
      clipboard.replaceChildren(_template.content.cloneNode(true))
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
