import * as React from "react";
import { isNothing } from "../utilitites/isNothing";
import "../public/css/text-input.css";

interface IProps {
    value: string;
    label?: string;
    id?: string;
    style?: React.CSSProperties;
    containerStyle?: React.CSSProperties;
    disabled?: boolean;
    onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => any;
}

export function TextArea(props: IProps): JSX.Element {
    return (
        <div className="text-area-container" style={props.containerStyle}>
            { !isNothing(props.label) ? <label htmlFor={props.id}>{props.label}</label> : null }
            <textarea id={props.id} className="text-area" value={props.value}
                style={props.style} onChange={props.onChange} disabled={props.disabled}/>
        </div>
    );
}