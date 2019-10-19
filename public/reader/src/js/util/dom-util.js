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
    return function(...args) {
        if (timer === null) {
            timer = setTimeout(() => {
                callback.apply(this, args);
                timer = null;
            }, wait);
        }
    };
}
