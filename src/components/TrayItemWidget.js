import * as React from "react";


export default class TrayItemWidget extends React.Component {
	constructor(props: TrayItemWidgetProps) {
		super(props);
		this.state = {};
	}

	render() {

		const style = {
			color:'white',
			border: '1px solid black'
		};

		let className = '';
		if (this.props.model.type === 'stepnode') {
			className = 'stepnode';
		}
		else if (this.props.model.type === 'answernode') {
			className = 'answernode';
		}

		return (
			<div
				style={style}
				draggable={true}
				onDragStart={event => {
					event.dataTransfer.setData("storm-diagram-node", JSON.stringify(this.props.model));
				}}
				className={className}
			>
				{this.props.name}
			</div>
		);
	}
}
