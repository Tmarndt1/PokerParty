export default interface IModalData {
    active: boolean;
    body: JSX.Element | JSX.Element[];
    callback: (object: any) => void;
}