// data/texture.js
(function() {
    "use strict";

    var clampToGL = function(modeStr) {
        if (modeStr == "clamp")
            return WebGLRenderingContext.CLAMP_TO_EDGE;
        if (modeStr == "repeat")
            return WebGLRenderingContext.REPEAT;
    };

    var filterToGL = function(modeStr) {
        if (modeStr == "nearest")
            return WebGLRenderingContext.NEAREST;
        if (modeStr == "linear")
            return WebGLRenderingContext.LINEAR;
        if (modeStr == "nearest-mipmap-nearest")
            return WebGLRenderingContext.NEAREST_MIPMAP_NEAREST;
        if (modeStr == "linear-mipmap-nearest")
            return WebGLRenderingContext.LINEAR_MIPMAP_NEAREST;
        if (modeStr == "nearest-mipmap-linear")
            return WebGLRenderingContext.NEAREST_MIPMAP_LINEAR;
        if (modeStr == "linear-mipmap-linear")
            return WebGLRenderingContext.LINEAR_MIPMAP_LINEAR;
    };

    var TextureDataAdapter = function(factory, node) {
        XML3D.data.DataAdapter.call(this, factory, node);
    };
    XML3D.createClass(TextureDataAdapter, XML3D.base.NodeAdapter);

    TextureDataAdapter.prototype.init = function() {
        this.xflowInputNode = this.createXflowNode();
        this.xflowInputNode.data = this.createTextureEntry();
    };

    TextureDataAdapter.prototype.createTextureEntry = function() {
        var node = this.node;
        var entry = new Xflow.TextureEntry(null);
        var config = entry.getSamplerConfig();
        config.wrapS = clampToGL(node.wrapS);
        config.wrapT = clampToGL(node.wrapT);
        config.minFilter = filterToGL(node.filterMin);
        config.magFilter = filterToGL(node.filterMag);
        config.textureType = Xflow.TEX_TYPE.TEXTURE_2D;
        config.generateMipMap = this.shouldGenerateMipMaps(config.minFilter, config.magFilter);

        var imageAdapter = this.factory.getAdapter(this.node.firstElementChild, XML3D.data.XML3DDataAdapterFactory.prototype);
        if(imageAdapter) {
            imageAdapter.setTextureEntry(entry);
        }
        return entry;
    };

    TextureDataAdapter.prototype.shouldGenerateMipMaps = function(minFilter, magFilter) {
        return (minFilter != WebGLRenderingContext.NEAREST && minFilter != WebGLRenderingContext.LINEAR) ||
            (magFilter != WebGLRenderingContext.NEAREST && magFilter != WebGLRenderingContext.LINEAR);
    };

    TextureDataAdapter.prototype.createXflowNode = function() {
        var xnode = XML3D.data.xflowGraph.createInputNode();
        xnode.name = this.node.name;
        xnode.paramName = this.node.param ? this.node.name : null;
        xnode.key = this.node.key;
        return xnode;
    };

    TextureDataAdapter.prototype.setScriptValue = function(value){
        XML3D.debug.logError("Texture currently does not support setScriptValue()");
    }

    TextureDataAdapter.prototype.getOutputs = function() {
        var result = {};
        result[this.node.name] = this;
        return result;
    };

    TextureDataAdapter.prototype.getValue = function() {
        return this.value;
    };

    TextureDataAdapter.prototype.notifyChanged = function(evt)
    {
        if(evt.type == XML3D.events.VALUE_MODIFIED){
            var attr = evt.wrapped.attrName;
            if(attr == "name"){
                this.xflowInputNode.name = this.node.name;
            }
            else if(attr == "key"){
                this.xflowInputNode.key = this.node.key;
            }
            else if(attr == "param"){
                this.xflowInputNode.paramName = this.node.param ? this.node.name : null;
            }
        }
    };

    /**
     * @return {Element}
     */
    TextureDataAdapter.prototype.getXflowNode = function() {
        return this.xflowInputNode;
    };

    /**
     * Returns String representation of this TextureDataAdapter
     */
    TextureDataAdapter.prototype.toString = function() {
        return "XML3D.data.TextureDataAdapter";
    };

    // Export
    XML3D.data.TextureDataAdapter = TextureDataAdapter;

}());
