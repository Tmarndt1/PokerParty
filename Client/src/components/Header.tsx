import * as React from "react";
import { Player } from "../models/Player";

interface IProps {
    user: Player;
};

interface IState { };

export default class Header extends React.Component<IProps, IState> {
    headerRef: React.RefObject<HTMLDivElement>;

    constructor(props: IProps) {
        super(props);
        this.headerRef = React.createRef();
    }

    public render = (): JSX.Element => {
        return (
            <div id="header" ref={this.headerRef}>
                Agile Poker
            </div>
        )
    }
}