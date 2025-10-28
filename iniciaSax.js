/**
 * @NApiVersion 2.x
 * @NScriptType WorkflowActionScript
 */
define(['N/record', 'N/redirect', 'N/log'], function(record, redirect, log) {

    function onAction(context) {
        var requisition = context.newRecord;

        try {
            var inventoryAdjustment = record.create({
                type: record.Type.INVENTORY_ADJUSTMENT,
                isDynamic: true
            });

            // Cabeçalho
            inventoryAdjustment.setValue({
                fieldId: 'memo',
                value: requisition.getValue('memo')
            });

            inventoryAdjustment.setValue({
                fieldId: 'subsidiary',
                value: requisition.getValue('subsidiary')
            });

            inventoryAdjustment.setValue({
                fieldId: 'custbody_bit_aprovacaointerna',
                value: requisition.getValue('custbody_aprovador_sax')
            });
            inventoryAdjustment.setValue({
                fieldId: 'trandate',
                value: requisition.getValue('trandate')
            });
            inventoryAdjustment.setValue({
                fieldId: 'department',
                value: 116
            });
            inventoryAdjustment.setValue({
                fieldId: 'class',
                value: 123
            });

            // Linha de itens
            var itemCount = requisition.getLineCount({ sublistId: 'line' });

            for (var i = 0; i < itemCount; i++) {
                inventoryAdjustment.selectNewLine({ sublistId: 'inventory' });

                inventoryAdjustment.setCurrentSublistValue({
                    sublistId: 'inventory',
                    fieldId: 'item',
                    value: requisition.getSublistValue({ sublistId: 'line', fieldId: 'custcol_item_almoxarifado', line: i })
                });

                inventoryAdjustment.setCurrentSublistValue({
                    sublistId: 'inventory',
                    fieldId: 'adjustqtyby',
                    value: requisition.getSublistValue({ sublistId: 'line', fieldId: ('custcol_quantidade_sax') * (-1), line: i })
                });

                inventoryAdjustment.setCurrentSublistValue({
                    sublistId: 'inventory',
                    fieldId: 'avgunitcost',
                    value: requisition.getSublistValue({ sublistId: 'line', fieldId: 'amount', line: i })
                });

                inventoryAdjustment.setCurrentSublistValue({
                    sublistId: 'inventory',
                    fieldId: 'department',
                    value: requisition.getSublistValue({ sublistId: 'line', fieldId: 'department', line: i })
                });

                inventoryAdjustment.setCurrentSublistValue({
                    sublistId: 'inventory',
                    fieldId: 'class',
                    value: requisition.getSublistValue({ sublistId: 'line', fieldId: 'class', line: i })
                });

                inventoryAdjustment.setCurrentSublistValue({
                    sublistId: 'inventory',
                    fieldId: 'location',
                    value: requisition.getSublistValue({ sublistId: 'line', fieldId: 'location', line: i })
                });

                // inventoryAdjustment.setCurrentSublistValue({
                //     sublistId: 'inventory',
                //     fieldId: 'custcol_projeto',
                //     value: requisition.getSublistValue({ sublistId: 'line', fieldId: 'custcol_projeto', line: i })
                // });

                // inventoryAdjustment.setCurrentSublistValue({
                //     sublistId: 'inventory',
                //     fieldId: 'custcol_report',
                //     value: requisition.getSublistValue({ sublistId: 'line', fieldId: 'custcol_report', line: i })
                // });

                inventoryAdjustment.commitLine({ sublistId: 'inventory' });
            }

            // Salvar e redirecionar para edição
            var newId = inventoryAdjustment.save();
            log.audit('Inventory Adjustment Criado', 'ID: ' + newId);

            redirect.toRecord({
                type: record.Type.INVENTORY_ADJUSTMENT,
                id: newId,
                isEditMode: true
            });

        } catch (e) {
            log.error('Erro ao criar Inventory Adjustment', e);
            throw e;
        }
    }

    return {
        onAction: onAction
    };
});
