import * as React from "react";
import { TextField } from "./TextField";
import { TextArea } from "./TextArea";
import WorkItem from "../models/WorkItem";
import { Button } from "./Button";

interface IProps {
    isAdmin: boolean;
    workItem: WorkItem;
    onTitleChange: (title: string) => any;
    onBodyChange: (body: string) => any;
}

interface IState {
    
}

export class WorkItemContainer extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {

        }
    }

    public render = (): JSX.Element => {
        return (
            <div id="work-item-container">
                <div style={{display: "flex", flexDirection: "column", width: "50%"}}>
                    <TextField value={this.props.workItem.title} label="Title:"
                        style={{minWidth: 300, maxWidth: 500}} containerStyle={{paddingBottom: "1.5rem"}}
                        onChange={e => this.props.onTitleChange(e.currentTarget.value)}
                        disabled={!this.props.isAdmin}/>
                    <TextArea value={this.props.workItem.body} label="Description:"
                        style={{minWidth: 300, maxWidth: 500, height: 300, maxHeight: 350}} 
                        containerStyle={{paddingBottom: "1.5rem"}}
                        onChange={e => this.props.onBodyChange(e.currentTarget.value)}
                        disabled={!this.props.isAdmin}/>
                </div>
            </div>
        );
    }
}