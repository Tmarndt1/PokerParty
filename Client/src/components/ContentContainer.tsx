import * as React from "react";
import { IAppContext, AppContext } from "../contexts/AppContext";
import PokerItem, { IPokerItem } from "../models/PokerItem";
import { Guid } from "../utilitites/common";
import { isNullOrUndefined } from "util";
import Player from "../models/Player";
import { SignalREvent, SignalRService } from "../services/SignalRService";
import Party, { IParty } from "../models/Party";
import PartyFactory from "../factories/PartyFactory";
import { isNothing } from "../utilitites/isNothing";

interface IProps {
    user: Player;
    party: Party;
};

interface IState {
    title: string;
    body: string;
    titleInvalid: boolean;
    bodyInvalid: boolean;
    submitted: boolean;
};

export default class ContentContainer extends React.Component<IProps, IState> {
    public context: IAppContext;
    public static contextType = AppContext;

    constructor(props: IProps) {
        super(props);
        this.state = {
            title: "",
            body: "",
            titleInvalid: false,
            bodyInvalid: false,
            submitted: false
        }
    }

    public render = (): JSX.Element => {
        let titleCss: string = this.state.titleInvalid === true ? "vote-item-header invalid-input" : "vote-item-header";
        let bodyStyle: React.CSSProperties = this.context.isAdmin !== true ? {resize: "none"} : {}
        // let bodyCss = this.state.bodyInvalid === true ? "vote-item-body invalid-input" : "vote-item-body";

        return (
            <React.Fragment>
                <div id="item-container">
                    <label htmlFor="item-title">
                        Item Title:
                        <span style={{color: "crimson"}}>*</span>
                    </label>
                    <input id="item-title" className={titleCss} type="text" autoComplete="off" 
                    onChange={e => this.setTitle(e)} disabled={this.context.isAdmin != true || this.state.submitted} 
                    value={this.state.title}/>
                    {
                        this.state.titleInvalid ? 
                        <div className="invalid-error-message">Enter your work item's title</div> 
                        : null
                    }
                    <label htmlFor="item-title">Item Description:</label>
                    <textarea id="item-body" className="vote-item-body" autoComplete="off"
                    onChange={e => this.setBody(e)} disabled={this.context.isAdmin != true || this.state.submitted}
                    value={this.state.body} style={bodyStyle}/>
                    {/* {
                        this.state.bodyInvalid ? 
                        <div className="invalid-error-message">Enter your work item's body</div> 
                        : null
                    } */}
                </div>
                {
                    this.context.isAdmin == true ? 
                    <div id="admin-action-row">
                        {
                            this.state.submitted ? 
                            <button id="submit-admin-vote-btn" className="btn" onClick={this.reset}>Reset</button>
                            : 
                            <button id="submit-admin-vote-btn" className="btn" onClick={this.submit}>Submit</button>
                        }
                    </div>
                    : null
                }
                <div>

                </div>
            </React.Fragment>
        )
    }

    public componentDidMount = (): void => {
        if (this.context.isAdmin == true) return;

        SignalRService.getInstance().subscribe(SignalREvent.ItemSubmmitted, this.itemSubmitted); 
        SignalRService.getInstance().subscribe(SignalREvent.Reset, this.resetHandler);
    }

    public static getDerivedStateFromProps = (nextProps: IProps, prevState: IState): object => {
        if (isNullOrUndefined(nextProps.party.pokerItem)) return null;

        return {
            title: nextProps.party.pokerItem.title,
            titleInvalid: isNothing(nextProps.party.pokerItem.title),
            body: nextProps.party.pokerItem.body
        }
    }

    private setBody = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
        this.setState({
            body: e.currentTarget.value,
            bodyInvalid: false
        });
    }

    private setTitle = (e: React.ChangeEvent<HTMLInputElement>): void => {
        this.setState({
            title: e.currentTarget.value,
            titleInvalid: false
        });
    }

    private submit = (): void => {
        let titleInvalid = isNothing(this.state.title);
        if (titleInvalid) {
            return this.setState({
                titleInvalid: true,
            });
        }

        let item = PokerItem.fromJson({
            id: Guid(),
            title: this.state.title,
            body: this.state.body,
            partyName: this.context.user.partyName
        });

        SignalRService.getInstance().submitItem({
            partyId: this.props.party.id,
            item: item
        })
        .then(res => {
            // TODO: handle error
            if (!res.success) return;
            this.setState({
                submitted: true
            });
        })
        .catch(() => {

        });
    }

    private itemSubmitted = (json: IParty): void => {  
        if (isNullOrUndefined(json)) return;

        let party: Party = new PartyFactory().fromJson(json);

        this.setState({
            title: party.pokerItem.title,
            titleInvalid: isNothing(party.pokerItem.title),
            body: party.pokerItem.body,
            bodyInvalid: isNothing(party.pokerItem.body)
        });
    }

    private reset = (): void => {
        SignalRService.getInstance().reset({
            partyId: this.props.party.id
        })
        .then(res => {
            if (res.success === false) return;
            this.setState({
                title: "",
                titleInvalid: false,
                body: "",
                bodyInvalid: false,
                submitted: false
            });
        })
    }

    private resetHandler = (): void => {
        this.setState({
            title: "",
            titleInvalid: false,
            body: "",
            bodyInvalid: false,
        });
    }
}