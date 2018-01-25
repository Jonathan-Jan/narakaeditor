import React, { Component } from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Checkbox from 'material-ui/Checkbox';
import ColorPicker from 'material-ui-color-picker'

import TextField from 'material-ui/TextField';

import _ from 'lodash';
import shortid from 'shortid';

import './MetadataDialog.css';

class People extends Component {

    render() {
        return (
            <div>
                <TextField style={styles.it} defaultValue={this.props.pupil.name} onChange={(e) => this.props.pupil.name = e.target.value} hintText="name"/>
                <span>color</span>
                <ColorPicker
                    name='color'
                    defaultValue={this.props.pupil.color}
                    onChange={color => this.props.pupil.color = color}/>
                <span>backgroundColor</span>
                <ColorPicker
                    name='backgroundColor'
                    defaultValue={this.props.pupil.backgroundColor}
                    onChange={color => this.props.pupil.backgroundColor = color}/>
            </div>
        );
    }

}

class MetadataDialog extends Component {

    constructor(props) {
        super(props);

        this.addPupil = this.addPupil.bind(this);
    }

    addPupil() {
        this.props.metadata.people.push({
            key:shortid.generate(),
            name:'',
            color:'',
            backgroundColor:''
        });
        this.forceUpdate();
    }

    render() {
        return (
            <div>
                <Dialog
                  title="Metadata"
                  modal={false}
                  open={this.props.open}
                  onRequestClose={() => this.props.onClose(this.state)}>

                  <FlatButton onClick={this.addPupil} label="Ajouter une personne"/>
                  <div style={styles.flexC} className="">
                      {_.map(this.props.metadata.people, (pupil) => {return <People key={pupil.key} pupil={pupil} />})}
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

export default MetadataDialog;
