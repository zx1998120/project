export function getServerHTTP(path :string|undefined) {
    const root = `${import.meta.env.VITE_SERVER_HTTP}:${import.meta.env.VITE_SERVER_PORT}`
    if (path != undefined) {
        return new URL(path, root).href;
    }
    else {
        return root;
    }
}