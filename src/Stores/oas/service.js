import { generateOperationId} from '../../utils';

const ku = (methodName, t) => `${methodName.toLowerCase()}${t.replace(ju, Eu)}`

class OasService{
    constructor(e) {
        this.stores = e

        this.httpServices = []
        this.activeOperationNodes = []

        this.addOperation = (
            node,
            t = {
                summary: "",
                operationId: generateOperationId(node.path, node.method),

                responses: {
                    200: {
                        description: "OK",
                    },
                },
            }
        ) => {
            const {
                sourceNodeId: n, //n
                path, //r
                method, //i
                setActive, //o
            } = e

            Xe(this.stores.graphStore.getNodeById(n), n, this.stores.graphStore)
            const a = ["paths", r, i]

            this.stores.graphStore.graph.patchSourceNodeProp(n, "data.parsed", [{
                op: _t.b.Add,
                path: a,
                value: t,
            }])

            if (o) {
                yield this.stores.graphStore.waitUntilIdle()
                this.populateActiveOperationNodes()
                this.setActiveOperationNode(i)

                if (this.activeOperationNode) {
                    this.stores.uiStore.setActiveNode(this.activeOperationNode)
                }
            }
        };
    }

    get currentSpec() {
        var e

        if (((e = this.stores.uiStore.activeSourceNode) === null) || (e === undefined)) {
            0
            return
        } else {
            return e.spec
        }
    }

    async doActivate() {
        this.populateHttpServices()

        this._activeDisposables.pushAll([this.stores.graphStore.notifier.on(vt.a.DidMoveNode, Object(p.action)((
            {
                id: e,
            }
        ) => {
            var t
            const n = this.stores.graphStore.getNodeById(e)

            if (!((b.b.SourceMap !== (n == null ? undefined : n.category)) || (n.parentId != (((t = this.activePathNode) === null) || (t === undefined) ? undefined : t.id)) || ((fr.a.Operation !== n.type) && (jr.a.Operation !== n.type)))) {
                this.populateActiveOperationNodes()
            }
        })), this.stores.graphStore.notifier.on(vt.a.DidAddNode, (
            {
                node: e,
            }
        ) => {
            if ((b.b.Virtual === e.category) && (Kr.NodeType.HttpService === e.type)) {
                this.populateHttpServices()
            }
        }), this.stores.graphStore.notifier.on(vt.a.DidAddSourceMapNode, (
            {
                node: e,
            }
        ) => {
            var t

            if (!((e.parentId != (((t = this.activePathNode) === null) || (t === undefined) ? undefined : t.id)) || ((fr.a.Operation !== e.type) && (jr.a.Operation !== e.type)))) {
                this.populateActiveOperationNodes()
            }
        }), this.stores.graphStore.notifier.on(vt.a.DidRemoveNode, (
            {
                node: e,
            }
        ) => {
            if (e && (b.b.Source !== e.category)) {
                if (b.b.SourceMap === e.category) {
                    this.populateActiveOperationNodes()
                }
            } else {
                this.populateHttpServices()
            }
        })])

        this._activeDisposables.pushAll([Object(r.createDisposable)(Object(p.reaction)(() => {
            var e

            if (((e = this.activePathNode) === null) || (e === undefined)) {
                0
                return
            } else {
                return e.id
            }
        }, () => {
            this.populateActiveOperationNodes()
        }, {
            fireImmediately: true,
        })), Object(r.createDisposable)(Object(p.reaction)(() => ;
        ({
            activeSymbolNode: this.stores.uiStore.activeSymbolNode,
            activePathNode: this.activePathNode,
            activeOperationNodes: this.activeOperationNodes,
        }), () => {
            this.setActiveOperationNode()
        }, {
            fireImmediately: true,
        }))])
    }

    populateHttpServices() {
        this.httpServices = this.stores.graphStore.graph.getNodesByType("http_service")
    }

    get hasAnyHttpServices() {
        return this.httpServices.length > 0
    }

    get activeGraphNode() {
        let e = this.stores.uiStore.activeNode

        if (e !== undefined) {
            if (!((fr.a.Operation !== e.type) && (jr.a.Operation !== e.type))) {
                e = e.parent
            }

            return e
        }
    }

    get activePathNode() {
        return this.stores.oasStore.path.activePathNode
    }

    populateActiveOperationNodes() {
        this.activeOperationNodes = this.activePathNode ? vc(this.activePathNode.children.filter(Bi), "path") : []
    }

    setActiveOperationNode(e) {
        const {
            activeSymbolNode: t,
        } = this.stores.uiStore

        if (Bi(t)) {
            this.activeOperationNode = t
        } else {
            if (this.activePathNode) {
                this.activeOperationNode = this.activeOperationNodes.find(e ? (t) => Bi(t) && (e === t.path) : Bi)
            }
        }
    }

