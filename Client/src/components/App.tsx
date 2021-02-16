import * as React from "react";
import { AppContext, IAppContext, Theme } from "../contexts/AppContext";
import Login from "./Login";
import { Player } from "../models/Player";
import Modal from "./Modal";
import IModalData from "../interfaces/IModalData";
import Header from "./Header";
import PokerTable from "./PokerTable";
import { Party } from "../models/Party";
import { SignalRService } from "../services/SignalRService";
import { fakeAdmin, fakeParty } from "../fakes/configuration";
import { ITheme } from "../themes/ITheme";
import { darkTheme } from "../themes/darkTheme";
import { lightTheme } from "../themes/lightTheme";
import { WorkItem } from "../components/WorkItem";
import "../public/css/tab.css";
import { isNothing } from "../utilitites/isNothing";

let isFakes: boolean = true;

enum ViewOption {
    PokerTable,
    WorkItem,
    History
}

interface IProps { };

interface IState {
    isAdmin: boolean;
    party: Party;
    user: Player;
    connectionLost: boolean;
    loggedIn: boolean;
    modal: IModalData;
    intialRendered: boolean;
    theme: Theme;
    viewOption: ViewOption;
};

export class App extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props)
        this.state = {
            isAdmin: isFakes,
            party: isFakes ? fakeParty : null,
            user: isFakes ? fakeAdmin : null,
            loggedIn: isFakes,
            connectionLost: false,
            theme: Theme.Dark,
            intialRendered: false,
            viewOption: ViewOption.PokerTable,
            modal: {
                active: false,
                body: null,
                callback: null,
            }
        }
    }

    public render = (): JSX.Element => {
        let value: IAppContext = {
            theme: this.state.theme,
            isAdmin: this.state.isAdmin,
            user: this.state.user,
            party: this.state.party,
            modal: this.state.modal,
            login: this.login,
            showModal: this.showModal,
            closeModal: this.closeModal,
            updateUser: this.updateUser
        }

        let contentStyle: React.CSSProperties = {
            background: this.getTheme().pageBgColor,
            color: this.getTheme().fontColor
        }

        let roomStyle: React.CSSProperties = { 
            borderColor: this.getTheme().containerBrdColor,
            boxShadow: this.getTheme().boxShaddow,
            backgroundColor: this.getTheme().containerBkgdColor,
            borderRadius: 5
        }

        let dividerStyle: React.CSSProperties = {
            background: this.getTheme().dividerBkgdColor,
        }

        let pokerTableTabCss: string = this.state.viewOption === ViewOption.PokerTable ? "tab active" : "tab";
        let workItemTabCss: string = this.state.viewOption === ViewOption.WorkItem ? "tab active" : "tab";
        let historyTabCss: string = this.state.viewOption === ViewOption.History ? "tab active" : "tab";

        return (
            <div id="content" style={contentStyle}>
                <AppContext.Provider value={value}>
                    <AppContext.Consumer>
                        {
                            context => (
                                <React.Fragment>
                                    <Modal active={context.modal.active}/>
                                    <Header user={context.user}/>
                                    <div id="body">
                                        { 
                                            !this.state.loggedIn ? <Login/> : 
                                            <div id="poker-room" style={roomStyle}>
                                                <div id="poker-room-header">
                                                    <div className="tab-container">
                                                        <div className={pokerTableTabCss}
                                                            onClick={() => this.setViewOption(ViewOption.PokerTable)}>
                                                            Poker Table
                                                        </div>
                                                        <div className={workItemTabCss}
                                                            onClick={() => this.setViewOption(ViewOption.WorkItem)}>
                                                            Work Item
                                                        </div>
                                                        <div className={historyTabCss}
                                                            onClick={() => this.setViewOption(ViewOption.History)}>
                                                            History
                                                        </div>
                                                    </div>
                                                    <div id="admin-options">
                                                        <div>Revote</div>
                                                        <div>Submit</div>
                                                    </div>  
                                                </div>
                                                <div className="divider" style={dividerStyle}></div>
                                                { this.getBody(context) }
                                            </div> 
                                        }
                                    </div>
                                    <div id="footer"></div>
                                </React.Fragment>
                            )
                        }
                    </AppContext.Consumer>
                </AppContext.Provider>
            </div>
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

    private getBody = (context: IAppContext): JSX.Element => {
        if (this.state.viewOption === ViewOption.PokerTable) {
            return <PokerTable user={context.user} party={this.state.party}/>
        } else if (this.state.viewOption === ViewOption.WorkItem) {
            return <WorkItem/>;
        } else if (this.state.viewOption === ViewOption.History) {
            return <div id="history-body"></div>;
        } else {
            return null;
        }
    }

    private getTheme = (): ITheme => {
        return this.state.theme === Theme.Light ? lightTheme : darkTheme;
    }

    private setViewOption = (viewOption: ViewOption): void => {
        if (isNothing(this.state.viewOption) || this.state.viewOption === viewOption) return;

        this.setState({ viewOption: viewOption });
    }
}