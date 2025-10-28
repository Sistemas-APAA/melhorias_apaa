/**
 *@NApiVersion 2.1
 *@NScriptType ClientScript
 */
define(['N/currentRecord', 'N/record', 'N/ui/dialog', 'N/search'], function (currentRecord, record, dialog, search) {

    function pageInit(context) {
        // Nenhuma lógica necessária
    }

    function aprovarCotacao() {
        try {
            var rec = currentRecord.get();

            var statusCot = rec.getValue('custbody_bit_body_status_cot');
            var modalidadeCompra = rec.getValue('custbody_apaa_016555');
            var idRec = rec.getValue('id');

            if (modalidadeCompra === 4) {
                var cotacaoSearch = search.create({
                    type: 'customrecord_bit_cotacoes',
                    filters: [['custrecord_bit_cot_purchreq', 'is', idRec]],
                    columns: ['internalid']
                });

                var searchResult = cotacaoSearch.run().getRange({ start: 0, end: 1 });
                if (searchResult.length === 0) {
                    dialog.alert({
                        title: 'Erro',
                        message: 'Nenhuma cotação vinculada a esta requisição foi encontrada.'
                    });
                    return;
                }

                var cotacaoId = searchResult[0].getValue('internalid');
                log.debug('Cotação encontrada', cotacaoId);

                // 🔹 Carrega a cotação e atualiza o status
                var cotacaoRec = record.load({
                    type: 'customrecord_bit_cotacoes',
                    id: cotacaoId,
                    isDynamic: true
                });

                cotacaoRec.setValue({
                    fieldId: 'custrecord_bit_cot_status',
                    value: 3 // ← status aprovado
                });

                cotacaoRec.save();
                log.debug('Status da cotação atualizado');

                // 🔹 Buscar registros customrecord_bit_sublist_itens_cot vinculados à cotação
                var itensSearch = search.create({
                    type: 'customrecord_bit_sublist_itens_cot',
                    filters: [['custrecord_bit_rt_itens_link', 'is', cotacaoId]],
                    columns: ['internalid']
                });

                var itensResults = itensSearch.run().getRange({ start: 0, end: 1000 });

                // 🔹 Atualizar todos os registros encontrados
                for (var i = 0; i < itensResults.length; i++) {
                    var itemId = itensResults[i].getValue('internalid');

                    record.submitFields({
                        type: 'customrecord_bit_sublist_itens_cot',
                        id: itemId,
                        values: { custrecord_bit_rt_itens_premio: true }
                    });
                }

                log.debug('Itens premiados atualizados: ' + itensResults.length);

                record.submitFields({
                    type: 'purchaserequisition',
                    id: idRec,
                    values: { custbody_bit_body_status_cot: 2 }
                });

                dialog.alert({
                    title: 'Sucesso',
                    message: 'Cotação aprovada com sucesso.'
                }).then(function () {
                    window.location.reload();
                });
            } else {
                var itensSearch = search.create({
                    type: 'customrecord_bit_sublist_itens_cot',
                    filters: [['custrecord_bit_rt_itens_transaction', 'is', idRec]],
                    columns: ['internalid']
                });

                var itensResults = itensSearch.run().getRange({ start: 0, end: 1000 });

                // 🔹 Atualizar todos os registros encontrados
                for (var i = 0; i < itensResults.length; i++) {
                    var itemId = itensResults[i].getValue('internalid');

                    record.submitFields({
                        type: 'customrecord_bit_sublist_itens_cot',
                        id: itemId,
                        values: { custrecord_bit_rt_itens_premio: true }
                    });
                }

                log.debug('Itens premiados atualizados: ' + itensResults.length);

                record.submitFields({
                    type: 'purchaserequisition',
                    id: idRec,
                    values: { custbody_bit_body_status_cot: 2 }
                });

                dialog.alert({
                    title: 'Sucesso',
                    message: 'Cotação aprovada com sucesso.'
                }).then(function () {
                    window.location.reload();
                });
            }

        } catch (e) {
            console.log('Erro ao aprovar cotação:', e);
            dialog.alert({
                title: 'Erro',
                message: 'Ocorreu um erro: ' + e.message
            });
        }
    }

    return {
        pageInit: pageInit,
        aprovarCotacao: aprovarCotacao
    };
});

