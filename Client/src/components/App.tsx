import * as React from "react";
import { AppContext, IAppContext } from "../contexts/AppContext";
import Login from "./Login";
import Player, { IPlayer } from "../models/Player";
import Modal from "./Modal";
import IModalData from "../interfaces/IModalData";
import Header from "./Header";
import PokerTable from "./PokerTable";
import Curtain from "./Curtain";
import ContentContainer from "./ContentContainer";
import Party from "..//models/Party";
import { SignalRService } from "../services/SignalRService";


interface IProps { };

interface IState {
    isAdmin: boolean;
    party: Party;
    connectionLost: boolean;
    user: Player;
    loggedIn: boolean;
    modal: IModalData;
    intialRendered: boolean;
};

export class App extends React.Component<IProps, IState> {
    private timeoutCheck: NodeJS.Timeout = null;

    constructor(props: IProps) {
        super(props)
        this.state = {
            isAdmin: false,
            party: null,
            connectionLost: false,
            user: null,
            loggedIn: false,
            intialRendered: false,
            modal: {
                active: false,
                body: null,
                callback: null,
            }
        }

        SignalRService.getInstance();
    }

    public render = (): JSX.Element => {
        let value: IAppContext = {
            isAdmin: this.state.isAdmin,
            user: this.state.user,
            party: this.state.party,
            modal: this.state.modal,
            login: this.login,
            showModal: this.showModal,
            closeModal: this.closeModal,
            updateUser: this.updateUser
        }

        return (
            <AppContext.Provider value={value}>
                <AppContext.Consumer>
                    {context => (
                        <React.Fragment>
                            <Modal active={context.modal.active}/>
                            <Header user={context.user}/>
                            <div id="body">
                                {
                                    this.state.connectionLost ? 
                                    <div id="connection-warning">
                                        Connection has been lost!
                                    </div>
                                    :
                                    this.state.loggedIn === false ? 
                                    <Login/> 
                                    :
                                    <React.Fragment>
                                        <Curtain>
                                            <div id="poker-room">
                                                <div id="content-container">
                                                    <ContentContainer user={context.user} party={this.state.party}/>
                                                </div>
                                                <PokerTable user={context.user} party={this.state.party}/> 
                                            </div>
                                        </Curtain>
                                    </React.Fragment>
                                }
                            </div>
                            <div id="footer">
                                
                            </div>
                        </React.Fragment>
                    )}
                </AppContext.Consumer>
            </AppContext.Provider>
        );
    }

    public componentDidMount = (): void => {
        SignalRService.getInstance().connect();
    }

    public initialRendered = (): void => {
        this.setState({
            intialRendered: true
        });
    }

    public login = (user: Player, party: Party, isAdmin: boolean): void => {
        this.setState({
            loggedIn: true,
            isAdmin: isAdmin,
            user: user, 
            party: party
        });
    }

    public showModal = (body: JSX.Element | JSX.Element[], callback: (success: boolean) => void): void => {
        this.state.modal.active = true;
        this.state.modal.body = body;
        this.state.modal.callback = callback;

        this.setState({
            modal: this.state.modal
        });
    }

    public closeModal = (): void => {
        this.state.modal.active = false;
        this.state.modal.body = null;
        this.state.modal.callback = null;

        this.setState({
            modal: this.state.modal
        });
    }

    public updateUser = (user: Player): void => {
        this.setState({
            user: user,
        });
    }
}