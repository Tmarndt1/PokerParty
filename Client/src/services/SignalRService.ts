import * as signalR from "@microsoft/signalr";
import { Player, IPlayer } from "../models/Player";
import { Party, IParty } from "../models/Party";
import { IWorkItem } from "../models/WorkItem";
import IResponse from "../interfaces/IResponse";
import IRemoveVoterRequest from "../interfaces/IRemoveVoterRequest";
import IWorkItemRequest from "../interfaces/IWorkItemRequest";
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
    GetParty = "GetParty",
    Reset = "Reset",
    ItemSubmmitted = "ItemSubmmitted",
    PartyClosed = "PartyClosed",
    OtherClosed = "OtherClosed",
    SubmitWorkItem = "SubmitWorkItem",
    SubmitVote = "SubmitVote",
    RevoteItem = "RevoteItem",
    RemovePlayer = "RemovePlayer",
    PlayerUpdate = "PlayerUpdate",
    PartyUpdate = "PartyUpdate",
    Flip = "Flip"
}

export interface ISubscriber {
    event: SignalREvent;
    callback: (args?: any) => any;
}

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

        this.listen();
    }

    public static getInstance(): SignalRService {
        if (this._instance) return this._instance;
        else {
            this._instance = new SignalRService();
            return this._instance;
        }
    }

    public subscribe = (event: SignalREvent, callback: (args?: any) => any): void => {
        this._subscribers.push({
            event: event, 
            callback: callback
        });
    }

    public connect = (): void => {
        this._connection.start()
        .then(res => {
            this.isConnected = true;
        })
        .catch(err => {
            console.log(err);
            this.isConnected = false;
        });
    }

    public joinParty = (request: IStartOrJoinRequest): Promise<{user: Player, party: Party}> => {
        return new Promise(async (resolve, reject) => {
            try {
                let result: IResponse<IStartOrJoinResponse> = await this._connection.invoke(SignalREvent.Join, request);

                if (result.success === true) {
                    resolve({
                        user: new Player(result.data.user),
                        party: new Party(result.data.party)
                    });
                } else if (!isNothing(result.message)) {
                    reject(result.message);
                } else {
                    reject("Failed to join the poker party");
                }

            } catch (error) {
                reject(error);
            }
        });
    }

    public startParty = (request: IStartOrJoinRequest): Promise<{user: Player, party: Party}> => {
        return new Promise(async (resolve, reject) => {
            try {
                let result: IResponse<IStartOrJoinResponse> = await this._connection.invoke(SignalREvent.Start, request);

                if (result.success === true) {
                    resolve({
                        user: new Player(result.data.user),
                        party: new Party(result.data.party)
                    });
                } else if (!isNothing(result.message)) {
                    reject(result.message);
                } else {
                    reject("Failed to start the poker party");
                }

            } catch (error) {
                reject(error);
            }
        });
    }

    public submitWorkItem = (request: IWorkItemRequest): Promise<Party> => {
        return new Promise(async (resolve, reject) => {
            try {
                let result: IResponse<IParty> = await this._connection.invoke(SignalREvent.SubmitWorkItem, request);

                resolve(new Party(result.data));

            } catch (error) {
                reject(error);
            }
        });
    }

    public revoteItem = (request: IRevoteRequest): Promise<IResponse<any>> => {
        let success = false;
        return new Promise((resolve, reject) => {
            this._connection.invoke(SignalREvent.RevoteItem, request, (res: IResponse<any>) => {
                success = true;
                resolve(res);
            });

            setTimeout(() => {
                if (!success) reject();
            }, 5000);
        });
    }

    public submitVote = (request: IVoteRequest): Promise<Party> => {
        return new Promise(async (resolve, reject) => {
            try {
                let result: IResponse<IParty> = await this._connection.invoke(SignalREvent.SubmitVote, request);
                
                if (result.success) {
                    resolve(new Party(result.data));
                } else {
                    reject("Failed to complete vote request");
                }
            }
            catch (error) {
                reject(error);
            }
        });
    }

    public reset = (partyName: string, password: string): Promise<Party> => {
        let success = false;
        return new Promise((resolve, reject) => {
            this._connection.invoke(SignalREvent.Reset, { partyName: partyName, password: password}, (res: IResponse<IParty>) => {
                success = true;
                resolve(new Party(res.data));
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
    
    public flip = (partyName: string, passowrd: string): Promise<Party> => {
        return new Promise(async (resolve, reject) => {
            try {
                let result: IResponse<IParty> = await this._connection.invoke(SignalREvent.Flip, { partyName: partyName, password: passowrd});
                
                if (result.success) {
                    resolve(new Party(result.data));
                } else {
                    reject("Failed to complete vote request");
                }
            }
            catch (error) {
                reject(error);
            }
        });
    }

    private listen = (): void => {
        this._connection.on(SignalREvent.ItemSubmmitted, (args: IWorkItem) => {
            this._subscribers.forEach((subscriber: ISubscriber) => {
                if (subscriber.event === SignalREvent.ItemSubmmitted) subscriber.callback(args);
            });
        });

        this._connection.on(SignalREvent.PartyUpdate, (party: IParty) => {
            this._subscribers.forEach((subscriber: ISubscriber) => {
                if (subscriber.event === SignalREvent.PartyUpdate) subscriber.callback(party);
            });
        });

        this._connection.on(SignalREvent.PartyClosed, (args: any) => {
            this._subscribers.forEach((subscriber: ISubscriber) => {
                if (subscriber.event === SignalREvent.PartyClosed) subscriber.callback(args);
            });
        });

        this._connection.on(SignalREvent.Reset, (party: IParty) => {
            this._subscribers.forEach((subscriber: ISubscriber) => {
                if (subscriber.event === SignalREvent.Reset) subscriber.callback(party);
            });
        });

        this._connection.on(SignalREvent.OtherClosed, () => {
            this._subscribers.forEach((subscriber: ISubscriber) => {
                if (subscriber.event === SignalREvent.OtherClosed) subscriber.callback();
            });
        });
        
        this._connection.on(SignalREvent.RevoteItem, (party: IParty) => {
            this._subscribers.forEach((subscriber: ISubscriber) => {
                if (subscriber.event === SignalREvent.RevoteItem) subscriber.callback(party);
            });
        });

        this._connection.on(SignalREvent.PlayerUpdate, (player: IPlayer) => {
            this._subscribers.forEach((subscriber: ISubscriber) => {
                if (subscriber.event === SignalREvent.PlayerUpdate) subscriber.callback(player);
            });
        });
    }
}