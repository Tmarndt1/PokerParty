import { IPokerItem } from "../models/PokerItem";

export default interface ISubmitItemRequest {
    partyId: string;
    item: IPokerItem
}