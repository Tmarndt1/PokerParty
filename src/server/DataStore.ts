import PokerPlayer from "../shared/models/PokerPlayer";
import { IPokerPlayer } from "../shared/models/PokerPlayer"
import Party, { IPartyJSON } from "../shared/models/Party";
import { isNullOrUndefined } from "util";
import PokerItem from "../shared/models/PokerItem";


export default class DataStore {
    private static pokerPlayer: Array<PokerPlayer> =[];
    private static parties: Array<Party> = [];

    public static join = (json: IPokerPlayer, socketId: string): boolean | PokerPlayer=> {
        let pokerPlayer = PokerPlayer.createEmpty();
        pokerPlayer.mirror(json);

        if (pokerPlayer.admin === true) {
            for (let i = 0; i < DataStore.pokerPlayer.length; i++) {
                if (DataStore.pokerPlayer[i].admin === true && DataStore.pokerPlayer[i].partyName === pokerPlayer.partyName) {
                    return false;
                }
            }
        }

        DataStore.pokerPlayer.push(pokerPlayer);

        return pokerPlayer;
    }

    public static removePokerPlayer = (pokerPlayer: IPokerPlayer): boolean => {
        if (pokerPlayer === null) return false;

        let party = DataStore.parties.filter(x => x.name === pokerPlayer.partyName);

        if (party.length !== 1) return false;

        let removed = false;

        for (let i = 0; i < DataStore.parties.length; i++) {
            if (DataStore.parties[i].name === pokerPlayer.partyName) {
                let member = DataStore.parties[i].members.filter(x => x.id === pokerPlayer.id)[0];
                let index = DataStore.parties[i].members.indexOf(member);
                if (index === -1) break;
                DataStore.parties[i].members.splice(index, 1);
                removed = true;
            }
        }

        if (removed === false) return removed;

        for (let i = 0; i < DataStore.pokerPlayer.length; i++) {
            if (DataStore.pokerPlayer[i].id == pokerPlayer.id) {
                DataStore.pokerPlayer.splice(i, 1);
                break;
            }
        }

        return true;
    }

    public static closeParty = (partyName: string): void => {
        for (let i = 0; i < DataStore.parties.length; i++) {
            if (DataStore.parties[i].name === partyName) {
                let pokerPlayer = DataStore.pokerPlayer.filter(x => x.partyName === partyName);
                pokerPlayer.forEach(pokerPlayer => {
                    let index = DataStore.pokerPlayer.indexOf(pokerPlayer);
                    DataStore.pokerPlayer.splice(index, 1);
                });
                DataStore.parties.splice(i, 1); 
                return;
            }
        }

        //notify user
    }

    public static getBySocketId = (socketId: string): PokerPlayer | null => {
        for (let i = 0; i < DataStore.pokerPlayer.length; i++) {
            if (DataStore.pokerPlayer[i].connectionId == socketId) return DataStore.pokerPlayer[i];
        }

        return null;
    }

    public static startParty = (party: Party, password: string, pokerPlayer: PokerPlayer): boolean => {
        if (DataStore.parties.filter(x => x.name === party.name).length > 0) return false;
        DataStore.parties.push(party);
        DataStore.pokerPlayer.push(pokerPlayer);
        return true;
    }

    public static isPartyStarted = (partyName: string): boolean => {
        for (let i = 0; i < DataStore.parties.length; i++) {
            if (DataStore.parties[i].name === partyName) return true;
        }

        return false;
    }

    public static getPlayers = (partyName: string): Array<PokerPlayer> => {
        let party = DataStore.parties.filter(x => x.name === partyName)[0];
        if (isNullOrUndefined(party)) return [];
        return party.members;
    }

    public static getParty = (partyName: string): IPartyJSON => {
        let party = DataStore.parties.filter(x => x.name === partyName)[0];
        if (isNullOrUndefined(party)) return null;
        return party.toJSON();
    }

    public static getPlayersJSON = (partyName: string): Array<IPokerPlayer> => {
        let party = DataStore.parties.filter(x => x.name === partyName)[0];
        if (isNullOrUndefined(party)) return [];
        return party.members.map(member => {
            return member.toJSON();
        });
    }

    public static getPartyDetails = (): Array<IPartyJSON> => {
        return DataStore.parties.map(party => {
            return party.toJSON()
        });
    }

    public static validateParty = (partyName: string, password: string): boolean => {
        for (let i = 0; i < DataStore.parties.length; i++) {
            if (DataStore.parties[i].name === partyName) {
                return (DataStore.parties[i].password === password && DataStore.parties[i].members.length < 8);
            }
        }

        return false;
    }

    public static joinParty = (partyName: string, password: string, pokerPlayer: PokerPlayer): boolean => {
        for (let i = 0; i < DataStore.parties.length; i++) {
            if (DataStore.parties[i].name === partyName && DataStore.parties[i].password === password) {
                if (DataStore.parties[i].members.filter(x => x.username === pokerPlayer.username).length > 0) return false;
                DataStore.parties[i].join(pokerPlayer);
                DataStore.pokerPlayer.push(pokerPlayer);
                return true;
            }
        }

        return false;
    }

    public static getLowestAvailableSeat = (partyName: string): number => {
        let party = DataStore.parties.filter(x => x.name === partyName)[0];

        if (isNullOrUndefined(party)) return -1;

        let array = [1, 2, 3, 4, 5, 6, 7, 8];

        party.members.forEach(member => {
            if (array.includes(member.seatNumber)) {
                let index = array.indexOf(member.seatNumber);
                array.splice(index, 1);
            }
        });

        return Math.min(...array);
    }

    public static addItem = (item: PokerItem): boolean => {
        DataStore.parties.forEach((party: Party) => {
            if (party.name === item.partyName) {
                return party.setItem(item);
            }
        });

        return false;
    }

    public static setPlayersVote = (clone: IPokerPlayer): boolean => {
        if (isNullOrUndefined(clone) || isNullOrUndefined(clone.id)) return false;

        for (let i = 0; i < DataStore.parties.length; i++) {
            if (DataStore.parties[i].name === clone.partyName) {
                let player: PokerPlayer = DataStore.parties[i].members.filter(x => x.id === clone.id)[0];
                if (isNullOrUndefined(player)) return false;
                if (clone.voted === false) player.resetVote();
                else if (clone.voted === true) player.mirror(clone);
                return true;
            }
        }

        return false;
    }

    public static resetVote = (partyName: string): boolean => {
        let party = DataStore.parties.filter(x => x.name === partyName)[0];
        
        if (isNullOrUndefined(party) === true) return false;

        party.members.forEach((player: PokerPlayer) => {
            player.resetVote();
        });

        return true;
    }
}