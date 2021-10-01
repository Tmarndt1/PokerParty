import { IWorkItem } from "../models/WorkItem";

export default interface IWorkItemRequest {
    partyName: string;
    password: string;
    workItem: IWorkItem
}