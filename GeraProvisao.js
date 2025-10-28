/**
 * @NApiVersion 2.x
 * @NScriptType WorkflowActionScript
 */
define(['N/record', 'N/redirect', 'N/log','N/format'], function (record, redirect, log, format) {

    function onAction(context) {
        var pedido = context.newRecord;
        var dataEspeciAdiant = pedido.getValue('custbody33')
        var dataEspeciFinal = pedido.getValue('custbody34')
        var diasAdiantamento = pedido.getValue('custbody31')
        var diasApos = pedido.getValue('custbody32')
        var provisionado = pedido.getValue('custbody28')
        var diasCorridos = pedido.getValue('custbody29')
        var diasUteis = pedido.getValue('custbody30')
        var qtdParcelas = pedido.getValue('custbody35')
        var prazoDeExecucaoInicio = pedido.getValue('custbody_prazodeexecucaoinicio')
        var prazoDeExecucaoTermino = pedido.getValue('custbody_bit_prazodeexcucaotermino')

 

        try {
            var provisao = record.create({
                type: 'customtransaction_provisaocontratos',
                isDynamic: true
            });
            // Cabeçalho

            // 1	Pgto Padrão
            // 2	Pgto Total Pós serviço
            // 4	Pgto em dia específico
            // 5	Pgto sob demanda
            // 6	Pgto Parcelado
            // 7	Cartão
            // 8	Pgto Total Adiantado

            provisao.setValue({ fieldId: 'subsidiary', value: pedido.getValue('subsidiary') });
            provisao.setValue({ fieldId: 'custbody_brl_tran_l_created_from', value: pedido.id });
            provisao.setValue({ fieldId: 'trandate', value: pedido.getValue('trandate') });
            provisao.setValue({ fieldId: 'memo', value: pedido.getValue('memo') });
            provisao.setValue({ fieldId: 'custbody_fornecedor', value: pedido.getValue('entity') });
            provisao.setValue({ fieldId: 'custbody_situacao_nf', value: 1 });

            if (Number(provisionado) === 8) {
                provisao.setValue({ fieldId: 'custbody_valortotal', value: pedido.getValue('total') });
                provisao.setValue({ fieldId: 'custbody_parcela', value: '1/1' });
                provisao.setValue({ fieldId: 'custbody_dtemissaonf', value: pedido.getValue('custbody_bit_prazodeexcucaotermino') });
                if (dataEspeciAdiant) {
                    provisao.setValue({ fieldId: 'custbody_dtprevpagamento', value: dataEspeciAdiant });
                }else if (diasCorridos === true){
                    var dataInicio = new Date(prazoDeExecucaoInicio);
                    dataInicio.setDate(dataInicio.getDate()- Number(diasAdiantamento));
                    provisao.setValue({ fieldId: 'custbody_dtprevpagamento', value: dataInicio });
                }else if (diasUteis === true){

                    var novaData = new Date(prazoDeExecucaoInicio.getTime());
                    var feriadosFixos = ['01/01/2025','25/01/2025','03/03/2025','04/03/2025','18/04/2025','21/04/2025','01/05/2025','19/06/2025','20/11/2025','25/12/2025'];

                    function isDiaUtil(date) {
                        var diaSemana = date.getDay(); // 0 = Domingo, 6 = Sábado
                        var dd = String(date.getDate()).padStart(2, '0');
                        var mm = String(date.getMonth() + 1).padStart(2, '0');
                        var yyyy = date.getFullYear();
                        var strDate = dd + '/' + mm + '/' + yyyy;

                        if (diaSemana === 0 || diaSemana === 6) return false; // fim de semana
                        if (feriadosFixos.indexOf(strDate) !== -1) return false; // feriado
                        return true;
                    }
                    var diasRestantes = Number(diasAdiantamento);
                    while (diasRestantes > 0) {
                        novaData.setDate(novaData.getDate() - 1); // avança 1 dia
                        if (isDiaUtil(novaData)) {
                            diasRestantes--; // só decrementa se for dia útil
                        }
                    }

                    provisao.setValue({
                        fieldId: 'custbody_dtprevpagamento',
                        value: novaData
                    });
                }
                log.debug('saiu do if')
            } else if (Number(provisionado) === 2) {
                provisao.setValue({ fieldId: 'custbody_valortotal', value: pedido.getValue('total') });
                provisao.setValue({ fieldId: 'custbody_parcela', value: '1/1' });
                provisao.setValue({ fieldId: 'custbody_dtemissaonf', value: pedido.getValue('custbody_bit_prazodeexcucaotermino') });
                if (dataEspeciFinal) {
                    provisao.setValue({ fieldId: 'custbody_dtprevpagamento', value: dataEspeciFinal });
                }else if (diasCorridos === true){
                    var diasApos = new Date(prazoDeExecucaoTermino);
                    diasApos.setDate(diasApos.getDate()+ Number(diasAdiantamento));
                    provisao.setValue({ fieldId: 'custbody_dtprevpagamento', value: diasApos });
                }else if (diasUteis === true){
                    // Cria a data inicial
                    var novaData = new Date(prazoDeExecucaoTermino.getTime());
                    var feriadosFixos = ['01/01/2025','25/01/2025','03/03/2025','04/03/2025','18/04/2025','21/04/2025','01/05/2025','19/06/2025','20/11/2025','25/12/2025'];

                    // Função que verifica se é dia útil
                    function isDiaUtil(date) {
                        var diaSemana = date.getDay(); // 0 = Domingo, 6 = Sábado
                        var dd = String(date.getDate()).padStart(2, '0');
                        var mm = String(date.getMonth() + 1).padStart(2, '0');
                        var yyyy = date.getFullYear();
                        var strDate = dd + '/' + mm + '/' + yyyy;

                        if (diaSemana === 0 || diaSemana === 6) return false; // fim de semana
                        if (feriadosFixos.indexOf(strDate) !== -1) return false; // feriado
                        return true;
                    }

                    // Ajusta a data considerando apenas dias úteis
                    var diasRestantes = Number(diasAdiantamento);
                    while (diasRestantes > 0) {
                        novaData.setDate(novaData.getDate() + 1); // avança 1 dia
                        if (isDiaUtil(novaData)) {
                            diasRestantes--// só decrementa se for dia útil
                        }
                    }

                    // Salva diretamente o objeto Date
                    provisao.setValue({
                        fieldId: 'custbody_dtprevpagamento',
                        value: novaData
                    });
                }
                log.debug('saiu do if')
            
            }
            // Linha de itens
            var itemCount = pedido.getLineCount({ sublistId: 'item' });

            for (var i = 0; i < itemCount; i++) {
                provisao.selectNewLine({ sublistId: 'line' });
                provisao.setCurrentSublistValue({ sublistId: 'line', fieldId: 'custcol_provpgto_item', value: pedido.getSublistValue({ sublistId: 'item', fieldId: 'item', line: i }) });
                provisao.setCurrentSublistValue({ sublistId: 'line', fieldId: 'cseg_bit_depart', value: pedido.getSublistValue({ sublistId: 'item', fieldId: 'cseg_bit_depart', line: i }) });
                provisao.setCurrentSublistValue({ sublistId: 'line', fieldId: 'account', value: 1290 });
                provisao.setCurrentSublistValue({ sublistId: 'line', fieldId: 'cseg_bit_fonte_rec', value: pedido.getSublistValue({ sublistId: 'item', fieldId: 'cseg_bit_fonte_rec', line: i }) });
                provisao.setCurrentSublistValue({ sublistId: 'line', fieldId: 'memo', value: pedido.getSublistValue({ sublistId: 'item', fieldId: 'custcol_descricaodoobjeto', line: i }) });
                provisao.setCurrentSublistValue({ sublistId: 'line', fieldId: 'entity', value: pedido.getSublistValue({ sublistId: 'item', fieldId: 'customer', line: i }) });
                provisao.setCurrentSublistValue({ sublistId: 'line', fieldId: 'cseg_paactivitycode', value: pedido.getSublistValue({ sublistId: 'item', fieldId: 'cseg_paactivitycode', line: i }) });
                provisao.setCurrentSublistValue({ sublistId: 'line', fieldId: 'custcol_report_programa', value: pedido.getSublistValue({ sublistId: 'item', fieldId: 'department', line: i }) });
                provisao.setCurrentSublistValue({ sublistId: 'line', fieldId: 'cseg_bit_programas', value: pedido.getSublistValue({ sublistId: 'item', fieldId: 'cseg_bit_programas', line: i }) });

                if(provisionado == 8 || provisionado == 2){
                    provisao.setCurrentSublistValue({ sublistId: 'line', fieldId: 'amount', value: pedido.getSublistValue({ sublistId: 'item', fieldId: 'amount', line: i }) });
                    provisao.setCurrentSublistValue({ sublistId: 'line', fieldId: 'custcol_vlproporcional', value: pedido.getSublistValue({ sublistId: 'item', fieldId: 'rate', line: i }) });
                }else {
                    log.debug('valor diferente de 8')
                }

                provisao.commitLine({ sublistId: 'line' });
            }

            // Salvar e redirecionar para edição
            var newId = provisao.save();
            log.audit('line Criado', 'ID: ' + newId);



        } catch (e) {
            log.error('Erro ao criar line Adjustment', e);
            throw e;
        }
    }

    return {
        onAction: onAction
    };
});
