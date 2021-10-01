import * as React from "react";
import { Player } from "../models/Player";
import { IAppContext, AppContext } from "../contexts/AppContext";
import CardSuit from "../enums/CardSuit";
import IVoteRequest from "../interfaces/IVoteRequest";
import { Party } from "../models/Party";

interface IProps {
    party: Party;
    user: Player;
    password: string;
    onClose: () => any;
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
                <div id="close-vote" onClick={() => this.props.onClose()}>
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

    private vote = async (vote: string): Promise<void> => {
        try {
            let result = await this.context.signalR.submitVote({
                partyName: this.props.party?.name,
                password: this.props.password,
                playerKey: this.props.user.key,
                vote: vote
            });

            this.props.onClose();
        } catch (error) {
            this.props.onClose();
        }
    }
}