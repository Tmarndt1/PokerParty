import { IPokerPlayer } from "../models/PokerPlayer";

export default interface IVotePayload {
    partyName: string;
    pokerPlayer: IPokerPlayer
}