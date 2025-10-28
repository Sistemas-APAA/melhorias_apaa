/**
 * @NApiVersion 2.x
 * @NScriptType WorkflowActionScript
 */
define(['N/record', 'N/redirect', 'N/format', 'N/log'], function(record, redirect, format, log) {

    function onAction(context) {
        var nfId = currentRecord.getValue({fieldId:'internalid'}); 
        var statusNf = nfId.getValue({field:'status'});

        var provSearch = search.load({
            type:'customtransaction_provisaocontratos',
            id:nfId
        });

        if (statusNf === 'Abrir') {
            provSearch.setValue({
                fieldId:'custbody_situacao_nf',
                value:3
            });
        } else if (statusNf === 'Pago integralmente') {
            provSearch.setValue({
                fieldId:'custbody_situacao_nf',
                value:4
            });
            
        }else if (statusNf === 'Aprovação do supervisor pendente') {
            provSearch.setValue({
                fieldId:'custbody_situacao_nf',
                value:2
            });
        }else if (statusNf === 'Cancelado') {
            provSearch.setValue({
                fieldId:'custbody_situacao_nf',
                value:5
            });
        }

    }

    return {
        onAction: onAction
    };
});
