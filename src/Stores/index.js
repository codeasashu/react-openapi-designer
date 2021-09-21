//import Graph from './graph';
//import {NodeCategories} from '../utils/tree';
//import {exampleDoc} from '../model';
//import {initGraph} from './graph/addNode';
//
import GraphStore from './graphStore';
import UiStore from './uiStore';
import TreeStore from './treeStore';
import Stores from './stores';

export {GraphStore, UiStore, TreeStore};
export default Stores;

//export const initGraphStore = () => {
//const graph = new Graph({
//id: 'main-graph',
//});

//const node = graph.addNode({
//category: NodeCategories.Source,
//type: 'file',
//path: '/p/abc.yaml',
//});

//graph.setSourceNodeProp(node.id, 'data.original', JSON.stringify(exampleDoc));
//graph.setSourceNodeProp(node.id, 'data.parsed', exampleDoc);

//initGraph(node, graph);

//console.log('graph', graph, node);
//};
