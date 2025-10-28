/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */
define(['N/record', 'N/url'], function(record, url) {

    function afterSubmit(context) {
        if (context.type !== context.UserEventType.CREATE) return;

        let fatura = context.newRecord;
        let idFatura = fatura.id;
        let idOrigem = fatura.getValue('createdfrom');

        if (!idOrigem) return; // Se não tem origem, sai do script

        try {
            let transacaoOrigem = record.load({ type: record.Type.ITEM_RECEIPT, id: idOrigem });
            let linkFatura = url.resolveRecord({ recordType: record.Type.VENDOR_BILL, recordId: idFatura });

            transacaoOrigem.setValue({ fieldId: 'custbody_fatura', value: linkFatura }); // Substitua pelo ID do campo correto
            transacaoOrigem.save();
        } catch (e) {
            log.error({ title: 'Erro ao atualizar o recebimento de item', details: e });
        }
    }

    return {
        afterSubmit: afterSubmit
    };
});
