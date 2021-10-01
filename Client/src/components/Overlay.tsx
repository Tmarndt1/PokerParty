import * as React from "react";

export interface IOverlay {
    active: boolean;
    body: JSX.Element | JSX.Element[];
    callback: (object: any) => void;
}

interface IProps {
    active: boolean;
};

interface IState {
    active: boolean;
};

export class Overlay extends React.Component<IProps, IState> {
    modalRef: React.RefObject<HTMLDivElement>;

    constructor(props: IProps) {
        super(props);
        this.state = {
            active: false,
        }

        this.modalRef = React.createRef();
    }

    public render = (): JSX.Element => {
        if (!this.state.active) return null;

        return (
            <div id="modal">
                <div id="modal-content" ref={this.modalRef}>
                {
                    this.props.children
                }
                </div>
            </div>
        );
    }

    public componentWillReceiveProps = (props: IProps): void => {
        let callback = (): void => {
            this.setState({
                active: props.active,
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