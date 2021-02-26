export function activeOrNot(condition, pack) {
    return condition ? pack.active : pack.inactive;
}

export function updateTabBuilder(nav) {
    return (tab, params) => nav.navigate(tab, params)
}