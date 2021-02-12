import * as signalR from "@microsoft/signalr";
import Player, { IPlayer } from "../models/Player";
import Party, { IParty } from "../models/Party";
import { IPokerItem } from "../models/PokerItem";
import IResponse from "../interfaces/IResponse";
import IRemoveVoterRequest from "../interfaces/IRemoveVoterRequest";
import IResetRequest from "../interfaces/IResetRequest";
import ISubmitItemRequest from "../interfaces/ISubmitItemRequest";
import IRevoteRequest from "../interfaces/IRevoteRequest";
import IVoteRequest from "../interfaces/IVoteRequest";
import IStartOrJoinRequest from "../interfaces/IStartOrJoinRequest";
import IStartOrJoinResponse from "../interfaces/IStartOrJoinResponse";
import { isNothing } from "../utilitites/isNothing";

export enum SignalREvent {
    Connected = "Connected",
    Disconnected = "Disconnected",
    Join = "Join",
    Start = "Start",
    GetPokerPlayers = "GetPokerPlayers",
    GetParties = "GetParties",
    GetParty = "GetParty",
    Vote = "Vote",
    Reset = "Reset",
    ItemSubmmitted = "ItemSubmmitted",
    PartyClosed = "PartyClosed",
    OtherClosed = "OtherClosed",
    SubmitItem = "SubmitItem",
    RevoteItem = "RevoteItem",
    PartyAdded = "PartyAdded",
    PlayerVoted = "PlayerVoted",
    PlayerRemoved = "PlayerRemoved",
    RemovePlayer = "RemovePlayer",
    PlayerUpdate = "PlayerUpdate",
    PartyUpdate = "PartyUpdate",
    PlayerAdded = "PlayerAdded"
}

export type ISubscriber = [SignalREvent, Function]; // SocketEvent, Callback Function, SubscriberID

export class SignalRService {
    public isConnected: boolean = false;
    private _subscribers: Array<ISubscriber> = [];
    private _connection: signalR.HubConnection;
    private static _instance: SignalRService;
    
    private constructor() {
        this._connection = new signalR.HubConnectionBuilder()
        .withUrl("http://" + document.domain + ":65000/signalR", {
            skipNegotiation: true,
            transport: signalR.HttpTransportType.WebSockets
        })
        .build();
        this.setupClientFunctions();
    }

    public static getInstance(): SignalRService {
        if (this._instance) return this._instance;
        else {
            this._instance = new SignalRService();
            return this._instance;
        }
    }

    public subscribe = (event: SignalREvent, callback: Function): void => {
        this._subscribers.push([event, callback]);
    }

    public connect = (): void => {
        this._connection.start()
        .then(res => {
            console.log(res);
            this.isConnected = true;
        })
        .catch(err => {
            console.log(err);
            this.isConnected = false;
        });
    }

    public joinParty = (request: IStartOrJoinRequest): Promise<{user: Player, party: Party}> => {
        let success = false;
        return new Promise((resolve, reject) => {
            this._connection.invoke(SignalREvent.Join, request)
            .then((res: IResponse<IStartOrJoinResponse>) => {
                if (res.success === true) {
                    resolve({
                        user: new Player(res.data.user),
                        party: new Party(res.data.party)
                    })
                } else if (!isNothing(res.message)) {
                    reject(res.message);
                } else {
                    reject("Failed to start the poker party");
                }
            })
            .catch(err => {
                reject(err);
            });
        })
    }

    public startParty = (request: IStartOrJoinRequest): Promise<{user: Player, party: Party}> => {
        return new Promise((resolve, reject) => {
            this._connection.invoke(SignalREvent.Start, request)
            .then((res: IResponse<IStartOrJoinResponse>) => {
                if (res.success === true) {
                    resolve({
                        user: new Player(res.data.user),
                        party: new Party(res.data.party)
                    });
                } else if (!isNothing(res.message)) {
                    reject(res.message);
                } else {
                    reject("Failed to start the poker party");
                }
            })
            .catch(err => {
                reject(err);
            });
        })
    }

    public getParty = (partyId: string): Promise<IParty> => {
        let success = false;
        return new Promise((resolve, reject) => {
            this._connection.invoke(SignalREvent.GetParty, partyId, (party: IParty) => {
                resolve(party);
            });

            setTimeout(() => {
                if (!success) reject();
            }, 5000);
        });
    }

    public submitItem = (itemRequest: ISubmitItemRequest): Promise<IResponse<any>> => {
        let success = false;
        return new Promise((resolve, reject) => {
            this._connection.invoke(SignalREvent.SubmitItem, itemRequest, (res: IResponse<any>) => {
                success = true;
                resolve(res);
            });

            setTimeout(() => {
                if (!success) reject();
            }, 5000);
        });
    }

