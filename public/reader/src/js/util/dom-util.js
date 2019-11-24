export function hideElement(element) {
    try {
        if (!element.classList.contains("hidden")) {
            element.classList.add("hidden");
        }
    } catch (_) {
    }
}

export function showElement(element) {
    try {
        if (element.classList.contains("hidden")) {
            element.classList.remove("hidden");
        } else {
            element.style.display = "block";
        }
    } catch (_) {
    }
}

export function removeChild(element) {
    try {
        element.parentElement.removeChild(element);
    } catch (_) {
    }
}

export function isDescendant(parent, child) {
    let node = child.parentNode;
    while (node != null) {
        if (node === parent) {
            return true;
        }
        node = node.parentNode;
    }
    return false;
}

export function throttle(callback, wait = 100) {
    let timer = null;
    return function (...args) {
        if (timer === null) {
            timer = setTimeout(() => {
                callback.apply(this, args);
                timer = null;
            }, wait);
        }
    };
}

export function debounce(fn, wait = 1) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => fn.call(this, ...args), wait)
    }
}

const pageHeight = window.innerHeight
    , scrollTop = window.pageYOffset || document.documentElement.scrollTop;
export function getVisibilityForElement(element) {
        const elementTop = element.getBoundingClientRect().top + scrollTop
        , elementHeight = element.offsetHeight
        , portionHiddenBeforeVP = scrollTop - elementTop
        , portionHiddenAfterVP = (elementTop + elementHeight) - (scrollTop + pageHeight);
    if ((scrollTop > elementTop + elementHeight)
        || (elementTop > scrollTop + pageHeight)
        || window.getComputedStyle(element, null).display === "none") {
        return 0;
    } else {
        let visibility = 100;
        if (portionHiddenBeforeVP > 0) {
            visibility -= (portionHiddenBeforeVP * 100) / elementHeight;
        }
        if (portionHiddenAfterVP > 0) {
            visibility -= (portionHiddenAfterVP * 100) / elementHeight;
        }
        return visibility;
    }
}

export function findFirstVisibleElement(element) {
    let visibleElement = undefined;
    traverseAllElements(element, (childElement) => {
        if (visibleElement) {
            return;
        }
        const visible = getVisibilityForElement(childElement);
        if (!visible) {
            return
        }
        const grandChild = childElement.children;
        if (grandChild.length === 0 && visible > 0) {
            visibleElement = childElement;
        }
    });
    return visibleElement;
}

export function traverseAllElements(element, callback) {
    Array.from(element.children).map((childElement) => {
        callback(childElement);
        traverseAllElements(childElement, callback);
    });
}

const height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
export function scrollToElement(element, parentElement, CalculatedOffset = true) {
    const elementHeight = element.offsetHeight;
    const multiplier = Math.floor(height / 3 / elementHeight);
    const halfHeight = elementHeight * multiplier;
    let offset = element.offsetTop;
    if (CalculatedOffset) {
        offset = element.offsetTop - halfHeight;
    }
    if (element.offsetTop > (halfHeight + halfHeight / 2)) {
        if (parentElement) {
            parentElement.scrollTop = offset;
        } else {
            window.scrollTo({
                top: offset,
                behavior: 'smooth'
            })
        }
    }
}


export function getPathTo(element) {
    if (element.id !== '') {
        return 'id("' + element.id + '")';
    }
    if (element === document.body) {
        return element.tagName;
    }

    let ix = 0;
    const siblings = element.parentNode.childNodes;
    for (let i = 0; i < siblings.length; i++) {
        let sibling = siblings[i];
        if (sibling === element) {
            return getPathTo(element.parentNode) + '/' + element.tagName + '[' + (ix + 1) + ']';
        }
        if (sibling.nodeType === 1 && sibling.tagName === element.tagName) {
            ix++;
        }
    }
}

export function getElementXPath(elt) {
    let path = "";
    for (; elt && elt.nodeType === 1; elt = elt.parentNode) {
        const idx = getElementIdx(elt);
        let xname = elt.tagName;
        if (idx > 1) {
            xname += "[" + idx + "]";
        }
        path = "/" + xname + path;
    }
    return path;
}

function getElementIdx(elt) {
    let count = 1;
    for (let sib = elt.previousSibling; sib; sib = sib.previousSibling) {
        if (sib.nodeType === 1 && sib.tagName === elt.tagName) {
            count++;
        }
    }
    return count;
}

export function getElementByXpath(path) {
    try {
        return document.evaluate(
            path,
            document,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null).singleNodeValue;
    } catch (e) {
        return undefined;
    }
}