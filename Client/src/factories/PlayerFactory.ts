import Player, { IPlayer } from "../models/Player";
import { Guid } from "../utilitites/common";

export default class PlayerFactory {
    public create(name: string, partyName: string, isAdmin: boolean = false, connectionId: string = null): Player {
        return new Player({
            id: Guid(),
            socketId: connectionId,
            username: name,
            partyName: partyName,
            active: true,
            isAdmin: isAdmin,
            lastVote: null,
            seatNumber: isAdmin === true ? 1 : -1,
            v10Count: -1,
            v25Count: -1,
            v50Count: -1,
            v5Count: -1,
            vote: null,
            voteSuit: null,
            voted: false,
        });
    }

    public default(seatNumber: number): Player {
        return new Player({
            id: Guid(),
            username: "",
            isAdmin: false,
            vote: null,
            partyName: name,
            voted: false,
            seatNumber: seatNumber,
            v5Count: null,
            v10Count: null,
            v25Count: null,
            v50Count: null,
            lastVote: null,
            voteSuit: -1,
            active: false
        });
    }

    public fromJson(json: IPlayer): Player {
        return new Player(json);
    }
}