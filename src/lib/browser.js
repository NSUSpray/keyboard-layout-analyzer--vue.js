const rowFirstClass = 'row-first'
const rowLastClass = 'row-last'

/**
 * @param {Object} parent Element within which child elements will be searched.
 * @link https://copyprogramming.com/howto/is-it-possible-to-target-the-first-and-the-last-element-per-row-in-a-flex-layout
 */
function rowFirstLastUpdate(parent) {
  const children = Array.from(parent.children)
  if (!children.length) return
  const addClass = (i, cls) => children.slice(i)[0].classList.add(cls)
  const rect = i => children[i].getBoundingClientRect()
  const hasWrappingAfter = (_, i) => rect(i).bottom <= rect(i + 1).top
  function insertLastFirst(_, i)
      { addClass(i, rowLastClass); addClass(i + 1, rowFirstClass) }
  children.forEach(ch => ch.classList.remove(rowFirstClass, rowLastClass))
  addClass(0, rowFirstClass)
  addClass(-1, rowLastClass)
  children.slice(0, -1).filter(hasWrappingAfter).forEach(insertLastFirst)
}

/**
 * Make a function that marks the first/last elements within given wrappers.
 * @param {String} parentSelector CSS selector of the wrapper elements.
 * @return {Function}
 */
export const rowFirstLast = parentSelector => () =>
    document.querySelectorAll(parentSelector)?.forEach(rowFirstLastUpdate)


/**
 * Add an href="javascript:;" attribute for each link in the current document
 * without an href attribute. Reason: every link must behave like a link.
 */
export const setDummyHrefAttribute = () =>
    document.querySelectorAll('a')?.forEach(
      item => !item.hasAttribute('href')?
          item.setAttribute('href', 'javascript:;') : null
    )


const rootStyle = getComputedStyle(document.documentElement)

const transitionDuration =
    parseFloat(rootStyle.getPropertyValue('--transition-duration')) * 1000

/**
 * Event callback decorator that adds a class to the event target.
 * @param {Promise} func Event callback.
 * @param {Function} errorHandler
 * @param {String} processClass Class to be added. Default—“in-process”.
 * @return {Promise} Decorated event callback.
 */
export function processEventHandler
    (func, errorHandler, processClass='in-process') {
  return async (event, ...args) => {
    const target = event.target
    const disabled = target.getAttribute('disabled')
    const time = Date.now()
    function fadeOut() {
      target.classList.remove(processClass)
      if (!disabled) target.removeAttribute('disabled')
    }
    target.classList.add(processClass)
    if (!disabled) target.setAttribute('disabled', '')
    try { return await func(event, ...args) }
    catch (e) { if (errorHandler) errorHandler(e); else throw e }
    finally {
      const fadeOutDelay = Math.max(0, transitionDuration - Date.now() + time)
      setTimeout(fadeOut, fadeOutDelay)
    }
  }
}


/**
 * Get the value of transition-duration CSS property of a given DOM element.
 * @param {Element} element DOM element.
 * @return {Number} Transition duration in seconds.
 */
export const transitionDurationOf = element =>
    1000 * parseFloat
        (getComputedStyle(element).getPropertyValue('transition-duration'))

/**
 * @param {Object} data Object to be downloaded.
 * @param {String} filename Target name for the file to be downloaded.
 */
export function downloadJson(data, filename) {
  const json = JSON.stringify(data)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.setAttribute('download', filename)
  link.href = url
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * @param {String} style
 */
export function addStyle(style) {
  const sheet = new CSSStyleSheet()
  sheet.replaceSync(style)
  document.adoptedStyleSheets.push(sheet)
}
