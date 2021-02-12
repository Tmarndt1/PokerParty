import * as React from "react";
import Player from "../models/Player";

const card = require("../public/images/card.png");

enum SuitSymbol {
    Diamonds = "♦",
    Hearts = "♥",
    Clubs =  "♣",
    Spades = "♠"
}

interface IProps {
    player: Player;
    flipped: boolean;
};

interface IState {
    flipped: boolean;
    voted: boolean;
};

export default class PokerCard extends React.Component<IProps, IState> {
    private cardClass: SuitSymbol = SuitSymbol.Hearts;

    constructor(props: IProps) {
        super(props);
        this.state = {
            flipped: false,
            voted: false,
        }
    }

    public render = (): JSX.Element => {
        return (
            <div className="flip-container">
                <div className={this.state.flipped === true ? "flipper flipped" : "flipper"}>
                    <div className="front">
                        <img src={card} className="poker-card-front"/>
                    </div>
                    <div className="back">
                        {
                            this.getBackOfCard()
                        }
                    </div>
                </div>
            </div>
        );
    }

    public static getDerivedStateFromProps = (nextProps: IProps, prevState: IState) => {
        return {
            flipped: nextProps.flipped,
            voted: nextProps.player.voted
        }
    }

    public shouldComponentUpdate = (nextProps: IProps, nextState: IState): boolean => {
        return (this.state.flipped !== nextState.flipped || this.state.voted !== nextProps.player.voted);
    }

    private getBackOfCard = (): JSX.Element => {
        let suit = null;
        let color = null;
        // let random = Math.ceil(Math.random() * 4);
        if (this.props.player.voteSuit == 0) {
            suit = SuitSymbol.Hearts;
            color = "red";
        } else if (this.props.player.voteSuit == 1) {
            suit = SuitSymbol.Diamonds;
            color = "red";
        } else if (this.props.player.voteSuit == 2) {
            suit = SuitSymbol.Clubs;
            color = "black";
        } else if (this.props.player.voteSuit == 3) {
            suit = SuitSymbol.Spades;
            color = "black";
        }
        
        return (
            <div className="poker-card-back">
                <div className="top-suit" style={{color: color}}>{suit}</div>
                <div className="poker-card-value">
                    {this.props.player.vote}
                </div>
                <div className="bottom-suit" style={{color: color}}>{suit}</div>
            </div>
        );
    }
}