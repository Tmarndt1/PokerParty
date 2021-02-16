import * as React from "react";
import { isNothing } from "../utilitites/isNothing";
import "../public/css/text-input.css";

interface IProps {
    value: string;
    onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => any;
    label?: string;
    id?: string;
    style?: React.CSSProperties;
    containerStyle?: React.CSSProperties;
}

export function TextArea(props: IProps): JSX.Element {
    return (
        <div className="text-area-container" style={props.containerStyle}>
            {
                !isNothing(props.label) ? <label htmlFor={props.id}>{props.label}</label> : null
            }
            <textarea id={props.id} className="text-area" value={props.value}
                style={props.style} onChange={props.onChange}/>
        </div>
    );
}