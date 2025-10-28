/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 */
define(['N/record'], function(record) {
    function beforeSubmit(context) {
        var newRecord = context.newRecord;
        var lineCount = newRecord.getLineCount({ sublistId: 'item' });

        for (var i = 0; i < lineCount; i++) {
            var quantidade = newRecord.getSublistValue({ sublistId: 'item', fieldId: 'quantity', line: i }) || 0;
            var faturado = newRecord.getSublistValue({ sublistId: 'item', fieldId: 'quantitybilled', line: i }) || 0;
            
            var saldoContrato = quantidade - faturado;
            
            newRecord.setSublistValue({
                sublistId: 'item',
                fieldId: 'custcol_saldo_contrato',
                line: i,
                value: saldoContrato
            });
        }
    }

    return {
        beforeSubmit: beforeSubmit
    };
});
