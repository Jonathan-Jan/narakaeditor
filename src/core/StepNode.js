import * as SRD from "storm-react-diagrams";
import React from 'react';

import _ from 'lodash';
import shortid from 'shortid';

const DefaultPortLabel = SRD.DefaultPortLabel;

export class StepNodeModel extends SRD.NodeModel {
	constructor(mode,title,clearMsg) {
		super("stepnode");

		this.addPort(new SRD.DefaultPortModel(true, "in", "E"));
		this.addPort(new SRD.DefaultPortModel(false, "out", "S"));

		this.mode = mode;
		this.title = title;
		this.clearMsg = false;
		this.autoNextDelay = '';
        this.messages = [];
	}

	deSerialize(object) {
		super.deSerialize(object);
		this.mode = object.mode;
		this.title = object.title;
		this.clearMsg = object.clearMsg;
		this.autoNextDelay = object.autoNextDelay;
		this.messages = object.messages;
	}

	serialize() {

		return _.merge(super.serialize(), {
			mode: this.mode,
			title: this.title,
			clearMsg: this.clearMsg,
			autoNextDelay: this.autoNextDelay,
			messages: this.messages,
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

	remove() {
		super.remove();
		for (var i in this.ports) {
			_.forEach(this.ports[i].getLinks(), link => {
				link.remove();
			});
		}
	}

	/**
	 * Vrai si il s'agit de l'étape de départ de l'histoire
	 * @return {Boolean} [description]
	 */
	isStartStep() {
		return Object.keys(this.ports['in'].links).length === 0;
	}

	getNextNodes() {
		 //model.getNodes() => node.ports.links.targetPort.parentNode
		 const links = _.values(this.ports['out'].links);

		 return links.map((link) => {
			 let node = link.targetPort.parentNode;

			 if (node.id === this.id) {
				 node = link.sourcePort.parentNode;
			 }

			 return node;
		 });
	}

	/**
	 * Construit un objet serializé correspondant à l'étape
	 * @return {[type]} [description]
	 */
	buildNaraka() {
		//récup des info de base
		const narakaStep = {
			mode: this.mode,
			title: this.title,
			clearMsg: this.clearMsg,
			autoNextDelay: this.autoNextDelay,
			messages: this.messages,
		};

		//récup des nodes suivant
		let nextNodes = this.getNextNodes();
		if (!nextNodes) return narakaStep;

		//si il y a un node unique de type stepnode, il s'agit d'une étape sans réponse (avec une destination unique direct)
		if (nextNodes.length === 1 && nextNodes[0].type === 'stepnode') {
			narakaStep.destination = nextNodes[0].id;

			return narakaStep;
		}

		//récupération des réponses possible
		narakaStep.answers = nextNodes.map(node => {
			//seul les noeuds answernode sont traités
			if (node.type === 'stepnode') {
				console.warn(`Le Noeud possède des noeuds suivant de type multiple : ${JSON.stringify(narakaStep)}`);
				return;
			}

			const answer =  {text:node.text,from:node.from,destination:node.getNextNode() ? node.getNextNode().id : 'none'};

			if (answer.destination === 'none') console.warn(`Réponse sans déstination : ${JSON.stringify(narakaStep)}`);

			return answer;
		});

		return narakaStep;
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

	generateAnswer(message) {
		return <div key={shortid.generate()}className="message">{message.from} : {message.text}</div>
	}

	render() {
		return (
			<div className="basic-node stepnode">
				<div className="header" style={{backgroundColor: 'black'}}>Etape</div>
				<div className="title">
					<div className="name">title : {this.props.node.title}</div>
					<div className="name">mode : {this.props.node.mode}</div>
					<div className="name">clearMsg : {this.props.node.clearMsg === true ? 'true' : "false"}</div>
					<div className="name">autoNextDelay : {this.props.node.autoNextDelay}</div>
				</div>
				<div className="ports">
					<div className="in">{_.map(this.props.node.getInPorts(), this.generatePort.bind(this))}</div>
					<div className="out">{_.map(this.props.node.getOutPorts(), this.generatePort.bind(this))}</div>
				</div>
				<div>{_.map(this.props.node.messages, this.generateAnswer.bind(this))}</div>
			</div>
		);
	}
}

const StepNodeWidgetFactory = React.createFactory(StepNodeWidget);
