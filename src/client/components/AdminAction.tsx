import * as React from "react";
import { IAppContext, AppContext } from "../contexts/AppContext";
import String from "../../shared/String";
import AppConnection from "../services/AppConnection";
import PokerItem from "../../shared/models/PokerItem";
import { Guid } from "../../shared/common";
import { isNullOrUndefined } from "util";


enum AdminActions {
    SubmitNew,
    Revote,
    Reset
};

interface IProps {
    pokerItem: PokerItem;
};

interface IState {
    title: string;
    body: string;
    titleInvalid: boolean;
    bodyInvalid: boolean;
    actionSelected: AdminActions
};

export default class AdminAction extends React.Component<IProps, IState> {
    public context: IAppContext;
    public static contextType = AppContext;

    constructor(props: IProps) {
        super(props);
        this.state = {
            title: null,
            body: null,
            titleInvalid: false,
            bodyInvalid: false,
            actionSelected: null
        }
    }

    public render = (): JSX.Element => {
        let titleCss = this.state.titleInvalid === true ? "vote-item-header invalid-input" : "vote-item-header";
        let bodyCss = this.state.bodyInvalid === true ? "vote-item-body invalid-input" : "vote-item-body";

        return (
            <div id="modal-wrapper">
                <div id="modal-header">Admin Action Panel</div>
                <div id="action-selector-container">
                    <label htmlFor="submit-new" className="for-form-radio">New Item:</label>
                    <input id="submit-new" type="radio" name="admin-action" value="Submit New Item" className="form-radio" 
                    checked={this.state.actionSelected === AdminActions.SubmitNew} 
                    onClick={() => this.setState({actionSelected: AdminActions.SubmitNew})}/>
                    <label htmlFor="revote" className={isNullOrUndefined(this.props.pokerItem) ? "for-form-radio disabled" : "for-form-radio"}>Revote Item:</label>
                    <input id="revote" type="radio" name="admin-action" value="Revote" className={isNullOrUndefined(this.props.pokerItem) ? "form-radio disabled" : "form-radio"} 
                    checked={this.state.actionSelected === AdminActions.Revote}
                    onClick={() => this.setState({actionSelected: AdminActions.Revote})}/>
                </div>
                <div id="item-container" className={this.state.actionSelected !== AdminActions.SubmitNew ? "hide" : ""}>
                    <label htmlFor="item-title">Item Title:</label>
                    <input id="item-title" className={titleCss} type="text" placeholder={"Item Title.."} 
                    onChange={e => this.setTitle(e)}/>
                    {this.state.titleInvalid ? <div style={{padding: "0 5px", color: "red", fontSize: ".9rem"}}>Enter your work item's title</div> : null}
                    <label htmlFor="item-title">Item Description:</label>
                    <textarea id="item-body" className={bodyCss} placeholder={"Item Description.."}
                    onChange={e => this.setBody(e)}/>
                    {this.state.bodyInvalid ? <div style={{padding: "0 5px", color: "red", fontSize: ".9rem"}}>Enter your work item's body</div> : null}
                </div>
                <div id="admin-action-row">
                    <button id="cancel-admin-vote-btn" className="btn" onClick={this.cancel}>Cancel</button>
                    <button id="submit-admin-vote-btn" className="btn" onClick={this.submit}>Submit</button>
                </div>
            </div>
        )
    }

    private setBody = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
        this.setState({
            body: e.currentTarget.value,
            bodyInvalid: false
        })
    }

    private setTitle = (e: React.ChangeEvent<HTMLInputElement>): void => {
        this.setState({
            title: e.currentTarget.value,
            titleInvalid: false
        })
    }

    private submit = (): void => {
        if (this.state.actionSelected === AdminActions.SubmitNew) {
            this.submitItem();
        } else if (this.state.actionSelected === AdminActions.Revote) {
            this.revote();
        } else if (this.state.actionSelected === AdminActions.Reset) {
            this.reset();
        }
    }

    private submitItem = (): void => {
        let titleInvalid = String.isNullOEmpty(this.state.title);
        let bodyInvalid = String.isNullOEmpty(this.state.body);

        if (titleInvalid && bodyInvalid) {
            return this.setState({
                titleInvalid: true,
                bodyInvalid: true,
            });
        } else if (titleInvalid && !bodyInvalid) {
            return this.setState({
                titleInvalid: true
            });
        } else if (bodyInvalid && !titleInvalid) {
            return this.setState({
                bodyInvalid: true
            });
        }

        let item = PokerItem.fromJSON({
            id: Guid(),
            title: this.state.title,
            body: this.state.body,
            partyName: this.context.user.partyName
        });

        AppConnection.submitItem(item)
        .then((res) => {
            if (!res.success) return;
            this.context.closeModal();
        })
        .catch(() => {

        })
    }

    private revote = (): void => {
        AppConnection.revoteItem(this.context.user.partyName)
        .then((res) => {
            if (!res.success) return;
            this.context.closeModal();
        })
        .catch(() => {

        });
    }

    private reset = (): void => {
        AppConnection.reset(this.context.user.partyName)
        .then((res) => {
            if (!res.success) return;
        })
        .catch(() => {

        });
    }

    private cancel = (): void => {
        this.setState({
            body: null,
            title: null,
            bodyInvalid: false,
            titleInvalid: false
        });

        this.context.closeModal();
    }
}