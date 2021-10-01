import * as React from "react";

interface IProps {
    text: string;
    id?: string;
    className?: string;
    children?: React.ReactChild | React.ReactChild[];
    style?: React.CSSProperties;
    onClick: () => any;
}

export function Button(props: IProps): JSX.Element {
    return (
        <button id={props.id ?? ""} className={(props.className ? "btn " + props.className : "btn")} onClick={props.onClick}
            style={props.style}>
            <span style={props.children ? {paddingRight: 10} : {}}>
                { props.text }
            </span>
            { props.children }
        </button>
    );
}