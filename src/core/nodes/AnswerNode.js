import React from 'react';

import _ from 'lodash';

import {NarakaNodeModel,NarakaNodeWidget,getFactory} from 'core/nodes/NarakaNode';

export class AnswerNodeModel extends NarakaNodeModel {
	constructor() {
		super("answernode", {text:''});
	}
}

/**
 * @author Dylan Vorster
 */
export class AnswerNodeWidget extends NarakaNodeWidget {

	render() {
		return (
			<div className="basic-node answernode">
				<div className="header" style={{backgroundColor: 'black'}}>Answer</div>
				<div className="title">
					<div className="name">{this.props.node.text}</div>
				</div>
				<div className="ports">
					<div className="in">{_.map(this.props.node.getInPorts(), this.generatePort.bind(this))}</div>
					<div className="out">{_.map(this.props.node.getOutPorts(), this.generatePort.bind(this))}</div>
				</div>
			</div>
		);
	}
}

const AnswerNodeFactory = getFactory('answernode',React.createFactory(AnswerNodeWidget),AnswerNodeModel);
export {AnswerNodeFactory}
