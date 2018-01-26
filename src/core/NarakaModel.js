import {
    DiagramModel
} from "storm-react-diagrams";
import _ from 'lodash';

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
}
