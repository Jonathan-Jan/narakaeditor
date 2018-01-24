import React, { Component } from 'react';
import {
	DiagramEngine,
	DefaultNodeFactory,
	DefaultLinkFactory,
	DiagramModel,
	DefaultNodeModel,
	LinkModel,
	DefaultPortModel,
	DiagramWidget,
	DefaultPortFactory,
	LinkFactory,
	SimplePortFactory
} from "storm-react-diagrams";

import {StepNodeModel,StepNodeFactory} from 'core/StepNode';

import shortid from 'shortid';
import _ from 'lodash';

class NakaraGraph extends Component {

	constructor(props) {
		super(props);

	}

	render() {
		return <DiagramWidget diagramEngine={this.props.engine} />
	}
}

class Editor extends Component {

	constructor(props) {
		super(props);

		//1) setup the diagram engine
		let engine = new DiagramEngine();
		engine.installDefaultFactories();
		engine.registerNodeFactory(new StepNodeFactory());

		//2) setup the diagram model
		let model = new DiagramModel();

		//3) load model into engine
		engine.setDiagramModel(model);

		this.state = {
			engine:engine,
			model:model,

			selected:undefined
		}
	}

	componentDidUpdate(prevProps, prevState) {
		let engine = this.state.engine;
		let model = engine.getDiagramModel();
		const nodes = _.values(model.getNodes());

		nodes.forEach(node => {
			node.clearListeners();
			node.addListener({
				selectionChanged: (event) => {this.onSelect(event)}
			});
		});
	}

	onSelect(event) {
		if (!event.isSelected) {
			this.setState({selected:undefined});
			return;
		}
		console.log(event);

		const selected = event.entity;
		const selectedName = event.entity.name;
		this.setState({selected,selectedName});
	}

	updateSelected(event) {
		console.log(event);

		this.state.selected.name = event.target.value;

		this.forceUpdate();
	}

	addNode(isStep) {
		// var node = new DefaultNodeModel("Node 1", isStep ? "rgb(0,192,255)" : "rgb(192,255,0)");
		var node = new StepNodeModel(isStep ? "rgb(0,192,255)" : "rgb(119, 242, 45)");
		var port1 = node.addPort(new DefaultPortModel(false, "out-1", "S"));
		var port2 = node.addPort(new DefaultPortModel(true, "in-1", "E"));
		node.x = 50;
		node.y = 50;

		let model = this.state.model;
		model.addNode(node);

		this.forceUpdate();
	}

	serialize() {
		var str = JSON.stringify(this.state.model.serializeDiagram());
		window.alert(str);
	}

	parse(serialized) {
		let engine = this.state.engine;

		//deserialize the model
		var model = new DiagramModel();
		model.deSerializeDiagram(JSON.parse(serialized), engine);
		engine.setDiagramModel(model);

		this.setState({model,engine});
	}

	render() {
		return (
			<div style={{height:'100%'}}>
				<header>
					<button onClick={() => this.addNode(true)}>Ajouter Etape</button>
					<button onClick={() => this.addNode(false)}>Ajouter Réponse</button>
					<button onClick={() => this.serialize()}>Serialize</button>
					<button onClick={() => this.parse(window.prompt("DATA : "))}>Parse</button>
					{this.state.selected && <input value={this.state.selected.name} onChange={(e) => this.updateSelected(e)}/>}
				</header>
				<NakaraGraph engine={this.state.engine} model={this.state.model}/>
			</div>
		);
	}
}

export default Editor;
