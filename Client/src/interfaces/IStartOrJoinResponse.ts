import { IPlayer } from "../models/Player";
import { IParty } from "../models/Party";

export default interface IStartOrJoinResponse {
    user: IPlayer;
    party: IParty;
}