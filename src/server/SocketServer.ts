import * as socket from "socket.io";
import PokerPlayer, { IPokerPlayer } from "../shared/models/PokerPlayer";
import DataStore from "./DataStore";
import Party, { IPartyJSON } from "../shared/models/Party";
import IPartyInitialPayload from "../shared/interfaces/IPartyInitialPayload";
import PokerItem, { IPokerItem } from "../shared/models/PokerItem"
import IResetPayload from "../shared/interfaces/IResetPayload";
import IVotePayload from "../shared/interfaces/IVotePayload";
import IResponsePayload from "../shared/interfaces/IResponsePayload";
import SocketEvent from "../shared/enums/SocketEvent";
import { isNullOrUndefined } from "util";


type PartyDetailsCallback = (args: Array<IPartyJSON>) => void;
type SuccessCallback = (args: IResponsePayload<boolean>) => void;
type SuccessInitialCallback = (callback: IResponsePayload<number>) => void;

export class SocketService {
    private io: socket.Server;
    private socket: socket.Socket;
    private watchers: Array<Function>;

    constructor(server: any) {
        this.watchers = [];
        this.io = socket(server);
        this.io.origins("*:8080");

        this.io.sockets.on(SocketEvent.Connect, (socket: socket.Socket) => {
            this.socket = socket;
            this.setup(socket);
        });
    }