    async addSharedResponse(
        {
            sourceNodeId: e,
            name: t,
        }
    ) {
        const n = Xe(this.stores.graphStore.getNodeById(e), e, this.stores.graphStore)
        const r = b.d.OAS2 === n.spec ? ["responses"] : ["components", "responses"]

        const i = [...r, I(t, {
            lower: false,
        })]

        const o = n.uri + Object(te.pathToPointer)(i).slice(1)

        this.stores.graphStore.graph.patchSourceNodeProp(e, "data.parsed", [...(Object(S.hasIn)(n.data.parsed, r) ? [] : [{
            op: _t.b.Add,
            path: r,
            value: {},
        }]), {
            op: _t.b.Add,
            path: i,

            value: {
                description: "Example response",

                content: {
                    "application/json": {
                        schema: {
                            properties: {
                                id: {
                                    type: "string",
                                },
                            },
                        },
                    },
                },
            },
        }])

        await this.stores.graphStore.waitUntilIdle()
        return Je(this.stores.graphStore.getNodeByUri(o), o, this.stores.graphStore)
    }

    async addSharedExample(
        {
            sourceNodeId: e,
            name: t,
        }
    ) {
        const n = Xe(this.stores.graphStore.getNodeById(e), e, this.stores.graphStore)
        const r = ["components", "examples"]

        const i = [...r, I(t, {
            lower: false,
        })]

        const o = n.uri + Object(te.pathToPointer)(i).slice(1)

        this.stores.graphStore.graph.patchSourceNodeProp(e, "data.parsed", [...(Object(S.hasIn)(n.data.parsed, r) ? [] : [{
            op: _t.b.Add,
            path: r,
            value: {},
        }]), {
            op: _t.b.Add,
            path: i,

            value: {
                value: {
                    description: "Example shared example",
                    type: "object",

                    properties: {
                        id: {
                            type: "string",
                        },
                    },

                    required: ["id"],
                },
            },
        }])

        await this.stores.graphStore.waitUntilIdle()
        return Je(this.stores.graphStore.getNodeByUri(o), o, this.stores.graphStore)
    }

    async addSharedRequestBody(
        {
            sourceNodeId: e,
            name: t,
        }
    ) {
        const n = Xe(this.stores.graphStore.getNodeById(e), e, this.stores.graphStore)
        const r = ["components", "requestBodies"]

        const i = [...r, I(t, {
            lower: false,
        })]

        const o = n.uri + Object(te.pathToPointer)(i).slice(1)

        this.stores.graphStore.graph.patchSourceNodeProp(e, "data.parsed", [...(Object(S.hasIn)(n.data.parsed, r) ? [] : [{
            op: _t.b.Add,
            path: r,
            value: {},
        }]), {
            op: _t.b.Add,
            path: i,

            value: {
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                        },
                    },
                },
            },
        }])

        await this.stores.graphStore.waitUntilIdle()
        return Je(this.stores.graphStore.getNodeByUri(o), o, this.stores.graphStore)
    }

    async addSharedParameter(
        {
            sourceNodeId: e,
            name: t,
            parameterType: n,
        }
    ) {
        const r = Xe(this.stores.graphStore.getNodeById(e), e, this.stores.graphStore)
        const i = b.d.OAS2 === r.spec ? ["parameters"] : ["components", "parameters"]

        const o = [...i, I(t, {
            lower: false,
        })]

        const a = r.uri + Object(te.pathToPointer)(o).slice(1)

        this.stores.graphStore.graph.patchSourceNodeProp(e, "data.parsed", [...(Object(S.hasIn)(r.data.parsed, i) ? [] : [{
            op: _t.b.Add,
            path: i,
            value: {},
        }]), {
            op: _t.b.Add,
            path: o,

            value: {
                name: t,
                in: n,
                required: n === "path",

                schema: {
                    type: "string",
                },
            },
        }])

        await this.stores.graphStore.waitUntilIdle()
        return Je(this.stores.graphStore.getNodeByUri(a), a, this.stores.graphStore)
    }

    get activeHttpNode() {
        if (this.stores.uiStore.activeSourceNodeId !== undefined) {
            return this.httpServices.find((e) => this.stores.uiStore.activeSourceNodeId === e.parentId)
        } else {
            0
            return
        }
    }
}

Object(h.d)([p.observable], hd.prototype, "httpServices", undefined)
Object(h.d)([p.action], hd.prototype, "populateHttpServices", null)
Object(h.d)([p.computed], hd.prototype, "hasAnyHttpServices", null)
Object(h.d)([p.computed], hd.prototype, "activeGraphNode", null)
Object(h.d)([p.computed], hd.prototype, "activePathNode", null)
Object(h.d)([p.observable], hd.prototype, "activeOperationNodes", undefined)
Object(h.d)([p.action], hd.prototype, "populateActiveOperationNodes", null)
Object(h.d)([p.action], hd.prototype, "setActiveOperationNode", null)
Object(h.d)([p.observable.ref], hd.prototype, "activeOperationNode", undefined)
Object(h.d)([p.computed], hd.prototype, "activeHttpNode", null)

