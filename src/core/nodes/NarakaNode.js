import * as SRD from "storm-react-diagrams";
import React from 'react';

import _ from 'lodash';

const DefaultPortLabel = SRD.DefaultPortLabel;

export class NarakaNodeModel extends  SRD.NodeModel {

    constructor(type, params) {
        super(type);

        this.addPort(new SRD.DefaultPortModel(true, "in", "E"));
		this.addPort(new SRD.DefaultPortModel(false, "out", "S"));

        this._keys = [];

        Object.keys(params).map(key => {
            this._keys.push(key);
            this[key] = params[key];
        });
    }

    deSerialize(object) {
		super.deSerialize(object);

        this._keys.map(key => {
            this[key] = object[key];
        });
	}

    serialize() {

        const serialized = {};
        this._keys.map(key => {
            serialized[key] = this[key];
        });

		return _.merge(super.serialize(), serialized);
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
	 * Toujours faux pour un noeud autre que stepnode
	 * @return {Boolean} [description]
	 */
	isStartStep() {
		return false;
	}
}

export function getFactory(type,NodeWidgetFactory,NodeModel){
    return class CustomFactory extends  SRD.NodeFactory {
        constructor() {
    		super(type);
    	}

    	generateReactWidget(diagramEngine, node) {
    		return NodeWidgetFactory({ node: node });
    	}

    	getNewInstance() {
    		return new NodeModel();
    	}
    }
}

// export class StepNodeFactory extends SRD.NodeFactory {
//     constructor() {
// 		super("stepnode");
// 	}
//
// 	generateReactWidget(diagramEngine, node) {
// 		return StepNodeWidgetFactory({ node: node });
// 	}
//
// 	getNewInstance() {
// 		return new StepNodeModel();
// 	}
// }

export class NarakaNodeWidget extends React.Component {
    constructor(props) {
		super(props);
		this.state = {};
	}

    generatePort(port) {
		return <DefaultPortLabel model={port} key={port.id} />;
	}
}
