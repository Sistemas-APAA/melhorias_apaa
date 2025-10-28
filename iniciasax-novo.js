/**
 * @NApiVersion 2.x
 * @NScriptType WorkflowActionScript
 */
define(['N/record', 'N/log', 'N/runtime'], function(record, log, runtime) {

    function onAction(context) {
        var requisition = context.newRecord;
        var requisitionId = requisition.id;
        var requisitionType = requisition.type;

        try {
            var itemCount = requisition.getLineCount({ sublistId: 'line' });
            var movimentos = []; // [{ line, idMovimento }]

            for (var i = 0; i < itemCount; i++) {
                var atendido = requisition.getSublistValue({
                    sublistId: 'line',
                    fieldId: 'custcol_atendido',
                    line: i
                });

                if (!atendido) continue;

                // === Criar um Inventory Adjustment por item ===
                var inventoryAdjustment = record.create({
                    type: record.Type.INVENTORY_ADJUSTMENT,
                    isDynamic: true
                });
                
                var lineDepartment = requisition.getSublistValue({ sublistId: 'line', fieldId: 'department', line: i });
                var lineLocation = requisition.getSublistValue({ sublistId: 'line', fieldId: 'location', line: i });
                var lineFonteRec = requisition.getSublistValue({ sublistId: 'line', fieldId: 'cseg_bit_fonte_rec', line: i });
                var linePaActivity = requisition.getSublistValue({ sublistId: 'line', fieldId: 'cseg_paactivitycode', line: i });
                var lineClass = requisition.getSublistValue({ sublistId: 'line', fieldId: 'class', line: i });

                // ======= Cabeçalho preenchido com valores da linha =======
                inventoryAdjustment.setValue({ fieldId: 'memo', value: requisition.getValue('memo') });
                inventoryAdjustment.setValue({ fieldId: 'subsidiary', value: requisition.getValue('subsidiary') });
                inventoryAdjustment.setValue({ fieldId: 'custbody_bit_aprovacaointerna', value: requisition.getValue('custbody_aprovador_sax') });
                inventoryAdjustment.setValue({ fieldId: 'trandate', value: requisition.getValue('trandate') });
                inventoryAdjustment.setValue({ fieldId: 'account', value: requisition.getValue('custbody_conta_de_ajuste') });
                inventoryAdjustment.setValue({ fieldId: 'custbody_atlas_inv_adj_reason', value: 1 });
                inventoryAdjustment.setValue({ fieldId: 'adjlocation', value: lineLocation });
                inventoryAdjustment.setValue({ fieldId: 'class', value: lineClass });
                inventoryAdjustment.setValue({ fieldId: 'department', value: lineDepartment });
                inventoryAdjustment.setValue({ fieldId: 'cseg_bit_fonte_rec', value: lineFonteRec });
                inventoryAdjustment.setValue({ fieldId: 'cseg_paactivitycode', value: linePaActivity });
                inventoryAdjustment.setValue({ fieldId: 'custbody_brl_tran_l_created_from', value: requisition.id });

                // ======= Linha do item =======
                inventoryAdjustment.selectNewLine({ sublistId: 'inventory' });
                inventoryAdjustment.setCurrentSublistValue({
                    sublistId: 'inventory',
                    fieldId: 'item',
                    value: requisition.getSublistValue({ sublistId: 'line', fieldId: 'custcol_item_almoxarifado', line: i })
                });

                inventoryAdjustment.setCurrentSublistValue({
                    sublistId: 'inventory',
                    fieldId: 'location',
                    value: requisition.getSublistValue({ sublistId: 'line', fieldId: 'location', line: i })
                });

                var valorNegativo = requisition.getSublistValue({ sublistId: 'line', fieldId: 'custcol_quantidade_sax', line: i });
                inventoryAdjustment.setCurrentSublistValue({
                    sublistId: 'inventory',
                    fieldId: 'adjustqtyby',
                    value: valorNegativo * -1
                });

                inventoryAdjustment.setCurrentSublistValue({
                    sublistId: 'inventory',
                    fieldId: 'avgunitcost',
                    value: requisition.getSublistValue({ sublistId: 'line', fieldId: 'amount', line: i })
                });

                inventoryAdjustment.setCurrentSublistValue({
                    sublistId: 'inventory',
                    fieldId: 'custcol_projeto_sax',
                    value: requisition.getSublistValue({ sublistId: 'line', fieldId: 'custcol_projeto_sax', line: i })
                });

                inventoryAdjustment.commitLine({ sublistId: 'inventory' });

                // Salva o ajuste desta linha
                var newId = inventoryAdjustment.save();
                log.audit('Inventory Adjustment Criado', 'ID: ' + newId);

                // === Reabrir o ajuste para atualizar o memo com tranid + class ===
                var adjustLoaded = record.load({
                    type: record.Type.INVENTORY_ADJUSTMENT,
                    id: newId,
                    isDynamic: false
                });

                var tranid = adjustLoaded.getValue({ fieldId: 'tranid' });
                var classValue = lineClass || '';

                adjustLoaded.setValue({
                    fieldId: 'memo',
                    value: 'Baixa de Material de Escritório para consumo, conforme requisição interna n.º ' + tranid
                });

                adjustLoaded.save({ ignoreMandatoryFields: true });

                // Guardar para atualização posterior
                movimentos.push({ line: i, idMovimento: newId });
            }

            // === Atualizar todas as linhas atendidas de uma vez ===
            if (movimentos.length > 0) {
                var requisitionUpdate = record.load({
                    type: requisitionType,
                    id: requisitionId,
                    isDynamic: true
                });

                movimentos.forEach(function(m) {
                    requisitionUpdate.selectLine({ sublistId: 'line', line: m.line });
                    requisitionUpdate.setCurrentSublistValue({
                        sublistId: 'line',
                        fieldId: 'custcol_trans_origem_linha',
                        value: m.idMovimento
                    });
                    requisitionUpdate.commitLine({ sublistId: 'line' });
                });


                requisitionUpdate.save({ ignoreMandatoryFields: true });
                log.audit('Requisição atualizada', 'Linhas atualizadas: ' + movimentos.length);
            }

            var currentUser = runtime.getCurrentUser();
            var entityId = currentUser.name || currentUser.id;

            // Formata a data e hora atual
            var now = new Date();
             var pad = function(n) { return n < 10 ? '0' + n : n; };
            var formattedDate = pad(now.getDate()) + '/' + pad(now.getMonth() + 1) + '/' + now.getFullYear();
            var formattedTime = pad(now.getHours()) + ':' + pad(now.getMinutes()) + ':' + pad(now.getSeconds());
            var entreguePor = entityId + '-' + formattedDate + '-' + formattedTime;

            var origemRecord = record.load({
                type: 'customtransaction_solicitacao_almoxarifa', // string literal
                id: requisitionId,
                isDynamic: true
            });
            
                origemRecord.setValue({
                    fieldId: 'transtatus',
                    value: 'E' // Status Finalizado
                });

                 origemRecord.setValue({
                    fieldId: 'custbody_entregue_por',
                    value: entreguePor
                });

                origemRecord.save({ ignoreMandatoryFields: true });

                log.audit('Transação de origem atualizada', 'ID: ' + requisitionId);

        } catch (e) {
            log.error('Erro ao criar Inventory Adjustments', e);
            throw e;
        }
    }

    return {
        onAction: onAction
    };
});