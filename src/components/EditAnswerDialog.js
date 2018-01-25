import React, { Component } from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

import TextField from 'material-ui/TextField';

import _ from 'lodash';
import shortid from 'shortid';

import './EditAnswerDialog.css';

class EditAnswerDialog extends Component {

    constructor(props){
        super(props);
        this.state = {
            text:'',
        };
    }

    componentWillReceiveProps(nextProps) {

        if(!nextProps.node) return;

        let {text} = nextProps.node;

        this.setState({text});
    }

    render() {
        return (
            <div>
                <Dialog
                  title="Edition messages"
                  modal={false}
                  open={this.props.open}
                  onRequestClose={() => this.props.onClose(this.state)}>

                  <div style={styles.flexC}>
                      <TextField style={styles.it} value={this.state.text} onChange={(e) => this.setState({text:e.target.value})} hintText="text" onKeyUp={() => console.log('upupup')}/>
                  </div>


                </Dialog>
              </div>
        );
    }

}

const styles = {
    flexC:{
        display:'flex',flexDirection:'column'
    },
    it:{
        width: '100%',
    }
}

export default EditAnswerDialog;
