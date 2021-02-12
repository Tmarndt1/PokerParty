import Party, { IParty } from "../models/Party";
import Player from "../models/Player";
import { Guid } from "../utilitites/common";


export default class PartyFactory {
    public start = (admin: Player, name: string, password: string): Party => {
        let party = new Party({
            id: Guid(),
            name: name,
            members: [admin],
            pokerItem: null,
            itemHistory: [],
            voting: false
        });

        admin.setSeat(1);

        for (let i = 2; i < 9; i++) {
            party.members.push(new Player({
                id: Guid(),
                username: "",
                isAdmin: false,
                vote: null,
                partyName: name,
                voted: false,
                seatNumber: i,
                v5Count: null,
                v10Count: null,
                v25Count: null,
                v50Count: null,
                lastVote: null,
                voteSuit: -1,
                active: false
            }));
        }

        party.setPassword(password);
        party.setAdmin(admin);
            
        return party;
    }

    public default = (): Party => {
        let party = new Party();
        party.id = Guid();
        party.name = name;
        for (let i = 1; i < 9; i++) {
            party.members.push(new Player({
                id: Guid(),
                username: "",
                isAdmin: false,
                vote: null,
                partyName: name,
                voted: false,
                seatNumber: i,
                v5Count: null,
                v10Count: null,
                v25Count: null,
                v50Count: null,
                lastVote: null,
                voteSuit: -1,
                active: false
            }));
        }
            
        return party;
    }

    public fromJson = (json: IParty): Party => {
        return new Party(json);
    }
}