/**
 * @NApiVersion 2.x
 * @NScriptType ScheduledScript
 */

define(['N/record', 'N/log', 'N/search'], function(record, log, search) {

    function execute(context) {
        // Defina o ID da transação como um parâmetro
        var transactionId = context.parameters.transactionId;

        if (!transactionId) {
            log.error('Parâmetro ausente', 'O ID da transação é obrigatório');
            return;
        }

        try {
            var rec = record.load({
                type: 'purchaserequisition', // Altere para o tipo de transação correto
                id: transactionId
            });

            // Altere o rótulo do campo 'status'
            rec.setValue({
                fieldId: 'status',
                value: 'Status' // Substitua pelo novo status desejado
            });

            rec.save();

            log.audit({
                title: 'Transação Atualizada',
                details: 'Transação ID: ' + transactionId + ' atualizada com sucesso.'
            });
        } catch (e) {
            log.error({
                title: 'Erro ao atualizar transação',
                details: e.toString()
            });
        }
    }

    return {
        execute: execute
    };
});
