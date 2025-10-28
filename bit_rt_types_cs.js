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
        function lineInit(context) {
            const currentRecord = context.currentRecord;
            const type = currentRecord.type;

            if (type == 'customrecord_bit_tipo_de_compra') {
                if (context.sublistId == 'recmachcustrecord_bit_doc_c_link') {
                    const itensSublist = context.currentRecord.getSublist({ sublistId: 'recmachcustrecord_bit_doc_c_link' });
                    const column = itensSublist.getColumn({ fieldId: 'name' });
                    column.isDisabled = true;
                }
            }

            if (type == 'customrecord_bit_tipo_de_item') {
                if (context.sublistId == 'recmachcustrecord_bit_doc_i_link') {
                    const itensSublist = context.currentRecord.getSublist({ sublistId: 'recmachcustrecord_bit_doc_i_link' });
                    const column = itensSublist.getColumn({ fieldId: 'name' });
                    column.isDisabled = true;
                }
            }
        }

        function fieldChanged(context) {
            const currentRecord = context.currentRecord;
            const type = currentRecord.type;

            var fieldId = context.fieldId;
            var lineNum = context.line;

            if (type == 'customrecord_bit_tipo_de_compra') {
                var sublistId = 'recmachcustrecord_bit_doc_c_link';

                if (fieldId == 'custrecord_bit_doc_c_documentos') {
                    currentRecord.selectLine({ sublistId: sublistId, line: lineNum });
                    var docName = currentRecord.getCurrentSublistText({ sublistId: sublistId, fieldId: fieldId });
                    console.log(docName)
                    currentRecord.setCurrentSublistValue({ sublistId: sublistId, fieldId: 'name', value: docName, ignoreFieldChange: true });
                    currentRecord.commitLine({ sublistId: sublistId });
                };
            }

            if (type == 'customrecord_bit_tipo_de_item') {
                var sublistId = 'recmachcustrecord_bit_doc_i_link';

                if (fieldId == 'custrecord_bit_doc_i_documentos') {
                    currentRecord.selectLine({ sublistId: sublistId, line: lineNum });
                    var docName = currentRecord.getCurrentSublistText({ sublistId: sublistId, fieldId: fieldId });
                    console.log(docName)
                    currentRecord.setCurrentSublistValue({ sublistId: sublistId, fieldId: 'name', value: docName, ignoreFieldChange: true });
                    currentRecord.commitLine({ sublistId: sublistId });
                };
            }
        }

        return {
            lineInit: lineInit,
            fieldChanged: fieldChanged
        };
    });