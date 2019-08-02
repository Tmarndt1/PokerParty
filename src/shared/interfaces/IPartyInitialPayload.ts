import { IPokerPlayer } from "../models/PokerPlayer";

export default interface IPartyInitialPayload {
    partyName: string;
    pokerPlayer: IPokerPlayer;
    password: string;
}