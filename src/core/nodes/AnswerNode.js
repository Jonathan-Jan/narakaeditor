import * as SRD from "storm-react-diagrams";
import React from 'react';

import _ from 'lodash';

import {NarakaNodeModel,NarakaNodeWidget,getFactory} from 'core/nodes/NarakaNode';

const DefaultPortLabel = SRD.DefaultPortLabel;

export class AnswerNodeModel extends NarakaNodeModel {
	constructor() {
		super("answernode", {text:''});
	}

	/**
	 * retourne le noeud suivant
	 * @return {[type]} [description]
	 */
	getNextNode() {
		 const nodes = super.getNextNode();

		 if (nodes.length > 1) console.warn(`Noeud message avec plusieurs destination. Seul la première est prise en compte ${JSON.stringify({text:this.text,from:this.from})}`);

		 return nodes[0];
	}
}

/**
 * @author Dylan Vorster
 */
export class AnswerNodeWidget extends NarakaNodeWidget {
	constructor(props) {
		super(props);
	}

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
