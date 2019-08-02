import * as React from "react";
import PokerPlayer, { IPokerPlayer } from "../../shared/models/PokerPlayer";
import AppConnection from "../services/AppConnection";
import SocketEvent from "../../shared/enums/SocketEvent";
import Player from "./Player";
import String from "../../shared/String";
import { isNullOrUndefined } from "util";
import PokerItem, { IPokerItem } from "../../shared/models/PokerItem";
import { IAppContext, AppContext } from "../contexts/AppContext";
import { IPartyJSON } from "../../shared/models/Party";

const card = require("../public/images/card.png");

interface IProps {
    user: PokerPlayer;
    isAdmin: boolean;
};

interface IState {
    user: PokerPlayer;
    players: Array<PokerPlayer>;
    flipped: boolean;
    flipping: boolean;
    countDown: number;
    pokerItem: PokerItem;
};

export default class PokerTable extends React.Component<IProps, IState> {
    public context: IAppContext;
    public static contextType = AppContext;

    constructor(props: IProps) {
        super(props);
        this.state = {
            user: null,
            players: [],
            flipped: false,
            flipping: false,
            countDown: null,
            pokerItem: null
        }
    }

    public render = (): JSX.Element => {
        let placeHolders: Array<JSX.Element> = [];
        for (let i = this.state.players.length + 1; i < 9; i++) {
            let player = PokerPlayer.createEmpty();
            player.setSeatNumber(i);
            placeHolders.push(<Player player={player} isUser={false} adminControl={false} pokerItem={this.state.pokerItem}/>)
        }

        return (
            <div id="poker-table-body">
                {
                    this.state.flipping === true ? 
                    <div id="flip-count-down">
                        Cards flip in: {this.state.countDown} seconds
                    </div>
                    : null
                }
                <div id="poker-table">
                    <div id="table-name">{this.props.user.partyName}</div>
                    <div id="cards-place">
                        {this.getCards()}
                    </div>
                    <div id="players">
                        {placeHolders}
                        {
                            this.state.players.map(player => {
                                return <Player player={player} isUser={(this.props.user.id === player.id)} 
                                adminControl={this.props.isAdmin} pokerItem={this.state.pokerItem}/>
                            })
                        }
                    </div>
                </div>
            </div>
        );
    }

    public componentDidMount = (): void => {
        AppConnection.subscribe([SocketEvent.PlayerAdded, this.addPlayer]);
        AppConnection.subscribe([SocketEvent.PlayerRemoved, this.removePlayer]);
        AppConnection.subscribe([SocketEvent.Reset, this.reset]);
        AppConnection.subscribe([SocketEvent.RevoteItem, this.reset]);
        AppConnection.subscribe([SocketEvent.PlayerVoted, this.setPlayersVote]);
        // AppConnection.subscribe([SocketEvent.Connect, this.getPokerPlayers]);
        AppConnection.subscribe([SocketEvent.ItemSubmmitted, this.itemSubmitted]);

        AppConnection.getParty(this.props.user.partyName)
        .then((party: IPartyJSON) => {
            if (isNullOrUndefined(party) || (party.members instanceof Array) === false) return;
            if (isNullOrUndefined(party.pokerItem) === false) {
                this.setState({
                    pokerItem: PokerItem.fromJSON(party.pokerItem)
                });
            }

            party.members.forEach((member: IPokerPlayer) => {
                this.addPlayer(member);
            });
        });
    }

    public componentWillReceiveProps = (props: IProps): void => {
        if (isNullOrUndefined(this.state.user)) {
            this.setState({
                user: props.user,
            });
        }
    }

    private addPlayer = (player: IPokerPlayer): void => {
        for (let i = 0; i < this.state.players.length; i++) {
            if (this.state.players[i].id == player.id) return;
        }

        this.state.players.push(new PokerPlayer(player));
        this.state.players.sort((a: PokerPlayer, b: PokerPlayer) => {
            return a.seatNumber < b.seatNumber ? -1 : 1;
        });

        AppConnection.reset(this.props.user.partyName);

        this.context.closeModal();
    }

    private removePlayer = (player: PokerPlayer): void => {
        for (let i = 0; i < this.state.players.length; i++) {
            if (this.state.players[i].id == player.id) {
                this.state.players.splice(i, 1);
                break;
            }
        }
        this.setState({
            players: this.state.players
        });
    }

    private reset = (): void => {
        this.state.players.forEach(player => {
            player.resetVote();
        });

        this.setState({
            players: this.state.players,
            flipped: false,
            flipping: false,
            countDown: null
        });

        this.context.closeModal();
    }


    private setPlayersVote = (player: IPokerPlayer) => {
        let allVoted = true;
        let countDown = 6;

        this.state.players.forEach((p: PokerPlayer) => {
            if (p.id == player.id) {
                p.mirror(player);
            }
            if (p.voted === false) allVoted = false;
        });

        if (allVoted) {
            let func: any = setInterval(() => {
                if (countDown === 0) {
                    this.setState({
                        countDown: null,
                        flipping: false,
                    });

                    return clearInterval(func);
                }

                --countDown;

                this.setState({
                    countDown: countDown,
                    flipped: (countDown === 0)
                });
            }, 1000);
        }

        this.setState({
            players: this.state.players,
            countDown: countDown,
            flipping: allVoted
        });

        this.context.closeModal();
    }

    private getCards = (): JSX.Element[] => {
        let cards: Array<JSX.Element> = [];
        let flippedClass = this.state.flipped ? "flipped" : "";

        this.state.players.forEach((player: PokerPlayer) => {
            if (player.voted === true && String.isNullOEmpty(player.vote) === false) {  
                // flippedClass += (" seat-" + player.seatNumber.toString());             
                let jsx = <div className="flip-container">
                    <div className={("flipper " + flippedClass)}>
                        <div className="front">
                            <img src={card} className="poker-card-voted"/>
                        </div>
                        <div className={flippedClass + " back"}>
                            {player.vote}
                        </div>
                    </div>
                </div>

                cards.push(jsx);
            }
        });
    
        return cards;
    }

    private itemSubmitted = (item: IPokerItem): void => { 
        this.state.players.forEach(player => {
            player.resetVote();
        });

        let pokerItem = PokerItem.fromJSON(item);

        this.setState({
            players: this.state.players,
            flipped: false,
            flipping: false,
            countDown: null,
            pokerItem: pokerItem
        });

        this.context.closeModal();
    }
}