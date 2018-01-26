import React, { Component } from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

import TextField from 'material-ui/TextField';

import _ from 'lodash';
import shortid from 'shortid';

import './EditNextChapterDialog.css';

class EditNextChapterDialog extends Component {

    constructor(props){
        super(props);
        this.state = {
            chapterId:props.chapters[0],
        };
    }

    componentWillReceiveProps(nextProps) {

        let {chapters,node} = nextProps;

        if((!chapters || chapters.length <= 0) && !node.chapterId) return;

        let chapterId = node.chapterId || nextProps.chapters[0];

        this.setState({chapterId});
    }

    render() {
        return (
            <div>
                <Dialog
                  title="Edition messages"
                  modal={false}
                  open={this.props.open}
                  onRequestClose={() => this.props.onClose(this.state)}>

                  <select value={this.state.chapterId} onChange={(event) => this.setState({chapterId:event.target.value})}>
                      {this.props.chapters.map(id => <option key={id} value={id}>{id}</option>)}
                  </select>

                </Dialog>
              </div>
        );
    }

}

export default EditNextChapterDialog;
