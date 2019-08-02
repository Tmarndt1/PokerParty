import * as React from "react";
import AppConnection from "../services/AppConnection";
import { isNullOrUndefined } from "../../shared/common";
import { IPartyJSON } from "../../shared/models/Party";
import SocketEvent from "../../shared/enums/SocketEvent";
import PokerPlayer from "../../shared/models/PokerPlayer";
import { IAppContext, AppContext } from "../contexts/AppContext";
import LoadingDots from "./misc/LoadingDots";


interface IProps {};

interface IState {
    username: string;
    isAdmin: boolean;
    partyName: string;
    password: string;
    parties: Array<IPartyJSON>; // name, member count, active
    usernameInvalid: boolean;
    partyNameInvalid: boolean;
    passwordInvalid: boolean;
    submitting: boolean;
};

export default class Login extends React.Component<IProps, IState> {
    public context: IAppContext;
    public static contextType = AppContext;

    private pollerF: NodeJS.Timeout;
    private connectedSubscriptionId: string;
    private partyClosedSubscriptionId: string;
    private partyAddedSubscriptionId: string;
    private activePartyId: string;

    constructor(props: IProps) {
        super(props);
        this.state ={
            username: null,
            isAdmin: false,
            partyName: null,
            password: null,
            parties: [],
            usernameInvalid: false,
            partyNameInvalid: false,
            passwordInvalid: false,
            submitting: false,
        }
    }

    public render = (): JSX.Element => {
        let partyLength = this.state.parties.length;
        let rowCount = 0;
        if (partyLength < 10) rowCount = 10 - this.state.parties.length;
        let additionalRows: Array<JSX.Element> = [];
        for (let i = 0; i < rowCount; i++) {
            additionalRows.push(<div className="party-list-row">Empty...</div>);
        }

        return (
            <div id="login-initial-container" style={this.state.submitting === true ? {pointerEvents: "none"} : null}>
                <div id="login-container-wrapper">
                    <div style={{padding: "10px"}}>Start or Join a Party</div>
                    <div id="login-container" style={this.state.submitting === true ? {boxShadow: "0 0 5px gold"} : null}>
                        {
                            this.state.submitting ? 
                            <div className="login-loading-dots-container">
                                <LoadingDots/>
                            </div>
                            : 
                            null
                        }
                        <div id="name-container">
                            <div className="name-wrapper">
                                <label htmlFor="first-name">Username:</label>
                                <input autoComplete="off" id="first-name" type="text" className={this.state.usernameInvalid === true ? "invalid-input" : ""} 
                                onChange={e => this.setState({username: e.currentTarget.value, usernameInvalid: false})}/>
                                {this.state.usernameInvalid ? <div style={{padding: "5px 5px 0 5px", color: "red", fontSize: ".8rem"}}>Enter your username</div> : null}
                            </div>
                        </div>
                        <div id="party-name-container">
                            <div className="name-wrapper">
                                <label htmlFor="party-name">Party Name:</label>
                                <input autoComplete="off" id="party-name" className={this.state.partyNameInvalid === true ? "invalid-input" : ""} type="text" 
                                onChange={e => this.setState({partyName: e.currentTarget.value, partyNameInvalid: false})} value={this.state.partyName}/>
                                {this.state.partyNameInvalid ? <div style={{padding: "5px 5px 0 5px", color: "red", fontSize: ".8rem"}}>Enter your party name</div> : null}
                            </div>
                        </div>
                        <div id="party-password-container">
                            <div className="name-wrapper">
                                <label htmlFor="party-password">Party Password:</label>
                                <input autoComplete="off" id="party-password" type="password" className={this.state.passwordInvalid === true ? "invalid-input" : ""} 
                                onChange={e => this.setState({password: e.currentTarget.value, passwordInvalid: false})}/>
                                {this.state.passwordInvalid ? <div style={{padding: "5px 5px 0 5px", color: "red", fontSize: ".8rem"}}>Enter your password</div> : null}
                            </div>
                        </div>
                        <div id="is-admin-container">
                            <label htmlFor="is-admin">Admin:</label>
                            <label className="switch">
                                <input type="checkbox" onChange={e => this.setState({isAdmin: e.target.checked})}/>
                                <div className="slider"></div>
                            </label>
                        </div>
                        <div id="join-btn-wrapper">
                            <button id="join-btn" className="btn" onClick={this.login}>Join</button>
                        </div>
                    </div>
                </div>
                <div id="party-list-container-wrapper">
                    <div style={{padding: "10px"}}>Active Parties</div>
                    <div id="party-list-container">
                        {this.state.parties.map((party: IPartyJSON, index) => {
                            return (
                                <div className={((party.id === this.activePartyId ? "selected " : "") + "party-list-row active-party")} onClick={() => this.setParty(party.id)}>
                                    {party.name}
                                    <div className="member-count">{party.memberCount}</div>
                                </div>
                            )
                        })}
                        {additionalRows}
                    </div>
                </div>
            </div>
        )
    }

