import * as SRD from "storm-react-diagrams";
import React from 'react';

import _ from 'lodash';

const DefaultPortLabel = SRD.DefaultPortLabel;

export class MessageNodeModel extends SRD.NodeModel {
	constructor() {
		super("messagenode");

        this.addPort(new SRD.DefaultPortModel(false, "out-1", "S"));
		this.addPort(new SRD.DefaultPortModel(true, "in-1", "E"));

		this.text = '';
		this.from = '';
	}

	deSerialize(object) {
		super.deSerialize(object);
		this.text = object.text;
		this.from = object.from;
	}

	serialize() {
		return _.merge(super.serialize(), {
			text: this.text,
			from: this.from,
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
			<div className="basic-node messagenode" style={{ background: "rgb(119, 242, 45)" }}>
				<div className="header" style={{backgroundColor: 'black'}}>Message</div>
				<div className="title">
					<div className="name">from : {this.props.node.from}</div>
					<div className="name">text : {this.props.node.text}</div>
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
