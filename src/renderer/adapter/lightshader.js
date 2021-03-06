(function (webgl) {

    /**
     * Adapter for <lightshader>
     * @constructor
     * @param {RenderAdapterFactory} factory
     * @param {Element} node
     */
    var LightShaderRenderAdapter = function (factory, node) {
        XML3D.webgl.RenderAdapter.call(this, factory, node);
        this.dataAdapter = XML3D.base.resourceManager.getAdapter(this.node, XML3D.data);
    };
    XML3D.createClass(LightShaderRenderAdapter, webgl.RenderAdapter, {
        getDataNode: function () {
            return this.dataAdapter.getXflowNode();
        },
        getLightType: function () {
            var script = this.node.getAttribute("script");
            if (script.indexOf("urn:xml3d:lightshader:") === 0) {
                return script.substring(22, script.length);
            } else {
                XML3D.debug.logError("Unsupported light type " + script);
                return null;
            }
        },
        notifyChanged: function (evt) {
            switch (evt.type) {
                case XML3D.events.THIS_REMOVED:
                    this.notifyOppositeAdapters();
                    break;
                case XML3D.events.VALUE_MODIFIED:
                    this.notifyOppositeAdapters(XML3D.events.ADAPTER_VALUE_CHANGED);
                    break;
            }
        }
    });

    // Export
    webgl.LightShaderRenderAdapter = LightShaderRenderAdapter;

})(XML3D.webgl);
