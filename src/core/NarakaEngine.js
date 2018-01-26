import {
	DiagramEngine
} from "storm-react-diagrams";

import {StepNodeFactory} from 'core/nodes/StepNode';
import {AnswerNodeFactory} from 'core/nodes/AnswerNode';
import {NextChapterNodeFactory} from 'core/nodes/NextChapterNode';
import {NarakaModel} from 'core/NarakaModel';

class NarakaEngine {
    constructor() {
        this.engine = new DiagramEngine();
        this.model = new NarakaModel(this.engine);

		this.engine.installDefaultFactories();
		this.engine.registerNodeFactory(new StepNodeFactory());
		this.engine.registerNodeFactory(new AnswerNodeFactory());
		this.engine.registerNodeFactory(new NextChapterNodeFactory());

    }

    getModel() {
        return this.model;
    }

    getDiagramEngine() {
        return this.engine;
    }

    /**
     * Chargement du chapitre dont l'id est passé en parametre
     * Si il n'y a pas de parametre, on cherche a charger le chapitre de départ
     * @param  {[type]} chapterId [description]
     * @return {[type]}           [description]
     */
    loadChapter(chapterId, noSave) {
        const stormModel = this.model.loadChapter(chapterId);
        this.engine.setDiagramModel(stormModel);
    }

    getDiagramModel() {
        return this.engine.getDiagramModel();
    }

}

//singleton
const narakaEngine = new NarakaEngine();
function getEngine(){
    return narakaEngine;
}

export {getEngine};
