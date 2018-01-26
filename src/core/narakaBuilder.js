import _ from 'lodash';

export default class NarakaBuilder {
    constructor(narakaModel) {
        this.narakaModel = narakaModel;
    }

    build() {

        const nM = this.narakaModel;

        //récupération des metadatas
        let _metadata = nM.metadata;
        //on ne conserve que les clef importante
        const toKeep = ['people'];
        Object.keys(_metadata).map(key => {
            if (toKeep.indexOf(key) < 0) {
                delete _metadata[key];
            }
        });


        let naraka = {
            _metadata:_metadata
        };

        //liste des chapitres pouvant être le premier
        //A la fin du build il n'en restera qu'un seul
        //On élimine les chapitres de cette liste lorsqu'un noeud de changement de chapitre y fait référence
        let potentialStartChapter = _.values(nM.getChapters()); //on met tous les chapitres pour le moment
        let chatperStartNode = {};

        //On récupère l'ensemble des noeuds de type stepnode
        let allStepNodes = [];
        //On récupère aussi l'ensemble des noeurs de type nextchapternode
        let allNextChapterNodes = [];
        //on parcours l'ensemble des chapitres...
        _.values(nM.getChapters()).forEach(chapter => {
            //on parcours l'ensemble des noeuds de chaque chapitre
            _.values(chapter.getNodes()).forEach(node => {
                node.chapterId = chapter.id;
                if (node.type === 'stepnode') allStepNodes.push(node);
                if (node.type === 'nextchapternode') allNextChapterNodes.push(node);

            });
        });

        //on parcours tous les stepnodes pour construire l'étape
        allStepNodes.forEach(stepNode => {

            //si il s'agit d'une étape de départ on la met de coté
            if (stepNode.isStartStep()) {
                chatperStartNode[stepNode.chapterId] = stepNode;
            }
            naraka[stepNode.id] = this.buildStep(stepNode);
        });

        //on cherche l'étape de départ
        //on commence par chercher le chapitre de départ
        allNextChapterNodes.forEach(nextChapterNode => {
            delete chatperStartNode[nextChapterNode.chapterId];
        });
        //si il reste plus d'un chapitre => probleme
        if (Object.keys(chatperStartNode).length !== 1) console.warn(`Impossible de trouver le premier chapitre : ${JSON.stringify(potentialStartChapter.map(id => id))}`);


        let startNode = _.values(chatperStartNode)[0];
        naraka._metadata.start = startNode.id;


        // _.values(model.getNodes()).forEach((node) => {
        //
        //     if (node.type === 'answernode') return;
        //
        //     if (node.isStartStep()) {
        //         naraka._metadata.start = node.id;
        //     }
        //
        //     naraka[node.id] = node.buildNaraka();
        // });

        console.log(naraka);

        return naraka;
    }

    /**
	 * Construit un objet serializé correspondant à l'étape
	 * @return {[type]} [description]
	 */
	buildStep(stepNode) {
		//récup des info de base
		const narakaStep = {
			mode: stepNode.mode,
			title: stepNode.title,
			clearMsg: stepNode.clearMsg,
			autoNextDelay: stepNode.autoNextDelay,
			messages: stepNode.messages,
		};

		//récup des nodes suivant
		let nextNodes = stepNode.getNextNodes();
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

            let nextNodes = node.getNextNodes();
            if (nextNodes.length > 1) console.warn(`Noeud message avec plusieurs destination. Seul la première est prise en compte ${JSON.stringify({text:this.text,from:this.from})}`);
            let nextNode = nextNodes[0];

			const answer =  {text:node.text,from:node.from,destination: nextNode ? nextNode.id : 'none'};

			if (answer.destination === 'none') console.warn(`Réponse sans déstination : ${JSON.stringify(narakaStep)}`);

			return answer;
		});

		return narakaStep;
	}
}
