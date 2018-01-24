import React, { Component } from 'react';
import {
	DiagramEngine,
	DiagramModel,
	DiagramWidget,
} from "storm-react-diagrams";

import _ from 'lodash';

import {StepNodeModel,StepNodeFactory} from 'core/StepNode';
import {MessageNodeModel,MessageNodeFactory} from 'core/MessageNode';

import EditStepDialog from 'components/EditStepDialog';
import EditMessageDialog from 'components/EditMessageDialog';

class NakaraGraph extends Component {

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
		engine.registerNodeFactory(new MessageNodeFactory());

		//2) setup the diagram model
		let model = new DiagramModel();

		//3) load model into engine
		engine.setDiagramModel(model);

		this.state = {
			engine:engine,
			model:model,

			onEditStep:false,
			onEditMessage:false,

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
		let selected = this.state.selected;
		selected.name = event.target.value;

		this.forceUpdate();
	}

	onCloseEditorStep(newStep) {
		let selected = this.state.selected;
		selected.mode = newStep.mode;
		selected.title = newStep.title;
		selected.messages = newStep.messages;

		this.setState({onEditStep:false});
	}

	onCloseEditorMessage(newMsg) {
		let selected = this.state.selected;
		selected.text = newMsg.text;

		this.setState({onEditMessage:false});
	}

	addStepNode(isStep) {
		// var node = new DefaultNodeModel("Node 1", isStep ? "rgb(0,192,255)" : "rgb(192,255,0)");
		var node = new StepNodeModel("sms",this.state.defaultTitle,"rgb(0,192,255)");
		node.x = 50;
		node.y = 50;

		let model = this.state.model;
		model.addNode(node);

		this.forceUpdate();
	}

	addMessageNode() {
		// var node = new DefaultNodeModel("Node 1", isStep ? "rgb(0,192,255)" : "rgb(192,255,0)");
		var node = new MessageNodeModel();
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
					<button onClick={() => this.addStepNode(true)}>Ajouter Etape</button>
					<button onClick={() => this.addMessageNode(false)}>Ajouter Réponse</button>
					<button onClick={() => this.serialize()}>Serialize</button>
					<button onClick={() => this.parse(window.prompt("DATA : "))}>Parse</button>
					<input value={this.state.defaultTitle} onChange={(e) => this.setState({defaultTitle:e.target.value})}/>

					{this.state.selected && this.state.selected.type === 'stepnode' && <button onClick={() => this.setState({onEditStep:true})}>Editer</button>}
					{this.state.selected && this.state.selected.type === 'messagenode'&& <button onClick={() => this.setState({onEditMessage:true})}>Editer</button>}
				</header>
				<NakaraGraph engine={this.state.engine} model={this.state.model}/>

				{this.state.selected && this.state.selected.type === 'stepnode' && <EditStepDialog open={this.state.onEditStep} node={this.state.selected} onClose={(newStep) => this.onCloseEditorStep(newStep)}/>}
				{this.state.selected && this.state.selected.type === 'messagenode' && <EditMessageDialog open={this.state.onEditMessage} node={this.state.selected} onClose={(newStep) => this.onCloseEditorMessage(newStep)}/>}
			</div>
		);
	}
}

export default Editor;
