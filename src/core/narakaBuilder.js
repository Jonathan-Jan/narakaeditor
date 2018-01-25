import _ from 'lodash';

export default function(model,metadata) {
    let naraka = {
        _metadata:metadata
    };

    _.values(model.getNodes()).forEach((node) => {

        if (node.type === 'answernode') return;

        if (node.isStartStep()) {
            naraka._metadata.start = node.id;
        }

        naraka[node.id] = node.buildNaraka();
    });

    console.log(naraka);

    return naraka;
}