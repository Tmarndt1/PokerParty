import * as React from "react";

interface IProps { 
    delay?: number;
};

interface IState { };


export default class Curtain extends React.Component<IProps, IState> {
    curtainOneRef: React.RefObject<HTMLDivElement>;
    curtainTwoRef: React.RefObject<HTMLDivElement>;

    constructor(props: IProps) {
        super(props);

        this.curtainOneRef = React.createRef();
        this.curtainTwoRef = React.createRef();
    }

    public render = (): JSX.Element => {
        return (
            <div id="curtain-container">
                <div id="curtain-1" ref={this.curtainOneRef}></div>
                <div id="curtain-2" ref={this.curtainTwoRef}></div>
                {this.props.children}
            </div>
        );
    }

    public componentDidMount = (): void => {
        let delay: number = 100;

        if (this.props.delay > 100) delay = this.props.delay;

        setTimeout(() => {
            this.curtainOneRef.current.style.width = "0%";
            this.curtainTwoRef.current.style.width = "0%";
        }, delay);
    }
}