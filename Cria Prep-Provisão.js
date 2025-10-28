/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 */
define(['N/record', 'N/log', 'N/search'], function (record, log, search) {

    function afterSubmit(context) {
        try {
            var prepaymentRecord = context.newRecord;
            var purchaseOrderId = prepaymentRecord.getValue({ fieldId: 'purchaseorder' });
            var paymentValueRaw = prepaymentRecord.getValue({ fieldId: 'payment' });
            var paymentValue = parseFloat(paymentValueRaw) || 0;

            log.debug("ID do Pedido de Compra", purchaseOrderId);
            log.debug("Valor do Pagamento (numérico)", paymentValue);

            if (!purchaseOrderId) {
                log.debug("Campo purchaseorder está vazio ou inválido");
                return;
            } else {
                var purchaseOrder = record.load({
                    type: record.Type.PURCHASE_ORDER,
                    id: purchaseOrderId,
                    isDynamic: false
                });
                var existingValue = parseFloat(purchaseOrder.getValue({ fieldId: 'custbody26' }) || 0);
                log.debug("Valor existente em custbody26", existingValue);
                var total = existingValue + paymentValue;
                log.debug("Novo total a ser salvo em custbody26", total);
            }

            // Atualiza a Purchase Order com flags básicas
            try {
                var updatedId = record.submitFields({
                    type: record.Type.PURCHASE_ORDER,
                    id: purchaseOrderId,
                    values: {
                        custbody_prepgto_realizado: true,
                        custbody26: total // campo do valor do pré-pagamento
                    },
                    options: { enableSourcing: false, ignoreMandatoryFields: true }
                });
                log.debug("Pedido de Compra atualizado", updatedId);
            } catch (poErr) {
                log.error("Falha ao atualizar Purchase Order", poErr);
            }

            // Busca provisões relacionadas (somente mainline)
            var provSearch = search.create({
                type: 'customtransaction_provisaocontratos',
                filters: [
                    ['custbody_brl_tran_l_created_from', 'anyof', purchaseOrderId], 'AND',
                    ['mainline', 'is', 'T']
                ],
                columns: [
                    search.createColumn({ name: 'internalid' }),
                    search.createColumn({ name: 'trandate' }),
                    search.createColumn({ name: 'total' }),
                    search.createColumn({ name: 'custbody_valortotal' })
                ]
            });

            var provResults = [];
            provSearch.run().each(function (result) {
                var provId = result.getValue({ name: 'internalid' });
                var trandateStr = result.getValue({ name: 'trandate' });
                var tranid = result.getValue({ name: 'tranid' });
                var totalStr = result.getValue({ name: 'custbody_valortotal' });
                var totalNum = parseFloat(totalStr) || 0;

                provResults.push({
                    id: provId,
                    trandateStr: trandateStr,
                    tranid: tranid,
                    total: totalNum
                });
                return true;
            });

            var qty = provResults.length;
            log.debug("Qtd provisões encontradas", qty);

            if (qty === 0) {
                log.debug("Nenhuma customtransaction_provisaocontratos encontrada para o PO " + purchaseOrderId);
                return;
            } else if (qty === 1) {
                var prov = provResults[0];

                log.debug('Aplicando (1 provisão)', {
                    provId: prov.id,
                    total: total
                });
                var existingIds = record.load({
                    type: 'customtransaction_provisaocontratos',
                    id: prov.id,
                    isDynamic: false
                }).getValue({ fieldId: 'custbody27' }) || '';

                // Adiciona o novo ID, separando por vírgula se já houver algum valor
                var updatedIds = existingIds ? existingIds + ',' + prepaymentRecord.id : prepaymentRecord.id;

                record.submitFields({
                    type: 'customtransaction_provisaocontratos',
                    id: prov.id,
                    values: {
                        custbody_prepgto_a_aplicar: total,
                        custbody27:updatedIds
                    },
                    options: { enableSourcing: false, ignoreMandatoryFields: true }
                });

                return;
            } else if (qty > 1) {
                provResults.sort(function (a, b) {
                    return String(a.tranid).localeCompare(String(b.tranid));
                });
            }

            var remaining = total;
            log.debug('Iniciando distribuição em ' + qty + ' provisões. Valor disponível: ' + remaining);

            for (var i = 0; i < provResults.length; i++) {
                if (remaining <= 0) {
                    break; // já não há mais nada para aplicar
                }

                var prov = provResults[i];
                var provTotal = parseFloat(prov.total) || 0;
                var toApply = remaining;

                // Evita gravar se não for aplicar nada
                if (toApply >= provTotal) {
                    record.submitFields({
                        type: 'customtransaction_provisaocontratos',
                        id: prov.id,
                        values: {
                            custbody_prepgto_a_aplicar: provTotal
                        },
                        options: { enableSourcing: false, ignoreMandatoryFields: true }
                    });
                    remaining = remaining - provTotal
                }

                log.debug('Aplicação em provisão', {
                    provId: prov.id,
                    totalProvisao: provTotal,
                    aplicado: toApply,
                    saldoRestante: remaining
                });
                var toApply = remaining;

            }

            // var remaining = total;
            // log.debug('Iniciando distribuição em ' + qty + ' provisões. Valor disponível: ' + remaining);

            // for (var i = 0; i < provResults.length; i++) {
            //     var prov = provResults[i];

            //     var toApply = total;
            //     if (remaining > 0) {
            //         if (remaining <= prov.total) {
            //             toApply = remaining;
            //             remaining = 0;
            //         } else {
            //             toApply = prov.total;
            //             remaining -= prov.total;
            //         }
            //     }

            //     record.submitFields({
            //         type: 'customtransaction_provisaocontratos',
            //         id: prov.id,
            //         values: {
            //             custbody_prepgto_a_aplicar: toApply
            //         },
            //         options: { enableSourcing: false, ignoreMandatoryFields: true }
            //     });

            //     log.debug('Aplicação em provisão', {
            //         provId: prov.id,
            //         total: prov.total,
            //         aplicado: toApply,
            //         saldoRestante: remaining
            //     });
            // }

        } catch (e) {
            log.error('Erro ao processar pré-pagamento', e);
        }
    }

    return {
        afterSubmit: afterSubmit
    };
});
