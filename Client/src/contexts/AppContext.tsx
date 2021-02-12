import * as React from "react";
import Player from "../models/Player";
import IModalData from "../interfaces/IModalData";
import Party from "../models/Party";

export interface IAppContext {
    isAdmin: boolean;
    user: Player; 
    party: Party;
    modal: IModalData;
    login: (user: Player, party: Party, isAdmin: boolean) => void;
    showModal: (body: JSX.Element | JSX.Element[], callback: (success: boolean) => void) => void;
    closeModal: () => void;
    updateUser: (user: Player) => void;
}

const contextObject: IAppContext = {
    isAdmin: false,
    user: null,
    party: null,
    modal: {
        active: false,
        body: null,
        callback: null,
    },
    login: null,
    showModal: null,
    closeModal: null,
    updateUser: null,
};

export const AppContext = React.createContext<IAppContext>(contextObject);
