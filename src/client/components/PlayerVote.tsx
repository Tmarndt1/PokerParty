import * as React from "react";
import String from "../../shared/String";
import AppConnection from "../services/AppConnection";
import { IAppContext, AppContext } from "../contexts/AppContext";
import PokerItem from "../../shared/models/PokerItem";

interface IProps {
    pokerItem: PokerItem;
};

interface IState {
    vote: string;
    voted: boolean;
};

export default class PlayerVote extends React.Component<IProps, IState> {
    public context: IAppContext;
    public static contextType = AppContext;

    constructor(props: IProps) {
        super(props);
        this.state = {
            vote: null,
            voted: false,
        }
    }

    public render = (): JSX.Element => {
        return (
            <div id="modal-wrapper" style={{marginTop: "100px"}}>
                <div id="modal-header">Voter Dialog</div>
                <div id="item-content-container">
                    <input id="user-vote-item-title" type="text" value={this.props.pokerItem.title}/>
                    <textarea id="user-vote-item-body" value={this.props.pokerItem.body}/>
                </div>
                <div id="user-vote-container">
                    <div className={this.state.vote === "1" ? "vote-option active" : "vote-option"} 
                    onClick={() => this.setState({vote: "1"})}>1</div>
                    <div className={this.state.vote === "2" ? "vote-option active" : "vote-option"} 
                    onClick={() => this.setState({vote: "2"})}>2</div>
                    <div className={this.state.vote === "3" ? "vote-option active" : "vote-option"} 
                    onClick={() => this.setState({vote: "3"})}>3</div>
                    <div className={this.state.vote === "5" ? "vote-option active" : "vote-option"} 
                    onClick={() => this.setState({vote: "5"})}>5</div>
                    <div className={this.state.vote === "8" ? "vote-option active" : "vote-option"} 
                    onClick={() => this.setState({vote: "8"})}>8</div>
                    <div className={this.state.vote === "13" ? "vote-option active" : "vote-option"} 
                    onClick={() => this.setState({vote: "13"})}>13</div>
                    <div className={this.state.vote === "?" ? "vote-option active" : "vote-option"} 
                    onClick={() => this.setState({vote: "?"})}>?</div>
                </div>
                <div className="invalid-error-message">Choose a valid value</div>
                <div id="user-submit-btn-row">
                    <button id="cancel-user-vote-btn" className="btn" onClick={this.cancel}>Cancel</button>
                    <button id="submit-user-vote-btn" className="btn" onClick={this.submit}>Submit</button>
                </div>
            </div>
        );
    }

    public submit = (): void => {
        if (String.isNullOEmpty(this.state.vote) || this.state.voted === true) return;

        let clone = this.context.user.clone();
        clone.generateVote(this.state.vote, this.props.pokerItem.toJSON());

        AppConnection.vote(this.context.user.partyName, clone)
        .then(res => {
            if (!res) return;
            this.context.updateUser(clone);
            this.context.closeModal();
            this.setState({
                vote: null,
                voted: true
            });
        })
        .catch(() => {
            clone.resetVote();
            this.context.updateUser(clone);
            this.context.closeModal();
            this.setState({
                vote: null,
                voted: false
            });

            // add report error
        });
    }

    private cancel = (): void => {
        this.setState({
            voted: false,
            vote: null
        });
        
        this.context.closeModal();
    }
}