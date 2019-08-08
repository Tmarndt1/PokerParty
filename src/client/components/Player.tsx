import * as React from "react";
import PokerPlayer from "../../shared/models/PokerPlayer";
import { isNullOrUndefined } from "util";
import { IAppContext, AppContext } from "../contexts/AppContext";
import AdminVote from "./AdminVote";
import PlayerVote from "./PlayerVote";
import AdminAction from "./AdminAction"
import PokerItem from "../../shared/models/PokerItem";
import AppConnection from "../services/AppConnection";


const cancelBtn = require("../public/images/cancel.png");
const card = require("../public/images/card.png");
const action = require("../public/images/action3.png");

interface IProps {
    player: PokerPlayer;
    isUser: boolean;
    adminControl: boolean;
    pokerItem: PokerItem;
};

interface IState {
    player: PokerPlayer;
    pokerItem: PokerItem;
    voted: boolean;
};

export default class Player extends React.Component<IProps, IState> {
    public context: IAppContext;
    public static contextType = AppContext;

    private cardRef: React.RefObject<HTMLImageElement>;
    private intervalF: NodeJS.Timeout;
    private timerStarted: boolean;

    constructor(props: IProps) {
        super(props);
        this.state = {
            player: props.player,
            pokerItem: props.pokerItem,
            voted: false,
        }

        this.cardRef = React.createRef();
        this.timerStarted = false;
    }

    public render = (): JSX.Element => {
        let id = "player" + this.props.player.seatNumber;

        if (this.props.isUser === true) {
            return (
                <div id={id} className={isNullOrUndefined(this.props.player.username) ? "player inactive" : "player"}>
                    <div className="avatar">
                        {
                            this.props.adminControl === true ? 
                            <div className="remove-player-btn">
                                <img className="x-img-remove" src={cancelBtn} onClick={this.remove}/>
                            </div> 
                            : null
                        }
                    </div>
                    <div className="name">{this.props.player.username}</div>
                    {
                        this.state.player.voted === false ? 
                        <React.Fragment>
                            <img src={card} className={"poker-card is-user"} onClick={this.vote} ref={this.cardRef}/>
                            <img src={card} className={"poker-card"}/>
                            <img src={card} className={"poker-card"} style={{boxShadow: "0 0 3px white"}}/>
                        </React.Fragment>
                        : null
                    }
                    <div className="player-indicator">&#9733;</div>
                    <div className="bank">
                        <div className="chip v5"></div>
                        <div className="chip v10"></div>
                        <div className="chip v25"></div>
                        <div className="chip v50"></div>
                    </div>
                    {this.state.player.voted === true ? this.bet() : null}
                    {
                        this.props.player.admin === true ? 
                        <div id="admin-action-container">
                            <img id="admin-action-btn" src={action} onClick={this.action}/>
                        </div>
                        : null
                    }
                </div>
            )
        } else {
            return (
                <div id={id} className={isNullOrUndefined(this.props.player.username) ? "player inactive" : "player"}>
                    <div className="avatar">
                        {
                            this.props.adminControl === true ? 
                            <div className="remove-player-btn">
                                <img className="x-img-remove" src={cancelBtn} onClick={this.remove}/>
                            </div> 
                            : null
                        }
                    </div>
                    <div className="name">{this.props.player.username}</div>
                    {
                        this.state.player.voted !== true ? 
                        <React.Fragment>
                            <img src={card} className="poker-card"/>
                            <img src={card} className={"poker-card"}/>
                            <img src={card} className={"poker-card"} style={{boxShadow: "0 0 3px white"}}/>
                        </React.Fragment> 
                        : null
                    }
                    <div className="bank">
                        <div className="chip v5"></div>
                        <div className="chip v10"></div>
                        <div className="chip v25"></div>
                        <div className="chip v50"></div>
                    </div>
                    {this.state.player.voted === true && !isNullOrUndefined(this.state.player.username) ? this.bet() : null}
                </div>
            )
        }
    }

    public componentWillReceiveProps = (props: IProps): void => {
        this.setState({
            player: props.player,
            pokerItem: props.pokerItem,
            voted: props.player.voted,
        });
    }

    public componentDidUpdate = (prevProps: IProps, prevState: IState): void => {
        if (this.props.isUser && this.state.player.voted === false
            && this.timerStarted === false && isNullOrUndefined(this.state.pokerItem) === false) {
            this.timerStarted = true;
            let count = 0;
            this.cardRef.current.classList.add("vote");
            let active = true;
            this.intervalF = setInterval(() => {
                if (count > 30 || isNullOrUndefined(this.cardRef.current)) {
                    this.timerStarted = false;
                    clearInterval(this.intervalF);
                }
                active === true ? this.cardRef.current.classList.remove("vote")
                : this.cardRef.current.classList.add("vote");
                active = !active;
            }, 1500);   
        } else if (this.props.isUser && this.state.player.voted === true && this.intervalF) {
            this.timerStarted = false;
            clearInterval(this.intervalF);
        }
    }

    private vote = (): void => {
        if (this.state.voted === true || isNullOrUndefined(this.state.pokerItem) === true) return;

        this.cardRef.current.classList.remove("vote");
        this.context.isAdmin === true ? this.context.dropModal(true, <AdminVote pokerItem={this.props.pokerItem}/>, null) 
        : this.context.dropModal(true, <PlayerVote pokerItem={this.props.pokerItem} />, null);
    }

    private remove = (): void => {
        if (confirm("Are you sure you want to remove this player?")) {
            AppConnection.removeVoter(this.state.player);
        }
    }

    private action = (): void => {
        this.context.dropModal(true, <AdminAction pokerItem={this.state.pokerItem}/>, null);
    }

    private bet = (): JSX.Element => {
        let player = this.state.player;

        return (
            <div className="bet-container">
                {this.generateBet(player.v5Count, "chip v5", "0px")}
                {this.generateBet(player.v10Count, "chip v10", "18px")}
                {this.generateBet(player.v25Count, "chip v25", "36px")}
                {this.generateBet(player.v50Count, "chip v50", "54px")}
            </div>
        )
    }

    private generateBet = (count: number, className: string, left: string):Array<JSX.Element> => {
        let array = [];
        for (let i = 0; i < count; i++) {
            array.push(<div className={className} style={{left: left, top: (i * 5).toString() + "px"}}></div>)
        }
        return array;
    }
}