/**
 * @NApiVersion 2.1
 * @NScriptType ClientScript
 * @NModuleScope Public
 */

define([
    'N/search',
    'N/record',
    'N/runtime',
    'N/ui/dialog'
],
    function (
        search,
        record,
        runtime,
        dialog
    ) {
        function validateDelete(context) {
            const currentRecord = context.currentRecord;

            if (context.sublistId == 'recmachcustrecord_bit_anexo_link') {
                const indexLine = currentRecord.getCurrentSublistIndex({ sublistId: 'recmachcustrecord_bit_anexo_link' });
                const checkbox = currentRecord.getCurrentSublistValue({ sublistId: 'recmachcustrecord_bit_anexo_link', fieldId: 'custrecord_bit_anexo_controle' });

                if (checkbox) {
                    dialog.alert({
                        title: 'Alerta!',
                        message: 'Não é possível remover uma linha que foi adicionada por script.'
                    })
                    return false
                }

                return true
            } else {
                return true;
            }
        }

        // function fieldChanged(context) {
        //     const currentRecord = context.currentRecord;
        //     const type = currentRecord.type;

        //     var fieldId = context.fieldId;
        //     var lineNum = context.line;

        //     if (type == 'purchaseorder') {
        //         var sublistId = 'recmachcustrecord_bit_anexo_link';

        //         if (fieldId == 'custrecord_bit_anexo_doc' || fieldId == 'custrecord_bit_anexo_doc_item') {
        //             currentRecord.selectLine({ sublistId: sublistId, line: lineNum });
        //             var docName = currentRecord.getCurrentSublistText({ sublistId: sublistId, fieldId: fieldId });
        //             currentRecord.setCurrentSublistValue({ sublistId: sublistId, fieldId: 'name', value: docName, ignoreFieldChange: true });
        //             currentRecord.commitLine({ sublistId: sublistId });
        //         };
        //     }
        // }

        return {
            validateDelete: validateDelete,
            // fieldChanged: fieldChanged
        };
    });