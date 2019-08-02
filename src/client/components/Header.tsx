import * as React from "react";
import HeaderName from "./HeaderName";
import PokerPlayer from "../../shared/models/PokerPlayer";

interface IProps {
    user: PokerPlayer;
};

interface IState {};

export default class Header extends React.Component<IProps, IState> {
    headerRef: React.RefObject<HTMLDivElement>;

    constructor(props: IProps) {
        super(props);
        this.headerRef = React.createRef();
    }

    public render = (): JSX.Element => {
        return (
            <div id="header" ref={this.headerRef}>
                <span>
                    {"<Poker Party/>"}
                </span>
                {/* <HeaderName/> */}
                <div id="username-logo">
                    {(this.props.user && typeof this.props.user.username == "string") ? 
                    this.props.user.username.charAt(0).toUpperCase() : "?"}
                </div>
            </div>
        )
    }
}