/**
 * @NApiVersion 2.x
 * @NScriptType WorkflowActionScript
 */
define(['N/record', 'N/url', 'N/https'], function(record, url, https) {
    function onAction(scriptContext) {
        var currentRecord = scriptContext.newRecord;
        var recordId = currentRecord.id;
        var recordType = currentRecord.type;

        var editUrl = url.resolveRecord({
            recordType: recordType,
            recordId: recordId,
            isEditMode: true
        });

        var response = https.redirect({
            url: editUrl
        });
    }

    return {
        onAction: onAction
    };
});
