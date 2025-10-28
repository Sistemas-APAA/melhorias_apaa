/**
 * @NApiVersion 2.x
 * @NScriptType MapReduceScript
 */

define(['N/search', 'N/record', 'N/log'], function(search, record, log) {
    
    function getInputData() {
        // Criar uma pesquisa para obter todas as requisições onde custbody_bit_body_status_cot = 'Cancelado'
        return search.create({
            type: 'purchaseorder', // Altere para o tipo de transação correto
            filters: [
                ['custbody_bit_body_status_cot', 'is', 'Cancelado']
            ],
            columns: ['internalid', 'uir-record-status'] // Ajuste os campos conforme necessário
        });
    }

    function map(context) {
        var searchResult = JSON.parse(context.value);
        var internalId = searchResult.id;

        try {
            var rec = record.load({
                type: 'purchaserequisition', // Altere para o tipo de transação correto
                id: internalId
            });

            // Atualizar o campo 'uir-record-status'
            rec.setValue({
                fieldId: 'uir-record-status',
                value: 'Cancelado' // Substitua pelo valor correto
            });

            rec.save();

            log.audit({
                title: 'Transação Atualizada',
                details: 'Transação ID: ' + internalId + ' atualizada com sucesso.'
            });
        } catch (e) {
            log.error({
                title: 'Erro ao atualizar transação',
                details: e.toString()
            });
        }
    }

    function reduce(context) {
        // Este exemplo não usa a fase de redução, mas você pode adicionar lógica aqui se necessário
    }

    function summarize(summary) {
        var type = summary.toString();
        log.audit({
            title: type + ' completed',
            details: JSON.stringify(summary)
        });

        // Log errors
        summary.mapSummary.errors.iterator().each(function(key, value) {
            log.error({
                title: 'Erro em Key: ' + key,
                details: value
            });
            return true;
        });
    }

    return {
        getInputData: getInputData,
        map: map,
        reduce: reduce,
        summarize: summarize
    };
});