    public componentDidMount = (): void => {
        this.connectedSubscriptionId = AppConnection.subscribe([SocketEvent.Connect, () => this.getParties()]);
        this.partyClosedSubscriptionId = AppConnection.subscribe([SocketEvent.OtherClosed, () => this.getParties()]);
        this.partyAddedSubscriptionId = AppConnection.subscribe([SocketEvent.PartyAdded, this.addParty])
    }

    public componentWillUnmount = (): void => {
        AppConnection.unsubscribe(this.partyClosedSubscriptionId);
        AppConnection.unsubscribe(this.connectedSubscriptionId);
        AppConnection.unsubscribe(this.partyAddedSubscriptionId);
    }

    private login = (): void => {
        if (this.state.submitting === true) return;
        
        let usernameInvalid = isNullOrUndefined(this.state.username);
        let partyNameInvalid = isNullOrUndefined(this.state.partyName);
        let passwordInvalid = isNullOrUndefined(this.state.password);

        if (usernameInvalid === true || partyNameInvalid === true || passwordInvalid === true) {
            return this.setState({
                usernameInvalid: usernameInvalid,
                partyNameInvalid: partyNameInvalid,
                passwordInvalid: passwordInvalid
            });
        } else this.setState({submitting: true});

        let pokerPlayer = new PokerPlayer({
            username: this.state.username,
            admin: this.state.isAdmin,
            vote: null,
            partyName: this.state.partyName,
            voted: false,
            seatNumber: null,
            v5Count: null,
            v10Count: null,
            v25Count: null,
            v50Count: null,
            lastVote: [null, null]
        });

        let callback = () => {
            if (this.state.isAdmin === true) {
                AppConnection.startParty({
                    partyName: this.state.partyName,
                    pokerPlayer: pokerPlayer.toJSON(),
                    password: this.state.password
                })
                .then((res) => {
                    if (res.success === false) {
                        return this.setState({
                            submitting: false
                        });
                    }
                    pokerPlayer.setSeatNumber(res.data);
                    this.context.login(pokerPlayer);
                })
                .catch(() => {
                    return this.setState({
                        submitting: false
                    });
                })
            } else if (this.state.isAdmin === false) {
                AppConnection.joinParty({
                    partyName: this.state.partyName,
                    pokerPlayer: pokerPlayer.toJSON(),
                    password: this.state.password
                })
                .then((res) => {
                    if (res.success === false) {
                        return this.setState({
                            submitting: false
                        }); 
                    }
                    pokerPlayer.setSeatNumber(res.data);
                    this.context.login(pokerPlayer);
                })
                .catch(() => {
                    return this.setState({
                        submitting: false
                    });
                })
            }
        }

        setTimeout(() => {
            callback();
        }, 1500);
    }

    private getParties = (): void => {
        AppConnection.getParties()
        .then((parties: Array<IPartyJSON>) => {
            if (!(parties instanceof Array)) return;

            parties.forEach((party) => {
                let localParty = this.state.parties.filter(x => x.id === party.id);
                if (localParty.length === 1) {
                    localParty[0] = party;
                }
            });

            this.setState({
                parties: parties
            })
        });
    }

    private setParty = (partyId: string): void => {
        let partyName;
        this.activePartyId === partyId ? this.activePartyId = null : this.activePartyId = partyId;
        let party = this.state.parties.filter(x => x.id === this.activePartyId)[0];

        isNullOrUndefined(party) ? partyName = "" : partyName = party.name;

        this.setState({
            parties: this.state.parties,
            partyName: partyName
        });
    }

    private addParty = (party: IPartyJSON): void => {
        if (!isNullOrUndefined(party) 
        && this.state.parties.filter(x => x.id === party.id).length !== 0) return;

        this.state.parties.push(party);
        this.setState({
            parties: this.state.parties
        });
    }
}