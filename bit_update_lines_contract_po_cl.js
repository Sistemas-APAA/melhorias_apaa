/**
 * @NApiVersion 2.1
 * @NScriptType ClientScript
 * @NModuleScope Public
 */

define([
    'N/record'
],
    function (
        record
    ) {


        function fieldChanged(context) {
            const currentRecord = context.currentRecord;

            var fieldId = context.fieldId;
            var lineNum = context.line;

            if (fieldId == 'item') {
                const contractId = currentRecord.getValue({ fieldId: 'purchasecontract' });

                if (!contractId) return;

                currentRecord.selectLine({ sublistId: 'item', line: lineNum });
                var itemPO = currentRecord.getCurrentSublistValue({ sublistId: 'item', fieldId: fieldId });

                if (itemPO) {
                    const recordObj = record.load({ type: 'purchasecontract', id: contractId, isDynamic: true });

                    const line = recordObj.findSublistLineWithValue({
                        sublistId: 'item',
                        fieldId: 'item',
                        value: itemPO
                    });

                    if (line == -1) return;

                    recordObj.selectLine({ sublistId: 'item', line: line })
                    var specifications = recordObj.getCurrentSublistValue({ sublistId: 'item', fieldId: 'description' });
                    var descriptionObject = recordObj.getCurrentSublistValue({ sublistId: 'item', fieldId: 'custcol_descricaodoobjeto' });
                    recordObj.commitLine({ sublistId: 'item' })

                    setTimeout(() => {
                        if (specifications) currentRecord.setCurrentSublistValue({ sublistId: 'item', fieldId: 'description', value: specifications });
                        if (descriptionObject) currentRecord.setCurrentSublistValue({ sublistId: 'item', fieldId: 'custcol_descricaodoobjeto', value: descriptionObject });
                    }, 1500);
                }

            };
        }

        return {
            fieldChanged: fieldChanged
        };
    });