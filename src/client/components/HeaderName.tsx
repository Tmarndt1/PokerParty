import * as React from "react";

interface IProps {
    finishedCallback?: () => void;
}; 

interface IState {
    name: Array<string>;
};

export default class HeaderName extends React.Component<IProps, IState> {
    logoRef: React.RefObject<HTMLDivElement>;
    messageRef: React.RefObject<HTMLDivElement>;
    typeRef1: React.RefObject<HTMLDivElement>;
    typeRef2: React.RefObject<HTMLDivElement>;
    containerRef: React.RefObject<HTMLDivElement>;;

    constructor(props: IProps) {
        super(props);
        this.logoRef = React.createRef();
        this.containerRef = React.createRef();
        this.state = {
            name: ["<", "P", "o", "k", "e", "r", "&", "P", "a", "r", "t", "y", "/", ">"],
        }
    }

    public render() {
        return (
            <div id="logo-container" ref={this.containerRef}>
                <div id="init-logo" ref={this.logoRef}>
                    {
                        this.state.name.map((digit) => {
                            if (digit === "&") return <div style={{color: "transparent"}}>{digit}</div>;
                            else return <div>{digit}</div>;
                        })
                    }
                </div>
            </div>
        );
    }

    public componentDidMount() {
        setTimeout(() => {
            this.logoRef.current.style.opacity = "1";
        }, 200);

        setTimeout(() => {
            this.type(this.logoRef, this.state.name.length, 100).then(() => {
            });
        }, 300);
    }

    type(ref: React.RefObject<HTMLDivElement>, length: number, time: number) {
        return new Promise((resolve) => {
            var myLoop = (i: any) => {         
                setTimeout(() => {   
                    let node = ref.current.childNodes[i] as HTMLDivElement;
                    if (node && node.style) node.style.display = "inline-flex";
                    if (i < length) {
                        myLoop(++i);
                    } else {
                        resolve();
                    }
                }, time);
            };
            myLoop(0);
        }); 
    }
}
