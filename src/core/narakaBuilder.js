import _ from 'lodash';

export default class NarakaBuilder {
    constructor(narakaModel) {
        this.narakaModel = narakaModel;
    }

    build() {

        const nM = this.narakaModel;

        //-------------------------------------------------------------
        //récupération des metadatas
        //-------------------------------------------------------------
        let _metadata = nM.metadata;
        //on ne conserve que les clef importante
        const toKeep = ['people'];
        Object.keys(_metadata).forEach(key => {
            if (toKeep.indexOf(key) < 0) {
                delete _metadata[key];
            }
        });

        let naraka = {
            _metadata:_metadata
        };


        //-------------------------------------------------------------
        //liste des chapitres pouvant être le premier
        //A la fin du build il n'en restera qu'un seul
        //On élimine les chapitres de cette liste lorsqu'un noeud de changement de chapitre y fait référence
        //-------------------------------------------------------------
        let potentialStartChapter = _.values(nM.getChapters()); //on met tous les chapitres pour le moment
        let chapterStartNode = {};


        //-------------------------------------------------------------
        // Première passe
        // indexation des noeuds étapes
        // indexation des noeuds de changement de chapitre
        //-------------------------------------------------------------
        //On récupère l'ensemble des noeuds de type stepnode
        let allStepNodes = [];
        //On récupère aussi l'ensemble des noeurs de type nextchapternode
        let allReferencedChapterId = [];
        //on parcours l'ensemble des chapitres...
        _.values(nM.getChapters()).forEach(chapter => {
            //on parcours l'ensemble des noeuds de chaque chapitre
            _.values(chapter.getNodes()).forEach(node => {
                node._chapterId = chapter.id;
                if (node.type === 'stepnode') allStepNodes.push(node);
                if (node.type === 'nextchapternode') allReferencedChapterId.push(node.chapterId);

            });
        });


        //-------------------------------------------------------------
        // Deuxième passe
        // indexation des noeuds de départ pour chaque chapitre
        //-------------------------------------------------------------
        allStepNodes.forEach(stepNode => {
            //si il s'agit d'une étape de départ on la met de coté
            if (stepNode.isStartStep()) {
                chapterStartNode[stepNode._chapterId] = stepNode;
            }
        });



        //-------------------------------------------------------------
        // construction des étapes
        //-------------------------------------------------------------
        //on parcours tous les stepnodes pour construire l'étape
        allStepNodes.forEach(stepNode => {

            //si il s'agit d'une étape de départ on la met de coté
            if (stepNode.isStartStep()) {
                chapterStartNode[stepNode._chapterId] = stepNode;
            }

            naraka[stepNode.id] = this.buildStep(stepNode, chapterStartNode);
        });


        //-------------------------------------------------------------
        // on cherche l'étape de départ
        // on commence par chercher le chapitre de départ
        //-------------------------------------------------------------
        let startChapterId;
        for (let i = 0; i < potentialStartChapter.length; i++) {
            //si un chapitre n'est referencé par aucun noeud de changement de chapitre : il s'agit du noeud de départ
            if (allReferencedChapterId.indexOf(potentialStartChapter[i].id) < 0) {
                startChapterId = potentialStartChapter[i].id;
            }
        }
        //on a trouvé le noeud de départ
        const startNode = chapterStartNode[startChapterId];
        naraka._metadata.start = startNode.id;



        console.log(naraka);

        return naraka;
    }

    /**
	 * Construit un objet serializé correspondant à l'étape
     * @param chapterStartNode : map chapitreId -> noeud de départ
	 * @return {[type]} [description]
     *
	 */
	buildStep(stepNode, chapterStartNode) {
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

        if (nextNodes.length === 1 && nextNodes[0].type === 'nextchapternode') {
            let nextChapter = nextNodes[0].chapterId;
            narakaStep.destination = chapterStartNode[nextChapter].id;
        }

		//récupération des réponses possible
		narakaStep.answers = this.buildAnswers(narakaStep, nextNodes, chapterStartNode);

		return narakaStep;
	}

    buildAnswers(narakaStep, nextNodes, chapterStartNode) {
        return nextNodes.map(node => {
			//seul les noeuds answernode sont traités
			if (node.type === 'stepnode' || node.type === 'nextchapternode') {
				throw new Error(`Le Noeud possède des noeuds suivant de type multiple : ${JSON.stringify(narakaStep)}`);
			}

            let nextNodes = node.getNextNodes();
            if (nextNodes.length > 1) console.warn(`Noeud message avec plusieurs destination. Seul la première est prise en compte ${JSON.stringify({text:this.text,from:this.from})}`);
            let nextNode = nextNodes[0];
            let id = nextNode ? nextNode.id : 'none';
            if (nextNode && nextNode.type === 'nextchapternode') {
                id = narakaStep.destination = chapterStartNode[nextNode.chapterId].id;
            }

			const answer =  {text:node.text,from:node.from,destination: id};

			if (answer.destination === 'none') console.warn(`Réponse sans déstination : ${JSON.stringify(narakaStep)}`);

			return answer;
		});
    }
}
