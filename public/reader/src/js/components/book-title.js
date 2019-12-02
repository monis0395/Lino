export function getTitle(title, domain) {
    let hadDomainInTitle = false;
    domain.split(".").forEach((part) => {
        if (title.toLowerCase().includes(part)) {
            hadDomainInTitle = true;
            if (title.toLowerCase().startsWith("read")) {
                title = title.replace(/read/i, "").trim();
            }
            const re = new RegExp(`\\b${part}\\b`, 'i');
            title = title.replace(re, "").trim();
        }
    });
    title = title.replace(/([–\-])$/, "").trim();
    if (title.endsWith("novel")) {
        title = title.replace(/novel$/, "").trim();
    }
    return title
}
