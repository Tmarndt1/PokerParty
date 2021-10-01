import { isNothing } from "../utilitites/isNothing";


export interface IWorkItem {
    key: string;
    title: string;
    body: string;
    active: boolean;
}

export default class WorkItem implements IWorkItem {
    public key: string;
    public title: string;
    public body: string;
    public active: boolean;

    constructor(json: IWorkItem = null) {
        if (isNothing(json) === true) return;
        
        this.key = json.key;
        this.title = json.title;
        this.body = json.body;
        this.active = json.active ?? false;
    }
}