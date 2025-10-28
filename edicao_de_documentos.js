/**
 * @NApiVersion 2.x
 * @NScriptType WorkflowActionScript
 */
define(['N/record', 'N/url', 'N/https'], function(record, url, https) {
    function onAction(scriptContext) {
        var currentRecord = scriptContext.newRecord;
        var recordId = currentRecord.id;
        var recordType = currentRecord.type;
	var editUrl = rec.getValue('custbody_apaa_016231');

        var editUrl = url.resolveRecord({
            recordType: recordType,
            recordId: recordId,
            isEditMode: true
        });

        var response = https.redirect({
            url: 'https://8681871-sb1.app.netsuite.com/app/accounting/transactions/purchreq.nl?id='+recordId+'&e=T'
        });
    }

    return {
        onAction: onAction
    };
});
