/**
 *@NApiVersion 2.1
 *@NScriptType WorkflowActionScript
 */
define(['N/record', 'N/search', 'N/log'], function (record, search, log) {

    function onAction(context) {
        try {
            var rec = context.newRecord;
            var idRec = rec.id;

            var statusCot = rec.getValue('custbody_bit_body_status_cot');
            var modalidadeCompra = rec.getValue('custbody_apaa_016555');

            log.debug('Início da aprovação de cotação', {
                requisicao: idRec,
                statusCot: statusCot,
                modalidadeCompra: modalidadeCompra
            });

            if (Number(modalidadeCompra) === 4) {
                var cotacaoSearch = search.create({
                    type: 'customrecord_bit_cotacoes',
                    filters: [['custrecord_bit_cot_purchreq', 'is', idRec]],
                    columns: ['internalid']
                });

                var searchResult = cotacaoSearch.run().getRange({ start: 0, end: 1 });

                if (searchResult.length === 0) {
                    log.error('Erro', 'Nenhuma cotação vinculada à requisição ' + idRec);
                    return 'Nenhuma cotação vinculada a esta requisição foi encontrada.';
                }

                var cotacaoId = searchResult[0].getValue('internalid');
                log.debug('Cotação encontrada', cotacaoId);

                record.submitFields({
                    type: 'customrecord_bit_cotacoes',
                    id: cotacaoId,
                    values: { custrecord_bit_cot_status: 3 } // 3 = Aprovado
                });

                var itensSearch = search.create({
                    type: 'customrecord_bit_sublist_itens_cot',
                    filters: [['custrecord_bit_rt_itens_link', 'is', cotacaoId]],
                    columns: ['internalid']
                });

                var itensResults = itensSearch.run().getRange({ start: 0, end: 1000 });

                for (var i = 0; i < itensResults.length; i++) {
                    var itemId = itensResults[i].getValue('internalid');

                    record.submitFields({
                        type: 'customrecord_bit_sublist_itens_cot',
                        id: itemId,
                        values: { custrecord_bit_rt_itens_premio: true }
                    });
                }

                log.debug('Itens premiados atualizados', itensResults.length);

                record.submitFields({
                    type: 'purchaserequisition',
                    id: idRec,
                    values: {
                        custbody_bit_body_status_cot: 2,
                        custbody37: true
                    }
                });

                log.audit('Cotação aprovada com sucesso', idRec);
                return 'Cotação aprovada com sucesso.';
            }

            else {
                var itensSearch = search.create({
                    type: 'customrecord_bit_sublist_itens_cot',
                    filters: [['custrecord_bit_rt_itens_transaction', 'is', idRec]],
                    columns: ['internalid']
                });

                var itensResults = itensSearch.run().getRange({ start: 0, end: 1000 });

                if (itensResults.length === 0) {
                    log.error('Erro', 'Nenhuma cotação vinculada à requisição ' + idRec);
                    return 'Nenhuma cotação vinculada a esta requisição foi encontrada.';
                }

                for (var i = 0; i < itensResults.length; i++) {
                    var itemId = itensResults[i].getValue('internalid');

                    record.submitFields({
                        type: 'customrecord_bit_sublist_itens_cot',
                        id: itemId,
                        values: { custrecord_bit_rt_itens_premio: true }
                    });
                }

                log.debug('Itens premiados atualizados', itensResults.length);

                record.submitFields({
                    type: 'purchaserequisition',
                    id: idRec,
                    values: {
                        custbody_bit_body_status_cot: 2
                    }
                });

                log.audit('Cotações aprovadas com sucesso', idRec);
                return 'Cotações aprovadas com sucesso.';
            }

        } catch (e) {
            log.error('Erro ao aprovar cotação', e);
            return 'Erro ao aprovar cotação: ' + e.message;
        }
    }

    return { onAction };
});
