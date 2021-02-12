import * as React from "react";
import Player, { IPlayer } from "../models/Player";
import PlayerComponent from "./PlayerComponent";
import { isNullOrUndefined } from "util";
import PokerItem, { IPokerItem } from "../models/PokerItem";
import { IAppContext, AppContext } from "../contexts/AppContext";
import PokerCard from "./PokerCard";
import Modal from "./Modal";
import VoteComponent from "./VoteComponent";
import Party, { IParty } from "../models/Party";
import PartyFactory from "../factories/PartyFactory";
import { SignalRService, SignalREvent } from "../services/SignalRService";

const card = require("../public/images/card.png");

interface IProps {
    user: Player;
    party: Party;
};

interface IState {
    user: Player;
    party: Party;
    flipped: boolean;
    flipping: boolean;
    countDown: number;
    voting: boolean;
};


export default class PokerTable extends React.Component<IProps, IState> {
    public context: IAppContext;
    public static contextType = AppContext;

    constructor(props: IProps) {
        super(props);

        this.state = {
            user: props.user,
            party: props.party,
            flipped: false,
            flipping: false,
            countDown: null,
            voting: false
        }
    }

    public render = (): JSX.Element => {
        let average: number = this.state.party.voting ? 
            this.getAvg(this.state.party.members.filter(x => x.active).map(x => parseInt(x.vote))) : null;

        return (
            <div id="poker-table-body">
                <Modal active={this.state.voting}>
                    <VoteComponent closeHandler={this.closeVoteWindow} user={this.state.user}
                    pokerItem={this.state.party.pokerItem} partyId={this.state.party.id}/>
                </Modal>
                {
                    this.state.flipping === true ? 
                    <div id="flip-count-down">
                        Cards flip in: { this.state.countDown } seconds
                    </div>
                    : null
                }
                <div id="poker-table">
                    <div id="table-name">{ this.props.party.name }</div>
                    <div id="cards-place">
                        {
                            this.state.party.members.filter(x => x.active && x.voted).map(player => {
                                return <PokerCard key={player.id} player={player} flipped={this.state.flipped}/>
                            })
                        }
                        {
                            this.state.user.admin == true && this.state.flipped == true ? 
                            <div id="reset-container" onClick={this.revote}>
                                <i className="fas fa-undo-alt"></i>
                            </div>
                            : null
                        }
                    </div>
                    <div id="players">
                        {
                            this.state.party.members.map(player => {
                                return <PlayerComponent key={player.id} player={player} isUser={(this.props.user.id === player.id)} 
                                pokerItem={this.state.party.pokerItem}
                                voteHandler={() => this.setState({voting: true})} party={this.state.party}/>
                            })
                        }
                    </div>
                    <div id="average-container">
                        {
                            this.state.flipped == true ? 
                            <span>Average: { isNaN(average) ? "?" : average } </span> : null
                        }
                    </div>
                </div>
            </div>
        );
    }

    public componentDidMount = (): void => {
        SignalRService.getInstance().subscribe(SignalREvent.ItemSubmmitted, this.itemSubmitted);
        SignalRService.getInstance().subscribe(SignalREvent.PartyUpdate, this.updateParty);
        SignalRService.getInstance().subscribe(SignalREvent.PlayerRemoved, this.removePlayer);
        SignalRService.getInstance().subscribe(SignalREvent.PlayerVoted, this.setPlayersVote);
        SignalRService.getInstance().subscribe(SignalREvent.Reset, this.reset);
        SignalRService.getInstance().subscribe(SignalREvent.RevoteItem, this.reset);
        SignalRService.getInstance().subscribe(SignalREvent.PlayerAdded, this.playerAdded);
    }

    private removePlayer = (player: Player): void => {
        for (let i = 0; i < this.state.party.members.length; i++) {
            if (this.state.party.members[i].id == player.id) {
                this.state.party.members.splice(i, 1);
                break;
            }
        }
        this.setState({
            party: this.state.party
        });
    }

    private setPlayersVote = (json: IParty) => {
        let countDown: number = 3;
        let party: Party = new PartyFactory().fromJson(json);
        let allVoted: boolean = party.members.filter(x => x.active === true).every(x => x.voted === true);
        
        this.setState({
            party: party,
            countDown: countDown,
            flipping: allVoted,
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
                    flipped: (countDown === 0),
                });
            }, 1000);
        }
    }

    private itemSubmitted = (json: IParty): void => { 
        let party: Party = new PartyFactory().fromJson(json);

        this.setState({
            party: party,
            flipped: false,
            flipping: false,
            countDown: null
        });
    }

    private revote = (): void => {
        SignalRService.getInstance().revoteItem({
            partyId: this.state.party.id
        });
    }

    private reset = (json: IParty): void => {
        if (isNullOrUndefined(json)) return;
        
        let party: Party = new PartyFactory().fromJson(json);

        this.setState({
            party: party,
            flipped: false,
            flipping: false,
            countDown: null,
            voting: false
        });
    }

    private playerAdded = (json: IParty): void => {
        if (isNullOrUndefined(json)) return;
        
        let party: Party = new PartyFactory().fromJson(json);

        this.setState({
            party: party,
            flipped: false,
            flipping: false,
            countDown: null,
        });
    }

    private getAvg(votes: number[]): number {
        return votes.reduce((a, b) => a + b) / votes.length;
    }

    private closeVoteWindow = (): void => {
        this.setState({
            voting: false
        });
    }

    private updateParty = (json: IParty): void => {
        let party = new PartyFactory().fromJson(json);
        this.setState({
            party: party
        });
    }
}