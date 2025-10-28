/**
 * @NApiVersion 2.1
 * @NScriptType WorkflowActionScript
 */
define(['N/record', 'N/log', 'N/format', 'N/runtime'], function (record, log, format, runtime) {

    function onAction(context) {
        try {
            const currentRecord = context.newRecord;
            const transacaoId = currentRecord.getValue('custrecord_apaa_transacao');
            log.debug("Transação vinculada", transacaoId);

            if (!transacaoId) {
                log.error('Transação não vinculada', 'Campo custrecord_apaa_transacao vazio');
                return;
            }

            // Carrega a transação (Pedido de Compra)
            const transacaoRecord = record.load({
                type: record.Type.PURCHASE_ORDER, // ajuste se for outro tipo
                id: transacaoId,
                isDynamic: true
            });

            // Data e hora atual formatada como dd/MM/yyyy HH:mm:ss
            const now = new Date();
            const dataHoraFormatada = format.format({
                value: now,
                type: format.Type.DATETIMETZ
            });

            // Atualiza campos
            transacaoRecord.setValue({
                fieldId: 'custbody_bitvalidacaojuridica',
                value: true
            });

            transacaoRecord.setValue({
                fieldId: 'custbody13',
                value: `Atualização automática - ${dataHoraFormatada}`
            });

            const savedId = transacaoRecord.save();
            log.audit('Transação atualizada com sucesso', `ID: ${savedId}`);

        } catch (e) {
            log.error('Erro na ação do workflow DocuSign', e);
        }
    }

    return {
        onAction: onAction
    };

});
