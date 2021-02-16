import * as React from "react";
import { Party } from "../models/Party";
import { IAppContext, AppContext } from "../contexts/AppContext";
import LoadingDots from "./LoadingDots";
import { SignalRService } from "../services/SignalRService";
import { isNothing } from "../utilitites/isNothing";
import IStartOrJoinRequest from "../interfaces/IStartOrJoinRequest";
import { Player } from "../models/Player";
import "../public/css/login.css";

interface IProps {};

interface IState {
    username: string;
    isAdmin: boolean;
    partyName: string;
    password: string;
    parties: Array<Party>; // name, member count, active
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
            username: "",
            isAdmin: false,
            partyName: "",
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
            <div id="login-container">
                {
                    this.state.submitting ? 
                    <div className="login-loading-dots-container">
                        <LoadingDots/>
                    </div>
                    : 
                    null
                }
                <div id="login-header">
                    Sign In
                </div>
                <div id="name-container">
                    <div className="name-wrapper">
                        <label htmlFor="first-name">Username:</label>
                        <input autoComplete="off" id="first-name" type="text" className={this.state.usernameInvalid === true ? "invalid-input" : ""} 
                            onChange={e => this.setState({username: e.currentTarget.value, usernameInvalid: false})}/>
                        {this.state.usernameInvalid ? <div className="input-error-message">Enter your username</div> : null}
                    </div>
                </div>
                <div id="party-name-container">
                    <div className="name-wrapper">
                        <label htmlFor="party-name">Party Name:</label>
                        <input autoComplete="off" id="party-name" className={this.state.partyNameInvalid === true ? "invalid-input" : ""} type="text" 
                            onChange={e => this.setState({partyName: e.currentTarget.value, partyNameInvalid: false})} value={this.state.partyName}/>
                        {this.state.partyNameInvalid ? <div className="input-error-message">Enter your party name</div> : null}
                    </div>
                </div>
                <div id="party-password-container">
                    <div className="name-wrapper">
                        <label htmlFor="party-password">Party Password:</label>
                        <input autoComplete="off" id="party-password" type="password" className={this.state.passwordInvalid === true ? "invalid-input" : ""} 
                            onChange={e => this.setState({password: e.currentTarget.value, passwordInvalid: false})}/>
                        {this.state.passwordInvalid ? <div className="input-error-message">Enter your password</div> : null}
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
                {
                    this.state.isAdmin == true ? 
                    <button id="join-btn" className="btn" onClick={this.login}>Start</button>
                    :
                    <button id="join-btn" className="btn" onClick={this.login}>Join</button>
                }
                </div>
            </div>
        );
    }

    public componentDidMount = (): void => {
        document.addEventListener("keydown", this.onEnter);
    }

    public componentWillUnmount = (): void => {
        document.removeEventListener("keydown", this.onEnter);
    }

    private onEnter = (ev: KeyboardEvent): void => {
        if (ev?.keyCode == 13) this.login();
    }

    private login = (): void => {
        if (this.state.submitting === true) return;
        
        let usernameInvalid = isNothing(this.state.username);
        let partyNameInvalid = isNothing(this.state.partyName);
        let passwordInvalid = isNothing(this.state.password);

        if (usernameInvalid === true || partyNameInvalid === true || passwordInvalid === true) {
            return this.setState({
                usernameInvalid: usernameInvalid,
                partyNameInvalid: partyNameInvalid,
                passwordInvalid: passwordInvalid
            });
        } else this.setState({ submitting: true });

        let callback = () => {
            let startOrJoin: (request: IStartOrJoinRequest) => Promise<{user: Player, party: Party}> = 
                this.state.isAdmin ? 
                SignalRService.getInstance().startParty : SignalRService.getInstance().joinParty;

            startOrJoin({
                partyName: this.state.partyName,
                username: this.state.username,
                password: this.state.password
            })
            .then(res => {  
                this.context.login(res.user, res.party, res.user.isAdmin);
            })
            .catch(error => {
                this.setState({ submitting: false });
            });
        }

        setTimeout(() => {
            callback();
        }, 1500);
    }
}