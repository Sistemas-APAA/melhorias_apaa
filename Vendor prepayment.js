/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 */
define(['N/record', 'N/search'], function(record, search, error) {

    function beforeSubmit(context) {
        var newRecord = context.newRecord;
        var cnpj = newRecord.getValue('custbody_brl_tran_t_subsd_fed_tx_reg'); // Substitua 'custentity_brl_entity_t_fed_tax_reg' pelo ID do campo CNPJ

        if (!cnpj) {
            return;
        }

            // Carregue a busca salva
        var supplierSearch = search.load({
            id: savedSearchId
        });

        // Execute a busca
        var searchResult = supplierSearch.run().getRange({
            start: 0,
            end: 1000
        });

        // Processar os resultados da busca
        searchResult.forEach(function(result) {
            var entityId = result.getValue('entityid');
            // Faça algo com os resultados
            log.debug('Fornecedor encontrado', entityId);
        });


        var searchResult = supplierSearch.run().getRange({
            start: 0,
            end: 1
        });

        if (searchResult.length > 0) {
            // Exibe uma mensagem de alerta
            dialog.alert({
                title: 'Alerta',
                message: 'Encontrou.'
        });
    }

    return {
        beforeSubmit: beforeSubmit
    };
});
