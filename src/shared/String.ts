export default class String {
    private constructor() {}
    
    public static isNullOEmpty = (string: string): boolean => {
        return (string === null || string === undefined || string === "");
    }
}