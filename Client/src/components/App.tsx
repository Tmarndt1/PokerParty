import * as React from "react";
import { AppContext, IAppContext, Theme } from "../contexts/AppContext";
import Login from "./Login";
import { Player } from "../models/Player";
import { Overlay, IOverlay } from "./Overlay";
import Header from "./Header";
import PokerTable from "./PokerTable";
import { IParty, Party } from "../models/Party";
import { SignalREvent, SignalRService } from "../services/SignalRService";
import { fakeAdmin, fakeParty } from "../fakes/configuration";
import { ITheme } from "../themes/ITheme";
import { darkTheme } from "../themes/darkTheme";
import { lightTheme } from "../themes/lightTheme";
import { WorkItemContainer } from "../components/WorkItemContainer";
import { isNothing } from "../utilitites/isNothing";
import VoteComponent from "./VoteComponent";
import "../public/css/tab.css";

let isFakes: boolean = true;

enum ViewOption {
    PokerTable,
    WorkItem,
    History,
    Settings
}

interface IProps { };

interface IState {
    user: Player;
    party: Party;
    password: string;
    connectionLost: boolean;
    overlay: IOverlay;
    intialRendered: boolean;
    theme: Theme;
    viewOption: ViewOption;
    signalR: SignalRService;
    voting: boolean;
};

/**
 * Summary
 */
