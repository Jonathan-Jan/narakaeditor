import * as SRD from "storm-react-diagrams";
import React, { Component } from 'react';

import _ from 'lodash';
import shortid from 'shortid';

const PortWidget = SRD.PortWidget ;
const DefaultPortLabel = SRD.DefaultPortLabel;

export class MessageNodeModel extends SRD.NodeModel {
	constructor() {
		super("messagenode");

        this.addPort(new SRD.DefaultPortModel(false, "out-1", "S"));
		this.addPort(new SRD.DefaultPortModel(true, "in-1", "E"));

        this.message = {text:'Je suis en pleine partie.'};
		this.name = this.message.text;
	}

	deSerialize(object) {
		super.deSerialize(object);
		this.name = object.name;
		this.message = object.message;
	}

	serialize() {
		return _.merge(super.serialize(), {
			name: this.name,
			message: this.message
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

export class MessageNodeFactory extends SRD.NodeFactory {
	constructor() {
		super("messagenode");
	}

	generateReactWidget(diagramEngine, node) {
		return MessageNodeWidgetFactory({ node: node });
	}

	getNewInstance() {
		return new MessageNodeModel();
	}
}

/**
 * @author Dylan Vorster
 */
export class MessageNodeWidget extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	generatePort(port) {
		return <DefaultPortLabel model={port} key={port.id} />;
	}

	render() {
		return (
			<div className="basic-node" style={{ background: "rgb(119, 242, 45)" }}>
				<div style={{backgroundColor: 'black'}}>Message</div>
				<div className="title">
					<div className="name">{this.props.node.name}</div>
				</div>
				<div className="ports">
					<div className="in">{_.map(this.props.node.getInPorts(), this.generatePort.bind(this))}</div>
					<div className="out">{_.map(this.props.node.getOutPorts(), this.generatePort.bind(this))}</div>
				</div>
			</div>
		);
	}
}

const MessageNodeWidgetFactory = React.createFactory(MessageNodeWidget);
