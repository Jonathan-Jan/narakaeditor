import React, { Component } from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

import TextField from 'material-ui/TextField';

import _ from 'lodash';
import shortid from 'shortid';

class DialogBackToParent extends Component {

    constructor(props){
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div>
                <Dialog
                  title=""
                  modal={false}
                  open={this.props.open}
                  onRequestClose={() => this.props.onClose()}>

                  {this.props.chapters.map(chapterId => <button key={shortid.generate()} onClick={() => this.props.loadChapter(chapterId)}>{chapterId}</button>)}

                </Dialog>
              </div>
        );
    }

}

export default DialogBackToParent;
