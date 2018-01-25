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
import MetadataDialog from 'components/MetadataDialog';
import TrayItemWidget from 'components/TrayItemWidget';

import narakaBuilder from 'core/narakaBuilder';
import modelSerialized from 'savedmodel/model.json';

import 'Editor.css';

let doubleClickSelectTimer = 0;

class NakaraGraph extends Component {

	render() {
		return (
			<div style={{height:'100%'}}
				onDrop={event => {
							var data = JSON.parse(event.dataTransfer.getData("storm-diagram-node"));
							var nodesCount = _.keys(
								this.props.engine
									.getDiagramModel()
									.getNodes()
							).length;

							var node = null;
							if (data.type === "stepnode") {
								node = new StepNodeModel("sms",this.props.defaultTitle,false);
							} else if (data.type === "answernode") {
								node = new AnswerNodeModel();
							}

							node.addListener({
								selectionChanged: this.props.onSelect,
								entityRemoved: this.props.onRemove,
							});

							var points = this.props.engine.getRelativeMousePoint(event);
							node.x = points.x;
							node.y = points.y;
							this.props.engine
								.getDiagramModel()
								.addNode(node);
							this.forceUpdate();
						}}
						onDragOver={event => {
							event.preventDefault();
						}}>
				<DiagramWidget diagramEngine={this.props.engine} maxNumberPointsPerLink='0' deleteKeys={[46]}/>
			</div>
		)
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
		let metadata = {people:[]};
		if (modelSerialized.id) {
			metadata = modelSerialized._metadata || metadata;
			model.deSerializeDiagram(modelSerialized, engine);
		}

		//3) load model into engine
		engine.setDiagramModel(model);

		this.state = {
			engine:engine,
			model:model,

			metadata:metadata,

			onEditStep:false,
			onEditAnswer:false,
			onEditMetadata:false,

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
		selected.autoNextDelay = newStep.autoNextDelay;
		selected.messages = newStep.messages;

		this.setState({onEditStep:false});
	}

	onCloseEditorAnswer(newMsg) {
		let selected = this.state.selected;
		selected.text = newMsg.text;
		selected.from = newMsg.from;

		this.setState({onEditAnswer:false});
	}

	onCloseEditorMetadata(newMetadata) {
		this.setState({onEditMetadata:false});
	}

	serialize() {
		let serialized = this.state.model.serializeDiagram();
		serialized._metadata = this.state.metadata;
		var str = JSON.stringify(serialized);
		copy(str);
	}

	buildNaraka() {
		let model = this.state.engine.getDiagramModel();
		const narakaModel = narakaBuilder(model,this.state.metadata);
		copy(JSON.stringify(narakaModel));
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

		const graphProps = {
			defaultTitle: this.state.defaultTitle,

			onSelect: this.onSelect.bind(this),
			onRemove: this.onRemove.bind(this),
		};

		const metadataDialogProps = {
			metadata: this.state.metadata,
			onClose:this.onCloseEditorMetadata.bind(this)
		}

		return (
			<div style={{height:'100%'}}>
				<header className="flex-row menu">
					<TrayItemWidget model={{ type: "stepnode" }} name="Ajouter Etape" />
					<TrayItemWidget model={{ type: "answernode" }} name="Ajouter réponse" />
					<button onClick={() => this.serialize()}>Serialize to clipboard</button>
					<button onClick={() => this.buildNaraka()}>build Naraka</button>
					<input value={this.state.defaultTitle} onChange={(e) => this.setState({defaultTitle:e.target.value})}/>
					<button onClick={() => this.setState({onEditMetadata:true})}>Metadata</button>

					{this.state.selected && this.state.selected.type === 'stepnode' && <button onClick={() => this.setState({onEditStep:true})}>Editer</button>}
					{this.state.selected && this.state.selected.type === 'answernode'&& <button onClick={() => this.setState({onEditAnswer:true})}>Editer</button>}
				</header>
				<NakaraGraph engine={this.state.engine} model={this.state.model} {...graphProps}/>

				{this.state.selected && this.state.selected.type === 'stepnode' && <EditStepDialog open={this.state.onEditStep} node={this.state.selected} onClose={(newStep) => this.onCloseEditorStep(newStep)}/>}
				{this.state.selected && this.state.selected.type === 'answernode' && <EditAnswerDialog open={this.state.onEditAnswer} node={this.state.selected} onClose={(newStep) => this.onCloseEditorAnswer(newStep)}/>}

				<MetadataDialog open={this.state.onEditMetadata} {...metadataDialogProps}/>
			</div>
		);
	}
}

export default Editor;
