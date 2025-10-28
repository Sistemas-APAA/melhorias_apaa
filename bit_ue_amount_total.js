/**
 * @NApiVersion 2.x
 * @NScriptType usereventscript
 * @NModuleScope SameAccount
 */

define(['N/record', 'N/search'], function (record, search) {
    function beforeSubmit(context) {
        var objRecord = context.newRecord;

        var sublistName = 'recmachcustrecord_bit_rt_itens_link';
        var amount_field = 'custrecord_bit_rt_itens_amount';
        var quantity_field = 'custrecord_bit_rt_itens_quantity';
        var total_field = 'custrecord_bit_cotacao_total';

        var linecount = objRecord.getLineCount({ sublistId: sublistName });
        var amountTotal = 0;

        for (i = 0; i < linecount; i++) {
            var amount = objRecord.getSublistValue({ sublistId: sublistName, fieldId: amount_field, line: i });
            var quantity = objRecord.getSublistValue({ sublistId: sublistName, fieldId: quantity_field, line: i });
            objRecord.setSublistValue({ sublistId: sublistName, fieldId: 'custrecord_bit_rt_itens_amount_total', value: amount * quantity, line: i });
            amountTotal += amount * quantity;
        }

        objRecord.setValue({ fieldId: total_field, value: amountTotal });
    }
    return {
        beforeSubmit: beforeSubmit
    };
});
