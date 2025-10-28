/**
 * @NApiVersion 2.x
 * @NScriptType WorkflowActionScript
 */
define(['N/https', 'N/log', 'N/url', 'N/runtime'], function(https, log, url, runtime) {

    function onAction(context) {
        try {
            // === CONFIGURAÇÕES ===
            var webhookUrl = 'https://admapaa.webhook.office.com/webhookb2/71b41dc6-3dfd-42d4-aee5-c63d1e2e7064@5d74001a-d2eb-4b3e-8d54-a44be5675441/IncomingWebhook/23160965907a4855977d61e9c9b31dcf/05698447-a8da-4df0-8d32-8ef6f2cb1773/V2DkexucUlPo8hVhTGMPfvgAoUWxCwOjsxohdRoP8XZ3c1'; 

            // ID da Saved Search (pode ser usada para montar o link)
            var searchId = 'customsearch4670';

            // Gera o link para a pesquisa salva
            var suiteletUrl = url.resolveScript({
                scriptId: 'customscript_fake_script', // só pra construir URL base
                deploymentId: 'customdeploy_fake_deploy',
                returnExternalUrl: true
            });

            // Monta a URL da busca salva
            var searchUrl = suiteletUrl.split('/app')[0] + '/app/common/search/searchresults.nl?searchid=' + searchId;

            // === MENSAGEM PARA O TEAMS ===
            var mensagem = {
                '@type': 'MessageCard',
                '@context': 'http://schema.org/extensions',
                'summary': 'Notificação de Fatura',
                'themeColor': '0076D7',
                'title': 'Nova Fatura com Prioridade',
                'text': 'Olá,<br><br>Informo que foi criada uma fatura com prioridade em conclusão, por favor seguir.<br><br>Segue link com faturas para aprovação: [Ver Faturas](' + searchUrl + ')'
            };

            // === ENVIA PARA O TEAMS ===
            var response = https.post({
                url: webhookUrl,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(mensagem)
            });

            log.debug('Resposta do Teams', response.body);
        } catch (e) {
            log.error('Erro ao enviar mensagem para o Teams', e);
        }
    }

    return {
        onAction: onAction
    };
});
