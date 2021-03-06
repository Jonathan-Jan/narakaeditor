import React from 'react';

import _ from 'lodash';

import {NarakaNodeModel,NarakaNodeWidget,getFactory} from 'core/nodes/NarakaNode';

export class NextChapterNodeModel extends NarakaNodeModel {
	constructor() {
		super("nextchapternode", {chapterId:'',chapterName:''});
	}
}

export class NextChapterNodeWidget extends NarakaNodeWidget {

	render() {
		return (
			<div className="basic-node nextchapternode">
				<div className="header" style={{backgroundColor: 'black'}}>Answer</div>
				<div className="title">
					<div className="name">{this.props.node.chapterId}</div>
				</div>
				<div className="ports">
					<div className="in">{_.map(this.props.node.getInPorts(), this.generatePort.bind(this))}</div>
					<div className="out">{_.map(this.props.node.getOutPorts(), this.generatePort.bind(this))}</div>
				</div>
			</div>
		);
	}
}

const NextChapterNodeFactory = getFactory('nextchapternode',React.createFactory(NextChapterNodeWidget),NextChapterNodeModel);
export {NextChapterNodeFactory}
