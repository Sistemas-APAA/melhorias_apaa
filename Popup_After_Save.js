/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 */
define(['N/url', 'N/redirect', 'N/record'], function (url, redirect, record) {

    function afterSubmit(context) {
        if (context.type !== context.UserEventType.CREATE) return;

        var recId = context.newRecord.id;

        try {
            // Carrega a fatura recém-criada
            var fatura = record.load({
                type: context.newRecord.type,
                id: recId
            });

            // Obtém o ID da PO vinculada (campo 'createdfrom')
            var poId = fatura.getValue('createdfrom');
            var poNum = '';

            if (poId) {
                // Carrega a PO para obter o número da transação (tranid)
                var po = record.load({
                    type: record.Type.PURCHASE_ORDER,
                    id: poId
                });

                poNum = po.getValue('tranid');
            }

            // Monta a URL do Suitelet com os parâmetros
            var suiteletUrl = url.resolveScript({
                scriptId: 'customscript7523',
                deploymentId: 'customdeploy1',
                returnExternalUrl: false,
                params: {
                    recid: recId,
                    poNum: poNum || ''
                }
            });
            log.debug('poNum'+poNum)
            redirect.redirect({ url: suiteletUrl });

        } catch (e) {
            log.error('Erro ao redirecionar com número da PO', e);
        }
    }

    return {
        afterSubmit: afterSubmit
    };
});
