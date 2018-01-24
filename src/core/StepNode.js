import * as SRD from "storm-react-diagrams";
import React from 'react';

import _ from 'lodash';
import shortid from 'shortid';

const DefaultPortLabel = SRD.DefaultPortLabel;

export class StepNodeModel extends SRD.NodeModel {
	constructor(color) {
		super("stepnode");

		this.addPort(new SRD.DefaultPortModel(false, "out-1", "S"));
		this.addPort(new SRD.DefaultPortModel(true, "in-1", "E"));

		this.name = shortid.generate();
        this.messages = [{text:'Lundi, 01h30'},
            {text:'Votre téléphone vibre...'},];
		this.color = color;
	}

	deSerialize(object) {
		super.deSerialize(object);
		this.name = object.name;
		this.messages = object.messages;
		this.color = object.color;
	}

	serialize() {
		return _.merge(super.serialize(), {
			name: this.name,
			messages: this.messages,
			color: this.color
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
}

export class StepNodeFactory extends SRD.NodeFactory {
	constructor() {
		super("stepnode");
	}

	generateReactWidget(diagramEngine, node) {
		return StepNodeWidgetFactory({ node: node });
	}

	getNewInstance() {
		return new StepNodeModel();
	}
}

/**
 * @author Dylan Vorster
 */
export class StepNodeWidget extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	generatePort(port) {
		return <DefaultPortLabel model={port} key={port.id} />;
	}

	generateMessage(message) {
		return <div key={shortid.generate()}className="message">{message.text}</div>
	}

	render() {
		return (
			<div className="basic-node" style={{ background: this.props.node.color }}>
				<div style={{backgroundColor: 'black'}}>Etape</div>
				<div className="title">
					<div className="name">{this.props.node.name}</div>
				</div>
				<div className="ports">
					<div className="in">{_.map(this.props.node.getInPorts(), this.generatePort.bind(this))}</div>
					<div className="out">{_.map(this.props.node.getOutPorts(), this.generatePort.bind(this))}</div>
				</div>
				<div>{_.map(this.props.node.messages, this.generateMessage.bind(this))}</div>
			</div>
		);
	}
}

const StepNodeWidgetFactory = React.createFactory(StepNodeWidget);
