import * as React from "react";
import { AppContext } from "../contexts/AppContext";
import Login from "./Login";
import AppConnection from "../services/AppConnection";
import PokerPlayer from "../../shared/models/PokerPlayer";
import Modal from "./Modal";
import SocketEvent from "../../shared/enums/SocketEvent";
import IModalData from "../interfaces/IModalData";
import Header from "./Header";
import PokerTable from "./PokerTable";
import Curtain from "./Curtain";


interface IProps {};

interface IState {
    PokerPlayers: Array<PokerPlayer>;
    connectionLost: boolean;
    user: PokerPlayer;
    loggedIn: boolean;
    modal: IModalData;
    intialRendered: boolean;
    isAdmin: boolean;
};

export class App extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props)
        this.state = {
            PokerPlayers: [],
            connectionLost: false,
            user: null,
            loggedIn: false,
            intialRendered: false,
            isAdmin: false,
            modal: {
                active: false,
                body: null,
                callback: null,
            }
        }
    }

    public render = (): JSX.Element => {
        let value = {
            isAdmin: this.state.isAdmin,
            user: this.state.user,
            loggedIn: this.state.loggedIn,
            modal: this.state.modal,
            login: this.login,
            dropModal: this.dropModal,
            closeModal: this.closeModal,
            updateUser: this.updateUser
        }

        return (
            <AppContext.Provider value={value}>
                <AppContext.Consumer>
                    {context => (
                        <React.Fragment>
                            <Modal active={context.modal.active} body={context.modal.body}/>
                            <Header user={context.user}/>
                            <div id="body">
                                {
                                    this.state.connectionLost ? 
                                    <div id="connection-warning">
                                        Connection has been lost!
                                    </div>
                                    :
                                    context.loggedIn === false ? <Login/> :
                                    <Curtain>
                                        <PokerTable user={context.user} isAdmin={context.isAdmin}/> 
                                    </Curtain>
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
        AppConnection.subscribe([SocketEvent.Disconnect, () => {
            this.state.modal.active = false;
            this.state.modal.body = null;
            this.state.modal.callback = null;

            this.setState({
                modal: this.state.modal,
                connectionLost: true
            });
        }]);

        AppConnection.subscribe([SocketEvent.LocalClosed, () => {
            this.state.modal.active = false;
            this.state.modal.body = null;
            this.state.modal.callback = null;

            this.setState({
                modal: this.state.modal,
                connectionLost: true
            });
        }]);

        AppConnection.subscribe([SocketEvent.Reset, () => {
            this.state.user.vote = null;
            this.state.user.voted = false;
            this.state.modal.active = false;
            this.state.modal.body = null;
            this.state.modal.callback = null;
            
            this.setState({
                user: this.state.user,
                modal: this.state.modal
            });
        }]);

        AppConnection.start("http://" + document.domain + ":" + 8080);
    }

    public initialRendered = (): void => {
        this.setState({
            intialRendered: true
        });
    }

    public login = (user: PokerPlayer): void => {
        this.setState({
            loggedIn: true,
            user: user,
            isAdmin: user.admin
        });
    }

    public dropModal = (display: boolean, body: JSX.Element | JSX.Element[], callback: (success: boolean) => void): void => {
        this.state.modal.active = display;
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

    public updateUser = (user: PokerPlayer): void => {
        this.setState({
            user: user,
        });
    }
}