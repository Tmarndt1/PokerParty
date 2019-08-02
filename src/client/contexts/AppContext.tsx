import * as React from "react";
import PokerPlayer from "../../shared/models/PokerPlayer";
import IModalData from "../interfaces/IModalData";

export interface IAppContext {
    isAdmin: boolean;
    user: PokerPlayer; 
    loggedIn: boolean;
    modal: IModalData;
    login: (user: PokerPlayer) => void;
    dropModal: (display: boolean, body: JSX.Element | JSX.Element[], callback: (success: boolean) => void) => void;
    closeModal: () => void;
    updateUser: (user: PokerPlayer) => void;
}

const contextObject: IAppContext = {
    isAdmin: false,
    user: null,
    loggedIn: false,
    modal: {
        active: false,
        body: null,
        callback: null,
    },
    login: null,
    dropModal: null,
    closeModal: null,
    updateUser: null,
};

export const AppContext = React.createContext<IAppContext>(contextObject);
