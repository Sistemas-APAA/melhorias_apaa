/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 */
define(['N/record'], function (record) {
    
    function beforeSubmit(context) {
        if (context.type !== context.UserEventType.CREATE) return;

        var invoice = context.newRecord;

        var createdFrom = invoice.getValue('createdfrom'); // ID da PO
        if (createdFrom) {
            invoice.setValue({
                fieldId: 'custbody_bit_transacao',
                value: createdFrom
            });
        }
    }

    return {
        beforeSubmit: beforeSubmit
    };
});