    public revoteItem = (revoteRequest: IRevoteRequest): Promise<IResponse<any>> => {
        let success = false;
        return new Promise((resolve, reject) => {
            this._connection.invoke(SignalREvent.RevoteItem, revoteRequest, (res: IResponse<any>) => {
                success = true;
                resolve(res);
            });

            setTimeout(() => {
                if (!success) reject();
            }, 5000);
        });
    }

    public vote = (voteRequest: IVoteRequest): Promise<IResponse<any>> => {
        let success = false;
        return new Promise((resolve, reject) => {
            this._connection.invoke(SignalREvent.Vote, voteRequest, (res: IResponse<any>) => {
                success = true;
                resolve(res);
            });

            setTimeout(() => {
                if (!success) reject();
            }, 5000);
        });
    }

    public reset = (resetRequest: IResetRequest): Promise<IResponse<any>> => {
        let success = false;
        return new Promise((resolve, reject) => {
            this._connection.invoke(SignalREvent.Reset, resetRequest, (res: IResponse<any>) => {
                success = true;
                resolve(res);
            });

            setTimeout(() => {
                if (!success) reject();
            }, 5000);
        });
    }

    public getParties = (): Promise<IParty[]> => {
        let success = false;
        return new Promise((resolve, reject) => {
            this._connection.invoke(SignalREvent.GetParties, (parties: IParty[]) => {
                success = true;
                resolve(parties);
            });

            setTimeout(() => {
                if (!success) reject();
            }, 5000);
        });
    }

    public removeVoter = (removeRequest: IRemoveVoterRequest): Promise<IResponse<any>> => {
        let success = false;
        return new Promise((resolve, reject) => {
            try {
                this._connection.invoke(SignalREvent.RemovePlayer, removeRequest, (args: IResponse<any>) => {
                    success = true;
                    resolve(args);
                });
    
                setTimeout(() => {
                    if (!success) reject();
                }, 5000);
            }
            catch {
                reject();
            }
        });
    }

    private setupClientFunctions = (): void => {
        this._connection.on(SignalREvent.ItemSubmmitted, (args: IPokerItem) => {
            this._subscribers.forEach((subscriber: ISubscriber) => {
                if (subscriber[0] === SignalREvent.ItemSubmmitted) subscriber[1](args);
            });
        });

        this._connection.on(SignalREvent.PartyUpdate, (party: IParty) => {
            this._subscribers.forEach((subscriber: ISubscriber) => {
                if (subscriber[0] === SignalREvent.PartyUpdate) subscriber[1](party);
            });
        });

        this._connection.on(SignalREvent.PlayerRemoved, (pokerPlayer: IPlayer) => {
            this._subscribers.forEach((subscriber: ISubscriber) => {
                if (subscriber[0] === SignalREvent.PlayerRemoved) subscriber[1](pokerPlayer);
            });
        });

        this._connection.on(SignalREvent.PartyClosed, (args: any) => {
            this._subscribers.forEach((subscriber: ISubscriber) => {
                if (subscriber[0] === SignalREvent.PartyClosed) subscriber[1](args);
            });
        });

        this._connection.on(SignalREvent.PlayerVoted, (pokerPlayer: IPlayer) => {
            this._subscribers.forEach((subscriber: ISubscriber) => {
                if (subscriber[0] === SignalREvent.PlayerVoted) subscriber[1](pokerPlayer);
            });
        });

        this._connection.on(SignalREvent.Reset, (party: IParty) => {
            this._subscribers.forEach((subscriber: ISubscriber) => {
                if (subscriber[0] === SignalREvent.Reset) subscriber[1](party);
            });
        });

        this._connection.on(SignalREvent.OtherClosed, () => {
            this._subscribers.forEach((subscriber: ISubscriber) => {
                if (subscriber[0] === SignalREvent.OtherClosed) subscriber[1]();
            });
        });

        this._connection.on(SignalREvent.PlayerAdded, (party: IParty) => {
            this._subscribers.forEach((subscriber: ISubscriber) => {
                if (subscriber[0] === SignalREvent.PlayerAdded) subscriber[1](party);
            });
        });
        
        this._connection.on(SignalREvent.RevoteItem, (party: IParty) => {
            this._subscribers.forEach((subscriber: ISubscriber) => {
                if (subscriber[0] === SignalREvent.RevoteItem) subscriber[1](party);
            });
        });

        this._connection.on(SignalREvent.PlayerUpdate, (player: IPlayer) => {
            this._subscribers.forEach((subscriber: ISubscriber) => {
                if (subscriber[0] === SignalREvent.PlayerUpdate) subscriber[1](player);
            });
        });
    }
}