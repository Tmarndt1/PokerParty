import * as React from "react";
import PokerPlayer from "../../shared/models/PokerPlayer";
import { isNullOrUndefined } from "util";

const card = require("../public/images/card.png");

enum Suit {
    Diamonds = "♦",
    Hearts = "♥",
    Clubs =  "♣",
    Spades = "♠"
}

interface IProps {
    player: PokerPlayer;
    flipped: boolean;
};

interface IState {
    flipped: boolean;
    voted: boolean;
};

export default class PokerCard extends React.Component<IProps, IState> {
    private cardClass: Suit = Suit.Hearts;

    constructor(props: IProps) {
        super(props);
        this.state = {
            flipped: false,
            voted: false,
        }
    }

    public render = (): JSX.Element => {
        let suit = this.getRandomSuit();

        return (
            <div className="flip-container" style={this.state.voted === false ? {display: "none"} : {}}>
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

    public componentWillReceiveProps = (props: IProps): void => {
        this.setState({
            flipped: props.flipped,
            voted: props.player.voted,
        });
    }

    public shouldComponentUpdate = (nextProps: IProps, nextState: IState): boolean => {
        return (this.state.flipped !== nextState.flipped || this.state.voted !== nextProps.player.voted);
    }

    private getRandomSuit = (): string => {
        let random = Math.ceil(Math.random() * 4);
        if (random === 1) return Suit.Hearts;
        if (random === 2) return Suit.Diamonds;
        if (random === 3) return Suit.Clubs;
        if (random === 4) return Suit.Spades;
    }

    private getBackOfCard = (): JSX.Element => {
        let suit = null;
        let color = null;
        let random = Math.ceil(Math.random() * 4);
        if (random === 1) {
            suit = Suit.Hearts;
            color = "red";
        } else if (random === 2) {
            suit = Suit.Diamonds;
            color = "red";
        } else if (random === 3) {
            suit = Suit.Clubs;
            color = "black";
        } else if (random === 4) {
            suit = Suit.Spades;
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