import {
    DiagramModel
} from "storm-react-diagrams";
import _ from 'lodash';

import NarakaBuilder from 'core/NarakaBuilder';

export class NarakaModel {

    constructor(engine) {

        this.engine = engine; //on a besoin du diagram engine pour serializer / désérializer
        this.current = undefined; //id du diagram en cours d'edition

        this.metadata =  {
            people:[],
            firstChapter:undefined,
        };
        this.chapters = {}; //id <=> modele (issue de storm diagram)
    }

    deSerialize(model) {
        this.metadata = model.metadata;
        this.chapters = _.reduce(model.chapters, (obj,chapter) => {
            const stormModel = new DiagramModel();
            let stormModelSerialized = chapter;
            stormModel.deSerializeDiagram(stormModelSerialized, this.engine);
            obj[stormModel.id] = stormModel;
            return obj;
        }, {});

        if (this.metadata.firstChapter) {
            this.setCurrent(this.metadata.firstChapter);
        }
    }

    serialize() {
        let {metadata} = this;

        let chapters = _.values(this.chapters).map(chapter => {
            return chapter.serializeDiagram();
        });

        return {metadata,chapters};
    }

    /**
     * modification du chapitre en cours de modif
     * @param {[type]} chapter [description]
     */
    setCurrent(chapterId) {
        this.current = chapterId;
        this.engine.setDiagramModel(this.chapters[this.current]);
    }
    getCurrent() {
        return this.current;
    }

    /**
     * Création d'un StormModel à partir du chapitre dont l'id est passé en parametre
     * Si il n'y a pas d'id, on va tenter de charger le chapitre de départ
     * @param  {[type]} chapterId [description]
     * @return {[type]}           [description]
     */
    loadChapter(chapterId) {
        if (!chapterId) {
            chapterId = this.metadata.firstChapter;
        }
        this.current = chapterId;
        return this.chapters[chapterId];
    }

    addChapter() {
        let chapter = new DiagramModel();
        this.chapters[chapter.id] = chapter;
        this.setCurrent(chapter.id);
    }

    deleteChapter(chapterId) {
        chapterId = chapterId || this.current;
        delete this.chapters[chapterId];
        if (Object.keys(this.chapters).length > 0) {
            this.setCurrent(Object.keys(this.chapters)[0]);
        }
        else {
            this.addChapter();
        }
    }

    getChapterIds() {
        return Object.keys(this.chapters).map((id) => id);
    }

    getMetadata() {
        return this.metadata;
    }

    getChapters() {
        return this.chapters;
    }

    build() {
        return new NarakaBuilder(this).build();
    }

    /**
     * Execution de la fonction en parametre pour chaque noeuds
     * @param  {Function} callback [description]
     * @return {[type]}            [description]
     */
    forEachNode(callback) {
        _.values(this.getChapters()).forEach(chapter => {
            //parcours de l'ensemble des noeuds de chaque chapitre
            _.values(chapter.getNodes()).forEach(node => {
                callback(chapter,node);
            });
        });
    }

    /**
     * Permet de récuperer une liste des id des chapitre ayant un noeud menant au chapitre en cours
     * @return {[type]} [description]
     */
    getChapterParent() {
        let ref = [];
        //parcours des chapitres
        this.forEachNode((chapter,node) => {
            node._chapterId = chapter.id;
            if (node.type === 'nextchapternode') {
                if (this.current === node.chapterId) {
                    ref.push(chapter.id);
                }
            }
        });

        return ref;
    }
}
