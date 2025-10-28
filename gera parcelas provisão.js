/**
 * @NApiVersion 2.x
 * @NScriptType WorkflowActionScript
 */
define(['N/record'], function (record) {
    function onAction(context) {

        var cont = 1;
        var currentRecord = context.newRecord;
        var prazo = currentRecord.getValue({ fieldId: 'terms' });
        var execucaoInicio = currentRecord.getValue({ fieldId: 'custbody_prazodeexecucaoinicio' });
        var execucaoTermino = currentRecord.getValue({ fieldId: 'custbody_bit_prazodeexcucaotermino' });
        var fornecedor = currentRecord.getValue({ fieldId: 'entity' });
        var itemsItens = currentRecord.getLineCount({ sublistId: 'item' });
        log.debug('carregou itens: ' );
        var limiteDataParcelamento = new Date('2024-12-31'); // Data limite para comparação
        
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
            idterms = termsRecord.getValue({ fieldId: 'id' });
        }
        log.debug('carregou terms: '+divisao );

        if (idterms != '37') {
            log.debug('Entrou no IF: ' );
            while (cont <= recorrencia) {
                log.debug('Entrou no loop: ' );
                try {
                    var transactionId = currentRecord.id;
                    var total = currentRecord.getValue({ fieldId: 'total' });
                    var tranid = currentRecord.getValue({ fieldId: 'tranid' });
                    var mes = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
                    var mesTexto = mes[execucaoInicio.getMonth()];
                    var ano = execucaoInicio.getFullYear();


                    var customRecord = record.create({
                        type: 'customrecord_apaa_prov_pgmto_contrato',
                        isDynamic: true
                    });
                    
                        customRecord.setValue({ fieldId: 'custrecord_apaa_transaction', value: transactionId });
                        customRecord.setValue({ fieldId: 'custrecord_apaa_prazo', value: prazo });
                        customRecord.setValue({ fieldId: 'created', value: execucaoInicio });
                        customRecord.setValue({ fieldId: 'custrecord_apaa_valormes', value: total / recorrencia });
                        customRecord.setValue({ fieldId: 'custrecord_apaa_fornecedor', value: fornecedor });
                        customRecord.setValue({ fieldId: 'custrecordapaa_valortotal', value: total });
                        customRecord.setValue({ fieldId: 'custrecord_apaa_mescompetencia', value: mesTexto });
                        customRecord.setValue({ fieldId: 'custrecord_apaa_anocompetencia', value: ano });
                        customRecord.setValue({ fieldId: 'custrecord_apaa_parcela', value: cont + '/' + recorrencia });
                        customRecord.setValue({ fieldId: 'custrecord_apaa_dtprevpagamento', value: execucaoInicio });
                        if (execucaoInicio.getTime() < limiteDataParcelamento.getTime()) {
                            customRecord.setValue({ fieldId: 'isinactive', value: true });
                        }
                        cont = cont + 1;
                        customRecord.setValue({ fieldId: 'name', value: 'Provisão - ' + tranid });
                        execucaoInicio.setMonth(execucaoInicio.getMonth() + 1);


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
                            customItemRecord.setValue({ fieldId: 'custrecord_apaa_mescompetenciaitem', value: mesTexto });
                            customItemRecord.setValue({ fieldId: 'custrecordapaa_anocompetenciaitem', value: ano });
                            customItemRecord.setValue({ fieldId: 'custrecord_apaa_dtprevpagamentoitem', value: execucaoInicio });
                            if (execucaoInicio.getTime() < limiteDataParcelamento.getTime()) {
                                customRecord.setValue({ fieldId: 'isinactive', value: true });
                            }

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
        if (idterms === '37') {
            var transactionId = currentRecord.id;
            var total = currentRecord.getValue({ fieldId: 'total' });
            var tranid = currentRecord.getValue({ fieldId: 'tranid' });
           // const mes = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
           // const mesTexto = mes[execucaoInicio.getMonth()];
           // const ano = execucaoInicio.getFullYear();
            const dataAdiantamento  = DataAdiantamentoFunction(execucaoInicio);//10 dias uteis antes
            const dataPrimeiraNota  = DataPrimeiraNotaFunction(execucaoInicio);//15 dias uteis antes
            const dataPagamento  = DataPagamentoFunction(execucaoTermino);   //15 dias uteis depois
            const dataSegundaNota  = DataSegundaNotaFunction(execucaoTermino); // 15 dias uteis depois
            
            var customRecord = record.create({
                type: 'customrecord_apaa_prov_pgmto_contrato',
                isDynamic: true
            });
            


            customRecord.setValue({ fieldId: 'custrecord_apaa_transaction', value: transactionId });
            customRecord.setValue({ fieldId: 'custrecord_apaa_prazo', value: prazo });
            customRecord.setValue({ fieldId: 'created', value: execucaoInicio });
            customRecord.setValue({ fieldId: 'custrecord_apaa_valormes', value: total / recorrencia });
            customRecord.setValue({ fieldId: 'custrecord_apaa_fornecedor', value: fornecedor });
            customRecord.setValue({ fieldId: 'custrecordapaa_valortotal', value: total });
            customRecord.setValue({ fieldId: 'custrecord_apaa_dtprevpagamento', value: dataAdiantamento });
            if (execucaoInicio.getTime() < limiteDataParcelamento.getTime()) {
                customRecord.setValue({ fieldId: 'isinactive', value: true });
            }
            customRecord.setValue({ fieldId: 'custrecord_apaa_mescompetencia', value: mesTexto });
            customRecord.setValue({ fieldId: 'custrecord_apaa_anocompetencia', value: ano });
            customRecord.setValue({ fieldId: 'custrecord_apaa_parcela', value: cont + '/' + recorrencia });
            cont = cont + 1;
            customRecord.setValue({ fieldId: 'name', value: 'Provisão - ' + tranid });
            execucaoInicio.setMonth(execucaoInicio.getMonth() + 1);


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
                customItemRecord.setValue({ fieldId: 'custrecord_apaa_mescompetenciaitem', value: mesTexto });
                customItemRecord.setValue({ fieldId: 'custrecordapaa_anocompetenciaitem', value: ano });
                customItemRecord.setValue({ fieldId: 'custrecord_apaa_dtprevpagamentoitem', value: dataAdiantamento });
                if (execucaoInicio.getTime() < limiteDataParcelamento.getTime()) {
                    customRecord.setValue({ fieldId: 'isinactive', value: true });
                }
            
                
                var customItemRecordId = customItemRecord.save({
                    enableSourcing: true,
                    ignoreMandatoryFields: false
                });
                
            }
                var customRecord = record.create({
                    type: 'customrecord_apaa_prov_pgmto_contrato',
                    isDynamic: true
                });
                
    
    
                customRecord.setValue({ fieldId: 'custrecord_apaa_transaction', value: transactionId });
                customRecord.setValue({ fieldId: 'custrecord_apaa_prazo', value: prazo });
                customRecord.setValue({ fieldId: 'created', value: execucaoInicio });
                customRecord.setValue({ fieldId: 'custrecord_apaa_valormes', value: total / recorrencia });
                customRecord.setValue({ fieldId: 'custrecord_apaa_fornecedor', value: fornecedor });
                customRecord.setValue({ fieldId: 'custrecordapaa_valortotal', value: total });
                customRecord.setValue({ fieldId: 'custrecord_apaa_dtprevpagamento', value: dataPagamento });
                if (execucaoInicio.getTime() < limiteDataParcelamento.getTime()) {
                    customRecord.setValue({ fieldId: 'isinactive', value: true });
                }
                customRecord.setValue({ fieldId: 'custrecord_apaa_mescompetencia', value: mesTexto });
                customRecord.setValue({ fieldId: 'custrecord_apaa_anocompetencia', value: ano });
                customRecord.setValue({ fieldId: 'custrecord_apaa_parcela', value: cont + '/' + recorrencia });
                cont = cont + 1;
                customRecord.setValue({ fieldId: 'name', value: 'Provisão - ' + tranid });
                execucaoInicio.setMonth(execucaoInicio.getMonth() + 1);
    
    
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
                    customItemRecord.setValue({ fieldId: 'custrecord_apaa_mescompetenciaitem', value: mesTexto });
                    customItemRecord.setValue({ fieldId: 'custrecordapaa_anocompetenciaitem', value: ano });
                    customItemRecord.setValue({ fieldId: 'custrecord_apaa_dtprevpagamentoitem', value: dataPagamento });
                    if (execucaoInicio.getTime() < limiteDataParcelamento.getTime()) {
                        customRecord.setValue({ fieldId: 'isinactive', value: true });
                    }
                    
                    var customItemRecordId = customItemRecord.save({
                        enableSourcing: true,
                        ignoreMandatoryFields: false
                    });
                }
    

                log.debug('Item Registro Criado', 'ID do Registro Personalizado de Item: ' + customItemRecordId);
            }
        }    
    
    function DataAdiantamentoFunction(_data){    //10 dias uteis antes

        var calendarSearch = search.create({
            type: 'workcalendar', // Tipo interno do registro
            columns: ['name', 'holiday',] // Campos que desejamos buscar
        });
        var holidays = currentRecord.getLineCount({ sublistId: 'workcalendarexception' });
        for (var i = 0; i < holidays; i++) {
            var holidayDate = currentRecord.getSublistValue({ sublistId: 'workcalendarexception', fieldId: 'exceptiondate', line: i });





        return _data
    }
    function DataPrimeiraNotaFunction(_data){          
        return _data
    }
    function DataPagamentoFunction(_data){          
        return _data
    }
    function DataSegundaNotaFunction(_data){          
        return _data
    }
    return {
        onAction: onAction
    };
});