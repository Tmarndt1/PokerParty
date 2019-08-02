import * as React from "react"

interface IProps {
    active: boolean;
    body: JSX.Element | JSX.Element[];
};

interface IState {
    active: boolean;
    body: JSX.Element | JSX.Element[];
};

export default class Modal extends React.Component<IProps, IState> {
    modalRef: React.RefObject<HTMLDivElement>;

    constructor(props: IProps) {
        super(props);
        this.state = {
            active: false,
            body: null
        }

        this.modalRef = React.createRef();
    }

    public render = (): JSX.Element => {
        if (!this.state.active) return null;

        return (
            <div id="modal">
                <div id="modal-content" ref={this.modalRef}>
                    {this.state.body}
                </div>
            </div>
        );
    }

    public componentWillReceiveProps = (props: IProps): void => {
        let callback = (): void => {
            this.setState({
                active: props.active,
                body: props.body,
            });
        }

        if (!props.active && this.state.active) {
            this.modalRef.current.style.opacity = "0";
            setTimeout(() => {
                callback();
            }, 400);
        } else {
            callback();
        }
    }

    public componentDidUpdate = (prevProps: IProps, prevState: IState): void => {
        if (this.state.active && !prevState.active) {
            setTimeout(() => {
                this.modalRef.current.style.opacity = "1";
            }, 50);
        }
    }
}