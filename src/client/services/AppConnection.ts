import * as io from "socket.io-client";
import { IPokerPlayer } from "../../shared/models/PokerPlayer";
import PokerPlayer from "../../shared/models/PokerPlayer";
import IPartyInitialPayload from "../../shared/interfaces/IPartyInitialPayload";
import IResetPayload from "../../shared/interfaces/IResetPayload";
import IVotePayload from "../../shared/interfaces/IVotePayload";
import { Guid } from "../../shared/common";
import IResponsePayload from "../../shared/interfaces/IResponsePayload";
import { IPartyJSON } from "../../shared/models/Party";
import SocketEvent from "../../shared/enums/SocketEvent";
import PokerItem, { IPokerItem } from "../../shared/models/PokerItem";

export type ISubscriber = [SocketEvent, Function, string?]; // SocketEvent, Callback Function, SubscriberID

export default class AppConnection {
    private static subscribers: Array<ISubscriber> = [];
    private static socket: SocketIOClient.Socket = null;

    public static start = (url: string): void => {
        try {
            AppConnection.socket = io(url);

            AppConnection.socket.connect();

            AppConnection.socket.on(SocketEvent.Connect, () => {
                AppConnection.setup();
                AppConnection.subscribers.forEach((subscriber: ISubscriber) => {
                    if (subscriber[0] === SocketEvent.Connect) subscriber[1]();
                });
            });

            AppConnection.socket.on(SocketEvent.Disconnect, () => {
                AppConnection.subscribers.forEach((subscriber: ISubscriber) => {
                    if (subscriber[0] === SocketEvent.Disconnect) subscriber[1]();
                });
            })
        }
        catch{
            return;
        }
    }

    public static stop = (): void => {
        AppConnection.socket.disconnect();
    }

    public static subscribe = (subscriber: ISubscriber): string => {
        let guid = Guid();
        AppConnection.subscribers.push([subscriber[0], subscriber[1], guid]);
        return guid;
    }

    public static unsubscribe = (subscriptionId: string): boolean => {
        for (let i = 0; i < AppConnection.subscribers.length; i++) {
            if (AppConnection.subscribers[i][2] === subscriptionId) {
                AppConnection.subscribers.splice(i, 1);
                return true;
            }
        }
        return false;
    }

    public static joinParty = (object: IPartyInitialPayload): Promise<IResponsePayload<number>> => {
        let success = false;
        return new Promise((resolve, reject) => {
            AppConnection.socket.emit(SocketEvent.JoinParty, object, (res: IResponsePayload<number>) => {
                success = true;
                resolve(res);
            });

            setTimeout(() => {
                if (!success) reject();
            }, 5000);
        })
    }

    public static startParty = (object: IPartyInitialPayload): Promise<IResponsePayload<number>> => {
        let success = false;
        return new Promise((resolve, reject) => {
            AppConnection.socket.emit(SocketEvent.StartParty, object, (res: IResponsePayload<number>) => {
                success = true;
                resolve(res);
            });

            setTimeout(() => {
                if (!success) reject();
            }, 5000);
        })
    }

    public static getParty = (partyName: string): Promise<IPartyJSON> => {
        let success = false;
        return new Promise((resolve, reject) => {
            AppConnection.socket.emit(SocketEvent.GetParty, partyName, (party: IPartyJSON) => {
                resolve(party);
            });

            setTimeout(() => {
                if (!success) reject();
            }, 5000);
        });
    }

    public static submitItem = (item: PokerItem): Promise<IResponsePayload<any>> => {
        let success = false;
        return new Promise((resolve, reject) => {
            AppConnection.socket.emit(SocketEvent.SubmitItem, item.toJSON(), (res: IResponsePayload<any>) => {
                success = true;
                resolve(res);
            });

            setTimeout(() => {
                if (!success) reject();
            }, 5000);
        });
    }

    public static revoteItem = (partyName: string): Promise<IResponsePayload<any>> => {
        let success = false;
        return new Promise((resolve, reject) => {
            AppConnection.socket.emit(SocketEvent.RevoteItem, partyName, (res: IResponsePayload<any>) => {
                success = true;
                resolve(res);
            });

            setTimeout(() => {
                if (!success) reject();
            }, 5000);
        });
    }

