(function (webgl) {

    /**
     * A ShaderClosure connects a mesh-specific GLProgram with it's Xflow data
     * @param {GLContext} context
     * @param descriptor
     * @param dataCallback
     * @constructor
     */
    var ShaderClosure = function(context, descriptor, dataCallback) {
        webgl.AbstractShaderClosure.call(this, context);
        this.descriptor = descriptor;
        this.getShaderParameters = dataCallback || function(){ {} };
    };

    XML3D.createClass(ShaderClosure, webgl.AbstractShaderClosure);


    XML3D.extend(ShaderClosure.prototype, {


        setDefaultUniforms: function() {
            if (this.program.isValid()) {
                this.program.setUniformVariables(this.descriptor.uniforms);
            }
        },

        createSources: function(scene, shaderData, objectData) {
            var directives = [];
            //TODO add object data to directives
            this.descriptor.addDirectives(directives, scene.lights || {}, shaderData ? shaderData.getOutputMap() : {});
            this.source = {
                fragment: this.addDirectivesToSource(directives, this.descriptor.fragment),
                vertex: this.addDirectivesToSource(directives, this.descriptor.vertex)
            };
        },

        /**
         * @param {Xflow.data.ComputeResult} result
         * @param {Object?} options
         */
        updateUniformsFromComputeResult: function (result, options) {
            var dataMap = result.getOutputMap();
            var uniforms = this.program.uniforms;

            var opt = options || {};
            var force = opt.force || false;

            for (var name in uniforms) {
                var entry = dataMap[name];
                if (!entry)
                    continue;

                var webglData = this.context.getXflowEntryWebGlData(entry);
                if (force || webglData.changed) {
                    if (uniforms[name].glType === this.context.gl.BOOL) {
                        //TODO Can we get Xflow to return boolean arrays as normal JS arrays? WebGL doesn't accept Uint8Arrays here...
                        //TODO Alternatively we could set boolean uniforms using uniform1fv together with Float32Arrays, which apparently works too
                        webgl.setUniform(this.context.gl, uniforms[name], this.convertToJSArray(entry.getValue()));
                    } else {
                        webgl.setUniform(this.context.gl, uniforms[name], entry.getValue());
                    }
                    webglData.changed = 0;
                }
            }
            this.isTransparent = this.descriptor.hasTransparency(dataMap);
        },

        addDirectivesToSource: function (directives, source) {
            var header = "";
            directives.forEach(function (v) {
                header += "#define " + v + "\n";
            });
            return header + "\n" + source;
        },

        undoUniformVariableOverride: function(override) {
            var previousValues = {};
            var shaderData = this.getShaderParameters();
            for (var name in override) {
                var value = shaderData[name] ? shaderData[name] : this.descriptor.uniforms[name];
                previousValues[name] = value.getValue ? value.getValue() : value;
            }
            this.program.setUniformVariables(previousValues);
        }
});

    webgl.ShaderClosure = ShaderClosure;

}(XML3D.webgl));
