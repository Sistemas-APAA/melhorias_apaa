/**
 * @NApiVersion 2.x
 * @NScriptType WorkflowActionScript
 */
define(['N/record'], function (record) {
    function onAction(context) {

        var cont = 1;
        var currentRecord = context.newRecord;
        var prazo = currentRecord.getValue({ fieldId: 'terms' });
        var data = new Date();
        var fornecedor = currentRecord.getValue({ fieldId: 'entity' });
        var itemsItens = currentRecord.getLineCount({ sublistId: 'item' });
        log.debug('carregou itens: ' );

        if (prazo) {
            var termsRecord = record.load({
                type: 'term',
                id: prazo
            });
            descricao = termsRecord.getValue({ fieldId: 'name' });
            frequencia = termsRecord.getValue({ fieldId: 'recurrencefrequency' });
            recorrencia = termsRecord.getValue({ fieldId: 'recurrencecount' });
            repete = termsRecord.getValue({ fieldId: 'repeatevery' });
            divisao = termsRecord.getValue({ fieldId: 'splitevenly' })|| false;
            prestacao = termsRecord.getValue({ fieldId: 'installment' });
        }
        log.debug('carregou terms: '+divisao );

        if (divisao === true || frequencia === 'MONTHLY') {
            log.debug('Entrou no IF: ' );
            while (cont <= recorrencia) {
                log.debug('Entrou no loop: ' );
                try {
                    var transactionId = currentRecord.id;
                    var total = currentRecord.getValue({ fieldId: 'total' });
                    var tranid = currentRecord.getValue({ fieldId: 'tranid' });
                    const mes = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
                    const mesTexto = mes[data.getMonth()];
                    const ano = data.getFullYear();

                    while(custrecord_apaa_anocompetencia === '2024.0'){
                        data.setMonth(data.getMonth() + 1);
                        cont = cont + 1;
                    }
                    var customRecord = record.create({
                        type: 'customrecord_apaa_prov_pgmto_contrato',
                        isDynamic: true
                    });
                    
                        customRecord.setValue({ fieldId: 'custrecord_apaa_transaction', value: transactionId });
                        customRecord.setValue({ fieldId: 'custrecord_apaa_prazo', value: prazo });
                        customRecord.setValue({ fieldId: 'created', value: data });
                        customRecord.setValue({ fieldId: 'custrecord_apaa_valormes', value: total / recorrencia });
                        customRecord.setValue({ fieldId: 'custrecord_apaa_fornecedor', value: fornecedor });
                        customRecord.setValue({ fieldId: 'custrecordapaa_valortotal', value: total });
                        customRecord.setValue({ fieldId: 'custrecord_apaa_dtprevpagamento', value: data });
                        customRecord.setValue({ fieldId: 'custrecord_apaa_mescompetencia', value: mesTexto });
                        customRecord.setValue({ fieldId: 'custrecord_apaa_anocompetencia', value: ano });
                        customRecord.setValue({ fieldId: 'custrecord_apaa_parcela', value: cont + '/' + recorrencia });
                        cont = cont + 1;
                        customRecord.setValue({ fieldId: 'name', value: 'Provisão - ' + tranid });
                        data.setMonth(data.getMonth() + 1);

                        var customRecordId = customRecord.save({
                            enableSourcing: true,
                            ignoreMandatoryFields: false
                        });

                        log.debug('Registro Criado', 'ID do Registro Personalizado: ' + customRecordId);

                        for (var i = 0; i < itemsItens; i++) {
                            var itemId = currentRecord.getSublistValue({ sublistId: 'item', fieldId: 'item', line: i });
                            var itemQuantidade = currentRecord.getSublistValue({ sublistId: 'item', fieldId: 'quantity', line: i });
                            var itemRate = currentRecord.getSublistValue({ sublistId: 'item', fieldId: 'amount', line: i });
                            var projeto = currentRecord.getSublistValue({sublistId: 'item', fieldId:'customer', line: i });
                            var activitycode = currentRecord.getSublistValue({sublistId: 'item', fieldId:'cseg_paactivitycode', line: i });
                            var fonterecurso = currentRecord.getSublistValue({sublistId: 'item', fieldId:'cseg_bit_fonte_rec', line: i });
                            var reportprograma = currentRecord.getSublistValue({sublistId: 'item', fieldId:'department', line: i });
                            var departamento = currentRecord.getSublistValue({sublistId: 'item', fieldId:'cseg_bit_depart', line: i });
                            var centrocusto = currentRecord.getSublistValue({sublistId: 'item', fieldId:'class', line: i });
                            log.debug('Itens carregados - '+itemId);

                            var customItemRecord = record.create({
                                type: 'customrecord_apaa_provisaoporitem',
                                isDynamic: true
                            });

                            log.debug('Criado');

                            customItemRecord.setValue({ fieldId: 'custrecord_apaa_provpgto_link', value: customRecordId });
                            customItemRecord.setValue({ fieldId: 'name', value: fornecedor });
                            customItemRecord.setValue({ fieldId: 'custrecord_apaa_provpgto_item', value: itemId });
                            customItemRecord.setValue({ fieldId: 'custrecord_apaa_provpgto_quantidade', value: itemQuantidade });
                            customItemRecord.setValue({ fieldId: 'custrecord_apaa_vlproporcional', value: itemRate / recorrencia });
                            customItemRecord.setValue({ fieldId: 'custrecord_apaa_provpgto_projeto', value: projeto });
                            customItemRecord.setValue({ fieldId: 'custrecord_apaa_provpgto_activitycode', value: activitycode });
                            customItemRecord.setValue({ fieldId: 'custrecord_apaa_provpgto_fontederecurso', value: fonterecurso });
                            customItemRecord.setValue({ fieldId: 'custrecord_apaa_provpgto_reportprograma', value: reportprograma });
                            customItemRecord.setValue({ fieldId: 'custrecord_apaa_provpgto_departamento', value: departamento });
                            customItemRecord.setValue({ fieldId: 'custrecord_apaa_provpgto_centrodecusto', value: centrocusto });
                            customItemRecord.setValue({ fieldId: 'custrecord_apaa_transactionorigem', value: transactionId });
                            customItemRecord.setValue({ fieldId: 'custrecord_apaa_dtprevpagamentoitem', value: data });
                            customItemRecord.setValue({ fieldId: 'custrecord_apaa_mescompetenciaitem', value: mesTexto });
                            customItemRecord.setValue({ fieldId: 'custrecordapaa_anocompetenciaitem', value: ano });

                            var customItemRecordId = customItemRecord.save({
                                enableSourcing: true,
                                ignoreMandatoryFields: false
                            });

                            log.debug('Item Registro Criado', 'ID do Registro Personalizado de Item: ' + customItemRecordId);
                        }
                } catch (error) {
                    log.error('Erro ao criar registro personalizado', error);
                }
            }
            
        }
    }

    return {
        onAction: onAction
    };
});