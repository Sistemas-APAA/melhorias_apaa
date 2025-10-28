/**
 * @NApiVersion 2.1
 * @NScriptType ScheduledScript
 */
define(['N/record', 'N/runtime', 'N/log'], function (record, runtime, log) {

    function execute(context) {
        try {
            // Pega o ID da requisição do parâmetro do script agendado
            const requisitionId = runtime.getCurrentScript().getParameter({
                name: 'custscript_id_requisition'
            });

            if (!requisitionId) {
                throw new Error('O ID da requisição é obrigatório.');
            }

            log.debug('ID da Requisição', requisitionId);

            // Carrega a requisição
            const requisitionRecord = record.load({
                type: 'purchaserequisition',
                id: requisitionId,
                isDynamic: true
            });

            // Altera o status para Fechado (Closed)
            requisitionRecord.setValue({
                fieldId: 'status',
                value: 'Fechado' // 3 = Fechado (Closed) no NetSuite
            });
            requisitionRecord.setValue({
                fieldId: 'statusRef',
                value: 'closed' // 3 = Fechado (Closed) no NetSuite
            });          

            const savedId = requisitionRecord.save();
            log.audit('Requisição Fechada', `ID: ${savedId}`);
        } catch (error) {
            log.error('Erro ao fechar requisição', error.message);
        }
    }

    return {
        execute: execute
    };
});
