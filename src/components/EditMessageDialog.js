import React, { Component } from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

import TextField from 'material-ui/TextField';

import _ from 'lodash';
import shortid from 'shortid';

import './EditMessageDialog.css';

class EditMessageDialog extends Component {

    constructor(props){
        super(props);
        this.state = {
            text:'',
            from:''
        };
    }

    componentWillReceiveProps(nextProps) {

        if(!nextProps.node) return;

        let {text,from} = nextProps.node;

        this.setState({text,from});
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
                      <TextField style={styles.it} value={this.state.text} onChange={(e) => this.setState({text:e.target.value})} hintText="text"/>
                      <TextField style={styles.it} value={this.state.from} onChange={(e) => this.setState({from:e.target.value})} hintText="from"/>
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

export default EditMessageDialog;
