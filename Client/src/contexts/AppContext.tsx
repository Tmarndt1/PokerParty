import * as React from "react";
import { Player } from "../models/Player";
import { IOverlay } from "../components/Overlay";
import { Party } from "../models/Party";
import { SignalRService } from "../services/SignalRService";

export enum Theme {
    Dark,
    Light
}

export interface IAppContext {
    theme: Theme;
    isAdmin: boolean;
    user: Player; 
    party: Party;
    modal: IOverlay;
    signalR: SignalRService;
    showOverlay: (body: JSX.Element | JSX.Element[], callback: (success: boolean) => void) => void;
    hideOverlay: () => void;
    updateUser: (user: Player) => void;
}

const contextObject: IAppContext = {
    theme: Theme.Dark,
    isAdmin: false,
    user: null,
    party: null,
    modal: {
        active: false,
        body: null,
        callback: null,
    },
    showOverlay: null,
    hideOverlay: null,
    updateUser: null,
    signalR: null
};

export const AppContext = React.createContext<IAppContext>(contextObject);
