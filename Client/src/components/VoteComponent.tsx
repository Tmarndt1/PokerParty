import * as React from "react";
import { Player } from "../models/Player";
import PokerItem from "../models/PokerItem";
import { IAppContext, AppContext } from "../contexts/AppContext";
import CardSuit from "../enums/CardSuit";
import IVoteRequest from "../interfaces/IVoteRequest";
import { SignalRService } from "../services/SignalRService";

interface IProps {
    partyId: string;
    closeHandler: Function;
    user: Player;
    pokerItem: PokerItem;
};

interface IState {

};

export default class VoteComponent extends React.Component<IProps, IState> {
    public context: IAppContext;
    public static contextType = AppContext;

    private voteValues: string[];

    constructor(props: IProps) {
        super(props);
        this.state = {

        }

        this.voteValues =  ["1", "2", "3", "5", "8", "13", "?"];
    }

    public render = (): JSX.Element => {
        
        return (
            <React.Fragment>
                <div id="close-vote" onClick={() => this.props.closeHandler()}>
                    <i className="fas fa-times"></i>
                </div>
                <div id="vote-container">
                    {
                        this.voteValues.map(value => {
                            return (
                                <div className="vote-card" key={value}>
                                    { this.getCards(value) }
                                </div>
                            );
                        })
                    }
                </div>
            </React.Fragment>
        );
    }

    private getCards = (value: string): JSX.Element => {
        let suit = null;
        let color = null;
        let random = Math.floor(Math.random() * 3);
        if (random == 0) {
            suit = CardSuit.Hearts;
            color = "red";
        } else if (random == 1) {
            suit = CardSuit.Diamonds;
            color = "red";
        } else if (random == 2) {
            suit = CardSuit.Clubs;
            color = "black";
        } else if (random == 3) {
            suit = CardSuit.Spades;
            color = "black";
        }
        
        return (
            <div className="vote-card-body" onClick={() => this.vote(value)}>
                <div className="top-suit" style={{color: color, fontSize: "1rem"}}>{suit}</div>
                <div className="poker-card-value">
                    { value }
                </div>
                <div className="bottom-suit" style={{color: color, fontSize: "1rem"}}>{suit}</div>
            </div>
        );
    }

    private vote = (vote: string): void => {
        let voteRequest: IVoteRequest = {
            partyId: this.props.partyId,
            partyName: this.props.user.partyName,
            playerId: this.props.user.id,
            vote: vote,
            v5Count: Math.ceil(Math.random() * 9),
            v10Count: Math.ceil(Math.random() * 9),
            v25Count: Math.ceil(Math.random() * 7),
            v50Count: Math.ceil(Math.random() * 3),
            voteSuit: Math.floor(Math.random() * 4),
        }
        
        SignalRService.getInstance().vote(voteRequest)
        .then(res => {
            if (!res) return;
            this.props.closeHandler();
        })
        .catch(() => {
            this.props.closeHandler();
        });
    }
}