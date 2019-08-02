export default interface IResponsePayload<T> {
    success: boolean;
    message: string;
    data?: T;
}