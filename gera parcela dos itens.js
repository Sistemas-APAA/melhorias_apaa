/**
 * @NApiVersion 2.1
 * @NScriptType WorkflowActionScript
 * @NModuleScope Public
 */

define([
    'N/search',
    'N/record',
    'N/error',
    'N/log'
], function (
    search,
    record,
    error,
    log
) {
    function onAction(context) {
        try {
            const currentRecordItem = context.newRecord;
            const transaction = currentRecordItem.getValue({ fieldId: 'custrecord_apaa_transaction' });

            if (transaction) {
                // Carregar o registro de ordem de compra
                const purchorderObj = record.load({
                    type: 'purchaseorder',
                    id: transaction,
                    isDynamic: true
                });

                const itemsItens = purchorderObj.getLineCount({ sublistId: 'item' });

                // Preenchendo o fornecedor
                currentRecordItem.setValue({
                    fieldId: 'custrecord_apaa_fornecedor',
                    value: purchorderObj.getValue({ fieldId: 'entity' })
                });

                // Loop para adicionar os itens da ordem de compra à sublista
                for (let i = 0; i < itemsItens; i++) {
                    purchorderObj.selectLine({ sublistId: 'item', line: i });

                    const itemPurchOrder = purchorderObj.getCurrentSublistValue({
                        sublistId: 'item',
                        fieldId: 'item'
                    });
                    const quantityPurchOrder = purchorderObj.getCurrentSublistValue({
                        sublistId: 'item',
                        fieldId: 'quantity'
                    });
                    const amountPurchOrder = purchorderObj.getCurrentSublistValue({
                        sublistId: 'item',
                        fieldId: 'rate'
                    });
                    const customer = purchorderObj.getCurrentSublistValue({
                        sublistId: 'item',
                        fieldId: 'customer'
                    });

                    // Adicionando valores na sublista personalizada
                    currentRecordItem.selectNewLine({
                        sublistId: 'recmachcustrecord_apaa_provpgto_link'
                    });
                    currentRecordItem.setCurrentSublistValue({
                        sublistId: 'recmachcustrecord_apaa_provpgto_link',
                        fieldId: 'custrecord_apaa_provpgto_item',
                        value: itemPurchOrder
                    });
                    currentRecordItem.setCurrentSublistValue({
                        sublistId: 'recmachcustrecord_apaa_provpgto_link',
                        fieldId: 'custrecord_apaa_provpgto_quantidade',
                        value: quantityPurchOrder
                    });
                    currentRecordItem.setCurrentSublistValue({
                        sublistId: 'recmachcustrecord_apaa_provpgto_link',
                        fieldId: 'custrecord_apaa_vlproporcional',
                        value: amountPurchOrder
                    });
                    currentRecordItem.setCurrentSublistValue({
                        sublistId: 'recmachcustrecord_apaa_provpgto_link',
                        fieldId: 'custrecord_apaa_provpgto_projeto',
                        value: customer
                    });
                    currentRecordItem.commitLine({
                        sublistId: 'recmachcustrecord_apaa_provpgto_link'
                    });
                }
            } else {
                log.error('Transaction not found', 'The field custrecord_apaa_transaction is empty or invalid.');
            }
        } catch (e) {
            log.error('Error in Workflow Action Script', e.message);
            throw error.create({
                name: 'WORKFLOW_ACTION_ERROR',
                message: e.message
            });
        }
    }

    return {
        onAction: onAction
    };
});
