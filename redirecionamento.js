/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 */
define(['N/record', 'N/currentRecord'], function(record, currentRecord) {
    function pageInit(context) {
        var rec = currentRecord.get();
        var editUrl = rec.getValue('custrecord_edit_url');
        
        if (editUrl) {
            window.location.href = editUrl;
        }
    }

    return {
        pageInit: pageInit
    };
});
