import React, { Component } from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Checkbox from 'material-ui/Checkbox';

import TextField from 'material-ui/TextField';

import _ from 'lodash';
import shortid from 'shortid';

import './EditStepDialog.css';


class Message extends Component {

    render() {
        return (
            <TextField style={styles.it} value={this.props.msg.text} onChange={(e) => this.props.onChange({text:e.target.value})} hintText="Message"/>
        );
    }

}

class EditStepDialog extends Component {

    constructor(props) {
        super(props);

        this.state = {
            messages:[]
        };
    }

    componentWillReceiveProps(nextProps) {

        if(!nextProps.node) return;

        let {mode,title,messages} = nextProps.node;

        messages = messages.map((msg) => {
            msg.key = shortid.generate();
            return msg;
        });

        this.setState({mode,title,messages});
    }

    addMsg() {
        let messages = this.state.messages;
        messages.push({key:shortid.generate()});
        this.setState({messages});
    }

    onChangeMsg(msg,newData) {
        msg = _.assign(msg,newData);
        this.forceUpdate();
    }

    handleChangeMode = (event, index, mode) => this.setState({mode});

    updateClearMsg() {
        this.setState((oldState) => {
            return {
                clearMsg: !oldState.clearMsg,
            };
        });
    }

    render() {
        return (
            <div>
                <Dialog
                  title="Edition étape"
                  modal={false}
                  open={this.props.open}
                  onRequestClose={() => this.props.onClose(this.state)}>

                  <div style={styles.flexC}>
                      <SelectField
                          floatingLabelText="Mode"
                          value={this.state.mode}
                          onChange={this.handleChangeMode}
                          style={styles.it}>

                          <MenuItem value={'narator'} primaryText="narator" />
                          <MenuItem value={'sms'} primaryText="sms" />
                        </SelectField>

                      <TextField style={styles.it} value={this.state.title} onChange={(e) => this.setState({title:e.target.value})} hintText="Titre"/>

                      <Checkbox
                          label="clearMsg"
                          checked={this.state.clearMsg}
                          onCheck={this.updateClearMsg.bind(this)}
                          style={styles.checkbox}/>

                      <span className="message-title">Messages</span>
                      <FlatButton label="Ajouter un message" onClick={() => this.addMsg()}/>
                      <div style={styles.flexC} className="">
                          {_.map(this.state.messages, (msg) => {return <Message key={msg.key} msg={msg} onChange={(newData) => this.onChangeMsg(msg,newData)}/>})}
                      </div>
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

export default EditStepDialog;
