XML3D.xflow.register("skinDirection", {
    outputs: [{name: 'result', tupleSize: '3'}],
    params:  ['dir','boneIdx','boneWeight','boneXform'],
    evaluate: function(dir,boneIdx,boneWeight,boneXform) {
        var count = dir.length / 3;
        var result = new Float32Array(dir.length);

        var m = mat4.create();
        var r = vec3.create();
        var tmp = vec3.create();

        for(var i = 0; i<count;i++) {
            var offset = i*3;
            r[0] = r[1] = r[2] = +0;

            for(var j = 0; j < 4; j++) {
                var weight = boneWeight[i*4+j];
                if (weight) {
                    var mo = boneIdx[i*4+j]*16;

                    mat4.multiplyOffsetDirection(boneXform, mo, dir, offset, tmp);
                    vec3.scale(tmp, weight);
                    vec3.add(r, tmp);
                }
            }
            result[offset] = r[0];
            result[offset+1] = r[1];
            result[offset+2] = r[2];
        }
        this.result = result;
        return true;
    }
});