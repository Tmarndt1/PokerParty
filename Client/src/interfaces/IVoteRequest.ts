import { IPlayer } from "../models/Player";

export default interface IVoteRequest {
    partyName: string;
    partyId: string;
    playerId: string;
    vote: string;
    v5Count: number;
    v10Count: number;
    v25Count: number;
    v50Count: number;
    voteSuit: number;
}