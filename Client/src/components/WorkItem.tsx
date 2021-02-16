import * as React from "react";
import { TextField } from "./TextField";
import { TextArea } from "./TextArea";

interface IProps {

}

interface IState {
    title: string;
    description: string;
}

export class WorkItem extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            title: "",
            description: ""
        }
    }

    public render = (): JSX.Element => {
        return (
            <div id="work-item">
                <TextField value={this.state.title} label="Title"
                    style={{minWidth: 300, maxWidth: 500}} containerStyle={{paddingBottom: "1.5rem"}}
                    onChange={e => this.setState({title: e.currentTarget.value})}/>
                <TextArea value={this.state.description} label="Description"
                    style={{minWidth: 300, maxWidth: 500, height: 300}} 
                    containerStyle={{paddingBottom: "1.5rem"}}
                    onChange={e => this.setState({description: e.currentTarget.value})}/>
            </div>
        );
    }
}