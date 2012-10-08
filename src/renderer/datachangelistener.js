
/**
 *
 * @constructor
 * @param {XML3D.webgl.Renderer} renderer
 */
XML3D.webgl.DataChangeListener = function(renderer) {
    this.requestRedraw = renderer.requestRedraw;
    Xflow.DataChangeNotifier.addListener(this.dataEntryChanged);
};

/**
 *
 * @param {XML3D.Xflow.DataEntry} entry
 * @param {XML3D.Xflow.DataNotifications} notification
 */
XML3D.webgl.DataChangeListener.prototype.dataEntryChanged = function(entry, notification) {
    entry.userData.webglDataChanged = notification;

    //TODO: Decide if we need a picking buffer redraw too
    //this.requestRedraw("Data changed", false);
};