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

export function getVisibilityForElement(element) {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop
        , elementTop = element.getBoundingClientRect().top + scrollTop
        , elementHeight = element.scrollHeight
        , portionHiddenBeforeVP = scrollTop - elementTop
        , portionHiddenAfterVP = (elementTop + elementHeight) - (scrollTop + clientHeight);
    if ((scrollTop > elementTop + elementHeight)
        || (elementTop > scrollTop + clientHeight)
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
        return !!visibleElement;
    });
    return visibleElement;
}

export function traverseAllElements(element, callback) {
    let exit = false;
    Array.from(element.children).map((childElement) => {
        if (exit) {
            return
        }
        exit = callback(childElement);
        if (!exit) {
            exit = traverseAllElements(childElement, callback);
        }
    });
    return exit
}

const clientHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

export function scrollToElement(element, parentElement, CalculatedOffset = true) {
    const elementHeight = element.scrollHeight;
    const multiplier = Math.floor(clientHeight / 3 / elementHeight);
    const halfHeight = elementHeight * multiplier;
    const elementOffsetTop = element.offsetTop;
    let offset = elementOffsetTop;
    if (CalculatedOffset) {
        offset = elementOffsetTop - halfHeight;
    }
    if (elementOffsetTop > (halfHeight + halfHeight / 2)) {
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