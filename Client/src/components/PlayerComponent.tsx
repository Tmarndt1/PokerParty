import * as React from "react";
import { Player } from "../models/Player";
import { IAppContext, AppContext } from "../contexts/AppContext";
import WorkItem from "../models/WorkItem";
import { Party } from "../models/Party";
import { isNothing } from "../utilitites/isNothing";

const card = require("../public/images/card.png");

interface IProps {
    party: Party;
    player: Player;
    isUser: boolean;
    pokerItem: WorkItem;
    onVote: Function;
};

interface IState {
    party: Party;
    player: Player;
    pokerItem: WorkItem;
    voted: boolean;
};

/**
 * Summary
 */
export default class PlayerComponent extends React.Component<IProps, IState> {
    public context: IAppContext;
    public static contextType = AppContext;

    private cardRef: React.RefObject<HTMLImageElement>;
    private intervalF: NodeJS.Timeout;
    private timerStarted: boolean;

    constructor(props: IProps) {
        super(props);
        this.state = {
            party: props.party,
            player: props.player,
            pokerItem: props.pokerItem,
            voted: false,
        }

        this.cardRef = React.createRef();
        this.timerStarted = false;
    }

    public render = (): JSX.Element => {
        let id = "player" + this.props.player.seatNumber;

        let cardsCss = "poker-card ";

        if (this.state.player.voted == true) cardsCss += "hide ";

        if (isNothing(this.state.pokerItem)) cardsCss += "disabled ";

        if (this.props.isUser && this.state.party.voting && !this.state.player.voted) cardsCss += " vote";

        let cardsContainerCss: string = this.props.isUser ? "vote-cards-inside-container is-user" : "vote-cards-inside-container"; 

        return (
            <div id={id} className={!this.state.player.isActive ? "player inactive" : "player"}>
                <div className="avatar">
                {
                    this.state.player.isAdmin === true ? 
                    <div className="remove-player-btn">
                        <i className="fas fa-times x-img-remove" onClick={this.remove}/>
                    </div> : null
                }
                </div>
                <div className="player-name">{this.state.player.username}</div>
                <div className="vote-cards-container" draggable={false} onClick={this.vote}>
                    <div className={cardsContainerCss}>
                        <img src={card} className={cardsCss} ref={this.cardRef}/>
                        <img src={card} className={cardsCss}/>
                        <img src={card} className={cardsCss} style={{boxShadow: "0 0 3px white"}}/>
                    </div>
                </div>
                { 
                    this.props.isUser ? <div className="player-indicator">&#9733;</div> : null
                }
                <div className="bank">
                { 
                    this.props.player.v5Count !== 10 ? <div className="chip v5"></div> : null
                }
                { 
                    this.props.player.v10Count !== 10 ? <div className="chip v10"></div> : null
                }
                { 
                    this.props.player.v25Count !== 10 ? <div className="chip v25"></div> : null
                }
                { 
                    this.props.player.v50Count !== 10 ? <div className="chip v50"></div> : null
                }
                </div>
                {
                    this.state.player.voted === true ? this.showChips() : null
                }
            </div>
        );
    }

    public static getDerivedStateFromProps = (nextProps: IProps, prevState: IState) => {
        return {
            party: nextProps.party,
            player: nextProps.player,
            pokerItem: nextProps.pokerItem,
            voted: nextProps.player.voted,
        }
    }

    private vote = (): void => {
        if (!this.props.isUser) return;
        if (this.state.voted === true || isNothing(this.state.pokerItem) === true) return;
        this.cardRef.current.classList.remove("vote");
        this.props.onVote();
    }

    private remove = (): void => {
        if (confirm("Are you sure you want to remove this player?")) {
            this.context.signalR.removeVoter({
                playerId: this.state.player.key,
                partyId: this.state.party.key
            });
        }
    }

    private showChips = (): JSX.Element => {
        let player: Player = this.state.player;

        return (
            <div className="bet-container">
                { this.generateBet(player.v5Count, "chip v5", "0px") }
                { this.generateBet(player.v10Count, "chip v10", "18px") } 
                { this.generateBet(player.v25Count, "chip v25", "36px") }
                { this.generateBet(player.v50Count, "chip v50", "54px") }
            </div>
        )
    }

    private generateBet = (count: number, className: string, left: string):Array<JSX.Element> => {
        let array = [];
        for (let i = 0; i < count; i++) {
            array.push(<div key={i} className={className} style={{left: left, top: (i * 5).toString() + "px"}}></div>)
        }
        return array;
    }
}