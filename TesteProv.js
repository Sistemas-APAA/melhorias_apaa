/**
 * @NApiVersion 2.x
 * @NScriptType WorkflowActionScript
 */
define(['N/record', 'N/redirect', 'N/log'], function(record, redirect, log) {

    function onAction(context) {
        var pedido = context.newRecord;

        try {
            var provisao = record.create({
                type: 'customtransaction_provisaocontratos',
                isDynamic: true
            });

            // Cabeçalho
            
            
            provisao.setValue({
                fieldId: 'subsidiary',
                value: pedido.getValue('subsidiary')
            });

            provisao.setValue({
                fieldId: 'custbody_brl_tran_l_created_from',
                value: pedido.id
            });

            provisao.setValue({
                fieldId: 'trandate',
                value: pedido.getValue('trandate')
            });

            provisao.setValue({
                fieldId: 'memo',
                value: pedido.getValue('memo')
            });

            provisao.setValue({
                fieldId: 'taxtotal',
                value: pedido.getValue('custbody_taxtotal')
            });


            provisao.setValue({
                fieldId: 'subtotal',
                value: pedido.getValue('custbody_subtotal')
            });

            // provisao.setValue({
            //     fieldId: 'custbody_bit_aprovacaointerna',
            //     value: pedido.getValue('custbody_aprovador_sax')
            // });
            // provisao.setValue({
            //     fieldId: 'trandate',
            //     value: pedido.getValue('trandate')
            // });
            // provisao.setValue({
            //     fieldId: 'department',
            //     value: 116
            // });
            // provisao.setValue({
            //     fieldId: 'class',
            //     value: 123
            // });
            // provisao.setValue({
            //     fieldId: 'account',
            //     value: 661
            // });
            // provisao.setValue({
            //     fieldId: 'custbody_atlas_inv_adj_reason',
            //     value: 1
            // });


            

            // Linha de itens
            var itemCount = pedido.getLineCount({ sublistId: 'item' });
            
            for (var i = 0; i < itemCount; i++) {
                provisao.selectNewLine({ sublistId: 'line' });
                
                provisao.setCurrentSublistValue({
                    sublistId: 'line',
                    fieldId: 'item',
                    value: pedido.getSublistValue({ sublistId: 'item', fieldId: 'custcol_provpgto_item', line: i })
                });

                provisao.setCurrentSublistValue({
                    sublistId: 'line',
                    fieldId: 'cseg_bit_depart',
                    value: pedido.getSublistValue({ sublistId: 'item', fieldId: 'cseg_bit_depart', line: i })
                });

                provisao.setCurrentSublistValue({
                    sublistId: 'line',
                    fieldId: 'cseg_bit_fonte_rec',
                    value: pedido.getSublistValue({ sublistId: 'item', fieldId: 'cseg_bit_fonte_rec', line: i })
                });

                provisao.setCurrentSublistValue({
                    sublistId: 'line',
                    fieldId: 'cseg_paactivitycode',
                    value: pedido.getSublistValue({ sublistId: 'item', fieldId: 'cseg_paactivitycode', line: i })
                });

                // provisao.setCurrentSublistValue({
                //     sublistId: 'line',
                //     fieldId: 'location',
                //     value: pedido.getSublistValue({ sublistId: 'item', fieldId: 'custcol_projeto_sax', line: i })
                // });

                // /*provisao.setCurrentSublistValue({
                //     sublistId: 'line',
                //     fieldId: 'custcol_projeto',
                //     value: pedido.getSublistValue({ sublistId: 'item', fieldId: 'custcol_provpgto_item', line: i })
                // });

                // provisao.setCurrentSublistValue({
                //     sublistId: 'line',
                //     fieldId: 'custcol_report',
                //     value: pedido.getSublistValue({ sublistId: 'item', fieldId: 'custcol_quantidade_sax', line: i })
                // });*/

                // provisao.setCurrentSublistValue({
                //     sublistId: 'line',
                //     fieldId: 'custcol_report',
                //     value: pedido.getSublistValue({ sublistId: 'item', fieldId: 'custcol_report_programa', line: i })
                // });

                // provisao.setCurrentSublistValue({
                //     sublistId: 'line',
                //     fieldId: 'custcol_report',
                //     value: pedido.getSublistValue({ sublistId: 'item', fieldId: 'custcol_vlproporcional', line: i })
                // });



                provisao.commitLine({ sublistId: 'line' });
            }

            // Salvar e redirecionar para edição
            var newId = provisao.save();
            log.audit('line Adjustment Criado', 'ID: ' + newId);

            // redirect.toRecord({
            //     type: record.Type.INVENTORY_ADJUSTMENT,
            //     id: newId,
            //     isEditMode: true
            // });

        } catch (e) {
            log.error('Erro ao criar line Adjustment', e);
            throw e;
        }
    }

    return {
        onAction: onAction
    };
});
