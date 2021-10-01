import * as React from "react";
import { Player } from "../models/Player";
import PlayerComponent from "./PlayerComponent";
import { IAppContext, AppContext } from "../contexts/AppContext";
import PokerCard from "./PokerCard";
import { Party } from "../models/Party";

const card = require("../public/images/card.png");

interface IProps {
    user: Player;
    party: Party;
    onVote: () => any;
    onFlip: () => any;
};

interface IState {
    
};


export default class PokerTable extends React.Component<IProps, IState> {
    public context: IAppContext;
    public static contextType = AppContext;
    private playersRef: React.RefObject<HTMLDivElement> = React.createRef();

    constructor(props: IProps) {
        super(props);
        this.state = {
            
        }
    }

    public render = (): JSX.Element => {
        return (
            <div id="poker-table-body">
                <div id="poker-table">
                    <div id="table-name">{ this.props.party.name }</div>
                        <div id="cards-place">
                        {
                            this.props.party.members.filter(x => x.isActive && x.voted).map(player => {
                                return <PokerCard key={player.key} player={player} flipped={this.props.party?.flipped}/>
                            })
                        }
                        {/* TODO HIDE when not voting */}
                        <div id="reset-container" onClick={this.props.onFlip} 
                            style={{fontSize: "1.5rem"}}>
                            { this.getEyeIcon() }
                        </div>
                    </div>
                    <div id="players" ref={this.playersRef}>
                    {
                        this.props.party.members.map(player => {
                            return (
                                <PlayerComponent key={player.key} player={player} 
                                    isUser={(this.props.user.key === player.key)} 
                                    pokerItem={this.props.party.workItem}
                                    onVote={this.props.onVote} 
                                    party={this.props.party}/>
                            );
                        })
                    }
                    </div>
                    <div id="average-container">
                    {
                        this.props.party?.flipped === true ? 
                            <span>
                                Average: { this.getAvg(this.props.party.members.filter(x => x.isActive && x.voted).map(x => parseInt(x.vote))) }
                            </span>: null
                    }
                    </div>
                </div>
            </div>
        );
    }

    public componentDidMount = (): void => {
        
    }

    private getAvg(votes: number[]): number {
        return votes.reduce((a, b) => a + b) / votes.length;
    }

    private getEyeIcon = (): JSX.Element => {
        if (!this.props.user.isAdmin) return null;

        let hasOneVoted: boolean = this.props.party?.voting === true && this.props.party.members.some(x => x.voted === true);

        if (!hasOneVoted) return null;

        if (this.props.party?.flipped) return <i className="fas fa-eye-slash"></i>

        if (!this.props.party?.flipped) return <i className="fas fa-eye"></i>
    }
}