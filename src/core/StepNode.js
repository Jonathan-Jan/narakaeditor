import * as SRD from "storm-react-diagrams";
import React, { Component } from 'react';

import _ from 'lodash';

const PortWidget = SRD.PortWidget ;
const DefaultPortLabel = SRD.DefaultPortLabel;

export class StepNodeModel extends SRD.NodeModel {
	constructor(color) {
		super("stepnode");
        this.messages = [];
		this.color = color;
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

	render() {
		return (
			<div className="basic-node" style={{ background: this.props.node.color }}>
				<div className="title">
					<div>StepNode</div>
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

const StepNodeWidgetFactory = React.createFactory(StepNodeWidget);
