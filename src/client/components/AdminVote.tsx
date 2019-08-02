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

export default class AdminVote extends React.Component<IProps, IState> {
    public context: IAppContext;
    public static contextType = AppContext;

    private voteValues: Array<string>;

    constructor(props: IProps) {
        super(props);
        this.state = {
            vote: null,
            voted: false
        }

        this.voteValues =  ["1", "2", "3", "5", "8", "13", "?"];
    }

    public render = (): JSX.Element => {
        return (
            <div id="modal-wrapper">
                 <div id="modal-header">Voter Dialog</div>
                <div id="item-content-container">
                    <input id="user-vote-item-title" type="text" value={this.props.pokerItem.title}/>
                    <textarea id="user-vote-item-body" value={this.props.pokerItem.body}/>
                </div>
                <div id="admin-vote-container">
                    <div>
                        <label htmlFor="admin-vote">Please type your vote:</label>
                        <input id="admin-vote" type="password" onChange={e => {
                            document.getElementById("admin-vote").classList.remove("invalid-input");
                            document.getElementById("modal-wrapper").classList.remove("invalid-submit");
                            this.setState({vote: e.currentTarget.value})
                        }}/>
                    </div>
                    <div className="invalid-error-message">Enter a valid value</div>
                </div>
                <div id="admin-vote-action-row">
                    <button id="cancel-admin-vote-btn" className="btn" onClick={this.cancel}>Cancel</button>
                    <button id="submit-admin-vote-btn" className="btn" onClick={this.submit}>Submit</button>
                </div>
            </div>
        )
    }

    public submit = (): void => {
        if (String.isNullOEmpty(this.state.vote) || this.voteValues.includes(this.state.vote) === false) {
            document.getElementById("admin-vote").classList.add("invalid-input");
            document.getElementById("modal-wrapper").classList.add("invalid-submit");
            return;
        } else {
            document.getElementById("admin-vote").classList.remove("invalid-input");
            document.getElementById("modal-wrapper").classList.remove("invalid-submit");
        }

        let clone = this.context.user.clone();
        clone.generateVote(this.state.vote, this.props.pokerItem.toJSON());

        AppConnection.vote(this.context.user.partyName, clone)
        .then(res => {
            if (res.success === false) return;
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
        this.context.closeModal();
    }
}