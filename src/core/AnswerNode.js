import * as SRD from "storm-react-diagrams";
import React from 'react';

import _ from 'lodash';

const DefaultPortLabel = SRD.DefaultPortLabel;

export class AnswerNodeModel extends SRD.NodeModel {
	constructor() {
		super("answernode");

		this.addPort(new SRD.DefaultPortModel(true, "in", "E"));
        this.addPort(new SRD.DefaultPortModel(false, "out", "S"));

		this.text = '';
	}

	deSerialize(object) {
		super.deSerialize(object);
		this.text = object.text;
	}

	serialize() {
		return _.merge(super.serialize(), {
			text: this.text,
		});
	}

	getInPorts() {
		return _.filter(this.ports, (p) => {
			if (p.in) return p;
		});
	}

	getOutPorts() {
		return _.filter(this.ports, (p) => {
			if (!p.in) return p;
		});
	}

	/**
	 * Toujours faux pour un noeud de réponse
	 * @return {Boolean} [description]
	 */
	isStartStep() {
		return false;
	}

	/**
	 * retourne le noeud suivant
	 * @return {[type]} [description]
	 */
	getNextNode() {
		 //model.getNodes() => node.ports.links.targetPort.parentNode
		 const links = _.values(this.ports['out'].links);

		 const nodes = links.map((link) => {
			 return link.targetPort.parentNode
		 });

		 if (nodes.length > 1) console.warn(`Noeud message avec plusieurs destination. Seul la première est prise en compte ${JSON.stringify({text:this.text,from:this.from})}`);

		 return nodes[0];
	}
}

export class AnswerNodeFactory extends SRD.NodeFactory {
	constructor() {
		super("answernode");
	}

	generateReactWidget(diagramEngine, node) {
		return AnswerNodeWidgetFactory({ node: node });
	}

	getNewInstance() {
		return new AnswerNodeModel();
	}
}

/**
 * @author Dylan Vorster
 */
export class AnswerNodeWidget extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	generatePort(port) {
		return <DefaultPortLabel model={port} key={port.id} />;
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

const AnswerNodeWidgetFactory = React.createFactory(AnswerNodeWidget);
