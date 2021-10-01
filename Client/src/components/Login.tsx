import * as React from "react";
import { Party } from "../models/Party";
import { IAppContext, AppContext } from "../contexts/AppContext";
import LoadingDots from "./LoadingDots";
import { SignalRService } from "../services/SignalRService";
import { isNothing } from "../utilitites/isNothing";
import IStartOrJoinRequest from "../interfaces/IStartOrJoinRequest";
import { Player } from "../models/Player";
import "../public/css/login.css";
import { Button } from "./Button";

interface IProps {
    onLogin: (user: Player, party: Party, password: string) => any;
};

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
    private _mounted = false;

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
                    this.state.submitting !== true ? null : 
                    <div className="login-loading-dots-container">
                        <LoadingDots/>
                    </div>
                }
                <div id="login-header">
                    Sign In
                </div>
                <div id="name-container">
                    <div className="name-wrapper">
                        <label htmlFor="first-name">Username:</label>
                        <input autoComplete="off" id="first-name" type="text" 
                            className={this.state.usernameInvalid === true ? "invalid-input text-field" : "text-field"} 
                            onChange={e => this.setState({username: e.currentTarget.value, usernameInvalid: false})}/>
                        { this.state.usernameInvalid ? <div className="input-error-message">Enter your username</div> : null }
                    </div>
                </div>
                <div id="party-name-container">
                    <div className="name-wrapper">
                        <label htmlFor="party-name">Party Name:</label>
                        <input autoComplete="off" id="party-name" type="text" 
                            className={this.state.partyNameInvalid === true ? "invalid-input text-field" : "text-field"}
                            onChange={e => this.setState({partyName: e.currentTarget.value, partyNameInvalid: false})} value={this.state.partyName}/>
                        { this.state.partyNameInvalid ? <div className="input-error-message">Enter your party name</div> : null }
                    </div>
                </div>
                <div id="party-password-container">
                    <div className="name-wrapper">
                        <label htmlFor="party-password">Party Password:</label>
                        <input autoComplete="off" id="party-password" type="password" 
                        className={this.state.passwordInvalid === true ? "invalid-input text-field" : "text-field"} 
                            onChange={e => this.setState({password: e.currentTarget.value, passwordInvalid: false})}/>
                        { this.state.passwordInvalid ? <div className="input-error-message">Enter your password</div> : null }
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
                    <Button id="join-btn" onClick={this.login}
                        text={this.state.isAdmin ? "Start" : "Join"}>
                        <i className="fas fa-check"/>
                    </Button>
                </div>
            </div>
        );
    }

    public componentDidMount = (): void => {
        document.addEventListener("keydown", this.onEnter);
        this._mounted = true;
    }

    public componentWillUnmount = (): void => {
        this._mounted = false;
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
        } 
        
        this.setState({ submitting: true });

        let callback = async () => {
            try {
                if (this.state.isAdmin) {
                    let result = await this.context.signalR.startParty({ partyName: this.state.partyName, username: this.state.username, password: this.state.password });
                    
                    this.props.onLogin(result.user, result.party, this.state.password);
                } else {
                    let result = await this.context.signalR.joinParty({ partyName: this.state.partyName, username: this.state.username, password: this.state.password });
                    
                    this.props.onLogin(result.user, result.party, this.state.password);
                }

                if (this._mounted) this.setState({ submitting: false });
            }
            catch {
                if (this._mounted) this.setState({ submitting: false });
            }
        }

        setTimeout(() => {
            callback();
        }, 1500);
    }
}