/**
 * @NApiVersion 2.x
 * @NScriptType WorkflowActionScript
 */
define(['N/record'], function(record) {
    function onAction(scriptContext) {
        try {
            var prepaymentRecord = scriptContext.newRecord;
            var purchaseOrderId = prepaymentRecord.getValue({ fieldId: 'purchaseorder' });

            if (purchaseOrderId) {
                var purchaseOrder = record.load({
                    type: record.Type.PURCHASE_ORDER,
                    id: purchaseOrderId,
                    isDynamic: false
                });

                purchaseOrder.setValue({
                    fieldId: 'custbody_prepgto_realizado',
                    value: true
                });

                purchaseOrder.save();
            }
        } catch (e) {
            log.error('Erro ao atualizar o pedido de compra', e);
        }
    }

    return {
        onAction: onAction
    };
});
