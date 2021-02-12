export function Guid() {
    return "xxxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
        let r = Math.random() * 16 | 0, v = c == "x" ? r : (r & 0x3 | 0x4);
        return v.toString(16);
    });
}

export function isNullOrUndefined(object: any) {
    return (object === null || object === undefined || object === "");
}