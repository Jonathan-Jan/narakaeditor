import React, { Component } from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Checkbox from 'material-ui/Checkbox';

import TextField from 'material-ui/TextField';

import _ from 'lodash';
import shortid from 'shortid';

import './EditStepDialog.css';


class Answer extends Component {

    render() {
        return (
            <div style={{padding: '5px 0px 10px 0px'}}>
                <input style={styles.it} value={this.props.msg.from} onChange={(e) => this.props.onChange({from:e.target.value})} placeholder="from"/>
                <input style={styles.it} value={this.props.msg.text} onChange={(e) => this.props.onChange({text:e.target.value})} placeholder="text"/>
                <button onClick={() => this.props.onDelete(this.props.msg)}>Suppr</button>
            </div>
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
        messages.push({key:shortid.generate(),from:'',text:''});
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

    onDeleteMsg(msg) {
        let messages = _.filter(this.state.messages, message => {
            if (message.key !== msg.key) {
                return message;
            }
        });
        this.setState({messages});
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

                      <TextField style={styles.it} value={this.state.autoNextDelay} onChange={(e) => this.setState({autoNextDelay:e.target.value})} hintText="autoNextDelay"/>

                      <span className="message-title">Answers</span>
                      <FlatButton label="Ajouter un message" onClick={() => this.addMsg()}/>
                      <div style={styles.flexC} className="">
                          {_.map(this.state.messages, (msg) => {return <Answer key={msg.key} msg={msg} onDelete={this.onDeleteMsg.bind(this)} onChange={(newData) => this.onChangeMsg(msg,newData)}/>})}
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
