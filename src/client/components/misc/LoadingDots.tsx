import * as React from "react";


interface IProps {
    containerStyle?: React.CSSProperties;
    containerClass?: string;
    dotStyle?: React.CSSProperties;
    dotClass?: string;
}

export default function LoadingDots(props: IProps) {
    let containerClass = "loading-dots ";
    let dotClass = "bounce ";
    if (props.containerClass) containerClass += props.containerClass;
    if (props.dotClass) dotClass += props.dotClass;

    return (
        <div className={containerClass} style={props.containerStyle}>
            <div id="bounce1" className={dotClass} style={props.dotStyle}></div>
            <div id="bounce2" className={dotClass} style={props.dotStyle}></div>
            <div id="bounce3" className={dotClass} style={props.dotStyle}></div>
        </div>
    );
}