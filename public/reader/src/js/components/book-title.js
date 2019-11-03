export function getTitle(title, domain) {
    domain.split(".").forEach((part) => {
        if (title.toLowerCase().includes(part)) {
            const re = new RegExp(part, 'i');
            title = title.replace(re, "").trim();
        }
    });
    return title.replace(/–$/, "").trim();
}
