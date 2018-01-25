import React, { Component } from 'react';
import {
	DiagramEngine,
	DiagramModel,
	DiagramWidget,
} from "storm-react-diagrams";

import _ from 'lodash';
import copy from 'copy-to-clipboard';

import {StepNodeModel,StepNodeFactory} from 'core/StepNode';
import {AnswerNodeModel,AnswerNodeFactory} from 'core/AnswerNode';

import EditStepDialog from 'components/EditStepDialog';
import EditAnswerDialog from 'components/EditAnswerDialog';

import modelSerialized from 'savedmodel/model.json';

let doubleClickSelectTimer = 0;

class NakaraGraph extends Component {

	render() {
		return <DiagramWidget diagramEngine={this.props.engine} maxNumberPointsPerLink='0' deleteKeys={[46]}/>
	}
}

class Editor extends Component {

	constructor(props) {
		super(props);

		//1) setup the diagram engine
		let engine = new DiagramEngine();
		engine.installDefaultFactories();
		engine.registerNodeFactory(new StepNodeFactory());
		engine.registerNodeFactory(new AnswerNodeFactory());

		//2) setup the diagram model
		let model = new DiagramModel();
		model.deSerializeDiagram(modelSerialized, engine);

		//3) load model into engine
		engine.setDiagramModel(model);

		this.state = {
			engine:engine,
			model:model,

			onEditStep:false,
			onEditAnswer:false,

			selected:undefined
		}

		this.addListenerToNode();
	}

	componentDidUpdate(prevProps, prevState) {
		this.addListenerToNode();
	}

	addListenerToNode() {
		let engine = this.state.engine;
		let model = engine.getDiagramModel();
		const nodes = _.values(model.getNodes());

		nodes.forEach(node => {
			node.clearListeners();
			node.addListener({
				selectionChanged: this.onSelect.bind(this),
				entityRemoved: this.onRemove.bind(this),
			});
		});
	}

	onSelect(event) {
		if (!event.isSelected) {
			this.setState({selected:undefined});
			return;
		}
		console.log(event);

		let diffDoubleClickSelectTimer = new Date().getTime() - doubleClickSelectTimer;
		doubleClickSelectTimer = new Date().getTime();

		const selected = event.entity;
		const selectedName = event.entity.name;
		let newState = {selected,selectedName};
		//on a double cliqué sur un élement => on lance l'édition
		if (diffDoubleClickSelectTimer <= 1000 && this.state.selected && selected.id === this.state.selected.id) {
			newState = _.assign(newState, selected.type === 'stepnode' ? {onEditStep:true} : {onEditAnswer:true})
		}

		this.setState(newState);
	}

	onRemove(event) {
		this.state.model.removeNode(event.entity);
		this.forceUpdate();

	}

	onCloseEditorStep(newStep) {
		let selected = this.state.selected;
		selected.mode = newStep.mode;
		selected.title = newStep.title;
		selected.clearMsg = newStep.clearMsg;
		selected.messages = newStep.messages;

		this.setState({onEditStep:false});
	}

	onCloseEditorAnswer(newMsg) {
		let selected = this.state.selected;
		selected.text = newMsg.text;
		selected.from = newMsg.from;

		this.setState({onEditAnswer:false});
	}

	addStepNode(isStep) {
		// var node = new DefaultNodeModel("Node 1", isStep ? "rgb(0,192,255)" : "rgb(192,255,0)");
		var node = new StepNodeModel("sms",this.state.defaultTitle,false,"rgb(0,192,255)");
		node.x = 50;
		node.y = 50;

		let model = this.state.model;
		model.addNode(node);

		this.forceUpdate();
	}

	addAnswerNode() {
		// var node = new DefaultNodeModel("Node 1", isStep ? "rgb(0,192,255)" : "rgb(192,255,0)");
		var node = new AnswerNodeModel();
		node.x = 50;
		node.y = 50;

		let model = this.state.model;
		model.addNode(node);

		this.forceUpdate();
	}

	serialize() {
		var str = JSON.stringify(this.state.model.serializeDiagram());
		copy(str);
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
					<button onClick={() => this.addAnswerNode(false)}>Ajouter Réponse</button>
					<button onClick={() => this.serialize()}>Serialize to clipboard</button>
					<button style={{display:'none'}} onClick={() => this.parse(window.prompt("DATA : "))}>Parse</button>
					<input value={this.state.defaultTitle} onChange={(e) => this.setState({defaultTitle:e.target.value})}/>

					{this.state.selected && this.state.selected.type === 'stepnode' && <button onClick={() => this.setState({onEditStep:true})}>Editer</button>}
					{this.state.selected && this.state.selected.type === 'answernode'&& <button onClick={() => this.setState({onEditAnswer:true})}>Editer</button>}
				</header>
				<NakaraGraph engine={this.state.engine} model={this.state.model}/>

				{this.state.selected && this.state.selected.type === 'stepnode' && <EditStepDialog open={this.state.onEditStep} node={this.state.selected} onClose={(newStep) => this.onCloseEditorStep(newStep)}/>}
				{this.state.selected && this.state.selected.type === 'answernode' && <EditAnswerDialog open={this.state.onEditAnswer} node={this.state.selected} onClose={(newStep) => this.onCloseEditorAnswer(newStep)}/>}
			</div>
		);
	}
}

export default Editor;
