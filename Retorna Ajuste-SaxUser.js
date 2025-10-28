/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 */
define(['N/ui/serverWidget', 'N/log'], function(ui, log) {

    function beforeLoad(context) {
        var form = context.form;
        var newRecord = context.newRecord;

        // Executa apenas na criação
        if (context.type !== context.UserEventType.CREATE) {
            return;
        }

        try {
            // Verifica se é um ajuste de inventário
            if (newRecord.type !== 'inventoryadjustment') {
                log.debug('Registro não é ajuste de inventário. Encerrando script.');
                return;
            }

            // Verifica o campo de transação de origem
            var requisitionId = newRecord.getValue({ fieldId: 'custbody_trans_origem_sax' });

            if (!requisitionId) {
                log.debug('Campo "Transação de Origem" está vazio. Script não será executado.');
                return;
            }

            log.debug('Transação de origem encontrada', requisitionId);

            form.addPageLink({
                type: ui.FormPageLinkType.CROSSLINK,
                title: 'Abrir Requisição de Origem',
                url: '/app/accounting/transactions/purchasereq.nl?id=' + requisitionId + '&e=T'
            });

            form.addField({
                id: 'custpage_redirect_message',
                type: ui.FieldType.INLINEHTML,
                label: 'Mensagem'
            }).defaultValue = '<div style="color: green; font-weight: bold;">Transação de origem vinculada: <a href="/app/accounting/transactions/purchasereq.nl?id=' + requisitionId + '&e=T" target="_blank">Ver Requisição</a></div>';

        } catch (e) {
            log.error('Erro no User Event Script', e);
        }
    }

    return {
        beforeLoad: beforeLoad
    };
});
