import * as React from "react";
import { isNothing } from "../utilitites/isNothing";

interface IProps {
    value: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => any;
    label?: string;
    id?: string;
    style?: React.CSSProperties;
    containerStyle?: React.CSSProperties;
}

export function TextField(props: IProps): JSX.Element {
    return (
        <div className="text-field-container" style={props.containerStyle}>
            {
                !isNothing(props.label) ? <label htmlFor={props.id}>{props.label}</label> : null
            }
            <input id={props.id} className="text-field" type="text" value={props.value}
                style={props.style} onChange={props.onChange}/>
        </div>
    );
}