    public static vote = (partyName: string, pokerPlayer: PokerPlayer): Promise<IResponsePayload<any>> => {
        let success = false;
        return new Promise((resolve, reject) => {
            let payload: IVotePayload = {
                partyName: partyName,
                pokerPlayer: pokerPlayer.toJSON()
            }

            AppConnection.socket.emit(SocketEvent.Vote, payload, (res: IResponsePayload<any>) => {
                success = true;
                resolve(res);
            });

            setTimeout(() => {
                if (!success) reject();
            }, 5000);
        });
    }

    public static reset = (partyName: string): Promise<IResponsePayload<any>> => {
        let success = false;
        return new Promise((resolve, reject) => {
            let payload: IResetPayload = {
                partyName: partyName
            }
            AppConnection.socket.emit(SocketEvent.Reset, payload, (res: IResponsePayload<any>) => {
                success = true;
                resolve(res);
            });

            setTimeout(() => {
                if (!success) reject();
            }, 5000);
        });
    }

    public static getParties = (): Promise<Array<IPartyJSON>> => {
        let success = false;
        return new Promise((resolve, reject) => {
            AppConnection.socket.emit(SocketEvent.GetParties, (parties: Array<IPartyJSON>) => {
                success = true;
                resolve(parties);
            });

            setTimeout(() => {
                if (!success) reject();
            }, 5000);
        });
    }

    public static removeVoter = (pokerPlayer: PokerPlayer): Promise<IResponsePayload<any>> => {
        let success = false;
        return new Promise((resolve, reject) => {
            try {
                let json = pokerPlayer.toJSON();
                AppConnection.socket.emit(SocketEvent.RemovePlayer, json, (args: IResponsePayload<any>) => {
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

    private static setup = (): void => {
        AppConnection.socket.on(SocketEvent.ItemSubmmitted, (args: IPokerItem) => {
            AppConnection.subscribers.forEach((subscriber: ISubscriber) => {
                if (subscriber[0] === SocketEvent.ItemSubmmitted) subscriber[1](args);
            });
        });

        AppConnection.socket.on(SocketEvent.PlayerAdded, (pokerPlayer: IPokerPlayer) => {
            AppConnection.subscribers.forEach((subscriber: ISubscriber) => {
                if (subscriber[0] === SocketEvent.PlayerAdded) subscriber[1](pokerPlayer);
            });
        });

        AppConnection.socket.on(SocketEvent.PlayerRemoved, (pokerPlayer: IPokerPlayer) => {
            AppConnection.subscribers.forEach((subscriber: ISubscriber) => {
                if (subscriber[0] === SocketEvent.PlayerRemoved) subscriber[1](pokerPlayer);
            });
        });

        AppConnection.socket.on(SocketEvent.LocalClosed, (args: any) => {
            AppConnection.subscribers.forEach((subscriber: ISubscriber) => {
                if (subscriber[0] === SocketEvent.LocalClosed) subscriber[1]();
            });
        });

        AppConnection.socket.on(SocketEvent.PlayerVoted, (pokerPlayer: IPokerPlayer) => {
            AppConnection.subscribers.forEach((subscriber: ISubscriber) => {
                if (subscriber[0] === SocketEvent.PlayerVoted) subscriber[1](pokerPlayer);
            });
        });

        AppConnection.socket.on(SocketEvent.Reset, () => {
            AppConnection.subscribers.forEach((subscriber: ISubscriber) => {
                if (subscriber[0] === SocketEvent.Reset) subscriber[1]();
            });
        });

        AppConnection.socket.on(SocketEvent.OtherClosed, () => {
            AppConnection.subscribers.forEach((subscriber: ISubscriber) => {
                if (subscriber[0] === SocketEvent.OtherClosed) subscriber[1]();
            });
        });

        AppConnection.socket.on(SocketEvent.PartyAdded, (party: IPartyJSON) => {
            AppConnection.subscribers.forEach((subscriber: ISubscriber) => {
                if (subscriber[0] === SocketEvent.PartyAdded) subscriber[1](party);
            });
        });
        
        AppConnection.socket.on(SocketEvent.RevoteItem, () => {
            AppConnection.subscribers.forEach((subscriber: ISubscriber) => {
                if (subscriber[0] === SocketEvent.RevoteItem) subscriber[1]();
            });
        })
    }
}


