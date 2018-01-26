import React from 'react';

import _ from 'lodash';
import shortid from 'shortid';

import {NarakaNodeModel,NarakaNodeWidget,getFactory} from 'core/nodes/NarakaNode';

export class StepNodeModel extends NarakaNodeModel {
	constructor(mode,title,clearMsg) {
		super("stepnode",{mode:mode,title:title,clearMsg:false,autoNextDelay:'',messages:[]});
	}

	/**
	 * Vrai si il s'agit de l'étape de départ de l'histoire
	 * @return {Boolean} [description]
	 */
	isStartStep() {
		return Object.keys(this.ports['in'].links).length === 0;
	}
}

/**
 * @author Dylan Vorster
 */
export class StepNodeWidget extends NarakaNodeWidget {
	
	generateAnswer(message) {
		return <div key={shortid.generate()}className="message">{message.from} : {message.text}</div>
	}

	getBG(mode) {
		switch (mode) {
			case 'sms':
				return '#ff2525';
			case 'narator':
				return 'blue';
			default:
				return 'white';
		}
	}

	render() {
		return (
			<div className="basic-node stepnode">
				<div className="header" style={{backgroundColor: 'black'}}>Etape</div>
				<div className="title">
					<div className="name" style={{backgroundColor: this.getBG(this.props.node.mode)}}>mode : {this.props.node.mode}</div>
					<div className="name">title : {this.props.node.title}</div>
					<div className="name">clearMsg : {this.props.node.clearMsg === true ? 'true' : "false"}</div>
					<div className="name">autoNextDelay : {this.props.node.autoNextDelay}</div>
				</div>
				<div className="ports">
					<div className="in">{_.map(this.props.node.getInPorts(), this.generatePort.bind(this))}</div>
					<div className="out">{_.map(this.props.node.getOutPorts(), this.generatePort.bind(this))}</div>
				</div>
				<div>{_.map(this.props.node.messages, this.generateAnswer.bind(this))}</div>
			</div>
		);
	}
}

const StepNodeFactory = getFactory('stepnode',React.createFactory(StepNodeWidget),StepNodeModel);
export {StepNodeFactory}
