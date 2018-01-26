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

import {getEngine} from 'core/NarakaEngine';

import narakaBuilder from 'core/narakaBuilder';
import modelSerialized from 'savedmodel/narakamodel.json';

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
		let engine = getEngine();
		engine.getModel().deSerialize(modelSerialized);

		this.state = {
			engine:engine,

			onEditStep:false,
			onEditAnswer:false,
			onEditMetadata:false,

			selected:undefined
		}

		this.addListenerToNode();

		window.addEventListener('keydown', (e) => {
			if (e.ctrlKey && e.code === 'KeyE') {
				this.onCtrlE();
				e.preventDefault();
			}
		}, true);
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
			// newState = _.assign(newState, selected.type === 'stepnode' ? {onEditStep:true} : {onEditAnswer:true})
		}

		this.setState(newState);
	}

	onCtrlE() {
		const selected = this.state.selected;
		if (!selected) return;

		let newState = selected.type === 'stepnode' ? {onEditStep:true} : {onEditAnswer:true};
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
		// let serialized = this.state.model.serializeDiagram();
		// serialized._metadata = this.state.metadata;
		let serialized = this.state.engine.getModel().serialize();
		var str = JSON.stringify(serialized);
		copy(str);
	}

	buildNaraka() {
		let model = this.state.engine.getDiagramModel();
		const narakaModel = narakaBuilder(model,this.state.metadata);
		copy(JSON.stringify(narakaModel));
	}

	addChapter() {
		this.state.engine.getModel().addChapter();
		this.forceUpdate();
	}
	deleteChapter() {
		this.state.engine.getModel().deleteChapter();
		this.forceUpdate();
	}
	loadChapter(chapterId) {
		this.state.engine.loadChapter(chapterId);
		this.forceUpdate();
	}

	render() {

		const graphProps = {
			defaultTitle: this.state.defaultTitle,

			onSelect: this.onSelect.bind(this),
			onRemove: this.onRemove.bind(this),
		};

		const metadataDialogProps = {
			metadata: this.state.engine.getModel().getMetadata(),
			onClose:this.onCloseEditorMetadata.bind(this)
		}

		return (
			<div style={{height:'100%'}}>
				<header className="flex-row menu">
					<TrayItemWidget model={{ type: "stepnode" }} name="Ajouter Etape" />
					<TrayItemWidget model={{ type: "answernode" }} name="Ajouter réponse" />
					<input value={this.state.defaultTitle} onChange={(e) => this.setState({defaultTitle:e.target.value})}/>
					<button onClick={() => this.setState({onEditMetadata:true})}>Metadata</button>

					<select>
						<option onClick={()=>this.loadChapter()} value='firstChapter'>firstChapter</option>
						{this.state.engine.getModel().getChapterIds().map(id => <option key={id} onClick={()=>this.loadChapter(id)} value={id}>{id}</option>)}
					</select>
					<button onClick={() => this.addChapter()}>new chapters</button>
					<button onClick={() => this.deleteChapter()}>delete chapters</button>

					<div className="flex1"></div>

					<button onClick={() => this.serialize()}>Serialize to clipboard</button>
					<button onClick={() => this.buildNaraka()}>build Naraka</button>

					{this.state.selected && this.state.selected.type === 'stepnode' && <button onClick={() => this.setState({onEditStep:true})}>Editer (CTRL+E)</button>}
					{this.state.selected && this.state.selected.type === 'answernode'&& <button onClick={() => this.setState({onEditAnswer:true})}>Editer (CTRL+E)</button>}
				</header>
				<NakaraGraph engine={this.state.engine.getDiagramEngine()} {...graphProps}/>

				{this.state.selected && this.state.selected.type === 'stepnode' && <EditStepDialog open={this.state.onEditStep} node={this.state.selected} onClose={(newStep) => this.onCloseEditorStep(newStep)}/>}
				{this.state.selected && this.state.selected.type === 'answernode' && <EditAnswerDialog open={this.state.onEditAnswer} node={this.state.selected} onClose={(newStep) => this.onCloseEditorAnswer(newStep)}/>}

				<MetadataDialog open={this.state.onEditMetadata} {...metadataDialogProps}/>
			</div>
		);
	}
}

export default Editor;