export class App extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props)
        this.state = {
            user: isFakes ? fakeAdmin : null,
            party: isFakes ? fakeParty : null,
            password: "",
            connectionLost: false,
            theme: Theme.Dark,
            intialRendered: false,
            viewOption: ViewOption.PokerTable,
            signalR: SignalRService.getInstance(),
            overlay: {
                active: false,
                body: null,
                callback: null,
            },
            voting: false
        }
    }

    public render = (): JSX.Element => {
        let value: IAppContext = {
            theme: this.state.theme,
            isAdmin: this.state.user?.isAdmin ?? false,
            user: this.state.user,
            party: this.state.party,
            modal: this.state.overlay,
            showOverlay: this.showOverlay,
            hideOverlay: this.hideOverlay,
            updateUser: this.updateUser,
            signalR: this.state.signalR
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
        let settingsTabCss: string = this.state.viewOption === ViewOption.Settings ? "tab active" : "tab";
        
        let voteTabCss: string = "tab disabled";

        let hasVoted: boolean = this.state.party?.members.some(x => x.key === this.state.user.key && x.voted === true);

        if (this.state.party?.voting === true && !hasVoted) {
            workItemTabCss += " has-not-voted";
            voteTabCss = "tab";
        }

        let submitClass: string = !isNothing(this.state.party?.workItem?.title) 
            && !isNothing(this.state.party?.workItem?.body) ? "tab" : "tab disabled";

        return (
            <div id="content" style={contentStyle}>
                <AppContext.Provider value={value}>
                    <AppContext.Consumer>
                        {
                            context => (
                                <React.Fragment>
                                    <Overlay active={context.modal.active}/>
                                    <Header user={context.user}/>
                                    <div id="body">
                                        { 
                                            this.state.user == null ? <Login onLogin={this.login}/> : 
                                            <div id="poker-room">
                                                <Overlay active={this.state.voting}>
                                                    <VoteComponent onClose={this.closeVoteWindow} user={this.state.user}
                                                        party={this.state.party} password={this.state.password}/>
                                                </Overlay>
                                                <div id="poker-room-header">
                                                    <div className="tab-container">
                                                        <div className={pokerTableTabCss}
                                                            onClick={() => this.setViewOption(ViewOption.PokerTable)}>
                                                            <span>Poker Table</span>
                                                            <i className="fas fa-table"></i>
                                                        </div>
                                                        <div className={workItemTabCss}
                                                            onClick={() => this.setViewOption(ViewOption.WorkItem)}>
                                                            <span>Work Item</span>
                                                            <i className="fas fa-cube"></i>
                                                        </div>
                                                        <div className={historyTabCss}
                                                            onClick={() => this.setViewOption(ViewOption.History)}>
                                                            <span>History</span>
                                                            <i className="fas fa-history"></i>
                                                        </div>
                                                        <div className={settingsTabCss}
                                                            onClick={() => this.setViewOption(ViewOption.Settings)}>
                                                            <span>Settings</span>
                                                            <i className="fas fa-cog"></i>
                                                        </div>
                                                    </div>
                                                    <div id="header-single-click-options">
                                                        <div className={voteTabCss} 
                                                            onClick={this.onVote}>
                                                            <span>Vote</span>
                                                            <i className="fas fa-dice"/>
                                                        </div>
                                                        {
                                                            this.state.user.isAdmin ? 
                                                            <React.Fragment>
                                                                <div className={"tab"}>
                                                                    <span>Revote</span>
                                                                    <i className="fas fa-undo-alt"/>
                                                                </div>
                                                                <div className={"tab"}>
                                                                    <span>Save</span>
                                                                    <i className="fas fa-save"></i>
                                                                </div>
                                                            {
                                                                this.state.party?.voting === true ?
                                                                <div className={"tab"}>
                                                                    <span>Clear</span>
                                                                    <i className="fas fa-times"/>
                                                                </div>
                                                                :
                                                                <div className={submitClass} onClick={this.submitWorkItem}>
                                                                    <span>Submit</span>
                                                                    <i className="fas fa-check"/>
                                                                </div>
                                                            }
                                                            </React.Fragment> : null
                                                        }
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
        this.state.signalR.subscribe(SignalREvent.PartyUpdate, this.updateParty);

        this.state.signalR.connect();
    }

    public initialRendered = (): void => {
        this.setState({
            intialRendered: true
        });
    }

    public login = (user: Player, party: Party, password: string): void => {
        this.setState({
            user: user, 
            party: party,
            password: password
        });
    }

    public showOverlay = (body: JSX.Element | JSX.Element[], callback: (success: boolean) => void): void => {
        this.state.overlay.active = true;
        this.state.overlay.body = body;
        this.state.overlay.callback = callback;

        this.setState({
            overlay: this.state.overlay
        });
    }

    public hideOverlay = (): void => {
        this.state.overlay.active = false;
        this.state.overlay.body = null;
        this.state.overlay.callback = null;

        this.setState({
            overlay: this.state.overlay
        });
    }

    public updateUser = (user: Player): void => {
        this.setState({
            user: user,
        });
    }

    private getBody = (context: IAppContext): JSX.Element => {
        if (this.state.viewOption === ViewOption.PokerTable) {
            return <PokerTable user={context.user} party={this.state.party}
                onVote={this.onVote} onFlip={this.flip}/>
        } else if (this.state.viewOption === ViewOption.WorkItem) {
            return (
                <WorkItemContainer workItem={this.state.party?.workItem}
                    isAdmin={this.state.user.isAdmin}
                    onTitleChange={title => {
                        if (title?.length > 500) return;
                        this.state.party.workItem.title = title;
                        this.setState({ party: this.state.party });
                    }} 
                    onBodyChange={body => {
                        if (body?.length > 2000) return;
                        this.state.party.workItem.body = body;
                        this.setState({ party: this.state.party });
                    }}/>
            );
        } else if (this.state.viewOption === ViewOption.History) {
            return <div id="history-body"></div>;
        } else if (this.state.viewOption === ViewOption.Settings) {
            return (
                <div id="settings-body">
                    <div style={{padding: 10}}>PartyName: {this.state.party?.name}</div>
                    <div style={{padding: 10}}>Password: {this.state.password}</div>
                </div>
            );
        }
    }

    private getTheme = (): ITheme => {
        let arr = [ 1, 2, 3, 4, 5];

        return this.state.theme === Theme.Light ? lightTheme : darkTheme;
    }

    private updateParty = (json: IParty): void => {
        let party = new Party(json);

        if (this.state.party.voting !== true && party.voting === true) {
            this.setState({
                viewOption: ViewOption.WorkItem,
                party: new Party(json),
            });
        } else {
            this.setState({
                party: new Party(json),
            });
        }
    }

    private closeVoteWindow = (): void => {
        this.setState({
            voting: false
        });
    }

    private onVote = (): void => {
        this.setState({ 
            viewOption: ViewOption.PokerTable,
            voting: true
        });
    }


    private setViewOption = (viewOption: ViewOption): void => {
        if (isNothing(this.state.viewOption) || this.state.viewOption === viewOption) return;

        this.setState({ viewOption: viewOption });
    }

    private submitWorkItem = (): void => {
        if (this.state.party.voting !== false) return;

        if (isNothing(this.state.party?.workItem?.title)) return;

        if (isNothing(this.state.party?.workItem?.body)) return;

        this.state.signalR.submitWorkItem({
            partyName: this.state.party?.name,
            password: this.state.password,
            workItem: this.state.party?.workItem
        });
    }

    private flip = (): void => {
        this.state.signalR.flip(this.state.party?.name, this.state.password);
    }
}

        // let next = () => {
        //     if (document.getElementsByClassName("coreSpriteRightPaginationArrow")[0]) {
        //         document.getElementsByClassName("coreSpriteRightPaginationArrow")[0].click();
        //     }
        //     setTimeout(() => {
        //         if (document.getElementsByClassName("QBdPU")[5]) {
        //             document.getElementsByClassName("QBdPU")[5].click();
        //         } 
        //         setTimeout(() => {
        //             next();
        //         }, 500);
        //     }, 2000)
        // }

        // next();