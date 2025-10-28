/**
 * @NApiVersion 2.x
 * @NScriptType WorkflowActionScript
 */
define(['N/record', 'N/log'], function(record, log) {

    function onAction(context) {
        var currentRecord = context.newRecord;
        var nfId = currentRecord.id;
        var statusNf = String(currentRecord.getValue({ fieldId: 'status' })).toLowerCase();

        log.debug('Status da NF (normalizado)', statusNf);
        log.debug('Chamou o WFS', 'NF ID: ' + nfId + ' | Status: ' + statusNf);

        // Recupera o ID da provisão diretamente do campo 'custbody_provisao_x_nf'
        var provId = currentRecord.getValue({ fieldId: 'custbody_provisao_x_nf' });

        if (provId) {
            log.debug('ID da Provisão obtido do campo custbody_provisao_x_nf', provId);

            var provRecord = record.load({
                type: 'customtransaction_provisaocontratos',
                id: provId,
                isEditMode: true
            });

            var situacaoAtual = provRecord.getValue({ fieldId: 'custbody_situacao_nf' });

            log.debug('Registro de provisão carregado', 'ID: ' + provId + ' | Situação atual: ' + situacaoAtual);

            provRecord.setValue({
                fieldId: 'custbody_situacao_nf',
                value: 3
            });

            var savedId = provRecord.save();
            log.debug('Registro salvo com sucesso', 'ID: ' + savedId);
        }else {
            log.debug('Campo custbody_provisao_x_nf não possui valor. Nenhuma provisão relacionada à NF ID: ', nfId);
        }
    }

    return {
        onAction: onAction
    };
});