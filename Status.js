/**
 * @NApiVersion 2.x
 * @NScriptType WorkflowActionScript
 */
define(['N/record', 'N/log'], function(record, log) {

    function onAction(scriptContext) {
        var newRecord = scriptContext.newRecord;
        var recordType = newRecord.type;
        var recordId = newRecord.id;

        try {
            // Carrega o registro atual
            var transactionRecord = record.load({
                type: recordType,
                id: recordId,
                isDynamic: true
            });

            // Verifica se o status da transação pode ser alterado para "Cancelado"
            var currentStatus = transactionRecord.getValue({ fieldId: 'status' });

                // Define o novo status para "Cancelado"
                transactionRecord.setValue({
                    fieldId: 'status',
                    value: 'Cancelado'
                });

                // Salva o registro
                transactionRecord.save();

                log.debug('Status Alterado', 'O status da transação foi alterado para Cancelado.');
          
        } catch (e) {
            log.error('Erro ao alterar status', e.message);
        }
    }

    return {
        onAction: onAction
    };
});