    private setup = (socket: socket.Socket): void => {
        socket.on(SocketEvent.Disconnect, () => {
            let pokerPlayer = DataStore.getBySocketId(socket.id);

            if (pokerPlayer == null) return;

            if (pokerPlayer.admin === true) {
                DataStore.closeParty(pokerPlayer.partyName);
                this.broadcastToParty(pokerPlayer.partyName, SocketEvent.LocalClosed, {});
                this.broadcast(SocketEvent.OtherClosed, {});
            } else {
                DataStore.removePokerPlayer(pokerPlayer);
                this.broadcastToParty(pokerPlayer.partyName, SocketEvent.PlayerRemoved, pokerPlayer.toJSON());
            }

            socket.leave(pokerPlayer.partyName);
        });

        socket.on(SocketEvent.RemovePlayer, (args: IPokerPlayer, callback: SuccessCallback): void => {
            if (isNullOrUndefined(args)) return this.sendBadResult("Could not remove player", callback);
            let players = DataStore.getPlayers(args.partyName);
            let pokerPlayer = players.filter(x => x.id === args.id)[0];
            if (isNullOrUndefined(pokerPlayer) || DataStore.removePokerPlayer(pokerPlayer) === false) return this.sendBadResult("Could not remove player", callback);
            if (pokerPlayer.admin === true) {
                DataStore.closeParty(pokerPlayer.partyName);
                this.broadcastToParty(pokerPlayer.partyName, SocketEvent.LocalClosed, {});
                this.broadcast(SocketEvent.OtherClosed, {});
                this.sendGoodResult(null, null, callback);
            } else {
                this.io.to(pokerPlayer.connectionId).emit(SocketEvent.LocalClosed);
                this.broadcastToParty(args.partyName, SocketEvent.PlayerRemoved, pokerPlayer.toJSON());
                this.sendGoodResult(null, null, callback);
            }
        });

        socket.on(SocketEvent.SubmitItem, (args: IPokerItem, callback: SuccessCallback): void => {
            let pokerItem = new PokerItem(args);
            if (isNullOrUndefined(pokerItem)) return this.sendBadResult("Could not create item.", callback);
            DataStore.addItem(pokerItem);

            this.broadcastToParty(args.partyName, SocketEvent.ItemSubmmitted, args);
            this.sendGoodResult(null, null, callback);
        });

        socket.on(SocketEvent.RevoteItem, (partyName: string, callback: SuccessCallback): void => {
            if (DataStore.isPartyStarted(partyName) === false) return this.sendBadResult("Bad revote request", callback);
            if (DataStore.resetVote(partyName) === false) return this.sendBadResult("Bad revote request", callback);
            this.broadcastToParty(partyName, SocketEvent.RevoteItem, null);
            this.sendGoodResult(null, null, callback);
        });

        socket.on(SocketEvent.Vote, (args: IVotePayload, callback: SuccessCallback): void => {
            if (DataStore.isPartyStarted(args.partyName) === false) return this.sendBadResult("Bad vote request", callback);
            if (DataStore.setPlayersVote(args.pokerPlayer) === false) return this.sendBadResult("Vote unsuccessful", callback);
            let player = DataStore.getPlayers(args.partyName).filter(x => x.id === args.pokerPlayer.id)[0];
            this.broadcastToParty(args.partyName, SocketEvent.PlayerVoted, player.toJSON());
            this.sendGoodResult(null, null, callback);
        });

        socket.on(SocketEvent.Reset, (args: IResetPayload, callback: SuccessCallback): void => {
            this.broadcastToParty(args.partyName, SocketEvent.Reset, {});
            this.sendGoodResult(null, null, callback);
        });

        socket.on(SocketEvent.GetParties, (callback: PartyDetailsCallback): void => {
            callback(DataStore.getPartyDetails());
        });

        socket.on(SocketEvent.StartParty, (req: IPartyInitialPayload, callback: SuccessInitialCallback) => {
            let partyName = req.partyName;
            let jPokerPlayer = req.pokerPlayer;
            let password = req.password;
            if (jPokerPlayer.admin === true && !DataStore.isPartyStarted(partyName)) {
                jPokerPlayer.connectionId = socket.id;

                let admin = new PokerPlayer(jPokerPlayer);
                let party = new Party(admin, password);

                if (DataStore.startParty(party, password, admin) === false) return this.sendBadResult("Could not start party.", callback) 

                let seatNumber = DataStore.getLowestAvailableSeat(req.partyName);

                if (seatNumber === -1) return this.sendBadResult("Could not join party", callback);

                admin.setSeatNumber(seatNumber);

                socket.join(partyName);

                this.broadcast(SocketEvent.PartyAdded, party.toJSON());

                this.sendGoodResult<number>(null, jPokerPlayer.seatNumber, callback);

            } else this.sendBadResult("Could not join party.", callback);
        });

        socket.on(SocketEvent.JoinParty, (req: IPartyInitialPayload, callback: SuccessInitialCallback) => {
            let partyName = req.partyName;
            let jPokerPlayer = req.pokerPlayer;
            let password = req.password;
            if (jPokerPlayer.admin === false && DataStore.validateParty(partyName, password)) {
                jPokerPlayer.seatNumber = DataStore.getLowestAvailableSeat(req.partyName);
                jPokerPlayer.connectionId = socket.id;

                let pokerPlayer = new PokerPlayer(jPokerPlayer);

                if (DataStore.joinParty(partyName, password, pokerPlayer) === false) return this.sendBadResult("Could not join party.", callback);

                socket.join(partyName);
                
                this.broadcastToParty(partyName, SocketEvent.PlayerAdded, pokerPlayer.toJSON());

                this.sendGoodResult<number>(null, jPokerPlayer.seatNumber, callback);
            } else this.sendBadResult("Could not join party.", callback);
        });

        socket.on(SocketEvent.GetPokerPlayers, (partyName: string, callback: Function) => {
            callback(DataStore.getPlayersJSON(partyName));
        });
        
        type GetPartyCallback = (party: IPartyJSON) => void;
        socket.on(SocketEvent.GetParty, (partyName: string, callback: GetPartyCallback) => {
            callback(DataStore.getParty(partyName));
        });
    }

    private broadcastToParty = (party: string, method: string, args: any) => {
        this.io.to(party).emit(method, args);
    }

    private broadcast = (method: string, args: any) => {
        this.io.emit(method, args);
    }

    private sendBadResult = (message: string, callback: Function) => {
        callback({
            message: message,
            success: false,
        });
    }

    private sendGoodResult = <T>(message: string, data: any, callback: (object: IResponsePayload<T>) => void) => {
        callback({
            message: message,
            success: true,
            data: data
        });
    }
}